from datetime import datetime, date
from backend.services.progression import apply_xp_and_level_up, calculate_vitals
from backend.services.achievement_service import evaluate_user_achievements

DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

def get_or_create_streak(db, user_id: str) -> dict:
    """Fetches user streak record or creates initial 7-day tracker."""
    streak = db.streaks.find_one({'user_id': user_id})
    if not streak:
        today_idx = datetime.utcnow().weekday() # 0 = Mon, 6 = Sun
        streak_week = []
        for i, day_name in enumerate(DAYS_OF_WEEK):
            streak_week.append({
                'day': day_name,
                'checked': i == 0 # Default Mon checked as in initial state
            })

        streak_doc = {
            'user_id': user_id,
            'current_streak': 1,
            'longest_streak': 1,
            'last_activity_date': None,
            'streak_week': streak_week,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        res = db.streaks.insert_one(streak_doc)
        streak_doc['_id'] = res.inserted_id
        return streak_doc
    return streak

def record_daily_activity(db, user_id: str):
    """Automatically records daily activity when completing quests to maintain streak."""
    today_str = date.today().isoformat()
    streak = get_or_create_streak(db, user_id)
    if streak.get('last_activity_date') == today_str:
        return streak

    today_idx = datetime.utcnow().weekday() # 0 = Mon, 6 = Sun
    streak_week = streak.get('streak_week', [])
    if today_idx < len(streak_week):
        streak_week[today_idx]['checked'] = True

    new_current = streak.get('current_streak', 0) + 1
    new_longest = max(new_current, streak.get('longest_streak', 1))

    db.streaks.update_one(
        {'user_id': user_id},
        {
            '$set': {
                'current_streak': new_current,
                'longest_streak': new_longest,
                'last_activity_date': today_str,
                'streak_week': streak_week,
                'updated_at': datetime.utcnow()
            }
        }
    )
    db.characters.update_one({'user_id': user_id}, {'$set': {'streakDays': new_current}})
    return db.streaks.find_one({'user_id': user_id})

def check_in_streak(db, user_id: str, day_index: int = None) -> dict:
    """Performs daily streak check-in."""
    today_str = date.today().isoformat()
    streak = get_or_create_streak(db, user_id)

    last_date = streak.get('last_activity_date')
    if last_date == today_str:
        raise ValueError("Already checked in today!")

    today_idx = datetime.utcnow().weekday()
    target_idx = day_index if (day_index is not None and 0 <= day_index <= 6) else today_idx

    streak_week = streak.get('streak_week', [])
    if target_idx < len(streak_week):
        streak_week[target_idx]['checked'] = True

    new_current = streak.get('current_streak', 0) + 1
    new_longest = max(new_current, streak.get('longest_streak', 1))

    db.streaks.update_one(
        {'user_id': user_id},
        {
            '$set': {
                'current_streak': new_current,
                'longest_streak': new_longest,
                'last_activity_date': today_str,
                'streak_week': streak_week,
                'updated_at': datetime.utcnow()
            }
        }
    )

    # Restore Health and Energy & Award XP + Gold
    char = db.characters.find_one({'user_id': user_id})
    if char:
        max_hp, max_ep = calculate_vitals(char.get('attributes', []))
        char['health'] = max_hp
        char['energy'] = max_ep

        updated_char, level_up, levels_gained, new_level = apply_xp_and_level_up(char, 150, 25)
        updated_char['streakDays'] = new_current

        db.characters.update_one({'user_id': user_id}, {'$set': updated_char})

    # Log activity
    db.activities.insert_one({
        'user_id': user_id,
        'type': 'completed_quest',
        'title': f"Streak Sealed! Day {new_current} logged.",
        'xp': 150,
        'gold': 25,
        'timeAgo': 'Just now',
        'timestamp': int(datetime.utcnow().timestamp() * 1000),
        'created_at': datetime.utcnow()
    })

    # Evaluate achievements
    evaluate_user_achievements(db, user_id)

    updated_streak = db.streaks.find_one({'user_id': user_id})
    updated_char = db.characters.find_one({'user_id': user_id})

    return {
        'streak': updated_streak,
        'character': updated_char,
        'xp_gained': 150,
        'gold_gained': 25
    }
