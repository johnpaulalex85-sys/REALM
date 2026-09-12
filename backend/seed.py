from datetime import datetime, date

SEED_QUESTS = [
    {
        'title': 'Deep Work Session',
        'category': 'STUDY',
        'categoryColor': 'bg-indigo-900/80 border-purple-400/50 text-purple-200',
        'description': 'Focus for 30 minutes on a meaningful task.',
        'xpReward': 250,
        'goldReward': 40,
        'attribute': 'intellect',
        'energyCost': 15,
        'progress': 0,
        'active': False,
        'completed': False,
        'difficulty': 'Medium',
        'estimatedMinutes': 30,
        'currentMinutes': 0,
        'frequency': 'Daily',
        'quote': '“Focus is the key to extraordinary results.”',
        'iconName': 'book'
    },
    {
        'title': 'Morning Exercise',
        'category': 'HEALTH',
        'categoryColor': 'bg-emerald-950/80 border-emerald-400/50 text-emerald-200',
        'description': 'Complete 20 min workout.',
        'xpReward': 300,
        'goldReward': 50,
        'attribute': 'strength',
        'energyCost': 20,
        'progress': 0,
        'active': False,
        'completed': False,
        'difficulty': 'Medium',
        'estimatedMinutes': 20,
        'currentMinutes': 0,
        'frequency': 'Daily',
        'quote': '“Strength doesn’t come from what you can do, but overcoming what you once thought you couldn’t.”',
        'iconName': 'dumbbell'
    },
    {
        'title': 'Read a Book',
        'category': 'PERSONAL',
        'categoryColor': 'bg-amber-950/80 border-amber-400/50 text-amber-200',
        'description': 'Read 20 pages.',
        'xpReward': 200,
        'goldReward': 30,
        'attribute': 'wisdom',
        'energyCost': 15,
        'progress': 0,
        'active': False,
        'completed': False,
        'difficulty': 'Easy',
        'estimatedMinutes': 25,
        'currentMinutes': 0,
        'frequency': 'Daily',
        'quote': '“A reader lives a thousand lives before he dies. The man who never reads lives only one.”',
        'iconName': 'scroll'
    },
    {
        'title': 'Plan Your Day',
        'category': 'WORK',
        'categoryColor': 'bg-sky-950/80 border-sky-400/50 text-sky-200',
        'description': 'Organize and prioritize your tasks.',
        'xpReward': 150,
        'goldReward': 20,
        'attribute': 'discipline',
        'energyCost': 10,
        'progress': 0,
        'active': False,
        'completed': False,
        'difficulty': 'Easy',
        'estimatedMinutes': 15,
        'currentMinutes': 0,
        'frequency': 'Daily',
        'quote': '“By failing to prepare, you are preparing to fail.”',
        'iconName': 'scroll'
    },
    {
        'title': 'Meditation',
        'category': 'PERSONAL',
        'categoryColor': 'bg-amber-950/80 border-amber-400/50 text-amber-200',
        'description': 'Meditate for 10 minutes.',
        'xpReward': 100,
        'goldReward': 20,
        'attribute': 'wisdom',
        'energyCost': 10,
        'progress': 0,
        'active': False,
        'completed': False,
        'difficulty': 'Easy',
        'estimatedMinutes': 10,
        'currentMinutes': 0,
        'frequency': 'Daily',
        'quote': '“Quiet the mind, and the soul will speak.”',
        'iconName': 'brain'
    },
    {
        'title': 'Drink Water',
        'category': 'HEALTH',
        'categoryColor': 'bg-emerald-950/80 border-emerald-400/50 text-emerald-200',
        'description': 'Drink 8 glasses of water.',
        'xpReward': 100,
        'goldReward': 20,
        'attribute': 'vitality',
        'energyCost': 10,
        'progress': 0,
        'active': False,
        'completed': False,
        'difficulty': 'Easy',
        'estimatedMinutes': 12,
        'currentMinutes': 0,
        'frequency': 'Daily',
        'quote': '“Water is the driving force of all nature and energy.”',
        'iconName': 'shield'
    },
    {
        'title': 'Complete Assignment',
        'category': 'STUDY',
        'categoryColor': 'bg-indigo-900/80 border-purple-400/50 text-purple-200',
        'description': 'Finish your pending assignment.',
        'xpReward': 200,
        'goldReward': 30,
        'attribute': 'intellect',
        'energyCost': 20,
        'progress': 0,
        'active': False,
        'completed': False,
        'difficulty': 'Medium',
        'estimatedMinutes': 45,
        'currentMinutes': 0,
        'frequency': 'Weekly',
        'quote': '“Small disciplines repeated with consistency lead to great achievements.”',
        'iconName': 'book'
    },
    {
        'title': 'Clean Your Space',
        'category': 'PERSONAL',
        'categoryColor': 'bg-amber-950/80 border-amber-400/50 text-amber-200',
        'description': 'Spend 15 minutes cleaning.',
        'xpReward': 100,
        'goldReward': 20,
        'attribute': 'discipline',
        'energyCost': 15,
        'progress': 0,
        'active': False,
        'completed': False,
        'difficulty': 'Easy',
        'estimatedMinutes': 15,
        'currentMinutes': 0,
        'frequency': 'Daily',
        'quote': '“Clear your space to clear your mind.”',
        'iconName': 'shield'
    }
]

SEED_INVENTORY = [
    {
        'id': 'mindful_cloak',
        'name': 'Mindful Cloak',
        'rarity': 'Epic',
        'type': 'equipment',
        'category': 'boosts',
        'description': 'A cloak woven from the threads of focus. Helps you stay in the zone.',
        'bonus': '+5 Focus while working',
        'passiveEffect': 'Applies automatically while equipped',
        'quote': '“Discipline wears many forms.”',
        'sellPrice': 50,
        'icon': 'cloak',
        'quantity': 1,
        'equipped': True
    },
    {
        'id': 'time_shard',
        'name': 'Time Shard',
        'rarity': 'Legendary',
        'type': 'relic',
        'category': 'special',
        'description': 'Crystallized temporal energy mined from deep focused states.',
        'bonus': 'Reduces quest time by 25%',
        'passiveEffect': 'Accelerates progress calculations',
        'quote': '“Master time, or be mastered by it.”',
        'sellPrice': 150,
        'icon': 'hourglass',
        'quantity': 0,
        'equipped': False
    },
    {
        'id': 'focus_potion',
        'name': 'Focus Potion',
        'rarity': 'Rare',
        'type': 'potion',
        'category': 'consumables',
        'description': 'A distillation of hyper-concentration herbs that clears away brain fog.',
        'bonus': '+50 Focus (1 hour)',
        'quote': '“Clarity in a bottle.”',
        'sellPrice': 30,
        'icon': 'flask',
        'quantity': 1,
        'equipped': False
    },
    {
        'id': 'health_potion',
        'name': 'Health Potion',
        'rarity': 'Common',
        'type': 'potion',
        'category': 'consumables',
        'description': 'Enchanted tonic brewed from crimson berries and clean spring water.',
        'bonus': 'Restores 20 Health',
        'quote': '“Vitality renewed.”',
        'sellPrice': 15,
        'icon': 'apple',
        'quantity': 2,
        'equipped': False
    },
    {
        'id': 'knowledge_tome',
        'name': 'Knowledge Tome',
        'rarity': 'Epic',
        'type': 'relic',
        'category': 'boosts',
        'description': 'Illuminated codex holding synthesis techniques for complex disciplines.',
        'bonus': '+5 Intellect (permanent)',
        'quote': '“Knowledge compounds without limit.”',
        'sellPrice': 80,
        'icon': 'book',
        'quantity': 0,
        'equipped': False
    },
    {
        'id': 'energy_bar',
        'name': 'Energy Bar',
        'rarity': 'Common',
        'type': 'potion',
        'category': 'consumables',
        'description': 'Nutrient-dense ration that fuels prolonged physical and mental sessions.',
        'bonus': 'Restores 20 Energy',
        'quote': '“Fuel for the relentless.”',
        'sellPrice': 10,
        'icon': 'sneaker',
        'quantity': 2,
        'equipped': False
    },
    {
        'id': 'trackers_blade_item',
        'name': "Tracker's Blade",
        'rarity': 'Rare',
        'type': 'equipment',
        'category': 'boosts',
        'description': 'A tempered edge forged to slice away hesitation and strike directly at procrastination.',
        'bonus': '+10 Discipline',
        'quote': '“Strike while the iron is hot.”',
        'sellPrice': 70,
        'icon': 'sword',
        'quantity': 1,
        'equipped': True
    }
]

SEED_ACHIEVEMENTS = [
    {
        'id': 'consistent_mind',
        'title': 'Consistent Mind',
        'description': 'Complete 7 days in a row',
        'xpReward': 500,
        'goldReward': 100,
        'status': 'completed',
        'icon': 'brain',
        'category': 'Intellect',
        'rarity': 'Epic',
        'quote': 'Discipline compounds.',
        'unlocked': True,
        'dateUnlocked': '1 day ago',
        'progress': 7,
        'maxProgress': 7
    },
    {
        'id': 'bookworm',
        'title': 'Bookworm',
        'description': 'Read 10 books',
        'xpReward': 300,
        'goldReward': 50,
        'status': 'in_progress',
        'icon': 'book',
        'category': 'Intellect',
        'rarity': 'Rare',
        'quote': 'Pages turn into wisdom.',
        'unlocked': False,
        'progress': 6,
        'maxProgress': 10
    },
    {
        'id': 'fitness_fighter',
        'title': 'Fitness Fighter',
        'description': 'Complete 30 workout quests',
        'xpReward': 400,
        'goldReward': 75,
        'status': 'in_progress',
        'icon': 'dumbbell',
        'category': 'Strength',
        'rarity': 'Rare',
        'quote': 'Forge iron will through physical resistance.',
        'unlocked': False,
        'progress': 12,
        'maxProgress': 30
    },
    {
        'id': 'early_riser',
        'title': 'Early Riser',
        'description': 'Complete 20 morning quests',
        'xpReward': 300,
        'goldReward': 50,
        'status': 'completed',
        'icon': 'sun',
        'category': 'Vitality',
        'rarity': 'Rare',
        'quote': 'Conquer the dawn before the world awakens.',
        'unlocked': True,
        'dateUnlocked': '2 days ago',
        'progress': 20,
        'maxProgress': 20
    },
    {
        'id': 'quest_master',
        'title': 'Quest Master',
        'description': 'Complete 100 total quests',
        'xpReward': 1000,
        'goldReward': 200,
        'status': 'in_progress',
        'icon': 'scroll',
        'category': 'General',
        'rarity': 'Legendary',
        'quote': 'A century of disciplined deeds.',
        'unlocked': False,
        'progress': 0,
        'maxProgress': 100
    },
    {
        'id': 'productivity_pro',
        'title': 'Productivity Pro',
        'description': 'Complete 50 study quests',
        'xpReward': 300,
        'goldReward': 100,
        'status': 'in_progress',
        'icon': 'hourglass',
        'category': 'Discipline',
        'rarity': 'Epic',
        'quote': 'Deep work yields transcendent results.',
        'unlocked': False,
        'progress': 0,
        'maxProgress': 50
    },
    {
        'id': 'health_hero',
        'title': 'Health Hero',
        'description': 'Complete 50 health quests',
        'xpReward': 500,
        'goldReward': 100,
        'status': 'in_progress',
        'icon': 'leaf',
        'category': 'Vitality',
        'rarity': 'Rare',
        'quote': 'Honor the biological temple.',
        'unlocked': False,
        'progress': 0,
        'maxProgress': 50
    },
    {
        'id': 'wealth_builder',
        'title': 'Wealth Builder',
        'description': 'Earn 5,000 gold',
        'xpReward': 750,
        'goldReward': 0,
        'status': 'in_progress',
        'icon': 'coins',
        'category': 'General',
        'rarity': 'Epic',
        'quote': 'Value accumulated through consistent labor.',
        'unlocked': False,
        'progress': 50,
        'maxProgress': 5000
    },
    {
        'id': 'first_steps',
        'title': 'First Steps',
        'description': 'Complete your first quest',
        'xpReward': 100,
        'goldReward': 20,
        'status': 'in_progress',
        'icon': 'footprints',
        'category': 'General',
        'rarity': 'Common',
        'quote': 'The journey of a thousand leagues begins with a single step.',
        'unlocked': False,
        'progress': 0,
        'maxProgress': 1
    }
]

def copy_seed_templates_for_user(db, user_id: str):
    """Copies starter quests, inventory, and achievements for a newly registered user."""
    # Quests
    if db.quests.count_documents({'user_id': user_id}) == 0:
        quests_to_insert = []
        for q in SEED_QUESTS:
            q_copy = dict(q)
            q_copy['user_id'] = user_id
            q_copy['created_at'] = datetime.utcnow()
            q_copy['updated_at'] = datetime.utcnow()
            quests_to_insert.append(q_copy)
        if quests_to_insert:
            db.quests.insert_many(quests_to_insert)

    # Inventory
    if db.inventory.count_documents({'user_id': user_id}) == 0:
        inv_to_insert = []
        for inv in SEED_INVENTORY:
            inv_copy = dict(inv)
            inv_copy['user_id'] = user_id
            inv_copy['created_at'] = datetime.utcnow()
            inv_to_insert.append(inv_copy)
        if inv_to_insert:
            db.inventory.insert_many(inv_to_insert)

    # Achievements
    if db.user_achievements.count_documents({'user_id': user_id}) == 0:
        ach_to_insert = []
        for ach in SEED_ACHIEVEMENTS:
            ach_copy = dict(ach)
            ach_copy['user_id'] = user_id
            ach_copy['created_at'] = datetime.utcnow()
            ach_to_insert.append(ach_copy)
        if ach_to_insert:
            db.user_achievements.insert_many(ach_to_insert)

    # Streak
    from backend.services.streak_service import get_or_create_streak
    get_or_create_streak(db, user_id)

    # Activity initial log
    if db.activities.count_documents({'user_id': user_id}) == 0:
        now_ts = int(datetime.utcnow().timestamp() * 1000)
        db.activities.insert_one({
            'user_id': user_id,
            'type': 'completed_quest',
            'title': 'Registered to the Realm',
            'xp': 100,
            'gold': 50,
            'timeAgo': 'Just now',
            'timestamp': now_ts,
            'created_at': datetime.utcnow()
        })
