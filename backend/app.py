from flask import Flask, g
from flask_cors import CORS
from pymongo import MongoClient
import pymongo
from backend.config import Config
from backend.utils.responses import error_response, success_response

import os
from flask import Flask, send_from_directory, g

def create_app():
    dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'dist'))
    app = Flask(__name__, static_folder=dist_dir if os.path.exists(dist_dir) else None, static_url_path='')
    app.config.from_object(Config)

    # Configure CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Initialize PyMongo client
    mongo_client = MongoClient(Config.MONGO_URI)
    try:
        db = mongo_client.get_default_database()
        if db is None:
            db = mongo_client[Config.MONGO_DB_NAME]
    except Exception:
        db = mongo_client[Config.MONGO_DB_NAME]

    # Create MongoDB indexes safely
    try:
        db.users.create_index([('email', pymongo.ASCENDING)], unique=True)
        db.quests.create_index([('user_id', pymongo.ASCENDING)])
        db.quest_completions.create_index([('user_id', pymongo.ASCENDING)])
        db.quest_completions.create_index([('quest_id', pymongo.ASCENDING)])
        db.activities.create_index([('user_id', pymongo.ASCENDING)])
        db.inventory.create_index([('user_id', pymongo.ASCENDING)])
        db.user_achievements.create_index([('user_id', pymongo.ASCENDING)])
        db.streaks.create_index([('user_id', pymongo.ASCENDING)])
    except Exception as e:
        app.logger.warning(f"Index creation warning: {e}")

    @app.before_request
    def attach_db():
        g.db = db

    # Root welcome & Health check routes
    @app.route('/', methods=['GET'])
    def root():
        if app.static_folder and os.path.exists(os.path.join(app.static_folder, 'index.html')):
            return send_from_directory(app.static_folder, 'index.html')
        return success_response({
            'status': 'healthy',
            'service': 'REALM Life RPG Backend API',
            'frontend_ui_url': 'http://localhost:5173',
            'message': 'Flask + MongoDB API is active. Open http://localhost:5173 in your browser to play!'
        })

    @app.route('/<path:path>', methods=['GET'])
    def catch_all(path):
        if path.startswith('api/'):
            return error_response('NOT_FOUND', 'Requested endpoint not found', 404)
        if app.static_folder and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        if app.static_folder and os.path.exists(os.path.join(app.static_folder, 'index.html')):
            return send_from_directory(app.static_folder, 'index.html')
        return error_response('NOT_FOUND', 'Requested route not found', 404)

    @app.route('/api/health', methods=['GET'])
    def health():
        return success_response({'status': 'healthy', 'service': 'REALM Life RPG Backend'})

    # Register Blueprints
    from backend.routes.auth import auth_bp
    from backend.routes.dashboard import dashboard_bp
    from backend.routes.character import character_bp
    from backend.routes.quests import quests_bp
    from backend.routes.inventory import inventory_bp
    from backend.routes.achievements import achievements_bp
    from backend.routes.history import history_bp
    from backend.routes.streak import streak_bp
    from backend.routes.settings import settings_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(character_bp)
    app.register_blueprint(quests_bp)
    app.register_blueprint(inventory_bp)
    app.register_blueprint(achievements_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(streak_bp)
    app.register_blueprint(settings_bp)

    @app.errorhandler(404)
    def not_found_error(error):
        return error_response('NOT_FOUND', 'Requested endpoint not found', 404)

    @app.errorhandler(500)
    def internal_error(error):
        return error_response('SERVER_ERROR', 'An internal server error occurred', 500)

    @app.errorhandler(Exception)
    def handle_exception(e):
        app.logger.error(f"Unhandled Exception: {str(e)}")
        return error_response('SERVER_ERROR', str(e), 500)

    return app
