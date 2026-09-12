import React from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { soundFx } from '../sound';
import quickCharacterImg from '../assets/images/quick_character_1789201500553.jpg';
import quickInventoryImg from '../assets/images/quick_inventory_1789201528493.jpg';
import quickAchievementsImg from '../assets/images/quick_achieve_1789201550769.jpg';

interface QuickAccessProps {
  onAddQuest: () => void;
  onOpenCharacter: () => void;
  onOpenInventory: () => void;
  onOpenAchievements: () => void;
}

export const QuickAccess: React.FC<QuickAccessProps> = ({
  onAddQuest,
  onOpenCharacter,
  onOpenInventory,
  onOpenAchievements
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase">
          QUICK ACCESS
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Add Quest */}
        <div
          id="quick-add-quest"
          onClick={() => {
            soundFx.playClick();
            onAddQuest();
          }}
          className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-[#240c3c]/90 to-[#120520]/95 border border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center text-center group min-h-[145px] overflow-hidden"
        >
          {/* Subtle cosmic aura background */}
          <div className="absolute inset-0 bg-radial-gradient from-purple-600/20 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Glowing Plus Rune Emblem */}
          <div className="relative mb-2.5 z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-purple-600/50 to-fuchsia-900/60 border border-purple-400/60 flex items-center justify-center shadow-[0_0_15px_rgba(216,180,254,0.6)] group-hover:scale-110 transition-transform">
              <Plus className="w-7 h-7 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] stroke-[2.5]" />
            </div>
            <span className="absolute -inset-1 rounded-2xl bg-purple-500/20 blur-sm pointer-events-none" />
          </div>

          <h3 className="font-cinzel text-sm sm:text-base font-black text-white tracking-wide z-10">
            Add Quest
          </h3>
          <p className="text-[11px] text-purple-300/80 font-medium mt-0.5 z-10">
            Create a new quest
          </p>
        </div>

        {/* Card 2: Character */}
        <div
          id="quick-character"
          onClick={() => {
            soundFx.playClick();
            onOpenCharacter();
          }}
          className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-[#081f33]/90 to-[#040e1a]/95 border border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-end text-center group overflow-hidden min-h-[145px]"
        >
          {/* Background Illustration: Anime Hunter Silhouette under Blue Moonlight */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img 
              src={quickCharacterImg} 
              alt="Character" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter saturate-125 transform transition-transform duration-500 group-hover:scale-110 opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040e1a] via-[#040e1a]/70 to-transparent" />
          </div>

          <div className="relative z-10">
            <h3 className="font-cinzel text-sm sm:text-base font-black text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Character
            </h3>
            <div className="flex items-center justify-center gap-1 text-[11px] text-cyan-300 font-medium mt-0.5 group-hover:text-cyan-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              <span>View Stats</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        {/* Card 3: Inventory */}
        <div
          id="quick-inventory"
          onClick={() => {
            soundFx.playClick();
            onOpenInventory();
          }}
          className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-[#06292b]/90 to-[#021314]/95 border border-teal-500/60 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-end text-center group overflow-hidden min-h-[145px]"
        >
          {/* Background Illustration: Glowing Cyan Treasure Chest in Mystical Forest */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img 
              src={quickInventoryImg} 
              alt="Inventory Chest" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter saturate-125 transform transition-transform duration-500 group-hover:scale-110 opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#021314] via-[#021314]/70 to-transparent" />
          </div>

          <div className="relative z-10">
            <h3 className="font-cinzel text-sm sm:text-base font-black text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Inventory
            </h3>
            <div className="flex items-center justify-center gap-1 text-[11px] text-teal-300 font-medium mt-0.5 group-hover:text-teal-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              <span>Items & Rewards</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        {/* Card 4: Achievements */}
        <div
          id="quick-achievements"
          onClick={() => {
            soundFx.playClick();
            onOpenAchievements();
          }}
          className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-[#2e2006]/90 to-[#171002]/95 border border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-end text-center group overflow-hidden min-h-[145px]"
        >
          {/* Background Illustration: Radiant Golden Trophy Cup with Starburst Rays */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img 
              src={quickAchievementsImg} 
              alt="Achievements Trophy" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter saturate-125 transform transition-transform duration-500 group-hover:scale-110 opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171002] via-[#171002]/70 to-transparent" />
          </div>

          <div className="relative z-10">
            <h3 className="font-cinzel text-sm sm:text-base font-black text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Achievements
            </h3>
            <div className="flex items-center justify-center gap-1 text-[11px] text-amber-300 font-medium mt-0.5 group-hover:text-amber-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              <span>Your Milestones</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
