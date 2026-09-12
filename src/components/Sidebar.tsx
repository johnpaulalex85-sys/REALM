import React from 'react';
import { 
  Home, 
  ScrollText, 
  PlusCircle, 
  History, 
  User, 
  Package, 
  Trophy, 
  Settings,
  X
} from 'lucide-react';
import { soundFx } from '../sound';
import parchmentLanternImg from '../assets/images/parchment_lantern_1789201037103.jpg';
import sidebarSorcererImg from '../assets/images/sidebar_sorcerer_1789201023018.jpg';
import promoCliffImg from '../assets/images/promo_cliff_1789201593655.jpg';
import sidebarArchImg from '../assets/images/sidebar_arch_realm.jpg';
import sidebarBetterHabitsImg from '../assets/images/sidebar_better_habits.jpg';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAddQuest: () => void;
  questCount: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  openAddQuest,
  questCount,
  mobileOpen,
  setMobileOpen
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'quests', label: 'Quests', icon: ScrollText, badge: questCount },
    { id: 'add_quest', label: 'Add Quest', icon: PlusCircle },
    { id: 'history', label: 'History', icon: History },
    { id: 'character', label: 'Character', icon: User },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    soundFx.playClick();
    setCurrentTab(item.id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside 
        aria-label="Realm Main Navigation"
        className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#090a18]/95 border-r border-purple-900/30 flex flex-col justify-between
        transition-transform duration-300 ease-out backdrop-blur-xl
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header & Logo */}
        <div>
          <div className="p-5 pb-4 flex items-center justify-between border-b border-purple-950/40">
            <div className="flex items-center gap-3">
              {/* REALM Crest Emblem with Neon Purple Aura */}
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-b from-purple-900/60 to-[#12082b] border border-purple-500/50 shadow-[0_0_18px_rgba(168,85,247,0.45)]">
                {/* SVG Shield Crest with Rune */}
                <svg viewBox="0 0 40 40" className="w-7 h-7 text-purple-200 drop-shadow-[0_0_8px_rgba(216,180,254,0.8)]" fill="none">
                  <path 
                    d="M20 3L6 9V19C6 28 12 34.5 20 37C28 34.5 34 28 34 19V9L20 3Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinejoin="round"
                    fill="rgba(147, 51, 234, 0.2)"
                  />
                  {/* Inner glowing runic star */}
                  <path 
                    d="M20 10L22 17L29 19L22 21L20 28L18 21L11 19L18 17L20 10Z" 
                    fill="#e9d5ff"
                  />
                </svg>
                {/* Ambient glow pip */}
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-400 animate-ping opacity-75" />
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <span className="font-cinzel text-xl font-black tracking-widest text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]">
                    REALM
                  </span>
                </div>
                <p className="text-[9px] font-semibold tracking-wider text-purple-300/70 uppercase">
                  LEVEL UP YOUR REAL LIFE.
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item)}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-900/90 via-purple-950/80 to-[#1e0a38] text-white border-2 border-purple-500 shadow-[0_0_22px_rgba(168,85,247,0.7),inset_0_0_12px_rgba(168,85,247,0.3)]' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-purple-950/25 border border-transparent'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-purple-200 drop-shadow-[0_0_10px_rgba(216,180,254,1)]' : 'text-slate-400 group-hover:text-purple-300'
                    }`} />
                    <span className="tracking-wide">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-purple-600/90 rounded-full border border-purple-400/60 shadow-[0_0_10px_rgba(168,85,247,0.6)]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Silhouette & Quote Card */}
        <div className="p-3 relative overflow-hidden">
          <div className="relative rounded-2xl p-4 overflow-hidden border border-purple-800/40 bg-gradient-to-b from-[#110d28]/90 to-[#190924]/95 min-h-[190px] flex flex-col justify-end group shadow-xl">
            {/* Background artwork */}
            <div className="absolute inset-0 pointer-events-none opacity-80 overflow-hidden">
              <img
                src={
                  currentTab === 'settings'
                    ? sidebarBetterHabitsImg
                    : currentTab === 'achievements'
                    ? promoCliffImg
                    : currentTab === 'history' 
                    ? sidebarSorcererImg 
                    : currentTab === 'character' 
                    ? sidebarArchImg 
                    : currentTab === 'inventory'
                    ? sidebarSorcererImg
                    : parchmentLanternImg
                }
                alt="Discipline & Journey"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter saturate-125 transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090414] via-[#090414]/50 to-transparent" />
            </div>

            {/* Motivational Text */}
            <div className="relative z-10">
              {currentTab === 'settings' ? null : currentTab === 'achievements' ? (
                <div className="space-y-1">
                  <p className="font-cinzel text-xs font-black tracking-widest text-slate-100 uppercase leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                    DISCIPLINE<br />
                    TODAY<br />
                    A BRIGHTER<br />
                    TOMORROW.
                  </p>
                </div>
              ) : currentTab === 'inventory' ? (
                <div className="space-y-1">
                  <p className="font-cinzel text-xs font-black tracking-widest text-slate-100 uppercase leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                    COLLECT<br />
                    USE<br />
                    IMPROVE<br />
                    BECOME.
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-purple-400 select-none pt-0.5">
                    <span className="w-4 h-[1px] bg-purple-500/50" />
                    <span>✦</span>
                    <span className="w-4 h-[1px] bg-purple-500/50" />
                  </div>
                </div>
              ) : currentTab === 'character' ? (
                <div className="space-y-1">
                  <p className="font-cinzel text-xs font-black tracking-widest text-slate-100 uppercase leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                    DISCIPLINE<br />
                    TODAY.<br />
                    A BRIGHTER<br />
                    TOMORROW.
                  </p>
                </div>
              ) : currentTab === 'history' ? (
                <div className="space-y-1">
                  <p className="font-cinzel text-xs font-black tracking-widest text-slate-100 uppercase leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    EVERY<br />
                    ACTION<br />
                    WRITES<br />
                    YOUR STORY.
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-purple-400 select-none pt-0.5">
                    <span className="w-4 h-[1px] bg-purple-500/50" />
                    <span>✦</span>
                    <span className="w-4 h-[1px] bg-purple-500/50" />
                  </div>
                </div>
              ) : currentTab === 'character' ? (
                <div className="space-y-1">
                  <p className="font-cinzel text-xs font-black tracking-widest text-slate-100 uppercase leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    DISCIPLINE<br />
                    TODAY.<br />
                    A BRIGHTER<br />
                    TOMORROW.
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-purple-400 select-none pt-0.5">
                    <span className="w-4 h-[1px] bg-purple-500/50" />
                    <span>✦</span>
                    <span className="w-4 h-[1px] bg-purple-500/50" />
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-cinzel text-xs font-black tracking-widest text-amber-200 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    DISCIPLINE
                  </p>
                  <p className="font-serif text-sm font-bold text-white leading-tight italic drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                    A Better You
                  </p>
                  <p className="font-serif text-xs text-amber-300/90 font-medium italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    A Brighter Tomorrow.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
