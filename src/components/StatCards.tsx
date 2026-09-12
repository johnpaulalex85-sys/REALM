import React from 'react';
import { 
  Dumbbell, 
  Brain, 
  Eye, 
  Compass, 
  Leaf,
  Sparkles
} from 'lucide-react';
import { AttributeStat } from '../types';
import { soundFx } from '../sound';

interface StatCardsProps {
  attributes: AttributeStat[];
  onSelectAttribute?: (attrId: string) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({ attributes, onSelectAttribute }) => {
  // Custom icon map matching the reference image
  const renderIcon = (id: string) => {
    switch (id) {
      case 'strength':
        // Muscle / Bicep icon
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-rose-500 text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]">
            <path d="M7 6C7 4.9 7.9 4 9 4C10.1 4 11 4.9 11 6C11 6.8 10.5 7.5 9.8 7.8L12.5 12.5C13.2 11.6 14.3 11 15.5 11C17.4 11 19 12.6 19 14.5C19 15.3 18.7 16.1 18.2 16.7L19.7 18.2C20.5 17.2 21 15.9 21 14.5C21 11.5 18.5 9 15.5 9C14.7 9 13.9 9.2 13.2 9.5L10.7 5.2C10.9 4.8 11 4.4 11 4C11 2.9 10.1 2 9 2C7.9 2 7 2.9 7 4C7 4.4 7.1 4.8 7.3 5.2L4.8 9.5C4.1 9.2 3.3 9 2.5 9C1.1 9 0 10.1 0 11.5C0 12.9 1.1 14 2.5 14C3.3 14 4.1 13.8 4.8 13.5L7 17.5V22H11V16L8.5 11.5C9.2 11.2 9.8 10.5 9.8 9.8L7.3 5.2C7.1 5.5 7 5.7 7 6Z" />
            <path d="M14 16C13.4 16 13 16.4 13 17C13 17.6 13.4 18 14 18C14.6 18 15 17.6 15 17C15 16.4 14.6 16 14 16Z" />
          </svg>
        );
      case 'intellect':
        return (
          <Brain className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        );
      case 'wisdom':
        return (
          <Eye className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
        );
      case 'discipline':
        return (
          <Compass className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
        );
      case 'vitality':
        return (
          <Leaf className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        );
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getCardTheme = (id: string) => {
    switch (id) {
      case 'strength':
        return {
          bg: 'from-[#1f0a10]/90 to-[#120509]/95',
          border: 'border-rose-600/50 hover:border-rose-400/80',
          glow: 'rpg-border-glow-rose',
          titleColor: 'text-rose-400',
          numberColor: 'text-rose-400',
          barGrad: 'from-rose-600 to-red-500',
          barGlow: 'shadow-[0_0_8px_rgba(244,63,94,0.8)]',
          iconBg: 'bg-rose-950/60 border border-rose-500/40',
          dotColor: 'text-rose-400'
        };
      case 'intellect':
        return {
          bg: 'from-[#061922]/90 to-[#040f16]/95',
          border: 'border-cyan-600/50 hover:border-cyan-400/80',
          glow: 'rpg-border-glow-cyan',
          titleColor: 'text-cyan-400',
          numberColor: 'text-cyan-400',
          barGrad: 'from-cyan-600 to-sky-400',
          barGlow: 'shadow-[0_0_8px_rgba(6,182,212,0.8)]',
          iconBg: 'bg-cyan-950/60 border border-cyan-500/40',
          dotColor: 'text-cyan-400'
        };
      case 'wisdom':
        return {
          bg: 'from-[#190929]/90 to-[#0f051b]/95',
          border: 'border-purple-600/50 hover:border-purple-400/80',
          glow: 'rpg-border-glow-purple',
          titleColor: 'text-purple-400',
          numberColor: 'text-purple-400',
          barGrad: 'from-purple-600 to-violet-400',
          barGlow: 'shadow-[0_0_8px_rgba(168,85,247,0.8)]',
          iconBg: 'bg-purple-950/60 border border-purple-500/40',
          dotColor: 'text-purple-400'
        };
      case 'discipline':
        return {
          bg: 'from-[#221706]/90 to-[#140e03]/95',
          border: 'border-amber-600/50 hover:border-amber-400/80',
          glow: 'rpg-border-glow-amber',
          titleColor: 'text-amber-400',
          numberColor: 'text-amber-400',
          barGrad: 'from-amber-600 to-yellow-400',
          barGlow: 'shadow-[0_0_8px_rgba(234,179,8,0.8)]',
          iconBg: 'bg-amber-950/60 border border-amber-500/40',
          dotColor: 'text-amber-400'
        };
      case 'vitality':
      default:
        return {
          bg: 'from-[#081c14]/90 to-[#04100c]/95',
          border: 'border-emerald-600/50 hover:border-emerald-400/80',
          glow: 'rpg-border-glow-emerald',
          titleColor: 'text-emerald-400',
          numberColor: 'text-emerald-400',
          barGrad: 'from-emerald-600 to-teal-400',
          barGlow: 'shadow-[0_0_8px_rgba(16,185,129,0.8)]',
          iconBg: 'bg-emerald-950/60 border border-emerald-500/40',
          dotColor: 'text-emerald-400'
        };
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {attributes.map((attr) => {
        const theme = getCardTheme(attr.id);
        const percent = Math.min(100, Math.round((attr.current / attr.max) * 100));

        return (
          <div
            key={attr.id}
            id={`stat-card-${attr.id}`}
            onClick={() => {
              soundFx.playClick();
              if (onSelectAttribute) onSelectAttribute(attr.id);
            }}
            className={`
              relative rounded-xl p-4 bg-gradient-to-b ${theme.bg} border ${theme.border}
              ${theme.glow} transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between group
            `}
          >
            {/* Top Row: Centered Icon */}
            <div className="flex justify-center mb-2">
              <div className={`w-10 h-10 rounded-xl ${theme.iconBg} flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg`}>
                {renderIcon(attr.id)}
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h3 className={`font-cinzel text-xs sm:text-sm font-black tracking-wider ${theme.titleColor}`}>
                {attr.name}
              </h3>

              {/* Stat Value */}
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className={`text-base sm:text-lg font-black ${theme.numberColor}`}>
                  {attr.current}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  / {attr.max}
                </span>
              </div>
            </div>

            {/* Mini Progress Bar */}
            <div className="mt-2.5 w-full bg-[#080914] rounded-full h-1.5 p-[1px] border border-white/5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${theme.barGrad} ${theme.barGlow} transition-all duration-500`}
                style={{ width: `${percent}%` }}
              />
            </div>

            {/* Subskills List */}
            <div className="mt-3 pt-2.5 border-t border-white/5 space-y-1">
              {attr.subSkills.map((skill, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-slate-300">
                  <span className={`text-[10px] ${theme.dotColor}`}>✦</span>
                  <span className="truncate">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
