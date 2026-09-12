import random
from bson import ObjectId
from datetime import datetime
from backend.services.progression import apply_xp_and_level_up, calculate_vitals

def award_quest_loot(db, user_id: str, quest: dict) -> dict:
    """Randomly selects and awards a loot drop item to user upon quest completion."""
    attr = quest.get('attribute', 'strength')
    category = quest.get('category', 'GENERAL')

    candidate_ids = []
    if attr == 'strength' or category == 'HEALTH':
        candidate_ids = ['health_potion', 'energy_bar', 'vitality_leaf']
    elif attr == 'intellect' or category in ['STUDY', 'WORK']:
        candidate_ids = ['focus_potion', 'productivity_brew', 'knowledge_tome']
    elif attr == 'wisdom' or category == 'PERSONAL':
        candidate_ids = ['clarity_crystal', 'ancient_scroll', 'explorers_compass']
    elif attr == 'discipline' or category == 'DISCIPLINE':
        candidate_ids = ['productivity_brew', 'iron_token', 'time_shard']
    else:
        candidate_ids = ['energy_bar', 'health_potion', 'focus_potion']

    loot_id = random.choice(candidate_ids)
    item = db.inventory.find_one({'user_id': user_id, 'id': loot_id})
    if item:
        db.inventory.update_one(
            {'_id': item['_id']},
            {'$inc': {'quantity': 1}}
        )
        # Add activity record
        db.activities.insert_one({
            'user_id': user_id,
            'type': 'item_acquired',
            'title': f"Acquired: +1 {item.get('name')}",
            'timeAgo': 'Just now',
            'timestamp': int(datetime.utcnow().timestamp() * 1000),
            'created_at': datetime.utcnow()
        })
        return {
            'id': item.get('id'),
            'name': item.get('name'),
            'rarity': item.get('rarity'),
            'bonus': item.get('bonus'),
            'image': item.get('image')
        }
    return None

def use_item(db, user_id: str, item_id: str) -> dict:
    """Uses a potion or consumable from inventory."""
    item = db.inventory.find_one({'user_id': user_id, 'id': item_id})
    if not item:
        item = db.inventory.find_one({'user_id': user_id, '_id': ObjectId(item_id)}) if ObjectId.is_valid(item_id) else None

    if not item:
        raise ValueError("Item not found in user inventory")

    if item.get('quantity', 0) <= 0:
        raise ValueError(f"No charges left for {item.get('name')}")

    # Deduct 1 quantity
    db.inventory.update_one({'_id': item['_id']}, {'$inc': {'quantity': -1}})

    char = db.characters.find_one({'user_id': user_id})
    if not char:
        raise ValueError("Character not found")

    id_low = item.get('id', '').lower()
    xp_award = 250
    gold_award = 0
    attr_boost = None

    if 'focus' in id_low:
        xp_award = 350
        attr_boost = 'intellect'
    elif 'health' in id_low or 'vitality' in id_low:
        xp_award = 250
        attr_boost = 'vitality'
    elif 'productivity' in id_low or 'brew' in id_low:
        xp_award = 400
        gold_award = 75
        attr_boost = 'discipline'
    elif 'time_shard' in id_low or 'shard' in id_low:
        xp_award = 600
        gold_award = 150
    elif 'knowledge' in id_low or 'scroll' in id_low or 'tome' in id_low:
        xp_award = 500
        attr_boost = 'wisdom'
    elif 'phoenix' in id_low:
        xp_award = 1000
        gold_award = 250
        attr_boost = 'vitality'
    elif 'energy' in id_low:
        xp_award = 200
        gold_award = 35
        attr_boost = 'strength'
    elif 'token' in id_low or 'badge' in id_low or 'trophy' in id_low:
        xp_award = 750
        gold_award = 300

    hp_rest = item.get('healthRestore', 0)
    ep_rest = item.get('energyRestore', 0)
    if 'health' in id_low:
        hp_rest = max(hp_rest, 50)
    elif 'vitality' in id_low:
        hp_rest = max(hp_rest, 40)
        ep_rest = max(ep_rest, 25)
    elif 'energy' in id_low:
        ep_rest = max(ep_rest, 40)
    elif 'productivity' in id_low or 'brew' in id_low:
        ep_rest = max(ep_rest, 50)
        hp_rest = max(hp_rest, 20)
    elif 'focus' in id_low:
        ep_rest = max(ep_rest, 40)

    max_hp, max_ep = calculate_vitals(char.get('attributes', []))
    new_hp = min(max_hp, char.get('health', 100) + hp_rest)
    new_ep = min(max_ep, char.get('energy', 100) + ep_rest)

    char['health'] = new_hp
    char['energy'] = new_ep

    updated_char, level_up, levels_gained, new_level = apply_xp_and_level_up(char, xp_award, gold_award)

    if attr_boost:
        attrs = updated_char.get('attributes', [])
        for a in attrs:
            if a.get('id') == attr_boost:
                a['current'] = min(a.get('max', 100), a.get('current', 10) + 1)
        updated_char['attributes'] = attrs

    db.characters.update_one({'user_id': user_id}, {'$set': updated_char})

    # Log activity
    db.activities.insert_one({
        'user_id': user_id,
        'type': 'item_acquired',
        'title': f"Consumed {item.get('name')}",
        'xp': xp_award,
        'gold': gold_award,
        'timeAgo': 'Just now',
        'timestamp': int(datetime.utcnow().timestamp() * 1000),
        'created_at': datetime.utcnow()
    })

    return {
        'item': item.get('name'),
        'hp_restored': hp_rest,
        'energy_restored': ep_rest,
        'xp_gained': xp_award,
        'gold_gained': gold_award,
        'level_up': level_up,
        'new_level': new_level,
        'character': updated_char
    }

def equip_item(db, user_id: str, item_id: str) -> dict:
    """Toggles equip status for an item."""
    item = db.inventory.find_one({'user_id': user_id, 'id': item_id})
    if not item:
        item = db.inventory.find_one({'user_id': user_id, '_id': ObjectId(item_id)}) if ObjectId.is_valid(item_id) else None

    if not item:
        raise ValueError("Item not found in inventory")

    new_equipped = not item.get('equipped', False)
    db.inventory.update_one({'_id': item['_id']}, {'$set': {'equipped': new_equipped}})

    # Update equipped_items in character
    equipped_docs = list(db.inventory.find({'user_id': user_id, 'equipped': True}))
    equipped_ids = [doc.get('id') for doc in equipped_docs]
    db.characters.update_one({'user_id': user_id}, {'$set': {'equippedItems': equipped_ids}})

    return {'id': item.get('id'), 'equipped': new_equipped}

def sell_item(db, user_id: str, item_id: str) -> dict:
    """Sells an inventory item for gold."""
    item = db.inventory.find_one({'user_id': user_id, 'id': item_id})
    if not item:
        item = db.inventory.find_one({'user_id': user_id, '_id': ObjectId(item_id)}) if ObjectId.is_valid(item_id) else None

    if not item:
        raise ValueError("Item not found in inventory")

    if item.get('quantity', 0) <= 0:
        raise ValueError("Cannot sell item: 0 left in inventory")

    sell_price = item.get('sellPrice', 20)

    db.inventory.update_one({'_id': item['_id']}, {'$inc': {'quantity': -1}})
    db.characters.update_one({'user_id': user_id}, {'$inc': {'gold': sell_price}})

    db.activities.insert_one({
        'user_id': user_id,
        'type': 'item_acquired',
        'title': f"Sold {item.get('name')} for +{sell_price} Gold",
        'gold': sell_price,
        'timeAgo': 'Just now',
        'timestamp': int(datetime.utcnow().timestamp() * 1000),
        'created_at': datetime.utcnow()
    })

    char = db.characters.find_one({'user_id': user_id})
    return {
        'sold_item': item.get('name'),
        'gold_gained': sell_price,
        'new_gold_total': char.get('gold', 0)
    }

def buy_item(db, user_id: str, item_id: str) -> dict:
    """Purchases an inventory item using earned Gold currency."""
    item = db.inventory.find_one({'user_id': user_id, 'id': item_id})
    if not item:
        item = db.inventory.find_one({'user_id': user_id, '_id': ObjectId(item_id)}) if ObjectId.is_valid(item_id) else None

    if not item:
        raise ValueError("Item not found in merchant catalog")

    buy_price = item.get('buyPrice', int(item.get('sellPrice', 20) * 1.5))
    char = db.characters.find_one({'user_id': user_id})
    if not char:
        raise ValueError("Character not found")

    user_gold = char.get('gold', 0)
    if user_gold < buy_price:
        raise ValueError(f"Insufficient Gold! Requires {buy_price} Gold (You have {user_gold} Gold)")

    # Deduct gold & increase item quantity
    db.characters.update_one({'user_id': user_id}, {'$inc': {'gold': -buy_price}})
    db.inventory.update_one({'_id': item['_id']}, {'$inc': {'quantity': 1}})

    db.activities.insert_one({
        'user_id': user_id,
        'type': 'item_acquired',
        'title': f"Purchased {item.get('name')} for {buy_price} Gold",
        'gold': -buy_price,
        'timeAgo': 'Just now',
        'timestamp': int(datetime.utcnow().timestamp() * 1000),
        'created_at': datetime.utcnow()
    })

    updated_char = db.characters.find_one({'user_id': user_id})
    updated_item = db.inventory.find_one({'_id': item['_id']})

    return {
        'purchased_item': updated_item.get('name'),
        'buy_price': buy_price,
        'new_gold_total': updated_char.get('gold', 0),
        'item': updated_item
    }
