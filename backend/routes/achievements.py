from flask import Blueprint, g
from backend.middleware.auth import token_required
from backend.utils.responses import success_response
from backend.services.achievement_service import evaluate_user_achievements

achievements_bp = Blueprint('achievements', __name__, url_prefix='/api/achievements')

@achievements_bp.route('', methods=['GET'])
@token_required
def get_achievements():
    db = g.db
    user_id = g.user_id

    # Evaluate achievements automatically
    evaluate_user_achievements(db, user_id)

    achievements = list(db.user_achievements.find({'user_id': user_id}))
    for ach in achievements:
        ach['id'] = str(ach.get('id', ach['_id']))
        if '_id' in ach:
            del ach['_id']
    return success_response(achievements)
