import math

def calculate_max_xp_for_level(level: int) -> int:
    """Non-linear XP requirement curve: 200 * (1.25 ^ level)"""
    return math.ceil(200 * math.pow(1.25, level))

def calculate_vitals(attributes: list) -> tuple:
    """Calculate maxHealth and maxEnergy based on vitality and discipline."""
    vit = 10
    dis = 10
    for attr in attributes:
        if attr.get('id') == 'vitality':
            vit = attr.get('current', 10)
        elif attr.get('id') == 'discipline':
            dis = attr.get('current', 10)
    
    max_health = 100 + vit * 2
    max_energy = 100 + int(vit * 1.5 + dis * 0.5)
    return max_health, max_energy

def apply_xp_and_level_up(character: dict, xp_gained: int, gold_gained: int) -> tuple:
    """
    Applies XP and gold to character, checks for level up using non-linear XP curve.
    Returns (updated_character_dict, level_up_occurred, levels_gained, new_level)
    """
    current_level = character.get('level', 0)
    current_xp = character.get('currentXP', 0)
    max_xp = character.get('maxXP', calculate_max_xp_for_level(current_level))
    total_xp = character.get('totalXP', 0) + xp_gained
    current_gold = character.get('gold', 0) + gold_gained

    next_xp = current_xp + xp_gained
    level_up = False
    levels_gained = 0

    while next_xp >= max_xp:
        level_up = True
        levels_gained += 1
        next_xp -= max_xp
        current_level += 1
        max_xp = calculate_max_xp_for_level(current_level)

    updated_char = {
        **character,
        'level': current_level,
        'currentXP': next_xp,
        'maxXP': max_xp,
        'totalXP': total_xp,
        'gold': current_gold
    }

    return updated_char, level_up, levels_gained, current_level
