from datetime import datetime
from bson import ObjectId
from backend.services.progression import apply_xp_and_level_up, calculate_vitals
from backend.services.reward_service import calculate_quest_rewards, calculate_quest_energy_and_exhaustion
from backend.services.inventory_service import award_quest_loot
from backend.services.achievement_service import evaluate_user_achievements

def get_user_quests(db, user_id: str) -> list:
    """Returns all quests belonging to user."""
    quests = list(db.quests.find({'user_id': user_id}))
    for q in quests:
        q['id'] = str(q.get('_id'))
    return quests

def create_quest(db, user_id: str, quest_data: dict) -> dict:
    """Creates a new quest for user."""
    category = quest_data.get('category', 'STUDY').upper()
    attr = quest_data.get('attribute')
    if not attr:
        if category in ['STUDY', 'WORK']:
            attr = 'intellect'
        elif category == 'HEALTH':
            attr = 'strength' if 'gym' in quest_data.get('title', '').lower() or 'workout' in quest_data.get('title', '').lower() else 'vitality'
        elif category == 'PERSONAL':
            attr = 'wisdom'
        elif category == 'DISCIPLINE':
            attr = 'discipline'
        else:
            attr = 'intellect'

    new_quest = {
        'user_id': user_id,
        'title': quest_data.get('title', 'New Quest'),
        'description': quest_data.get('description', ''),
        'category': category,
        'categoryColor': quest_data.get('categoryColor', 'bg-indigo-900/80 border-purple-400/50 text-purple-200'),
        'xpReward': int(quest_data.get('xpReward', 200)),
        'goldReward': int(quest_data.get('goldReward', 30)),
        'attribute': attr,
        'energyCost': int(quest_data.get('energyCost', 15)),
        'progress': 0,
        'iconName': quest_data.get('iconName', 'book'),
        'active': True,
        'completed': False,
        'frequency': quest_data.get('frequency', 'Daily'),
        'difficulty': quest_data.get('difficulty', 'Medium'),
        'quote': quest_data.get('quote', '“Step by step, the quest is won.”'),
        'estimatedMinutes': int(quest_data.get('estimatedMinutes', 30)),
        'currentMinutes': 0,
        'image': quest_data.get('image', None),
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }
    res = db.quests.insert_one(new_quest)
    new_quest['id'] = str(res.inserted_id)

    # Log activity
    db.activities.insert_one({
        'user_id': user_id,
        'type': 'created',
        'title': f"Created New Quest: {new_quest['title']}",
        'subtitle': new_quest['description'],
        'category': new_quest['category'].title(),
        'timeAgo': 'Just now',
        'timestamp': int(datetime.utcnow().timestamp() * 1000),
        'created_at': datetime.utcnow()
    })

    return new_quest

def update_quest(db, user_id: str, quest_id: str, updates: dict) -> dict:
    """Updates an existing quest."""
    q_filter = {'user_id': user_id}
    if ObjectId.is_valid(quest_id):
        q_filter['_id'] = ObjectId(quest_id)
    else:
        q_filter['id'] = quest_id

    quest = db.quests.find_one(q_filter)
    if not quest:
        raise ValueError("Quest not found or access denied")

    updates['updated_at'] = datetime.utcnow()
    db.quests.update_one({'_id': quest['_id']}, {'$set': updates})
    updated = db.quests.find_one({'_id': quest['_id']})
    updated['id'] = str(updated['_id'])
    return updated

def delete_quest(db, user_id: str, quest_id: str) -> bool:
    """Deletes a quest."""
    q_filter = {'user_id': user_id}
    if ObjectId.is_valid(quest_id):
        q_filter['_id'] = ObjectId(quest_id)
    else:
        q_filter['id'] = quest_id

    res = db.quests.delete_one(q_filter)
    return res.deleted_count > 0

def complete_or_progress_quest(db, user_id: str, quest_id: str, is_step: bool = False) -> dict:
    """
    Authoritative server-side quest completion and progress tick endpoint.
    Handles duplicate completion protection, energy deduction, health loss, XP/Gold calculations,
    attribute gains, loot drops, activity logging, and achievement triggers.
    """
    q_filter = {'user_id': user_id}
    if ObjectId.is_valid(quest_id):
        q_filter['_id'] = ObjectId(quest_id)
    else:
        q_filter['id'] = quest_id

    quest = db.quests.find_one(q_filter)
    if not quest:
        raise ValueError("Quest not found")

    if quest.get('completed', False) or quest.get('progress', 0) >= 100:
        raise ValueError(f'Quest "{quest.get("title")}" has already been completed and claimed!')

    char = db.characters.find_one({'user_id': user_id})
    if not char:
        raise ValueError("Character profile not found")

    if char.get('health', 100) <= 0:
        raise ValueError("Collapse! You have 0 HP and cannot quest. Rest or drink an elixir to recover!")

    # Check if already completed in quest_completions collection
    existing_completion = db.quest_completions.find_one({'user_id': user_id, 'quest_id': str(quest['_id'])})
    if existing_completion:
        raise ValueError("Duplicate quest completion attempt detected!")

    attributes = char.get('attributes', [])
    cost, health_loss, new_energy = calculate_quest_energy_and_exhaustion(
        quest, attributes, char.get('energy', 100), is_step=is_step
    )

    new_health = max(0, char.get('health', 100) - health_loss)
    char['energy'] = new_energy
    char['health'] = new_health

    if is_step:
        new_progress = min(100, quest.get('progress', 0) + 20)
    else:
        new_progress = 100

    est = quest.get('estimatedMinutes', 30)
    new_mins = round((est * new_progress) / 100)
    is_now_completed = new_progress >= 100

    db.quests.update_one(
        {'_id': quest['_id']},
        {
            '$set': {
                'progress': new_progress,
                'currentMinutes': new_mins,
                'completed': is_now_completed,
                'updated_at': datetime.utcnow()
            }
        }
    )

    reward_data = None
    dropped_item = None
    level_up = False
    new_level = char.get('level', 0)

    if is_now_completed:
        reward_data = calculate_quest_rewards(quest, attributes)
        xp_earned = reward_data['final_xp']
        gold_earned = reward_data['final_gold']
        attr_type = reward_data['attribute']

        # Award XP and Gold & check level up
        updated_char, level_up, levels_gained, new_level = apply_xp_and_level_up(
            char, xp_earned, gold_earned
        )

        # Attribute increase
        if attr_type:
            attrs = updated_char.get('attributes', [])
            for a in attrs:
                if a.get('id') == attr_type:
                    a['current'] = min(a.get('max', 100), a.get('current', 10) + 1)
            updated_char['attributes'] = attrs

            # Recalculate max health & energy
            max_hp, max_ep = calculate_vitals(attrs)
            updated_char['maxHealth'] = max_hp
            updated_char['maxEnergy'] = max_ep

        db.characters.update_one({'user_id': user_id}, {'$set': updated_char})

        # Record completion
        db.quest_completions.insert_one({
            'user_id': user_id,
            'quest_id': str(quest['_id']),
            'quest_title': quest.get('title'),
            'xp_gained': xp_earned,
            'gold_gained': gold_earned,
            'attribute_gained': attr_type,
            'completed_at': datetime.utcnow()
        })

        # Award loot drop
        dropped_item = award_quest_loot(db, user_id, quest)

        # Log activity
        db.activities.insert_one({
            'user_id': user_id,
            'type': 'completed_quest',
            'title': f"Completed: {quest.get('title')}",
            'xp': xp_earned,
            'gold': gold_earned,
            'timeAgo': 'Just now',
            'timestamp': int(datetime.utcnow().timestamp() * 1000),
            'created_at': datetime.utcnow()
        })

        # Automatically advance streak & evaluate achievements
        from backend.services.streak_service import record_daily_activity
        record_daily_activity(db, user_id)
        evaluate_user_achievements(db, user_id)
    else:
        db.characters.update_one(
            {'user_id': user_id},
            {'$set': {'energy': new_energy, 'health': new_health}}
        )

    latest_char = db.characters.find_one({'user_id': user_id})
    latest_quest = db.quests.find_one({'_id': quest['_id']})
    latest_quest['id'] = str(latest_quest['_id'])

    return {
        'quest': latest_quest,
        'character': latest_char,
        'completed': is_now_completed,
        'progress': new_progress,
        'energy_used': cost,
        'health_loss': health_loss,
        'reward': reward_data,
        'dropped_item': dropped_item,
        'level_up': level_up,
        'new_level': new_level
    }
