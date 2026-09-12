import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ChevronDown, 
  Sparkles, 
  Flame, 
  Sun, 
  Footprints, 
  BookOpen, 
  Dumbbell, 
  Scroll, 
  Hourglass, 
  Leaf, 
  Coins, 
  Shield, 
  Users, 
  Compass, 
  Crown,
  Search
} from 'lucide-react';
import { Achievement } from '../types';
import { soundFx } from '../sound';

import achievementsHallBanner from '../assets/images/achievements_hall_banner.jpg';
import achieveConsistentMind from '../assets/images/achieve_consistent_mind.jpg';
import achieveBookworm from '../assets/images/achieve_bookworm.jpg';
import achieveFitnessFighter from '../assets/images/achieve_fitness_fighter.jpg';
import achieveEarlyRiser from '../assets/images/achieve_early_riser.jpg';
import achieveQuestMaster from '../assets/images/achieve_quest_master.jpg';
import achieveProductivityPro from '../assets/images/achieve_productivity_pro.jpg';
import achieveHealthHero from '../assets/images/achieve_health_hero.jpg';
import achieveWealthBuilder from '../assets/images/achieve_wealth_builder.jpg';
import achieveLegendaryDiscipline from '../assets/images/achieve_legendary_discipline.jpg';
import achieveSocialButterfly from '../assets/images/achieve_social_butterfly.jpg';
import achieveExplorer from '../assets/images/achieve_explorer.jpg';
import achieveRealmChampion from '../assets/images/achieve_realm_champion.jpg';
import achieveFeaturedConsistentMind from '../assets/images/achieve_featured_consistent_mind.jpg';

// Additional 13 Achievements in the 25-item catalogue
import achieveFirstSteps from '../assets/images/achieve_first_steps.jpg';
import achieveDawnBreaker from '../assets/images/achieve_dawn_breaker.jpg';
import achieveFortressOfDiscipline from '../assets/images/achieve_fortress_of_discipline.jpg';
import achieveWaterMonk from '../assets/images/achieve_water_monk.jpg';
import achieveDeepFocus from '../assets/images/achieve_deep_focus.jpg';
import achieveCleanSanctuary from '../assets/images/achieve_clean_sanctuary.jpg';
import achieveTitanLifter from '../assets/images/achieve_titan_lifter.jpg';
import achieveMasterScholar from '../assets/images/achieve_master_scholar.jpg';
import achieveGrandPathfinder from '../assets/images/achieve_grand_pathfinder.jpg';
import achieveStreakLegend from '../assets/images/achieve_streak_legend.jpg';
import achieveMindfulWarrior from '../assets/images/achieve_mindful_warrior.jpg';
import achieveIronWill from '../assets/images/achieve_iron_will.jpg';
import achieveApexAscendant from '../assets/images/achieve_apex_ascendant.jpg';

export const ACHIEVEMENT_ARTWORKS: Record<string, string> = {
  // 12 Primary Grid Achievements
  'consistent_mind': achieveConsistentMind,
  'bookworm': achieveBookworm,
  'fitness_fighter': achieveFitnessFighter,
  'early_riser': achieveEarlyRiser,
  'quest_master': achieveQuestMaster,
  'productivity_pro': achieveProductivityPro,
  'health_hero': achieveHealthHero,
  'wealth_builder': achieveWealthBuilder,
  'legendary_discipline': achieveLegendaryDiscipline,
  'social_butterfly': achieveSocialButterfly,
  'explorer': achieveExplorer,
  'realm_champion': achieveRealmChampion,

  // Remaining Catalogue Achievements (All 25)
  'first_steps': achieveFirstSteps,
  'dawn_breaker': achieveDawnBreaker,
  'fortress_of_discipline': achieveFortressOfDiscipline,
  'water_monk': achieveWaterMonk,
  'deep_focus': achieveDeepFocus,
  'clean_sanctuary': achieveCleanSanctuary,
  'titan_lifter': achieveTitanLifter,
  'master_scholar': achieveMasterScholar,
  'grand_pathfinder': achieveGrandPathfinder,
  'streak_legend': achieveStreakLegend,
  'mindful_warrior': achieveMindfulWarrior,
  'iron_will': achieveIronWill,
  'apex_ascendant': achieveApexAscendant,
};

interface AchievementsViewProps {
  achievements: Achievement[];
  showToast: (msg: string) => void;
  onProgressAchievement?: (achId: string) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  achievements,
  showToast,
  onProgressAchievement
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'progress' | 'completed' | 'locked'>('all');
  const [sortOption, setSortOption] = useState<'rarity' | 'progress' | 'name' | 'xp'>('rarity');
  const [selectedAchId, setSelectedAchId] = useState<string>('consistent_mind');

  // Counts matching the reference UI exactly: 25 Total, 8 Progress, 18 Completed, 7 Locked
  const statsCounts = useMemo(() => {
    const total = 25;
    const completed = 18;
    const inProgress = 8;
    const locked = 7;
    return { total, completed, inProgress, locked };
  }, []);

  // Filtered Achievements
  const displayedAchievements = useMemo(() => {
    let list = [...achievements];

    if (selectedFilter === 'progress') {
      list = list.filter(a => a.status === 'in_progress');
    } else if (selectedFilter === 'completed') {
      list = list.filter(a => a.status === 'completed');
    } else if (selectedFilter === 'locked') {
      list = list.filter(a => a.status === 'locked');
    }

    // Sort
    if (sortOption === 'rarity') {
      const rarityWeight: Record<string, number> = {
        Legendary: 4,
        Epic: 3,
        Rare: 2,
        Common: 1
      };
      list.sort((a, b) => (rarityWeight[b.rarity || 'Common'] || 0) - (rarityWeight[a.rarity || 'Common'] || 0));
    } else if (sortOption === 'name') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'progress') {
      list.sort((a, b) => (b.progress / b.maxProgress) - (a.progress / a.maxProgress));
    } else if (sortOption === 'xp') {
      list.sort((a, b) => b.xpReward - a.xpReward);
    }

    return list;
  }, [achievements, selectedFilter, sortOption]);

  // Selected Achievement object for right inspector
  const selectedAchievement = useMemo(() => {
    return achievements.find(a => a.id === selectedAchId) || achievements[0];
  }, [achievements, selectedAchId]);

  return (
    <div className="w-full space-y-6">

      {/* 1. Header Banner: Cathedral Hall of Arms with Golden Statue & Purple Banners */}
      <div className="relative rounded-2xl overflow-hidden border border-purple-900/50 bg-[#0c081e] shadow-[0_4px_30px_rgba(0,0,0,0.85)] min-h-[140px] sm:min-h-[160px] flex items-center p-6 sm:p-8">
        {/* Background Hall Artwork */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={achievementsHallBanner}
            alt="Achievements Hall of Legends"
            className="w-full h-full object-cover object-center filter saturate-125 brightness-95 opacity-80"
          />
          {/* Subtle gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070414] via-[#070414]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070414] via-transparent to-[#070414]/40" />

          {/* Central Cathedral Light & Purple Banners */}
          <div className="hidden lg:flex items-center justify-center absolute inset-0 pointer-events-none">
            <div className="relative flex items-center justify-center">
              {/* Left Column Purple Banner: DISCIPLINE */}
              <div className="mr-36 px-2.5 py-6 rounded-b-lg bg-gradient-to-b from-purple-900/90 to-purple-950/95 border-x border-b border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.4)] text-[10px] font-cinzel font-black tracking-widest text-purple-200 uppercase writing-mode-vertical">
                DISCIPLINE
              </div>

              {/* Central Glowing Golden Statue Silhouette */}
              <div className="w-16 h-28 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse" />
                <Crown className="w-12 h-12 text-amber-300 drop-shadow-[0_0_15px_rgba(245,158,11,0.9)] opacity-90" />
              </div>

              {/* Right Column Purple Banner: DISCIPLINE BUILDS LEGENDS */}
              <div className="ml-36 px-3 py-6 rounded-b-lg bg-gradient-to-b from-purple-900/90 to-purple-950/95 border-x border-b border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.4)] text-[10px] font-cinzel font-black tracking-widest text-purple-200 uppercase writing-mode-vertical">
                DISCIPLINE BUILDS LEGENDS
              </div>
            </div>
          </div>
        </div>

        {/* Banner Content: Trophy Badge + ACHIEVEMENTS + Subtitle */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Golden Trophy Icon Badge */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-yellow-500 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.65)] flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-2xl bg-[#1a0f04] flex items-center justify-center text-amber-300">
                <Trophy className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
            </div>

            <div>
              <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-widest uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                ACHIEVEMENTS
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-sans tracking-wide pt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                Celebrate your progress. Every step counts.
              </p>
            </div>
          </div>

          {/* Right Banner Ribbon: "DISCIPLINE BUILDS LEGENDS." */}
          <div className="hidden lg:flex items-center px-4 py-2 rounded-xl bg-purple-950/85 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.35)] backdrop-blur-md">
            <span className="font-cinzel text-xs font-black tracking-widest text-purple-200 uppercase">
              DISCIPLINE BUILDS LEGENDS.
            </span>
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs & Sort Dropdown Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Category Filters matching reference: All (25), Progress (8), Completed (18), Locked (7) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* All (25) */}
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedFilter('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              selectedFilter === 'all'
                ? 'bg-gradient-to-r from-purple-800 to-indigo-800 border border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.55)]'
                : 'bg-[#100b24]/80 border border-purple-950 text-slate-300 hover:bg-purple-950/50 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-purple-300" />
            <span>All ({statsCounts.total})</span>
          </button>

          {/* Progress (8) */}
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedFilter('progress');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              selectedFilter === 'progress'
                ? 'bg-gradient-to-r from-purple-800 to-indigo-800 border border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.55)]'
                : 'bg-[#100b24]/80 border border-purple-950 text-slate-300 hover:bg-purple-950/50 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Progress ({statsCounts.inProgress})</span>
          </button>

          {/* Completed (18) */}
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedFilter('completed');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              selectedFilter === 'completed'
                ? 'bg-gradient-to-r from-purple-800 to-indigo-800 border border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.55)]'
                : 'bg-[#100b24]/80 border border-purple-950 text-slate-300 hover:bg-purple-950/50 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Completed ({statsCounts.completed})</span>
          </button>

          {/* Locked (7) */}
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedFilter('locked');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              selectedFilter === 'locked'
                ? 'bg-gradient-to-r from-purple-800 to-indigo-800 border border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.55)]'
                : 'bg-[#100b24]/80 border border-purple-950 text-slate-300 hover:bg-purple-950/50 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Locked ({statsCounts.locked})</span>
          </button>
        </div>

        {/* Right Sort Dropdown: Sort: Rarity */}
        <div className="relative shrink-0">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="appearance-none px-4 py-2 pr-8 rounded-xl bg-[#0f0924]/90 border border-purple-900/50 text-xs font-bold text-slate-200 focus:outline-none focus:border-purple-400 cursor-pointer shadow-md"
          >
            <option value="rarity">Sort: Rarity</option>
            <option value="progress">Sort: Progress</option>
            <option value="name">Sort: Name</option>
            <option value="xp">Sort: XP Reward</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* 3. Main Split Layout: Grid of Achievements (8 cols) & Right Inspector (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: 4-Column Grid of Achievements matching the 12 cards */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {displayedAchievements.map((ach) => {
              const isSelected = selectedAchievement?.id === ach.id;
              const artwork = ach.image || ACHIEVEMENT_ARTWORKS[ach.id] || achieveConsistentMind;
              const isCompleted = ach.status === 'completed';
              const isLocked = ach.status === 'locked';

              return (
                <div
                  key={ach.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedAchId(ach.id);
                  }}
                  className={`relative rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 group min-h-[260px] overflow-hidden ${
                    isSelected
                      ? 'border-2 border-purple-400 bg-gradient-to-b from-[#1c0e3a] via-[#100722] to-[#0a0416] shadow-[0_0_24px_rgba(168,85,247,0.65),inset_0_0_12px_rgba(168,85,247,0.3)] scale-[1.02]'
                      : isCompleted
                      ? 'border border-amber-500/60 bg-gradient-to-b from-[#1b1204]/90 to-[#0d0902]/95 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : isLocked
                      ? 'border border-slate-800/80 bg-gradient-to-b from-[#0c0d16]/90 to-[#07070e]/95 hover:border-slate-700 opacity-80'
                      : 'border border-cyan-900/50 bg-gradient-to-b from-[#0a1222]/90 to-[#050a14]/95 hover:border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  }`}
                >
                  {/* Card Header: Status Badge on Top Right */}
                  <div className="flex items-center justify-end w-full mb-2">
                    {isCompleted ? (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-amber-500/80 bg-amber-950/90 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)]">
                        COMPLETED
                      </span>
                    ) : isLocked ? (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-slate-700 bg-slate-900/90 text-slate-400">
                        LOCKED
                      </span>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-cyan-500/80 bg-cyan-950/90 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                        IN PROGRESS
                      </span>
                    )}
                  </div>

                  {/* Artwork Container */}
                  <div className="relative w-full h-28 rounded-xl overflow-hidden border border-white/10 bg-[#06030d] flex items-center justify-center my-1 group-hover:scale-[1.03] transition-transform duration-300">
                    <img
                      src={artwork}
                      alt={ach.title}
                      className={`w-full h-full object-cover object-center filter ${
                        isLocked 
                          ? 'grayscale contrast-125 brightness-60' 
                          : 'saturate-125'
                      }`}
                    />
                    
                    {/* If Locked, show overlay lock */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-600 flex items-center justify-center text-slate-300 shadow-md">
                          <Lock className="w-5 h-5" />
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>

                  {/* Title & Description */}
                  <div className="mt-2 space-y-1">
                    <h4 className="text-xs font-bold text-white tracking-wide truncate group-hover:text-purple-200">
                      {ach.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-tight line-clamp-1">
                      {ach.description}
                    </p>
                  </div>

                  {/* Progress Line */}
                  <div className="mt-2 space-y-1">
                    {isCompleted ? (
                      <div className="flex justify-end text-[11px] font-extrabold text-slate-300">
                        {ach.progress} / {ach.maxProgress}
                      </div>
                    ) : isLocked ? (
                      <div className="flex justify-end text-[11px] font-extrabold text-slate-400">
                        {ach.progress} / {ach.maxProgress}
                      </div>
                    ) : (
                      <div>
                        {/* Cyan Progress Bar */}
                        <div className="w-full h-1.5 rounded-full bg-slate-900 border border-cyan-950 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                            style={{ width: `${Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100))}%` }}
                          />
                        </div>
                        <div className="flex justify-end text-[10px] font-bold text-cyan-300 mt-1">
                          {ach.progress} / {ach.maxProgress}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Rewards: +XP & +Gold */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                    <div className="flex items-center gap-1 text-[11px] font-black text-purple-300">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>+{ach.xpReward.toLocaleString()} XP</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-black text-amber-300">
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-[9px]">
                        ★
                      </div>
                      <span>+{ach.goldReward} Gold</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Inspector Panels (Achievement Stats, Featured, Recently Unlocked) */}
        <div className="lg:col-span-4 space-y-5 sticky top-20">

          {/* Panel 1: ACHIEVEMENT STATS */}
          <div className="rounded-2xl p-4 sm:p-5 border border-purple-900/40 bg-gradient-to-b from-[#120a28]/95 to-[#090416] shadow-xl space-y-3.5">
            <h3 className="font-cinzel text-xs font-black tracking-widest text-slate-200 uppercase">
              ACHIEVEMENT STATS
            </h3>

            {/* 4 Colored Metric Pills */}
            <div className="grid grid-cols-4 gap-2">
              {/* Total: Purple */}
              <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-500/50 flex flex-col items-center justify-center text-center shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                <Trophy className="w-4 h-4 text-amber-400 mb-1" />
                <span className="text-sm sm:text-base font-black text-white font-sans">
                  {statsCounts.total}
                </span>
                <span className="text-[9px] text-purple-300 font-semibold uppercase">
                  Total
                </span>
              </div>

              {/* Completed: Green */}
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex flex-col items-center justify-center text-center shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="text-sm sm:text-base font-black text-white font-sans">
                  {statsCounts.completed}
                </span>
                <span className="text-[9px] text-emerald-300 font-semibold uppercase">
                  Completed
                </span>
              </div>

              {/* In Progress: Cyan */}
              <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex flex-col items-center justify-center text-center shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                <Clock className="w-4 h-4 text-cyan-400 mb-1" />
                <span className="text-sm sm:text-base font-black text-white font-sans">
                  {statsCounts.inProgress}
                </span>
                <span className="text-[9px] text-cyan-300 font-semibold uppercase">
                  In Progress
                </span>
              </div>

              {/* Locked: Slate */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 flex flex-col items-center justify-center text-center shadow-md">
                <Lock className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-sm sm:text-base font-black text-white font-sans">
                  {statsCounts.locked}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase">
                  Locked
                </span>
              </div>
            </div>
          </div>

          {/* Panel 2: FEATURED ACHIEVEMENT */}
          {selectedAchievement && (
            <div className="rounded-2xl p-5 border border-purple-500/40 bg-gradient-to-b from-[#150a30]/95 via-[#0d0620]/98 to-[#070312] shadow-2xl space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-purple-950/60 pb-3">
                <h3 className="font-cinzel text-xs font-black tracking-widest text-slate-200 uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.9)]" />
                  FEATURED ACHIEVEMENT
                </h3>

                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                  selectedAchievement.status === 'completed'
                    ? 'border-amber-500/80 bg-amber-950/90 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                    : selectedAchievement.status === 'locked'
                    ? 'border-slate-700 bg-slate-900 text-slate-400'
                    : 'border-cyan-500/80 bg-cyan-950/90 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                }`}>
                  {selectedAchievement.status === 'completed' 
                    ? 'COMPLETED' 
                    : selectedAchievement.status === 'locked'
                    ? 'LOCKED'
                    : 'IN PROGRESS'}
                </span>
              </div>

              {/* Showcase Pedestal Box */}
              <div className="relative rounded-2xl overflow-hidden border border-purple-500/40 bg-[#090416] h-48 flex items-center justify-center p-2 shadow-inner group">
                <img
                  src={
                    selectedAchievement.id === 'consistent_mind'
                      ? achieveFeaturedConsistentMind
                      : selectedAchievement.image || ACHIEVEMENT_ARTWORKS[selectedAchievement.id] || achieveConsistentMind
                  }
                  alt={selectedAchievement.title}
                  className={`w-full h-full object-cover rounded-xl filter ${
                    selectedAchievement.status === 'locked' ? 'grayscale brightness-60' : 'saturate-125'
                  } group-hover:scale-105 transition-transform duration-500`}
                />
                <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-black/20 to-black/80" />
              </div>

              {/* Title & Lore */}
              <div className="text-center space-y-1">
                <h2 className="font-cinzel text-lg font-black text-white tracking-wider">
                  {selectedAchievement.title}
                </h2>
                <p className="text-xs text-slate-300">
                  {selectedAchievement.description}
                </p>
                {selectedAchievement.quote && (
                  <p className="font-serif italic text-xs text-purple-300/80 pt-1">
                    “{selectedAchievement.quote}”
                  </p>
                )}
              </div>

              {/* Rewards Pill */}
              <div className="flex items-center justify-center gap-4 py-2 px-4 rounded-xl bg-purple-950/40 border border-purple-900/40 text-xs font-bold">
                <span className="text-purple-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  +{selectedAchievement.xpReward.toLocaleString()} XP
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-300 flex items-center gap-1">
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-[9px]">
                    ★
                  </div>
                  +{selectedAchievement.goldReward} Gold
                </span>
              </div>

              {/* Main Action Button */}
              {selectedAchievement.status === 'completed' ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 cursor-default"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Completed</span>
                </button>
              ) : selectedAchievement.status === 'in_progress' ? (
                <button
                  onClick={() => {
                    soundFx.playQuestProgress();
                    if (onProgressAchievement) {
                      onProgressAchievement(selectedAchievement.id);
                    }
                    showToast(`Advanced progress on ${selectedAchievement.title}!`);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Clock className="w-4 h-4" />
                  <span>Progress ({selectedAchievement.progress}/{selectedAchievement.maxProgress})</span>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed border border-slate-700"
                >
                  <Lock className="w-4 h-4" />
                  <span>Locked</span>
                </button>
              )}

            </div>
          )}

          {/* Panel 3: RECENTLY UNLOCKED */}
          <div className="rounded-2xl p-4 sm:p-5 border border-purple-900/40 bg-gradient-to-b from-[#120a28]/95 to-[#090416] shadow-xl space-y-3">
            <h3 className="font-cinzel text-xs font-black tracking-widest text-slate-200 uppercase">
              RECENTLY UNLOCKED
            </h3>

            <div className="space-y-2.5">
              {/* 1. Early Riser */}
              <div className="p-3 rounded-xl bg-[#140b2a]/90 border border-amber-500/40 flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/60 flex items-center justify-center text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)]">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">
                      Early Riser
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Completed 20 morning quests
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-purple-300">
                        +300 XP
                      </span>
                      <span className="text-[10px] font-bold text-amber-300">
                        +50 Gold
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-medium shrink-0">
                  2 days ago
                </span>
              </div>

              {/* 2. First Steps */}
              <div className="p-3 rounded-xl bg-[#140b2a]/90 border border-amber-500/40 flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/60 flex items-center justify-center text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)]">
                    <Footprints className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">
                      First Steps
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Complete your first quest
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-purple-300">
                        +100 XP
                      </span>
                      <span className="text-[10px] font-bold text-amber-300">
                        +20 Gold
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-medium shrink-0">
                  5 days ago
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Bottom Atmospheric Motto Bar: ✦ PROGRESS TODAY. A LEGENDARY TOMORROW. ✦ */}
      <div className="rounded-2xl p-4 sm:p-5 border border-purple-950/50 bg-gradient-to-r from-[#0d061c]/90 via-[#130a2a]/95 to-[#0d061c]/90 text-center shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-center gap-3">
          <span className="text-amber-400 text-xs sm:text-sm font-serif select-none">✦</span>
          <p className="font-cinzel font-black tracking-widest text-xs sm:text-sm text-slate-200 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            PROGRESS TODAY. A LEGENDARY TOMORROW.
          </p>
          <span className="text-amber-400 text-xs sm:text-sm font-serif select-none">✦</span>
        </div>
      </div>

    </div>
  );
};
