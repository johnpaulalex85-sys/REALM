import React from 'react';
import { X, Shield, Star, Award, Zap, Flame } from 'lucide-react';
import { CharacterProfile, AttributeStat } from '../types';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CharacterProfile;
  attributes: AttributeStat[];
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  isOpen,
  onClose,
  profile,
  attributes
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0d0f22] border border-cyan-500/50 p-6 shadow-[0_0_40px_rgba(6,182,212,0.25)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center text-cyan-300">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl font-black text-white tracking-wide">
                HERO CODEX & ATTRIBUTES
              </h2>
              <p className="text-xs text-cyan-300/70">
                Level {profile.level} {profile.title} • {profile.name}
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

        {/* Character Overview Card */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-[#170a2c] via-[#0e172e] to-[#0a1f24] border border-purple-800/40 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-[#090514] border-2 border-purple-500/60 overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] shrink-0">
            <svg viewBox="0 0 40 40" className="w-16 h-16">
              <circle cx="20" cy="20" r="18" fill="#130826" />
              <path d="M12,24 C14,16 26,16 28,24" stroke="#a855f7" strokeWidth="2" fill="none" />
              <circle cx="20" cy="15" r="5" fill="#38bdf8" />
              <polygon points="20,6 23,12 17,12" fill="#c084fc" />
            </svg>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="font-cinzel text-2xl font-black text-white tracking-wider">
                {profile.name}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                Lv. {profile.level}
              </span>
            </div>
            <p className="text-xs text-purple-300 font-semibold mt-0.5">
              Title: {profile.title} • Discipline Class
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{profile.gold} Gold</span>
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                <span>{profile.currentXP} / {profile.maxXP} XP</span>
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                <span>{profile.streakDays} Day Streak</span>
              </span>
            </div>
          </div>
        </div>

        {/* 5 Core Attributes Breakdown */}
        <div className="mt-6">
          <h4 className="text-xs font-bold tracking-widest text-slate-300 uppercase mb-3">
            Core Attribute Ratings
          </h4>
          <div className="space-y-3">
            {attributes.map((attr) => {
              const percent = Math.round((attr.current / attr.max) * 100);
              return (
                <div key={attr.id} className="p-3 rounded-xl bg-[#12142d] border border-white/5">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-cinzel font-bold text-slate-200">
                      {attr.name}
                    </span>
                    <span className="font-bold" style={{ color: attr.color }}>
                      {attr.current} / {attr.max} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#080914] overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${attr.barColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {attr.subSkills.map((sub, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-slate-300 border border-white/5">
                        ✦ {sub}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
