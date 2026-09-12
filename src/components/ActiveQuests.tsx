import React from 'react';
import { 
  ArrowRight,
  CheckCircle,
  Sparkles,
  BookOpen,
  Dumbbell,
  Zap,
  Plus
} from 'lucide-react';
import { Quest } from '../types';
import { soundFx } from '../sound';
import deepWorkImg from '../assets/images/quest_deepwork_1789200577920.jpg';
import exerciseImg from '../assets/images/quest_exercise_1789200594078.jpg';
import readingImg from '../assets/images/quest_reading_1789200614011.jpg';

interface ActiveQuestsProps {
  quests: Quest[];
  onContinueQuest: (questId: string) => void;
  onViewAll?: () => void;
  onOpenAddQuest?: () => void;
}

export const ActiveQuests: React.FC<ActiveQuestsProps> = ({
  quests,
  onContinueQuest,
  onViewAll,
  onOpenAddQuest
}) => {
  const renderQuestIcon = (title: string, category: Quest['category']) => {
    const t = title.toLowerCase();
    if (t.includes('exercise') || t.includes('workout') || category === 'HEALTH') {
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform">
          <Dumbbell className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
        </div>
      );
    }
    if (t.includes('read') || category === 'PERSONAL') {
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-950/70 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.35)] group-hover:scale-105 transition-transform">
          <BookOpen className="w-6 h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-500/40 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.35)] group-hover:scale-105 transition-transform">
        <BookOpen className="w-6 h-6 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.9)]" />
      </div>
    );
  };

  const getQuestImage = (title: string, category: Quest['category']) => {
    if (title.toLowerCase().includes('deep work') || title.toLowerCase().includes('study')) {
      return deepWorkImg;
    }
    if (title.toLowerCase().includes('exercise') || title.toLowerCase().includes('workout')) {
      return exerciseImg;
    }
    return readingImg;
  };

  const getCardStyling = (category: Quest['category']) => {
    switch (category) {
      case 'STUDY':
        return {
          cardBg: 'from-[#170c2e]/95 to-[#0c0519]/95',
          border: 'border-purple-500/50 hover:border-purple-400/80',
          glow: 'shadow-[0_0_18px_rgba(168,85,247,0.25)]',
          badge: 'bg-purple-950/80 text-purple-300 border-purple-500/50',
          barColor: 'from-cyan-400 to-sky-500',
          barGlow: 'shadow-[0_0_10px_#38bdf8]',
          btnBg: 'bg-purple-900/70 hover:bg-purple-700 text-purple-200 border-purple-500/50 hover:border-purple-300'
        };
      case 'HEALTH':
        return {
          cardBg: 'from-[#08221a]/95 to-[#03110d]/95',
          border: 'border-emerald-500/50 hover:border-emerald-400/80',
          glow: 'shadow-[0_0_18px_rgba(16,185,129,0.25)]',
          badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50',
          barColor: 'from-emerald-400 to-teal-400',
          barGlow: 'shadow-[0_0_10px_#34d399]',
          btnBg: 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-200 border-emerald-500/50 hover:border-emerald-300'
        };
      case 'PERSONAL':
      default:
        return {
          cardBg: 'from-[#291a08]/95 to-[#140b03]/95',
          border: 'border-amber-500/50 hover:border-amber-400/80',
          glow: 'shadow-[0_0_18px_rgba(245,158,11,0.25)]',
          badge: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
          barColor: 'from-amber-400 to-yellow-400',
          barGlow: 'shadow-[0_0_10px_#fbbf24]',
          btnBg: 'bg-amber-950/80 hover:bg-amber-800 text-amber-200 border-amber-500/50 hover:border-amber-300'
        };
    }
  };

  return (
    <div className="w-full rounded-2xl p-5 bg-[#090b1c]/90 border border-purple-900/40 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase font-sans">
            ACTIVE QUESTS
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-purple-950/90 text-purple-300 border border-purple-500/40 text-[10px] font-black">
            {quests.length}
          </span>
        </div>
        {onViewAll && (
          <button
            onClick={() => {
              soundFx.playClick();
              onViewAll();
            }}
            className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
          >
            <span>View Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {quests.length === 0 ? (
        <div className="rounded-xl p-6 bg-gradient-to-b from-[#140a28]/80 to-[#0c0519]/90 border border-purple-800/40 text-center flex flex-col items-center justify-center space-y-3 shadow-inner">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Sparkles className="w-6 h-6 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
          </div>
          <div>
            <h3 className="font-sans text-sm font-bold text-white tracking-wide">
              No Active Quests Tracked
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              Your active quest list is at zero. Accept a quest from the Quest Board or forge a new personal trial to begin!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {onViewAll && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onViewAll();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600/80 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)] flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Browse Quest Board</span>
              </button>
            )}
            {onOpenAddQuest && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenAddQuest();
                }}
                className="px-3 py-1.5 rounded-xl bg-[#1d1033] hover:bg-[#281545] border border-purple-500/40 text-purple-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create Quest</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quest Cards List */
        <div className="space-y-3.5">
        {quests.map((quest) => {
          const style = getCardStyling(quest.category);
          const isCompleted = quest.progress >= 100;
          const questImg = quest.image || getQuestImage(quest.title, quest.category);

          return (
            <div
              key={quest.id}
              className={`
                rounded-xl p-3.5 sm:p-4 bg-gradient-to-b ${style.cardBg} border ${style.border} ${style.glow}
                transition-all duration-200 group relative overflow-hidden
              `}
            >
              {/* Subtle background art banner thumbnail */}
              <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none opacity-20 overflow-hidden">
                <img 
                  src={questImg} 
                  alt="" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#090b1c] to-transparent" />
              </div>

              {/* Top Row: Glowing Icon + Title + Category Badge */}
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  {renderQuestIcon(quest.title, quest.category)}
                  <div>
                    <h3 className="font-sans text-sm font-bold text-white tracking-wide group-hover:text-purple-200 transition-colors">
                      {quest.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {quest.description}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border tracking-wider uppercase ${style.badge}`}>
                  {quest.category}
                </span>
              </div>

              {/* Rewards Row with Energy Cost & Attribute Domain */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-3 text-xs relative z-10 font-bold">
                <span className="text-purple-300 flex items-center gap-1">
                  <span className="text-purple-400">✦</span> +{quest.xpReward} XP
                </span>
                <span className="text-amber-300 flex items-center gap-1">
                  <span className="text-amber-400">★</span> +{quest.goldReward} Gold
                </span>
                <span className="text-cyan-300 flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-[11px]">
                  <Zap className="w-3 h-3 fill-cyan-400 text-cyan-400" /> -{quest.energyCost || 10} Energy
                </span>
                <span className="text-indigo-300 flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-800/40 text-[10px] uppercase tracking-wider">
                  +{quest.attribute}
                </span>
              </div>

              {/* Bottom Row: Progress Bar + Percentage + Continue Button */}
              <div className="flex items-center justify-between gap-3 mt-3 pt-2.5 border-t border-white/5 relative z-10">
                <div className="flex-1 flex items-center gap-2.5">
                  {/* Glowing Progress bar */}
                  <div className="flex-1 h-2 bg-[#060712] rounded-full overflow-hidden border border-white/5 p-[1px]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${style.barColor} ${style.barGlow} transition-all duration-500`}
                      style={{ width: `${quest.progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-300 font-sans w-8 text-right">
                    {quest.progress}%
                  </span>
                </div>

                {/* Continue / Claimed Action Button */}
                <button
                  id={`continue-quest-${quest.id}`}
                  disabled={isCompleted}
                  onClick={() => {
                    if (!isCompleted) {
                      onContinueQuest(quest.id);
                    }
                  }}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 shrink-0
                    ${isCompleted 
                      ? 'bg-emerald-950/40 text-emerald-400/80 border-emerald-600/30 cursor-default opacity-85 select-none pointer-events-none' 
                      : `${style.btnBg} cursor-pointer hover:scale-105 active:scale-95`}
                  `}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Claimed</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
