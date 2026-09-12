import React from 'react';
import { Flame, Check } from 'lucide-react';
import { soundFx } from '../sound';
import streakFireImg from '../assets/images/streak_fire_1789201573546.jpg';

interface StreakCardProps {
  streakDays: number;
  streakWeek: { day: string; checked: boolean }[];
  onCheckInDay: (index: number) => void;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  streakDays,
  streakWeek,
  onCheckInDay
}) => {
  return (
    <div className="relative w-full rounded-2xl p-5 overflow-hidden border border-orange-500/40 bg-gradient-to-b from-[#1c0c08]/95 to-[#100604]/98 shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
      {/* Background Campfire / Citadel Ramparts Artwork on Right Side */}
      <div className="absolute top-0 right-0 bottom-0 w-3/5 pointer-events-none overflow-hidden">
        <img
          src={streakFireImg}
          alt="Streak Citadel Fire"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[center_35%] filter saturate-150 opacity-70"
        />
        {/* Smooth horizontal fade to dark card background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#170a04] via-[#170a04]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#100604] via-transparent to-[#1c0c08]/50" />
      </div>

      <div className="relative z-10">
        {/* Top Header: Flame + Title + Big 12 DAYS */}
        <div className="flex items-center gap-3 mb-1">
          <div className="relative">
            <Flame className="w-10 h-10 text-orange-400 fill-orange-500 drop-shadow-[0_0_18px_rgba(249,115,22,0.95)] animate-pulse" />
          </div>

          <div>
            <span className="text-[10px] font-black tracking-widest text-orange-400 uppercase">
              STREAK
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white font-cinzel tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                {streakDays} {streakDays === 1 ? 'DAY' : 'DAYS'}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-orange-200 font-semibold mb-4 pl-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          Keep going, legend!
        </p>

        {/* 7-Day Tracker (Mon - Sun) */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-2 border-t border-orange-900/60">
          {streakWeek.map((item, idx) => {
            return (
              <div 
                key={item.day} 
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
                onClick={() => {
                  soundFx.playClick();
                  onCheckInDay(idx);
                }}
              >
                <span className="text-[10px] font-black text-slate-300 group-hover:text-amber-300 uppercase transition-colors">
                  {item.day}
                </span>

                {item.checked ? (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 border border-amber-300 flex items-center justify-center shadow-[0_0_10px_rgba(251,191,36,0.7)] group-hover:scale-105 transition-transform">
                    <Check className="w-4 h-4 text-amber-950 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full border-2 border-amber-500/60 bg-black/60 flex items-center justify-center group-hover:border-amber-400 transition-all shadow-inner hover:scale-105">
                    <span className="w-2 h-2 rounded-full bg-amber-400/50 group-hover:bg-amber-400 transition-colors animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
