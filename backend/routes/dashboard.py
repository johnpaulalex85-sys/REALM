from flask import Blueprint, g
from backend.middleware.auth import token_required
from backend.utils.responses import success_response, error_response
from backend.services.streak_service import get_or_create_streak

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('', methods=['GET'])
@token_required
def get_dashboard():
    db = g.db
    user_id = g.user_id

    char = db.characters.find_one({'user_id': user_id})
    if not char:
        return error_response('NOT_FOUND', 'Character profile not found', 404)
    char['_id'] = str(char['_id'])

    attributes = char.get('attributes', [])

    # Quests
    quests = list(db.quests.find({'user_id': user_id}))
    for q in quests:
        q['id'] = str(q['_id'])
        del q['_id']

    active_quests = [q for q in quests if q.get('active') and not q.get('completed')]

    # Activity log
    activities = list(db.activities.find({'user_id': user_id}).sort('timestamp', -1).limit(10))
    for a in activities:
        a['id'] = str(a['_id'])
        del a['_id']

    # Streak
    streak = get_or_create_streak(db, user_id)
    if '_id' in streak:
        streak['_id'] = str(streak['_id'])

    # Inventory
    inventory = list(db.inventory.find({'user_id': user_id}))
    for inv in inventory:
        inv['id'] = str(inv.get('id', inv['_id']))
        if '_id' in inv:
            del inv['_id']

    # Achievements
    achievements = list(db.user_achievements.find({'user_id': user_id}))
    for ach in achievements:
        ach['id'] = str(ach.get('id', ach['_id']))
        if '_id' in ach:
            del ach['_id']

    return success_response({
        'character': char,
        'attributes': attributes,
        'quests': quests,
        'active_quests': active_quests,
        'recent_activity': activities,
        'streak': streak,
        'inventory': inventory,
        'achievements': achievements
    })
