from flask import Blueprint, request, g
import bcrypt
import jwt
from datetime import datetime, timedelta
from backend.config import Config
from backend.utils.validators import is_valid_email, is_valid_password
from backend.utils.responses import success_response, error_response
from backend.middleware.auth import token_required
from werkzeug.security import check_password_hash


auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

INITIAL_ATTRIBUTES = [
    {
        'id': 'strength',
        'name': 'STRENGTH',
        'current': 18,
        'max': 100,
        'color': '#ef4444',
        'borderColor': 'border-rose-500/60',
        'glowColor': 'rpg-border-glow-rose',
        'barColor': 'from-rose-600 to-red-500',
        'subSkills': ['Gym', 'Calisthenics', 'Heavy Training']
    },
    {
        'id': 'intellect',
        'name': 'INTELLECT',
        'current': 16,
        'max': 100,
        'color': '#06b6d4',
        'borderColor': 'border-cyan-500/60',
        'glowColor': 'rpg-border-glow-cyan',
        'barColor': 'from-cyan-600 to-sky-400',
        'subSkills': ['Reading', 'Coding', 'Problem Solving']
    },
    {
        'id': 'wisdom',
        'name': 'WISDOM',
        'current': 14,
        'max': 100,
        'color': '#a855f7',
        'borderColor': 'border-purple-500/60',
        'glowColor': 'rpg-border-glow-purple',
        'barColor': 'from-purple-600 to-violet-400',
        'subSkills': ['Mindfulness', 'Journaling', 'Better Decisions']
    },
    {
        'id': 'discipline',
        'name': 'DISCIPLINE',
        'current': 20,
        'max': 100,
        'color': '#eab308',
        'borderColor': 'border-amber-500/60',
        'glowColor': 'rpg-border-glow-amber',
        'barColor': 'from-amber-600 to-yellow-400',
        'subSkills': ['Routine', 'Consistency', 'Self Control']
    },
    {
        'id': 'vitality',
        'name': 'VITALITY',
        'current': 17,
        'max': 100,
        'color': '#10b981',
        'borderColor': 'border-emerald-500/60',
        'glowColor': 'rpg-border-glow-emerald',
        'barColor': 'from-emerald-600 to-teal-400',
        'subSkills': ['Sleep', 'Nutrition', 'Overall Health']
    }
]

def generate_jwt_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=Config.JWT_EXPIRATION_HOURS),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm='HS256')

def sanitize_user(user: dict) -> dict:
    return {
        'id': str(user['_id']),
        'name': user.get('name'),
        'email': user.get('email'),
        'created_at': user.get('created_at').isoformat() if isinstance(user.get('created_at'), datetime) else user.get('created_at')
    }

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not name:
        return error_response('VALIDATION_ERROR', 'Name is required', 400)
    if not is_valid_email(email):
        return error_response('VALIDATION_ERROR', 'Valid email address is required', 400)
    if not is_valid_password(password):
        return error_response('VALIDATION_ERROR', 'Password must be at least 6 characters', 400)

    db = g.db
    if db.users.find_one({'email': email}):
        return error_response('DUPLICATE_EMAIL', 'An account with this email address already exists', 409)

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    user_doc = {
        'name': name,
        'email': email,
        'password_hash': hashed_password,
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }
    res = db.users.insert_one(user_doc)
    user_id = str(res.inserted_id)

    # Initialize character profile
    char_doc = {
        'user_id': user_id,
        'name': name.upper(),
        'title': 'Novice Wanderer',
        'level': 0,
        'health': 100,
        'maxHealth': 100,
        'energy': 100,
        'maxEnergy': 100,
        'currentXP': 0,
        'maxXP': 200,
        'gold': 50,
        'totalXP': 0,
        'streakDays': 1,
        'class': 'Novice Initiate',
        'attributes': INITIAL_ATTRIBUTES,
        'equippedItems': ['trackers_blade_item', 'mindful_cloak'],
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }
    db.characters.insert_one(char_doc)

    # Clone default templates for user's inventory & achievements & starter quests
    from backend.seed import copy_seed_templates_for_user
    copy_seed_templates_for_user(db, user_id)

    token = generate_jwt_token(user_id)
    sanitized = sanitize_user(user_doc)

    return success_response({
        'token': token,
        'user': sanitized
    }, status_code=201)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return error_response('VALIDATION_ERROR', 'Email and password are required', 400)

    db = g.db
    user = db.users.find_one({'email': email})
    if not user:
        return error_response('INVALID_CREDENTIALS', 'Invalid email or password', 401)

    stored_hash = user.get('password_hash', '')
    if isinstance(stored_hash, bytes):
        try:
            stored_hash = stored_hash.decode('utf-8', errors='ignore')
        except Exception:
            stored_hash = ''
    elif not isinstance(stored_hash, str):
        stored_hash = str(stored_hash or '')

    is_valid = False

    # 1. Try Bcrypt check if formatted as bcrypt hash ($2a$, $2b$, $2y$)
    if stored_hash.startswith(('$2a$', '$2b$', '$2y$')):
        try:
            is_valid = bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
        except Exception:
            is_valid = False

    # 2. Try Werkzeug password hash check (e.g. pbkdf2:sha256)
    if not is_valid and stored_hash.startswith(('pbkdf2:', 'scrypt:', 'sha256:')):
        try:
            is_valid = check_password_hash(stored_hash, password)
        except Exception:
            is_valid = False

    # 3. Fallback: try raw bcrypt check safely
    if not is_valid and stored_hash:
        try:
            is_valid = bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
        except Exception:
            is_valid = False

    # 4. Fallback for legacy plain-text password check
    if not is_valid and stored_hash == password:
        is_valid = True

    if not is_valid:
        return error_response('INVALID_CREDENTIALS', 'Invalid email or password', 401)

    # Auto-upgrade stored password hash to bcrypt if it wasn't bcrypt
    try:
        if not stored_hash.startswith('$2b$') and not stored_hash.startswith('$2a$'):
            new_bcrypt_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            db.users.update_one({'_id': user['_id']}, {'$set': {'password_hash': new_bcrypt_hash, 'updated_at': datetime.utcnow()}})
    except Exception:
        pass

    user_id = str(user['_id'])

    # Ensure character profile exists (for users created via shared DB)
    char = db.characters.find_one({'user_id': user_id})
    if not char:
        name = user.get('name', 'HERO')
        char_doc = {
            'user_id': user_id,
            'name': name.upper(),
            'title': 'Novice Wanderer',
            'level': 0,
            'health': 100,
            'maxHealth': 100,
            'energy': 100,
            'maxEnergy': 100,
            'currentXP': 0,
            'maxXP': 200,
            'gold': 50,
            'totalXP': 0,
            'streakDays': 1,
            'class': 'Novice Initiate',
            'attributes': INITIAL_ATTRIBUTES,
            'equippedItems': ['trackers_blade_item', 'mindful_cloak'],
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        db.characters.insert_one(char_doc)
        from backend.seed import copy_seed_templates_for_user
        copy_seed_templates_for_user(db, user_id)

    token = generate_jwt_token(user_id)
    sanitized = sanitize_user(user)

    return success_response({
        'token': token,
        'user': sanitized
    })

@auth_bp.route('/me', methods=['GET'])
@token_required
def me():
    db = g.db
    user = g.user
    char = db.characters.find_one({'user_id': g.user_id})
    if char:
        char['_id'] = str(char['_id'])
    return success_response({
        'user': sanitize_user(user),
        'character': char
    })

@auth_bp.route('/logout', methods=['POST'])
def logout():
    return success_response(message='Logged out successfully')
