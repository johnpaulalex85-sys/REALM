from flask import Blueprint, request, g
from datetime import datetime
from backend.middleware.auth import token_required
from backend.utils.responses import success_response, error_response
from backend.services.progression import calculate_vitals

character_bp = Blueprint('character', __name__, url_prefix='/api/character')

@character_bp.route('', methods=['GET'])
@token_required
def get_character():
    db = g.db
    char = db.characters.find_one({'user_id': g.user_id})
    if not char:
        return error_response('NOT_FOUND', 'Character not found', 404)
    char['_id'] = str(char['_id'])
    return success_response(char)

@character_bp.route('', methods=['PUT'])
@token_required
def update_character():
    data = request.get_json() or {}
    db = g.db
    user_id = g.user_id

    data['updated_at'] = datetime.utcnow()
    if '_id' in data:
        del data['_id']
    if 'user_id' in data:
        del data['user_id']

    db.characters.update_one(
        {'user_id': user_id},
        {'$set': data}
    )

    updated = db.characters.find_one({'user_id': user_id})
    updated['_id'] = str(updated['_id'])
    return success_response(updated)

@character_bp.route('/rest', methods=['POST'])
@token_required
def campfire_rest():
    db = g.db
    user_id = g.user_id
    char = db.characters.find_one({'user_id': user_id})
    if not char:
        return error_response('NOT_FOUND', 'Character not found', 404)

    max_hp, max_ep = calculate_vitals(char.get('attributes', []))
    new_energy = min(max_ep, char.get('energy', 100) + 35)
    new_health = min(max_hp, char.get('health', 100) + 20)

    db.characters.update_one(
        {'user_id': user_id},
        {'$set': {'energy': new_energy, 'health': new_health, 'maxHealth': max_hp, 'maxEnergy': max_ep}}
    )

    db.activities.insert_one({
        'user_id': user_id,
        'type': 'item_acquired',
        'title': '🌙 Campfire Rest: Restored +35 Energy and +20 Health!',
        'timeAgo': 'Just now',
        'timestamp': int(datetime.utcnow().timestamp() * 1000),
        'created_at': datetime.utcnow()
    })

    updated = db.characters.find_one({'user_id': user_id})
    updated['_id'] = str(updated['_id'])
    return success_response({
        'message': 'Campfire Rest: Restored +35 Energy and +20 Health!',
        'character': updated
    })
