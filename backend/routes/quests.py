from flask import Blueprint, request, g
from backend.middleware.auth import token_required
from backend.utils.responses import success_response, error_response
from backend.services import quest_service

quests_bp = Blueprint('quests', __name__, url_prefix='/api/quests')

@quests_bp.route('', methods=['GET'])
@token_required
def get_quests():
    db = g.db
    quests = quest_service.get_user_quests(db, g.user_id)
    return success_response(quests)

@quests_bp.route('', methods=['POST'])
@token_required
def create_quest():
    data = request.get_json() or {}
    if not data.get('title'):
        return error_response('VALIDATION_ERROR', 'Quest title is required', 400)
    
    db = g.db
    quest = quest_service.create_quest(db, g.user_id, data)
    return success_response(quest, status_code=201)

@quests_bp.route('/<quest_id>', methods=['GET'])
@token_required
def get_quest_detail(quest_id):
    db = g.db
    quests = quest_service.get_user_quests(db, g.user_id)
    target = next((q for q in quests if q.get('id') == quest_id or str(q.get('_id', '')) == quest_id), None)
    if not target:
        return error_response('NOT_FOUND', 'Quest not found', 404)
    return success_response(target)

@quests_bp.route('/<quest_id>', methods=['PUT'])
@token_required
def update_quest(quest_id):
    data = request.get_json() or {}
    db = g.db
    try:
        updated = quest_service.update_quest(db, g.user_id, quest_id, data)
        return success_response(updated)
    except ValueError as e:
        return error_response('NOT_FOUND', str(e), 404)

@quests_bp.route('/<quest_id>', methods=['DELETE'])
@token_required
def delete_quest(quest_id):
    db = g.db
    success = quest_service.delete_quest(db, g.user_id, quest_id)
    if not success:
        return error_response('NOT_FOUND', 'Quest not found or already deleted', 404)
    return success_response(message='Quest deleted successfully')

@quests_bp.route('/<quest_id>/complete', methods=['POST'])
@token_required
def complete_quest(quest_id):
    data = request.get_json() or {}
    is_step = data.get('is_step', False)
    db = g.db
    try:
        result = quest_service.complete_or_progress_quest(db, g.user_id, quest_id, is_step=is_step)
        return success_response(result)
    except ValueError as e:
        return error_response('QUEST_ERROR', str(e), 400)
