import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  CheckCircle, 
  Lock, 
  Plus, 
  Compass, 
  Clock, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  HeartPulse, 
  Sparkles, 
  Layers,
  BarChart2,
  Bookmark,
  ArrowRight,
  Flame,
  Check,
  Zap
} from 'lucide-react';
import { Quest } from '../types';
import { soundFx } from '../sound';
import parchmentLanternImg from '../assets/images/parchment_lantern_1789201037103.jpg';
import realmBg from '../assets/images/realm_fantasy_bg_1789200503712.jpg';

interface QuestBoardProps {
  quests: Quest[];
  onContinueQuest: (questId: string) => void;
  onCompleteQuest: (questId: string) => void;
  onOpenAddQuest: () => void;
  onAcceptQuest?: (questId: string) => void;
}

type FilterCategory = 'ALL' | 'DAILY' | 'WEEKLY' | 'STUDY' | 'WORK' | 'HEALTH' | 'PERSONAL';

export const QuestBoard: React.FC<QuestBoardProps> = ({
  quests,
  onContinueQuest,
  onCompleteQuest,
  onOpenAddQuest,
  onAcceptQuest,
}) => {
  const [selectedQuestId, setSelectedQuestId] = useState<string>('quest-1');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Quest object (fallbacks to first quest)
  const selectedQuest = useMemo(() => {
    return quests.find(q => q.id === selectedQuestId) || quests[0];
  }, [quests, selectedQuestId]);

  // Filtered quests
  const filteredQuests = useMemo(() => {
    return quests.filter(quest => {
      // Filter by tab
      if (activeFilter === 'DAILY' && quest.frequency !== 'Daily') return false;
      if (activeFilter === 'WEEKLY' && quest.frequency !== 'Weekly') return false;
      if (activeFilter === 'STUDY' && quest.category !== 'STUDY') return false;
      if (activeFilter === 'WORK' && quest.category !== 'WORK') return false;
      if (activeFilter === 'HEALTH' && quest.category !== 'HEALTH') return false;
      if (activeFilter === 'PERSONAL' && quest.category !== 'PERSONAL') return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = quest.title.toLowerCase().includes(query);
        const matchesDesc = quest.description.toLowerCase().includes(query);
        const matchesCat = quest.category.toLowerCase().includes(query);
        return matchesTitle || matchesDesc || matchesCat;
      }
      return true;
    });
  }, [quests, activeFilter, searchQuery]);

  // Helper for category badge styling
  const getCategoryBadge = (category: Quest['category']) => {
    switch (category) {
      case 'STUDY':
        return {
          label: 'STUDY',
          className: 'bg-purple-900/90 text-purple-200 border-purple-400/50 shadow-[0_0_8px_rgba(168,85,247,0.4)]'
        };
      case 'HEALTH':
        return {
          label: 'HEALTH',
          className: 'bg-emerald-950/90 text-emerald-200 border-emerald-400/50 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
        };
      case 'WORK':
        return {
          label: 'WORK',
          className: 'bg-cyan-950/90 text-cyan-200 border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
        };
      case 'PERSONAL':
      default:
        return {
          label: 'PERSONAL',
          className: 'bg-amber-950/90 text-amber-200 border-amber-400/50 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
        };
    }
  };

  // Helper for progress bar color
  const getProgressBarColor = (category: Quest['category']) => {
    switch (category) {
      case 'STUDY':
        return 'from-cyan-400 via-sky-400 to-cyan-300';
      case 'HEALTH':
        return 'from-emerald-400 via-teal-400 to-emerald-300';
      case 'WORK':
        return 'from-cyan-500 via-sky-400 to-blue-400';
      case 'PERSONAL':
      default:
        return 'from-amber-400 via-yellow-400 to-amber-300';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Background Fantasy Spire Banner */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-purple-900/40 bg-[#0c0822] shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        {/* Background Artwork with Twilight Skyline */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={realmBg}
            alt="Realm Fantasy Sky"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[center_35%] opacity-60 filter saturate-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070514] via-[#0d0724]/80 to-[#070514]/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070514] via-transparent to-transparent" />
        </div>

        {/* Quest Board Title Bar & Hanging Banner */}
        <div className="relative z-10 p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Golden Compass Rose / Astrolabe */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#241706] to-[#45280b] border border-amber-500/60 p-2.5 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.35)]">
              <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" fill="none">
                <circle cx="50" cy="50" r="44" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
                <circle cx="50" cy="50" r="36" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
                <circle cx="50" cy="50" r="28" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />
                {/* 8-point compass star */}
                <polygon points="50,6 54,42 94,50 54,58 50,94 46,58 6,50 46,42" fill="#fbbf24" />
                <polygon points="50,6 50,50 94,50 50,50 50,94 50,50 6,50 50,50" fill="#f59e0b" />
                <polygon points="50,20 52,44 76,32 54,48 80,50 54,52 76,68 52,56 50,80 48,56 24,68 46,52 20,50 46,48 24,32 48,44" fill="#fef08a" opacity="0.9" />
                <circle cx="50" cy="50" r="5" fill="#ffffff" />
                <circle cx="50" cy="50" r="2.5" fill="#78350f" />
              </svg>
            </div>

            <div>
              <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                QUEST BOARD
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Turn your goals into quests. Progress, earn rewards, and become a better you.
              </p>
            </div>
          </div>

          {/* Right Hanging Velvet Guild Banner */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="relative px-5 py-3 rounded-b-xl border-x-2 border-b-2 border-purple-500/60 bg-gradient-to-b from-purple-950/90 via-[#220c3b]/95 to-[#120524] shadow-[0_10px_25px_rgba(0,0,0,0.7)] flex items-center gap-3">
              <div className="text-right">
                <span className="block font-cinzel text-[10px] font-black tracking-widest text-purple-200">
                  SAME PERSON.
                </span>
                <span className="block font-cinzel text-xs font-black tracking-widest text-purple-300">
                  HIGHER STANDARDS.
                </span>
              </div>
              {/* Guild Crest Icon */}
              <div className="w-8 h-8 rounded-lg bg-purple-900/60 border border-purple-400/50 flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-purple-300 drop-shadow-[0_0_4px_#c084fc]">
                  <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3zm0 4.5l3.5 3.5-1.4 1.4L12 9.3 9.9 11.4 8.5 10 12 6.5zm-3 7.5h6v2H9v-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
        {/* Filters pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL' as FilterCategory, label: 'All', icon: Layers },
            { id: 'DAILY' as FilterCategory, label: 'Daily', icon: Clock },
            { id: 'WEEKLY' as FilterCategory, label: 'Weekly', icon: Calendar },
            { id: 'STUDY' as FilterCategory, label: 'Study', icon: GraduationCap },
            { id: 'WORK' as FilterCategory, label: 'Work', icon: Briefcase },
            { id: 'HEALTH' as FilterCategory, label: 'Health', icon: HeartPulse },
            { id: 'PERSONAL' as FilterCategory, label: 'Personal', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveFilter(tab.id);
                }}
                className={`
                  flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all
                  ${isActive 
                    ? 'bg-purple-700/80 text-white border border-purple-400/70 shadow-[0_0_12px_rgba(168,85,247,0.5)]' 
                    : 'bg-[#101228]/80 text-slate-400 border border-purple-900/30 hover:text-slate-200 hover:border-purple-700/50'}
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.id === 'ALL' && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-purple-950 text-[10px] text-purple-300 font-extrabold">
                    {quests.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search input with filter icon */}
        <div className="flex items-center gap-2 max-w-sm w-full lg:w-72">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quests..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#101228]/90 text-slate-200 placeholder-slate-500 rounded-xl border border-purple-900/40 focus:outline-none focus:border-purple-500/70 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          <button 
            onClick={() => soundFx.playClick()}
            className="p-2 rounded-xl bg-[#101228]/90 border border-purple-900/40 hover:border-purple-500/60 text-slate-400 hover:text-slate-200 transition-colors"
            title="Filter Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Quest Content: Left Quest Grid + Right Quest Details Column */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column: 8 Quests + Bottom Locked/Create Row (8 cols on XL) */}
        <div className="xl:col-span-8 space-y-6">
          {/* Quest Grid: 4 columns on large screens, 2 on medium, 1 on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredQuests.map((quest) => {
              const badge = getCategoryBadge(quest.category);
              const barColor = getProgressBarColor(quest.category);
              const isSelected = quest.id === selectedQuestId;
              const isCompleted = quest.progress >= 100;

              return (
                <div
                  key={quest.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedQuestId(quest.id);
                  }}
                  className={`
                    relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#13102d]/95 to-[#0b081c]/95
                    cursor-pointer transition-all duration-300 flex flex-col justify-between group
                    ${isSelected 
                      ? 'border-2 border-amber-400 shadow-[0_0_22px_rgba(245,158,11,0.55)] scale-[1.01]' 
                      : 'border border-purple-900/40 hover:border-purple-500/60 shadow-lg hover:shadow-purple-950/40'}
                  `}
                >
                  {/* Top Image Banner */}
                  <div className="relative w-full h-36 overflow-hidden">
                    {quest.image ? (
                      <img
                        src={quest.image}
                        alt={quest.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-purple-950/40 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-purple-400" />
                      </div>
                    )}

                    {/* Dark gradient shadow on bottom of image for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13102d] via-transparent to-transparent opacity-90" />

                    {/* Category & Status Pill Tag on Top Right */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                      {quest.active && !isCompleted && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider bg-cyan-950/90 text-cyan-300 border border-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.5)] backdrop-blur-md animate-pulse">
                          ACTIVE
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-widest border backdrop-blur-md ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Frequency Pill on Top Left */}
                    {quest.frequency && (
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider bg-black/60 text-slate-300 border border-white/10 backdrop-blur-md">
                          {quest.frequency}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-sans text-sm font-black text-white tracking-wide group-hover:text-purple-200 transition-colors line-clamp-1">
                        {quest.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium mt-1 line-clamp-2 leading-relaxed">
                        {quest.description}
                      </p>
                    </div>

                    <div className="mt-3.5 space-y-2.5">
                      {/* Rewards row with Stamina Energy Cost & Attribute Domain */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs font-bold">
                        <div className="flex items-center gap-2">
                          <span className="text-purple-300 flex items-center gap-0.5 font-sans text-[11px]">
                            <span className="text-purple-400 drop-shadow-[0_0_4px_#c084fc]">✦</span>+{quest.xpReward} XP
                          </span>
                          <span className="text-amber-300 flex items-center gap-0.5 font-sans text-[11px]">
                            <span className="text-amber-400 drop-shadow-[0_0_4px_#f59e0b]">★</span>+{quest.goldReward} Gold
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-[10px] flex items-center gap-0.5 font-sans">
                            <Zap className="w-2.5 h-2.5 fill-cyan-400" /> -{quest.energyCost || 10}
                          </span>
                          <span className="text-indigo-300 px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-800/40 text-[9px] uppercase tracking-wider">
                            +{quest.attribute}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar + percentage */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                          <span className="text-[9px] uppercase tracking-wider">Progress</span>
                          <span className="text-slate-200">{quest.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#070614] rounded-full overflow-hidden border border-white/5">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-300`}
                            style={{ width: `${Math.min(100, quest.progress)}%` }}
                          />
                        </div>
                      </div>

                      {/* Bottom Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isCompleted) {
                            soundFx.playQuestComplete();
                          } else if (quest.active) {
                            soundFx.playClick();
                            onContinueQuest(quest.id);
                          } else {
                            soundFx.playClick();
                            onAcceptQuest?.(quest.id);
                          }
                        }}
                        className={`
                          w-full py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer
                          ${isCompleted 
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900/80' 
                            : quest.active 
                              ? 'bg-gradient-to-r from-purple-800 to-indigo-700 hover:from-purple-700 hover:to-indigo-600 text-white border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                              : 'bg-purple-950/60 hover:bg-purple-800/80 text-purple-200 hover:text-white border border-purple-700/50 hover:border-purple-400'}
                        `}
                      >
                        {isCompleted ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Completed</span>
                          </>
                        ) : quest.active ? (
                          <>
                            <span>Continue</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>Accept Quest</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Row: Create Your Own Quest + 2 Locked Quests */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Create Your Own Quest */}
            <div className="rounded-2xl p-4 bg-gradient-to-b from-[#140e33]/90 to-[#0c0721]/95 border border-purple-600/40 shadow-xl flex flex-col items-center text-center justify-between min-h-[170px] group">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenAddQuest();
                  }}
                  className="w-11 h-11 rounded-full bg-purple-700/60 hover:bg-purple-600 border border-purple-400/60 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all mb-2.5 group-hover:scale-105"
                >
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </button>
                <h3 className="font-sans text-sm font-black text-white tracking-wide">
                  Create Your Own Quest
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mt-1 px-2 leading-relaxed">
                  Have a unique goal? Create a custom quest and make it part of your journey.
                </p>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenAddQuest();
                }}
                className="mt-3 px-4 py-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-700 text-purple-200 text-xs font-bold border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all flex items-center gap-1.5"
              >
                <span>Add Quest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Locked Quest 1 */}
            <div className="rounded-2xl p-4 bg-gradient-to-b from-[#100e26]/80 to-[#0a0718]/90 border border-purple-950/50 shadow-lg flex flex-col items-center text-center justify-between min-h-[170px] opacity-75">
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-full bg-[#171433] border border-purple-800/40 flex items-center justify-center text-slate-400 mb-2.5">
                  <Lock className="w-5 h-5 text-purple-400/70" />
                </div>
                <h3 className="font-sans text-sm font-black text-slate-300 tracking-wide">
                  Locked Quest
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-1 px-2 leading-relaxed">
                  Reach Level 15 to unlock this special quest.
                </p>
              </div>

              <div className="mt-3 w-full py-1.5 px-4 rounded-xl bg-[#14122b] text-slate-500 text-xs font-bold border border-purple-950 text-center cursor-not-allowed">
                Locked
              </div>
            </div>

            {/* Card 3: Locked Quest 2 */}
            <div className="rounded-2xl p-4 bg-gradient-to-b from-[#100e26]/80 to-[#0a0718]/90 border border-purple-950/50 shadow-lg flex flex-col items-center text-center justify-between min-h-[170px] opacity-75">
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-full bg-[#171433] border border-purple-800/40 flex items-center justify-center text-slate-400 mb-2.5">
                  <Lock className="w-5 h-5 text-purple-400/70" />
                </div>
                <h3 className="font-sans text-sm font-black text-slate-300 tracking-wide">
                  Locked Quest
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-1 px-2 leading-relaxed">
                  Complete 10 quests to unlock this special quest.
                </p>
              </div>

              <div className="mt-3 w-full py-1.5 px-4 rounded-xl bg-[#14122b] text-slate-500 text-xs font-bold border border-purple-950 text-center cursor-not-allowed">
                Locked
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: QUEST DETAILS Panel (4 cols on XL) */}
        <div className="xl:col-span-4 space-y-6">
          {/* Cyber-Fantasy Cyan Framed Box */}
          <div className="relative rounded-2xl overflow-hidden bg-[#0a0920]/95 border-2 border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.25)] p-4 sm:p-5">
            {/* Tech Corner Rivets / Brackets */}
            <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

            {/* Panel Title */}
            <h2 className="font-cinzel text-base sm:text-lg font-black tracking-widest text-cyan-200 uppercase mb-3 flex items-center gap-2">
              <span>QUEST DETAILS</span>
            </h2>

            {/* Selected Quest Image Preview */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/10 shadow-lg">
              {selectedQuest.image ? (
                <img
                  src={selectedQuest.image}
                  alt={selectedQuest.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-purple-950/40 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
              )}
              {/* Overlay shadow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0920] via-transparent to-transparent opacity-80" />

              {/* Category Pill Tag on Top Right */}
              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-widest border backdrop-blur-md ${getCategoryBadge(selectedQuest.category).className}`}>
                  {getCategoryBadge(selectedQuest.category).label}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="mt-4">
              <h3 className="font-sans text-lg font-black text-white tracking-wide">
                {selectedQuest.title}
              </h3>
              <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
                {selectedQuest.description}
              </p>
            </div>

            {/* Motivational Quote Box */}
            <div className="mt-3.5 p-3 rounded-xl bg-purple-950/40 border border-purple-600/30 text-center">
              <p className="font-sans text-xs italic font-medium text-purple-200/90 leading-relaxed">
                {selectedQuest.quote || '“Focus is the key to extraordinary results.”'}
              </p>
            </div>

            {/* Metadata Rows */}
            <div className="mt-4 space-y-2.5 text-xs">
              {/* XP Reward */}
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <span className="text-purple-400 text-sm">✦</span>
                  <span>XP Reward</span>
                </div>
                <span className="font-extrabold text-purple-300 font-sans">
                  +{selectedQuest.xpReward} XP
                </span>
              </div>

              {/* Gold Reward */}
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <span className="text-amber-400 text-sm">★</span>
                  <span>Gold Reward</span>
                </div>
                <span className="font-extrabold text-amber-300 font-sans">
                  +{selectedQuest.goldReward} Gold
                </span>
              </div>

              {/* Difficulty */}
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Difficulty</span>
                </div>
                <span className="font-bold text-slate-200">
                  {selectedQuest.difficulty || 'Medium'}
                </span>
              </div>

              {/* Category */}
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                  <span>Category</span>
                </div>
                <span className="font-bold text-slate-200 capitalize">
                  {selectedQuest.category.toLowerCase()}
                </span>
              </div>

              {/* Estimated Time */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Estimated Time</span>
                </div>
                <span className="font-bold text-slate-200">
                  {selectedQuest.estimatedMinutes || 30} minutes
                </span>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Progress</span>
                <span className="text-cyan-300">{selectedQuest.progress}%</span>
              </div>

              {/* Glowing gradient bar */}
              <div className="relative w-full h-3 bg-[#070514] rounded-full overflow-hidden border border-purple-900/50 p-0.5 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-400 transition-all duration-300 relative shadow-[0_0_10px_rgba(192,132,252,0.8)]"
                  style={{ width: `${Math.min(100, selectedQuest.progress)}%` }}
                >
                  <span className="absolute right-0 top-0 bottom-0 w-2.5 bg-white rounded-full blur-[0.5px] animate-pulse" />
                </div>
              </div>

              <div className="text-right text-[10px] font-bold text-slate-400 font-sans">
                {selectedQuest.currentMinutes !== undefined ? (
                  `${selectedQuest.currentMinutes} / ${selectedQuest.estimatedMinutes || 30} mins`
                ) : (
                  `${Math.round(((selectedQuest.estimatedMinutes || 30) * selectedQuest.progress) / 100)} / ${selectedQuest.estimatedMinutes || 30} mins`
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 space-y-2.5">
              {selectedQuest.completed || selectedQuest.progress >= 100 ? (
                <button
                  disabled
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 font-extrabold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-default opacity-85 select-none pointer-events-none"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Claimed & Completed</span>
                </button>
              ) : selectedQuest.active ? (
                <>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onContinueQuest(selectedQuest.id);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-extrabold text-sm tracking-wide shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Continue Quest</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playQuestComplete();
                      onCompleteQuest(selectedQuest.id);
                    }}
                    className="w-full py-2 px-4 rounded-xl bg-black/40 hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-200 border border-white/10 hover:border-emerald-500/50 font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Mark as Complete</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onAcceptQuest?.(selectedQuest.id);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-amber-950 font-black text-sm tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:shadow-[0_0_25px_rgba(245,158,11,0.7)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-950" />
                  <span>Accept Quest (+1 Active)</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Right Cozy Parchment Scroll & Candle Lantern Card */}
          <div className="relative rounded-2xl overflow-hidden border border-amber-600/40 bg-[#160e07] shadow-xl p-5 group">
            {/* Background Artwork */}
            <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
              <img
                src={parchmentLanternImg}
                alt="Ancient Parchment & Lantern"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter saturate-150 transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#170a04] via-[#100604]/85 to-transparent" />
            </div>

            <div className="relative z-10 flex items-center justify-between gap-3">
              <div>
                <p className="font-script text-2xl sm:text-3xl text-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  “Small steps<br />create epic stories.”
                </p>
                <span className="inline-block mt-2 text-[9px] font-black text-amber-400/90 tracking-widest uppercase bg-black/50 px-2 py-0.5 rounded border border-amber-500/30">
                  CHRONICLES OF REALM
                </span>
              </div>

              {/* Lantern Flame Glow Pip */}
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.5)] shrink-0 animate-pulse">
                <Flame className="w-6 h-6 text-amber-300 fill-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Center Legendary Divider */}
      <div className="flex items-center justify-center gap-3 pt-6 pb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-amber-500/60" />
        <span className="text-amber-400 text-sm">✦</span>
        <span className="text-slate-300">REAL TASKS</span>
        <span className="text-purple-400">✦</span>
        <span className="text-cyan-300">REAL PROGRESS</span>
        <span className="text-amber-400">✦</span>
        <span className="text-slate-300">A REAL YOU</span>
        <span className="text-amber-400 text-sm">✦</span>
        <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-amber-500/60" />
      </div>
    </div>
  );
};
