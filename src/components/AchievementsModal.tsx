import React from 'react';
import { X, Trophy, CheckCircle, Lock, Award, Star } from 'lucide-react';
import { Achievement } from '../types';
import { soundFx } from '../sound';
import { ACHIEVEMENT_ARTWORKS } from './AchievementsView';
import achieveConsistentMind from '../assets/images/achieve_consistent_mind.jpg';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  onClaimReward?: (achId: string) => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
  onClaimReward
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#141004] border border-amber-500/50 p-6 shadow-[0_0_40px_rgba(245,158,11,0.25)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-400/60 flex items-center justify-center text-amber-300">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl font-black text-white tracking-wide">
                HEROIC ACHIEVEMENTS
              </h2>
              <p className="text-xs text-amber-300/70">
                Milestones conquered on your path to mastery
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of achievements */}
        <div className="mt-5 space-y-3">
          {achievements.map((ach) => {
            const percent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));
            const artwork = ach.image || ACHIEVEMENT_ARTWORKS[ach.id] || achieveConsistentMind;

            return (
              <div
                key={ach.id}
                className={`
                  p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
                  ${ach.unlocked 
                    ? 'bg-gradient-to-r from-[#221603] to-[#140e02] border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]' 
                    : 'bg-[#100c05] border-white/5 opacity-75'}
                `}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Picture thumbnail */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-amber-500/40 bg-black/60 relative shadow-md">
                    <img 
                      src={artwork} 
                      alt={ach.title}
                      className={`w-full h-full object-cover ${ach.unlocked ? 'saturate-125' : 'grayscale brightness-60'}`}
                    />
                    {!ach.unlocked && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-slate-300">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-cinzel text-sm font-bold text-white truncate">
                        {ach.title}
                      </h3>
                      <span className="text-[10px] px-2 py-0.2 bg-black/40 text-amber-300 rounded border border-amber-900/30 font-semibold">
                        {ach.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {ach.description}
                    </p>

                    {/* Progress */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-32 h-1.5 rounded-full bg-[#0a0702] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {ach.progress}/{ach.maxProgress}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-300 block">
                      +{ach.xpReward} XP
                    </span>
                    {ach.unlocked && (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 justify-end">
                        <CheckCircle className="w-3 h-3" /> Unlocked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
