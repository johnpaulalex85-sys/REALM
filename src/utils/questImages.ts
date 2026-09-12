import { Quest } from '../types';

// High-res RPG Quest Artwork Assets
import questDeepWork from '../assets/images/quest_deepwork_1789200577920.jpg';
import questGymWeights from '../assets/images/quest_gym_weights_1789201011033.jpg';
import questExercise from '../assets/images/quest_exercise_1789200594078.jpg';
import questReadBook from '../assets/images/quest_reading_1789200614011.jpg';
import questPlanDay from '../assets/images/quest_plan_day_1789200935829.jpg';
import questMeditation from '../assets/images/quest_meditation_1789200950636.jpg';
import questDrinkWater from '../assets/images/quest_water_bottle_1789200964839.jpg';
import questCompleteAssignment from '../assets/images/quest_assignment_1789200979976.jpg';
import questCleanSpace from '../assets/images/quest_clean_space_1789200996914.jpg';
import questGoalCliff from '../assets/images/goal_reality_cliff_1789201973062.jpg';
import questCampfireCitadel from '../assets/images/campfire_citadel_1789200559232.jpg';
import questInscribeBanner from '../assets/images/inscribe_banner_1789201955914.jpg';
import questHeroShadow from '../assets/images/hero_shadow_banner_1789201471184.jpg';

export interface QuestArtOption {
  id: string;
  name: string;
  category: 'STUDY' | 'HEALTH' | 'PERSONAL' | 'WORK' | 'DISCIPLINE';
  image: string;
  description: string;
}

export const QUEST_ART_CATALOG: QuestArtOption[] = [
  {
    id: 'quest_deepwork',
    name: 'Deep Work & Focus',
    category: 'STUDY',
    image: questDeepWork,
    description: 'Concentrated study, coding & deep problem solving'
  },
  {
    id: 'quest_gym_weights',
    name: 'Iron & Weights',
    category: 'HEALTH',
    image: questGymWeights,
    description: 'Strength training, lifting & heavy gym workouts'
  },
  {
    id: 'quest_exercise',
    name: 'Dawn Runner & Cardio',
    category: 'HEALTH',
    image: questExercise,
    description: 'Outdoor cardio, running, agility & stamina'
  },
  {
    id: 'quest_reading',
    name: 'Ancient Tome & Lore',
    category: 'PERSONAL',
    image: questReadBook,
    description: 'Reading, book pages & expanding knowledge'
  },
  {
    id: 'quest_plan_day',
    name: 'Tactical Horizon',
    category: 'WORK',
    image: questPlanDay,
    description: 'Strategic daily planning & career focus'
  },
  {
    id: 'quest_meditation',
    name: 'Inner Sanctuary',
    category: 'PERSONAL',
    image: questMeditation,
    description: 'Meditation, mindfulness & tranquility'
  },
  {
    id: 'quest_water_bottle',
    name: 'Elixir of Vitality',
    category: 'HEALTH',
    image: questDrinkWater,
    description: 'Hydration, water intake & rejuvenation'
  },
  {
    id: 'quest_assignment',
    name: 'Arcane Thesis',
    category: 'STUDY',
    image: questCompleteAssignment,
    description: 'Assignments, coursework & milestone deliverables'
  },
  {
    id: 'quest_clean_space',
    name: 'Discipline Citadel',
    category: 'DISCIPLINE',
    image: questCleanSpace,
    description: 'Tidying up, organizing sanctuary & order'
  },
  {
    id: 'quest_goal_cliff',
    name: 'Summit Expedition',
    category: 'PERSONAL',
    image: questGoalCliff,
    description: 'Breakthrough ambitions & epic challenges'
  }
];

// Lookup map by ID, image key, or identifier
export const QUEST_IMAGE_LOOKUP: Record<string, string> = {
  // Key names
  quest_deepwork: questDeepWork,
  quest_gym_weights: questGymWeights,
  quest_exercise: questExercise,
  quest_reading: questReadBook,
  quest_plan_day: questPlanDay,
  quest_meditation: questMeditation,
  quest_water_bottle: questDrinkWater,
  quest_assignment: questCompleteAssignment,
  quest_clean_space: questCleanSpace,
  quest_goal_cliff: questGoalCliff,
  quest_campfire: questCampfireCitadel,
  quest_inscribe: questInscribeBanner,
  quest_hero: questHeroShadow,

  // Direct IDs from initial seed
  'quest-1': questDeepWork,
  'quest-2': questGymWeights,
  'quest-3': questReadBook,
  'quest-4': questPlanDay,
  'quest-5': questMeditation,
  'quest-6': questDrinkWater,
  'quest-7': questCompleteAssignment,
  'quest-8': questCleanSpace,

  // Additional aliases
  deepwork: questDeepWork,
  gym: questGymWeights,
  exercise: questExercise,
  workout: questGymWeights,
  reading: questReadBook,
  book: questReadBook,
  plan: questPlanDay,
  meditation: questMeditation,
  water: questDrinkWater,
  assignment: questCompleteAssignment,
  cleanspace: questCleanSpace,
  cliff: questGoalCliff
};

/**
 * Resolves a reliable, high-definition fantasy artwork picture for any quest.
 * Guarantees that every quest in the Quest Tab and across the app always has a vivid picture.
 */
export function getQuestPicture(quest?: Partial<Quest> | null): string {
  if (!quest) return questDeepWork;

  // 1. Direct valid image string check
  if (quest.image && typeof quest.image === 'string') {
    const trimmed = quest.image.trim();
    if (trimmed && trimmed !== 'null' && trimmed !== 'undefined') {
      // If image is a key in our lookup map
      if (QUEST_IMAGE_LOOKUP[trimmed]) {
        return QUEST_IMAGE_LOOKUP[trimmed];
      }
      // If it looks like a loaded asset, data URL, or web link
      if (
        trimmed.startsWith('data:') ||
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('/@fs') ||
        trimmed.startsWith('/src') ||
        trimmed.startsWith('/assets') ||
        trimmed.includes('.jpg') ||
        trimmed.includes('.jpeg') ||
        trimmed.includes('.png') ||
        trimmed.includes('.webp') ||
        trimmed.includes('.svg')
      ) {
        return trimmed;
      }
    }
  }

  // 2. Lookup by Quest ID
  if (quest.id && QUEST_IMAGE_LOOKUP[quest.id]) {
    return QUEST_IMAGE_LOOKUP[quest.id];
  }

  // 3. Keyword matching against title and description
  const text = `${quest.title || ''} ${quest.description || ''}`.toLowerCase();

  if (
    text.includes('deep work') ||
    text.includes('coding') ||
    text.includes('study') ||
    text.includes('code') ||
    text.includes('algorithm') ||
    text.includes('programming') ||
    text.includes('software') ||
    text.includes('focus')
  ) {
    return questDeepWork;
  }

  if (
    text.includes('gym') ||
    text.includes('weight') ||
    text.includes('lift') ||
    text.includes('strength') ||
    text.includes('muscle') ||
    text.includes('push-up') ||
    text.includes('calisthenic')
  ) {
    return questGymWeights;
  }

  if (
    text.includes('exercise') ||
    text.includes('workout') ||
    text.includes('run') ||
    text.includes('cardio') ||
    text.includes('jog') ||
    text.includes('fitness') ||
    text.includes('walk')
  ) {
    return questExercise;
  }

  if (
    text.includes('read') ||
    text.includes('book') ||
    text.includes('pages') ||
    text.includes('literature') ||
    text.includes('chapter') ||
    text.includes('novel') ||
    text.includes('tome')
  ) {
    return questReadBook;
  }

  if (
    text.includes('plan') ||
    text.includes('day') ||
    text.includes('organize') ||
    text.includes('schedule') ||
    text.includes('priorit') ||
    text.includes('todo') ||
    text.includes('calendar')
  ) {
    return questPlanDay;
  }

  if (
    text.includes('meditat') ||
    text.includes('mindful') ||
    text.includes('breath') ||
    text.includes('zen') ||
    text.includes('peace') ||
    text.includes('reflect') ||
    text.includes('quiet')
  ) {
    return questMeditation;
  }

  if (
    text.includes('water') ||
    text.includes('hydrat') ||
    text.includes('drink') ||
    text.includes('glass') ||
    text.includes('nutrition') ||
    text.includes('vitality')
  ) {
    return questDrinkWater;
  }

  if (
    text.includes('assignment') ||
    text.includes('homework') ||
    text.includes('exam') ||
    text.includes('thesis') ||
    text.includes('project') ||
    text.includes('school') ||
    text.includes('deliverable')
  ) {
    return questCompleteAssignment;
  }

  if (
    text.includes('clean') ||
    text.includes('space') ||
    text.includes('room') ||
    text.includes('tidy') ||
    text.includes('declutter') ||
    text.includes('sanctuary') ||
    text.includes('discipline')
  ) {
    return questCleanSpace;
  }

  // 4. Category fallback
  switch (quest.category) {
    case 'STUDY':
      return questDeepWork;
    case 'HEALTH':
      return questGymWeights;
    case 'WORK':
    case 'CAREER':
      return questPlanDay;
    case 'DISCIPLINE':
      return questCleanSpace;
    case 'PERSONAL':
      return questReadBook;
    default:
      return questDeepWork;
  }
}

export {
  questDeepWork,
  questGymWeights,
  questExercise,
  questReadBook,
  questPlanDay,
  questMeditation,
  questDrinkWater,
  questCompleteAssignment,
  questCleanSpace,
  questGoalCliff,
  questCampfireCitadel,
  questInscribeBanner,
  questHeroShadow
};
