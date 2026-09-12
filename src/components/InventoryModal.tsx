import React from 'react';
import { X, Package, Sparkles, Shield, Flame, BookOpen, Check } from 'lucide-react';
import { InventoryItem } from '../types';
import { soundFx } from '../sound';
import { ITEM_PICTURES } from './InventoryView';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
  onUseItem: (itemId: string) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  items,
  onUseItem
}) => {
  if (!isOpen) return null;

  const getRarityBadge = (rarity: InventoryItem['rarity']) => {
    switch (rarity) {
      case 'Legendary':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.4)]';
      case 'Epic':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/50 shadow-[0_0_8px_rgba(168,85,247,0.4)]';
      case 'Rare':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.4)]';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c131d] border border-teal-500/50 p-6 shadow-[0_0_40px_rgba(20,184,166,0.25)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-teal-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-400/60 flex items-center justify-center text-teal-300">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl font-black text-white tracking-wide">
                HERO'S VAULT & INVENTORY
              </h2>
              <p className="text-xs text-teal-300/70">
                Artifacts, Potions & Relics to enhance your stats
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

        {/* Item Cards Grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#081720]/90 border border-teal-900/40 hover:border-teal-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-teal-500/40 shrink-0 bg-black/50 shadow-md">
                      <img
                        src={ITEM_PICTURES[item.id] || item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-cinzel text-sm font-bold text-slate-100">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-sans">
                        x{item.quantity} in pack
                      </p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${getRarityBadge(item.rarity)}`}>
                    {item.rarity}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-3 p-2 rounded-lg bg-black/40 border border-white/5 text-xs font-semibold text-teal-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>{item.bonus}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Qty: <strong className="text-white">{item.quantity}</strong>
                </span>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    onUseItem(item.id);
                  }}
                  className={`
                    px-3 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1
                    ${item.equipped 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60' 
                      : 'bg-teal-900/60 hover:bg-teal-700/80 text-teal-100 border-teal-500/50'}
                  `}
                >
                  {item.equipped ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Equipped</span>
                    </>
                  ) : item.type === 'potion' ? (
                    <span>Consume</span>
                  ) : (
                    <span>Equip</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
