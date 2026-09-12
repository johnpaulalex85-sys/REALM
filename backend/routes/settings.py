from flask import Blueprint, request, g
import bcrypt
from datetime import datetime
from backend.middleware.auth import token_required
from backend.utils.responses import success_response, error_response
from backend.utils.validators import is_valid_password

settings_bp = Blueprint('settings', __name__, url_prefix='/api/settings')

DEFAULT_SETTINGS = {
    'levelUpAnimations': True,
    'questCompletionEffects': True,
    'backgroundParticles': True,
    'showMotivationalQuotes': True,
    'compactMode': False,
    'masterVolume': 70,
    'backgroundMusic': True,
    'uiSoundEffects': True,
    'questCompletionSound': True,
    'levelUpSound': True,
    'theme': 'Realm (Default)',
    'accentColor': 'purple',
    'reducedMotion': False,
    'highContrast': False,
    'questReminders': True,
    'dailySummary': True,
    'streakAlerts': True,
    'achievementNotifications': True,
    'weeklyProgressReport': False,
    'defaultQuestCategory': 'Study',
    'defaultDifficulty': 'Medium',
    'dateFormat': 'DD/MM/YYYY',
    'timeFormat': '12 Hour (AM/PM)',
    'startWeekOn': 'Monday',
    'largerText': False,
    'dyslexiaFriendlyFont': False,
    'keyboardNavigation': True,
    'screenReaderSupport': True,
    'colorBlindFriendly': False
}

@settings_bp.route('', methods=['GET'])
@token_required
def get_settings():
    db = g.db
    user_id = g.user_id
    settings_doc = db.settings.find_one({'user_id': user_id})
    if not settings_doc:
        settings_doc = {**DEFAULT_SETTINGS, 'user_id': user_id, 'updated_at': datetime.utcnow()}
        db.settings.insert_one(settings_doc)
    
    settings_doc['id'] = str(settings_doc['_id'])
    del settings_doc['_id']
    return success_response(settings_doc)

@settings_bp.route('', methods=['PUT'])
@token_required
def update_settings():
    data = request.get_json() or {}
    db = g.db
    user_id = g.user_id

    data['updated_at'] = datetime.utcnow()
    if '_id' in data:
        del data['_id']
    if 'id' in data:
        del data['id']
    if 'user_id' in data:
        del data['user_id']

    db.settings.update_one(
        {'user_id': user_id},
        {'$set': data},
        upsert=True
    )

    updated = db.settings.find_one({'user_id': user_id})
    updated['id'] = str(updated['_id'])
    del updated['_id']
    return success_response(updated)

@settings_bp.route('/change-password', methods=['POST'])
@token_required
def change_password():
    data = request.get_json() or {}
    old_pass = data.get('old_password', '')
    new_pass = data.get('new_password', '')

    if not old_pass or not new_pass:
        return error_response('VALIDATION_ERROR', 'Old and new passwords are required', 400)

    if not is_valid_password(new_pass):
        return error_response('VALIDATION_ERROR', 'New password must be at least 6 characters', 400)

    db = g.db
    user = g.user

    if not bcrypt.checkpw(old_pass.encode('utf-8'), user['password_hash'].encode('utf-8')):
        return error_response('INVALID_CREDENTIALS', 'Incorrect current password', 401)

    hashed_new = bcrypt.hashpw(new_pass.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    db.users.update_one({'_id': user['_id']}, {'$set': {'password_hash': hashed_new, 'updated_at': datetime.utcnow()}})

    return success_response(message='Password updated successfully')

@settings_bp.route('/account', methods=['DELETE'])
@token_required
def delete_account():
    db = g.db
    user_id = g.user_id

    db.users.delete_one({'_id': g.user['_id']})
    db.characters.delete_many({'user_id': user_id})
    db.quests.delete_many({'user_id': user_id})
    db.quest_completions.delete_many({'user_id': user_id})
    db.inventory.delete_many({'user_id': user_id})
    db.user_achievements.delete_many({'user_id': user_id})
    db.activities.delete_many({'user_id': user_id})
    db.streaks.delete_many({'user_id': user_id})
    db.settings.delete_many({'user_id': user_id})

    return success_response(message='Account and all user data permanently deleted')

@settings_bp.route('/export-data', methods=['GET'])
@token_required
def export_user_data():
    db = g.db
    user_id = g.user_id

    user = g.user
    char = db.characters.find_one({'user_id': user_id})
    quests = list(db.quests.find({'user_id': user_id}))
    inventory = list(db.inventory.find({'user_id': user_id}))
    achievements = list(db.user_achievements.find({'user_id': user_id}))
    activities = list(db.activities.find({'user_id': user_id}))
    streak = db.streaks.find_one({'user_id': user_id})
    settings_doc = db.settings.find_one({'user_id': user_id})

    return success_response({
        'user': {'name': user.get('name'), 'email': user.get('email'), 'created_at': user.get('created_at')},
        'character': char,
        'quests': quests,
        'inventory': inventory,
        'achievements': achievements,
        'activities': activities,
        'streak': streak,
        'settings': settings_doc,
        'exported_at': datetime.utcnow().isoformat()
    })
