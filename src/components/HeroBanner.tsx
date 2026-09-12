import React from 'react';
import { Star, Shield, Heart, Zap } from 'lucide-react';
import { CharacterProfile } from '../types';
import heroShadowBanner from '../assets/images/hero_shadow_banner_1789201471184.jpg';
import shadowCharacter from '../assets/images/shadow_character_1789200523303.jpg';

interface HeroBannerProps {
  profile: CharacterProfile;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ profile }) => {
  const xpNeeded = profile.maxXP - profile.currentXP;
  const xpPercent = Math.min(100, Math.round((profile.currentXP / profile.maxXP) * 100));

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-purple-500/40 bg-[#090516] shadow-[0_4px_35px_rgba(0,0,0,0.7)] min-h-[220px]">
      {/* Background Cinematic Panoramic Artwork: Solo Leveling Shadow Hunter on Cliff overlooking Floating Islands & Sunset */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={heroShadowBanner}
          alt="Shadow Adventurer Citadel Realm"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[left_center] sm:object-[center_35%] opacity-90 filter saturate-125"
        />
        {/* Gradients for text contrast in the center while preserving the character on the left and floating islands on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#090516]/80 to-[#090516]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090516] via-transparent to-[#090516]/50" />
      </div>

      {/* Hero Content Overlay Grid */}
      <div className="relative z-10 px-5 sm:px-8 py-6 sm:py-7 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Section: Character & Identity info */}
        <div className="flex items-center gap-6 sm:gap-8 w-full md:w-auto">
          
          {/* Character Figure Cutout / Standout matching Dashboard.png */}
          <div className="relative shrink-0 hidden sm:block w-36 md:w-44 h-48 md:h-56 -my-4 group">
            <img
              src={shadowCharacter}
              alt="Shadow Adventurer"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain object-bottom drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] transform transition-transform duration-500 group-hover:scale-105"
            />
            {/* Glowing neon purple rune crest aura */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-purple-600/30 blur-xl pointer-events-none" />
          </div>

          {/* Hero Identity & Leveling Section */}
          <div className="flex-1 min-w-[220px]">
            {/* Sub-greeting */}
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-purple-300 uppercase mb-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              GOOD MORNING, ADVENTURER
            </p>

            {/* Name */}
            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black tracking-wider text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              {profile.name}
            </h1>

            {/* Tagline */}
            <p className="text-xs sm:text-sm text-slate-200 font-medium tracking-wide mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Same Person. Higher Standards.
            </p>

            {/* Badges: Level & Class */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mt-3">
              {/* Level Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2a1a06]/90 border border-amber-500/60 text-amber-300 text-xs font-black shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Lv. {profile.level}</span>
              </div>

              {/* Class / Title Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b0a2d]/90 border border-purple-500/60 text-purple-300 text-xs font-black shadow-[0_0_12px_rgba(168,85,247,0.3)]">
                <Shield className="w-3.5 h-3.5 fill-purple-400/40 text-purple-300" />
                <span>{profile.title}</span>
              </div>
            </div>

            {/* XP Progress Bar Section */}
            <div className="mt-4 max-w-md">
              <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                <span className="text-cyan-300 tracking-wide font-sans drop-shadow-[0_0_10px_rgba(6,182,212,0.9)]">
                  {profile.currentXP.toLocaleString()} / {profile.maxXP.toLocaleString()} XP
                </span>
                <span className="text-[11px] font-bold text-slate-300 bg-[#0d0a21]/90 px-2.5 py-0.5 rounded border border-purple-700/50">
                  Lv. {profile.level + 1}
                </span>
              </div>

              {/* Progress Bar Container with Cyan Glow */}
              <div className="relative w-full h-3 bg-[#080716] rounded-full overflow-hidden border border-cyan-500/40 p-0.5 shadow-inner">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-cyan-300 transition-all duration-500 relative shadow-[0_0_12px_rgba(6,182,212,0.9)]"
                  style={{ width: `${xpPercent}%` }}
                >
                  <span className="absolute right-0 top-0 bottom-0 w-3 bg-white/90 rounded-full blur-[1px] animate-pulse" />
                </div>
              </div>

              <p className="text-[11px] font-semibold text-slate-300 mt-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                {xpNeeded > 0 ? `${xpNeeded.toLocaleString()} XP to next level` : 'Ready to level up!'}
              </p>
            </div>
            {/* Dual Vitals HUD: HP & Energy Stamina Bars */}
            <div className="mt-3.5 grid grid-cols-2 gap-3 max-w-md">
              {/* HP Bar */}
              <div className="rounded-xl p-2 bg-[#17050d]/80 border border-rose-600/40 shadow-[0_0_12px_rgba(244,63,94,0.15)]">
                <div className="flex items-center justify-between text-[11px] font-bold text-rose-300 mb-1">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>HEALTH</span>
                  </div>
                  <span className="font-sans text-xs">{profile.health} / {profile.maxHealth}</span>
                </div>
                <div className="w-full h-1.5 bg-rose-950/80 rounded-full overflow-hidden border border-rose-900/40">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)] transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.round((profile.health / profile.maxHealth) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Energy Bar */}
              <div className="rounded-xl p-2 bg-[#04131d]/80 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300 mb-1">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                    <span>ENERGY</span>
                  </div>
                  <span className="font-sans text-xs">{profile.energy} / {profile.maxEnergy}</span>
                </div>
                <div className="w-full h-1.5 bg-cyan-950/80 rounded-full overflow-hidden border border-cyan-900/40">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-600 via-sky-400 to-cyan-300 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.round((profile.energy / profile.maxEnergy) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Callout / Handwritten Quote */}
        <div className="hidden lg:flex flex-col justify-center items-end text-right pr-4">
          <div className="relative font-script text-3xl xl:text-4xl text-slate-100 leading-snug drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">
            <span className="block text-slate-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Real Tasks</span>
            <span className="block text-cyan-300 drop-shadow-[0_0_14px_rgba(6,182,212,0.7)]">Real Progress</span>
            <span className="block text-purple-300 drop-shadow-[0_0_14px_rgba(168,85,247,0.7)]">A Real You.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
