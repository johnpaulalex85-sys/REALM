import random

def calculate_quest_rewards(quest: dict, attributes: list) -> dict:
    """Calculates server-authoritative quest XP, Gold, Critical Insight, and Bountiful Discovery bonuses."""
    base_xp = quest.get('xpReward', 200)
    base_gold = quest.get('goldReward', 30)
    attr_type = quest.get('attribute', 'strength')

    int_stat = 10
    wis_stat = 10
    for a in attributes:
        if a.get('id') == 'intellect':
            int_stat = a.get('current', 10)
        elif a.get('id') == 'wisdom':
            wis_stat = a.get('current', 10)

    # Intellect proc (+25% XP)
    insight_proc = (attr_type == 'intellect') and (random.random() < min(0.7, int_stat / 35.0))
    bonus_xp = int(base_xp * 0.25) if insight_proc else 0
    final_xp = base_xp + bonus_xp

    # Wisdom proc (+30% Gold)
    discovery_proc = (attr_type == 'wisdom') and (random.random() < min(0.7, wis_stat / 35.0))
    bonus_gold = int(base_gold * 0.3) if discovery_proc else 0
    final_gold = base_gold + bonus_gold

    return {
        'base_xp': base_xp,
        'bonus_xp': bonus_xp,
        'final_xp': final_xp,
        'insight_proc': insight_proc,
        'base_gold': base_gold,
        'bonus_gold': bonus_gold,
        'final_gold': final_gold,
        'discovery_proc': discovery_proc,
        'attribute': attr_type
    }

def calculate_quest_energy_and_exhaustion(quest: dict, attributes: list, char_energy: int, is_step: bool = False) -> tuple:
    """
    Calculates energy cost and health loss (exhaustion) for progressing or completing a quest.
    Returns (energy_cost, health_loss, new_energy, new_health)
    """
    raw_cost = quest.get('energyCost', 15)
    cost = max(3, int(raw_cost * 0.4)) if is_step else raw_cost

    str_stat = 10
    dis_stat = 10
    for a in attributes:
        if a.get('id') == 'strength':
            str_stat = a.get('current', 10)
        elif a.get('id') == 'discipline':
            dis_stat = a.get('current', 10)

    attr = quest.get('attribute', 'strength')
    if attr == 'strength':
        cost = max(2, int(cost * (1.0 - min(0.45, str_stat / 150.0))))
    cost = max(2, int(cost * (1.0 - min(0.35, dis_stat / 200.0))))

    health_loss = 0
    if char_energy >= cost:
        new_energy = char_energy - cost
    else:
        deficit = cost - char_energy
        new_energy = 0
        health_loss = max(4 if is_step else 6, int(deficit * 1.5))

    return cost, health_loss, new_energy
