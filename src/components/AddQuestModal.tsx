import React, { useState } from 'react';
import { X, Plus, Sparkles, BookOpen, Dumbbell, Scroll, Brain, Shield } from 'lucide-react';
import { AttributeType, Quest } from '../types';
import { soundFx } from '../sound';
import { getQuestPicture } from '../utils/questImages';

interface AddQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuest: (quest: Omit<Quest, 'id' | 'progress'>) => void;
}

export const AddQuestModal: React.FC<AddQuestModalProps> = ({
  isOpen,
  onClose,
  onAddQuest
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Quest['category']>('STUDY');
  const [attribute, setAttribute] = useState<AttributeType>('intellect');
  const [xpReward, setXpReward] = useState(250);
  const [goldReward, setGoldReward] = useState(40);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundFx.playQuestComplete();

    const categoryColorMap: Record<Quest['category'], string> = {
      STUDY: 'bg-indigo-900/70 border-indigo-400/50 text-indigo-200',
      HEALTH: 'bg-emerald-950/70 border-emerald-400/50 text-emerald-200',
      PERSONAL: 'bg-amber-950/70 border-amber-400/50 text-amber-200',
      WORK: 'bg-sky-950/70 border-sky-400/50 text-sky-200',
      CAREER: 'bg-cyan-950/70 border-cyan-400/50 text-cyan-200',
      DISCIPLINE: 'bg-rose-950/70 border-rose-400/50 text-rose-200',
    };

    const iconMap: Record<Quest['category'], Quest['iconName']> = {
      STUDY: 'book',
      HEALTH: 'dumbbell',
      PERSONAL: 'scroll',
      WORK: 'scroll',
      CAREER: 'brain',
      DISCIPLINE: 'shield',
    };

    onAddQuest({
      title: title.trim(),
      description: description.trim() || 'Daily task in your heroic journey',
      category,
      categoryColor: categoryColorMap[category],
      attribute,
      xpReward: Number(xpReward) || 200,
      goldReward: Number(goldReward) || 30,
      iconName: iconMap[category],
      image: getQuestPicture({ category, title })
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0e0f24] border border-purple-500/60 p-6 shadow-[0_0_40px_rgba(168,85,247,0.3)] overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-900/40 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-400/60 flex items-center justify-center text-purple-300">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-black text-white tracking-wide">
                CREATE NEW QUEST
              </h2>
              <p className="text-xs text-purple-300/70">
                Forge a real-life mission for XP and Gold
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 relative z-10">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Quest Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 45-Min Coding Session, 5K Run, Meditate"
              className="w-full px-4 py-2.5 rounded-xl bg-[#141630] border border-purple-900/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Objective & Instructions
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Focus without social media distractions"
              className="w-full px-4 py-2.5 rounded-xl bg-[#141630] border border-purple-900/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            />
          </div>

          {/* Category & Attribute */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Quest['category'])}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141630] border border-purple-900/50 text-white text-sm focus:outline-none focus:border-purple-400"
              >
                <option value="STUDY">STUDY</option>
                <option value="HEALTH">HEALTH</option>
                <option value="PERSONAL">PERSONAL</option>
                <option value="CAREER">CAREER</option>
                <option value="DISCIPLINE">DISCIPLINE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Attribute Boost
              </label>
              <select
                value={attribute}
                onChange={(e) => setAttribute(e.target.value as AttributeType)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141630] border border-purple-900/50 text-white text-sm focus:outline-none focus:border-purple-400"
              >
                <option value="intellect">Intellect</option>
                <option value="strength">Strength</option>
                <option value="wisdom">Wisdom</option>
                <option value="discipline">Discipline</option>
                <option value="vitality">Vitality</option>
              </select>
            </div>
          </div>

          {/* Rewards Sliders */}
          <div className="p-3.5 rounded-xl bg-[#131530]/80 border border-purple-950/60">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-purple-300">Experience Reward</span>
              <span className="text-cyan-300">+{xpReward} XP</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="25"
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />

            <div className="flex items-center justify-between text-xs font-bold mt-3 mb-2">
              <span className="text-amber-300">Gold Reward</span>
              <span className="text-amber-300">+{goldReward} Gold</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={goldReward}
              onChange={(e) => setGoldReward(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wider uppercase border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Engrave Quest</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
