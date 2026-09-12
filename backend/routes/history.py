from flask import Blueprint, g
from backend.middleware.auth import token_required
from backend.utils.responses import success_response

history_bp = Blueprint('history', __name__, url_prefix='/api/history')

@history_bp.route('', methods=['GET'])
@token_required
def get_history():
    db = g.db
    activities = list(db.activities.find({'user_id': g.user_id}).sort('timestamp', -1).limit(50))
    for act in activities:
        act['id'] = str(act['_id'])
        del act['_id']
    return success_response(activities)
