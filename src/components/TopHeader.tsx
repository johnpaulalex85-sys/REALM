import React from 'react';
import { 
  Search, 
  Flame, 
  Bell, 
  Volume2, 
  VolumeX, 
  Menu,
  Settings,
  Heart,
  Zap,
  Moon
} from 'lucide-react';
import { CharacterProfile } from '../types';
import { soundFx } from '../sound';
import shadowAvatar from '../assets/images/shadow_avatar_1789200543671.jpg';

interface TopHeaderProps {
  profile: CharacterProfile;
  currentTab?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  onProfileClick: () => void;
  onNotificationsClick: () => void;
  onSettingsClick?: () => void;
  onRest?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  profile,
  currentTab,
  searchQuery,
  setSearchQuery,
  soundEnabled,
  setSoundEnabled,
  setMobileOpen,
  onProfileClick,
  onNotificationsClick,
  onSettingsClick,
  onRest
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    soundFx.soundEnabled = next;
    setSoundEnabled(next);
    if (next) soundFx.playClick();
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#080916]/85 backdrop-blur-xl border-b border-purple-950/40 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Mobile menu button & Left Motto */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              setMobileOpen(true);
            }}
            className="lg:hidden p-2 text-slate-300 hover:text-white bg-purple-950/40 rounded-xl border border-purple-800/30"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Left Quotation */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 font-serif tracking-wider">
            <span className="text-purple-400 font-mono text-sm">→</span>
            <span className="font-semibold text-slate-200 uppercase tracking-widest text-[11px]">
              {currentTab === 'settings'
                ? '“DISCIPLINE TODAY. A BRIGHTER TOMORROW.”'
                : currentTab === 'achievements'
                ? '“MILESTONES TODAY. A LEGENDARY TOMORROW.”'
                : currentTab === 'inventory' 
                ? '“ITEMS TODAY. A STRONGER YOU TOMORROW.”' 
                : '“SAME PERSON. HIGHER STANDARDS.”'}
            </span>
            <span className="text-purple-400 font-mono text-sm">⇄</span>
          </div>
        </div>

        {/* Center Search Bar or Motto */}
        <div className="relative flex-1 max-w-xs xl:max-w-sm hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quests, codex, items..."
            className="w-full pl-10 pr-4 py-1.5 text-xs bg-[#101226]/80 text-slate-200 placeholder-slate-500 rounded-full border border-purple-900/40 focus:outline-none focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Right Badges & Controls */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Health (HP) Badge */}
            <div 
              id="header-hp-badge"
              className={`flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#1d060e]/90 border ${
                profile.health <= 25 ? 'border-rose-500 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'border-rose-600/50 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
              } cursor-default transition-transform hover:scale-105`}
              title={`Health: ${profile.health} / ${profile.maxHealth} HP ${profile.health <= 25 ? '(Critical Burnout / Rest Needed!)' : ''}`}
            >
              <div className="w-6 h-6 rounded-lg bg-rose-950/80 border border-rose-500/60 flex items-center justify-center text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
              </div>
              <div className="flex flex-col leading-tight min-w-[42px]">
                <div className="flex items-center justify-between text-xs font-black text-rose-300 font-sans">
                  <span>{profile.health}</span>
                  <span className="text-[9px] text-rose-400/70 font-normal">/{profile.maxHealth}</span>
                </div>
                <div className="w-full h-1 bg-rose-950 rounded-full overflow-hidden mt-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full" 
                    style={{ width: `${Math.min(100, Math.round((profile.health / profile.maxHealth) * 100))}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Energy (Stamina) Badge */}
            <div 
              id="header-energy-badge"
              className={`flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#03151f]/90 border ${
                profile.energy === 0 ? 'border-amber-500 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
              } cursor-default transition-transform hover:scale-105`}
              title={`Energy: ${profile.energy} / ${profile.maxEnergy} Stamina ${profile.energy === 0 ? '(Exhausted! Burning Health on quests!)' : ''}`}
            >
              <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              </div>
              <div className="flex flex-col leading-tight min-w-[42px]">
                <div className="flex items-center justify-between text-xs font-black text-cyan-200 font-sans">
                  <span>{profile.energy}</span>
                  <span className="text-[9px] text-cyan-400/70 font-normal">/{profile.maxEnergy}</span>
                </div>
                <div className="w-full h-1 bg-cyan-950 rounded-full overflow-hidden mt-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full" 
                    style={{ width: `${Math.min(100, Math.round((profile.energy / profile.maxEnergy) * 100))}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Rest / Recovery Button */}
            {onRest && (
              <button
                id="header-rest-button"
                onClick={() => {
                  soundFx.playClick();
                  onRest();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#120a28]/90 hover:bg-purple-900/60 border border-purple-500/50 hover:border-purple-400 text-purple-200 transition-all cursor-pointer shadow-md text-xs font-bold"
                title="Take a Campfire Rest (+35 Energy, +20 HP)"
              >
                <Moon className="w-3.5 h-3.5 text-purple-300" />
                <span className="hidden xl:inline text-[10px] tracking-wide">Rest</span>
              </button>
            )}

            {/* Gold Coin Badge */}
            <div 
              id="header-gold-badge"
              className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#140f06]/90 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)] cursor-default transition-transform hover:scale-105"
              title="Your Current Gold"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 flex items-center justify-center shadow-[0_0_8px_rgba(251,191,36,0.8)] border border-amber-300/80">
                <span className="text-[12px] font-black text-amber-950">★</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-black text-amber-300 font-sans">
                  {profile.gold.toLocaleString()}
                </span>
                <span className="text-[9px] text-amber-400/80 font-medium">Gold</span>
              </div>
            </div>

            {/* XP Gem Badge */}
            <div 
              id="header-xp-badge"
              className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#170926]/90 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.25)] cursor-default transition-transform hover:scale-105"
              title="Current Experience"
            >
              <div className="w-6 h-6 rounded-lg bg-purple-900/60 border border-purple-400/60 flex items-center justify-center text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.6)]">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,0.8)]">
                  <polygon points="12,2 22,8.5 12,22 2,8.5" />
                </svg>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-black text-purple-200 font-sans">
                  {profile.currentXP.toLocaleString()}
                </span>
                <span className="text-[9px] text-purple-300/80 font-medium">XP</span>
              </div>
            </div>

            {/* Streak Flame Badge */}
            <div 
              id="header-streak-badge"
              className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#230c05]/90 border border-orange-500/50 shadow-[0_0_12px_rgba(249,115,22,0.25)] cursor-default transition-transform hover:scale-105"
              title="Consecutive Day Streak"
            >
              <div className="w-6 h-6 rounded-lg bg-orange-950/70 border border-orange-500/50 flex items-center justify-center shadow-[0_0_8px_rgba(249,115,22,0.6)]">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-500 animate-pulse" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-black text-orange-300 font-sans">
                  {profile.streakDays}
                </span>
                <span className="text-[9px] text-orange-300/80 font-medium">Day Streak</span>
              </div>
            </div>

            {/* Sound Toggle Button */}
            <button
              id="header-audio-toggle"
              onClick={toggleSound}
              className="p-2 text-slate-300 hover:text-white bg-[#100824]/90 hover:bg-purple-950/60 rounded-xl border border-purple-900/50 hover:border-purple-500/60 transition-all cursor-pointer shadow-md"
              title={soundEnabled ? 'Audio FX Enabled (Click to Mute)' : 'Audio FX Muted (Click to Unmute)'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-purple-300" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* User Profile Pill */}
            <button 
              id="header-profile-button"
              onClick={() => {
                soundFx.playClick();
                onProfileClick();
              }}
              className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#110b24]/90 border border-purple-500/50 hover:border-purple-400 transition-all group cursor-pointer shadow-md"
              title="View Character Profile"
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-purple-400/80 bg-purple-950 flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.6)]">
                  <img
                    src={shadowAvatar}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-[#080916] shadow-[0_0_4px_#34d399]" />
              </div>

              <div className="text-left hidden sm:block leading-tight">
                <div className="text-xs font-black text-white font-cinzel tracking-wider group-hover:text-purple-300 transition-colors">
                  {profile.name}
                </div>
                <div className="text-[9px] font-semibold text-purple-300">
                  Lv. {profile.level}
                </div>
              </div>
            </button>

            {/* Notifications Bell */}
            <button 
              id="header-notifications-button"
              onClick={() => {
                soundFx.playClick();
                onNotificationsClick();
              }}
              className="relative p-2 text-slate-300 hover:text-white bg-[#100824]/90 hover:bg-purple-950/60 rounded-xl border border-purple-900/50 hover:border-purple-500/60 transition-all cursor-pointer shadow-md"
              aria-label="View notifications"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />
            </button>

            {/* Settings Gear */}
            <button 
              id="header-settings-button"
              onClick={() => {
                soundFx.playClick();
                if (onSettingsClick) {
                  onSettingsClick();
                } else {
                  onNotificationsClick();
                }
              }}
              className="p-2 text-slate-300 hover:text-white bg-[#100824]/90 hover:bg-purple-950/60 rounded-xl border border-purple-900/50 hover:border-purple-500/60 transition-all cursor-pointer shadow-md"
              aria-label="Open Settings"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-quote on right under badges: “SAME PERSON. HIGHER STANDARDS.” */}
          <div className="hidden lg:block text-[9px] font-serif tracking-widest text-slate-300/90 uppercase pt-1 text-right leading-tight">
            {currentTab === 'achievements' || currentTab === 'settings' ? (
              <>
                <div className="text-slate-200 font-bold tracking-widest">SAME PERSON.</div>
                <div className="text-slate-400">HIGHER STANDARDS.</div>
              </>
            ) : (
              <>
                <div>A BETTER YOU</div>
                <div className="text-slate-400">A BRIGHTER TOMORROW.</div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
