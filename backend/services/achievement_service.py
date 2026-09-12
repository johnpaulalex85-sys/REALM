from datetime import datetime
from backend.services.progression import apply_xp_and_level_up

def evaluate_user_achievements(db, user_id: str) -> list:
    """
    Evaluates all user achievements against user metrics (quest completion counts, streak, gold, etc.).
    Unlocks achievements if criteria are met and awards rewards without duplicate claims.
    Returns list of newly unlocked achievement objects.
    """
    user_achievements = list(db.user_achievements.find({'user_id': user_id}))
    if not user_achievements:
        return []

    # Calculate metrics
    completed_quests = list(db.quest_completions.find({'user_id': user_id}))
    total_completed = len(completed_quests)
    
    char = db.characters.find_one({'user_id': user_id})
    if not char:
        return []

    streak = db.streaks.find_one({'user_id': user_id})
    streak_days = streak.get('current_streak', 1) if streak else char.get('streakDays', 1)
    gold = char.get('gold', 0)

    category_counts = {}
    for qc in completed_quests:
        cat = qc.get('category', 'GENERAL').upper()
        category_counts[cat] = category_counts.get(cat, 0) + 1

    study_count = category_counts.get('STUDY', 0)
    health_count = category_counts.get('HEALTH', 0)
    personal_count = category_counts.get('PERSONAL', 0)

    unlocked_now = []

    for ach in user_achievements:
        if ach.get('unlocked', False):
            continue

        ach_id = ach.get('id')
        max_p = ach.get('maxProgress', 1)
        current_p = ach.get('progress', 0)

        new_p = current_p

        if ach_id == 'first_steps':
            new_p = min(max_p, total_completed)
        elif ach_id == 'quest_master':
            new_p = min(max_p, total_completed)
        elif ach_id == 'realm_champion':
            new_p = min(max_p, total_completed)
        elif ach_id == 'consistent_mind':
            new_p = min(max_p, streak_days)
        elif ach_id == 'legendary_discipline':
            new_p = min(max_p, streak_days)
        elif ach_id == 'productivity_pro':
            new_p = min(max_p, study_count)
        elif ach_id == 'health_hero':
            new_p = min(max_p, health_count)
        elif ach_id == 'fitness_fighter':
            new_p = min(max_p, health_count)
        elif ach_id == 'social_butterfly':
            new_p = min(max_p, personal_count)
        elif ach_id == 'wealth_builder':
            new_p = min(max_p, gold)

        is_completed = new_p >= max_p

        if new_p != current_p or is_completed:
            update_data = {'progress': new_p}
            if is_completed and not ach.get('unlocked', False):
                update_data['unlocked'] = True
                update_data['status'] = 'completed'
                update_data['dateUnlocked'] = 'Just now'

                # Award achievement rewards to character
                xp_rew = ach.get('xpReward', 0)
                gold_rew = ach.get('goldReward', 0)

                latest_char = db.characters.find_one({'user_id': user_id})
                updated_char, level_up, levels_gained, new_level = apply_xp_and_level_up(
                    latest_char, xp_rew, gold_rew
                )
                db.characters.update_one({'user_id': user_id}, {'$set': updated_char})

                # Log activity
                db.activities.insert_one({
                    'user_id': user_id,
                    'type': 'achievement',
                    'title': f"Achievement Unlocked: {ach.get('title')}",
                    'xp': xp_rew,
                    'gold': gold_rew,
                    'timeAgo': 'Just now',
                    'timestamp': int(datetime.utcnow().timestamp() * 1000),
                    'created_at': datetime.utcnow()
                })

                unlocked_now.append(ach)

            db.user_achievements.update_one({'_id': ach['_id']}, {'$set': update_data})

    return unlocked_now
