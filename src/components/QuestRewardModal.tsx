import React from 'react';
import { 
  Trophy, 
  Sparkles, 
  Coins, 
  Dumbbell, 
  Brain, 
  Eye, 
  Star, 
  Leaf, 
  Check, 
  Package, 
  Zap, 
  ArrowRight 
} from 'lucide-react';
import { soundFx } from '../sound';

interface QuestRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  questTitle: string;
  xpEarned: number;
  goldEarned: number;
  attributeType: string;
  droppedItem?: {
    name: string;
    rarity: string;
    image?: string;
    bonus: string;
  } | null;
  bonusXP?: number;
  bonusGold?: number;
}

export const QuestRewardModal: React.FC<QuestRewardModalProps> = ({
  isOpen,
  onClose,
  questTitle,
  xpEarned,
  goldEarned,
  attributeType,
  droppedItem,
  bonusXP = 0,
  bonusGold = 0
}) => {
  if (!isOpen) return null;

  const renderAttributeIcon = (attr: string) => {
    switch (attr.toLowerCase()) {
      case 'strength':
        return <Dumbbell className="w-5 h-5 text-rose-400" />;
      case 'intellect':
        return <Brain className="w-5 h-5 text-cyan-400" />;
      case 'wisdom':
        return <Eye className="w-5 h-5 text-purple-400" />;
      case 'vitality':
        return <Leaf className="w-5 h-5 text-emerald-400" />;
      case 'discipline':
      default:
        return <Star className="w-5 h-5 text-amber-400" />;
    }
  };

  const getAttributeColor = (attr: string) => {
    switch (attr.toLowerCase()) {
      case 'strength':
        return { border: 'border-rose-500/50', bg: 'bg-rose-950/40', text: 'text-rose-300' };
      case 'intellect':
        return { border: 'border-cyan-500/50', bg: 'bg-cyan-950/40', text: 'text-cyan-300' };
      case 'wisdom':
        return { border: 'border-purple-500/50', bg: 'bg-purple-950/40', text: 'text-purple-300' };
      case 'vitality':
        return { border: 'border-emerald-500/50', bg: 'bg-emerald-950/40', text: 'text-emerald-300' };
      case 'discipline':
      default:
        return { border: 'border-amber-500/50', bg: 'bg-amber-950/40', text: 'text-amber-300' };
    }
  };

  const attrStyle = getAttributeColor(attributeType);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#17092b] via-[#0d061c] to-[#070312] border-2 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.3)] space-y-6 text-center text-white transform transition-transform animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Trophy Crest */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 border-2 border-amber-300 p-0.5 shadow-[0_0_30px_rgba(251,191,36,0.8)] flex items-center justify-center">
          <div className="w-full h-full rounded-2xl bg-[#140a02] flex items-center justify-center">
            <Trophy className="w-10 h-10 text-amber-300 animate-bounce" />
          </div>
          {/* Radiant sparkles */}
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-200 animate-pulse" />
        </div>

        {/* Header Titles */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/50 text-[11px] font-black text-amber-300 uppercase tracking-widest">
            <span>★ Victory Achieved ★</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-black tracking-widest bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(251,191,36,0.5)]">
            QUEST COMPLETED!
          </h2>
          <p className="font-serif italic text-sm text-slate-300 line-clamp-1">
            "{questTitle}"
          </p>
        </div>

        {/* 3 Core Reward Badges */}
        <div className="grid grid-cols-3 gap-3">
          {/* XP */}
          <div className="rounded-2xl p-3.5 bg-purple-950/40 border border-purple-500/50 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <div className="w-8 h-8 rounded-lg bg-purple-900/60 border border-purple-400/60 flex items-center justify-center text-purple-300 mb-1.5 shadow-md">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-purple-300">
                <polygon points="12,2 22,8.5 12,22 2,8.5" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-black text-purple-200 font-sans">
              +{xpEarned}
            </span>
            <span className="text-[10px] font-bold text-purple-300/80 uppercase tracking-wider">
              Experience
            </span>
          </div>

          {/* Gold */}
          <div className="rounded-2xl p-3.5 bg-amber-950/40 border border-amber-500/50 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <div className="w-8 h-8 rounded-lg bg-amber-900/60 border border-amber-400/60 flex items-center justify-center text-amber-300 mb-1.5 shadow-md">
              <Coins className="w-4 h-4" />
            </div>
            <span className="text-lg sm:text-xl font-black text-amber-300 font-sans">
              +{goldEarned}
            </span>
            <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider">
              Gold
            </span>
          </div>

          {/* Attribute Mastery */}
          <div className={`rounded-2xl p-3.5 ${attrStyle.bg} border ${attrStyle.border} flex flex-col items-center justify-center shadow-md`}>
            <div className="w-8 h-8 rounded-lg bg-slate-900/80 border border-white/10 flex items-center justify-center mb-1.5 shadow-md">
              {renderAttributeIcon(attributeType)}
            </div>
            <span className={`text-lg sm:text-xl font-black font-sans ${attrStyle.text}`}>
              +1
            </span>
            <span className={`text-[9px] font-bold uppercase tracking-wider truncate max-w-full ${attrStyle.text}`}>
              {attributeType}
            </span>
          </div>
        </div>

        {/* Bonus Procs (Critical Insight or Bountiful Discovery) */}
        {(bonusXP > 0 || bonusGold > 0) && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {bonusXP > 0 && (
              <div className="px-3 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                <Brain className="w-3.5 h-3.5" />
                <span>Critical Insight Proc! (+{bonusXP} XP)</span>
              </div>
            )}
            {bonusGold > 0 && (
              <div className="px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-500/60 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                <Coins className="w-3.5 h-3.5" />
                <span>Bountiful Discovery! (+{bonusGold} Gold)</span>
              </div>
            )}
          </div>
        )}

        {/* Dropped Loot Box */}
        {droppedItem && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-[#190c33] to-[#100824] border border-purple-500/60 text-left flex items-center gap-3.5 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <div className="w-14 h-14 rounded-xl bg-[#0b0517] border border-purple-400/60 overflow-hidden shrink-0 flex items-center justify-center relative shadow-md">
              {droppedItem.image ? (
                <img 
                  src={droppedItem.image} 
                  alt={droppedItem.name} 
                  referrerPolicy="no-referrer" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <Package className="w-6 h-6 text-purple-300" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  🎁 LOOT DISCOVERED
                </span>
                <span className="text-[9px] px-2 py-0.2 rounded-full bg-purple-900/60 border border-purple-600/50 text-purple-200">
                  {droppedItem.rarity}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white tracking-wide truncate mt-0.5">
                +1 {droppedItem.name}
              </h4>
              <p className="text-[11px] text-emerald-300 font-medium">
                {droppedItem.bonus} (Added to Inventory Vault)
              </p>
            </div>
          </div>
        )}

        {/* Claim Rewards Button */}
        <button
          id="claim-quest-rewards-btn"
          onClick={() => {
            soundFx.playCelebration();
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-widest transition-all duration-200 shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Claim Rewards</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
