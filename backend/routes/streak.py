from flask import Blueprint, request, g
from backend.middleware.auth import token_required
from backend.utils.responses import success_response, error_response
from backend.services import streak_service

streak_bp = Blueprint('streak', __name__, url_prefix='/api/streak')

@streak_bp.route('', methods=['GET'])
@token_required
def get_streak():
    db = g.db
    streak = streak_service.get_or_create_streak(db, g.user_id)
    if '_id' in streak:
        streak['_id'] = str(streak['_id'])
    return success_response(streak)

@streak_bp.route('/check-in', methods=['POST'])
@token_required
def check_in():
    data = request.get_json() or {}
    day_index = data.get('day_index')
    db = g.db
    try:
        res = streak_service.check_in_streak(db, g.user_id, day_index=day_index)
        if '_id' in res['streak']:
            res['streak']['_id'] = str(res['streak']['_id'])
        if '_id' in res['character']:
            res['character']['_id'] = str(res['character']['_id'])
        return success_response(res)
    except ValueError as e:
        return error_response('STREAK_ERROR', str(e), 400)
