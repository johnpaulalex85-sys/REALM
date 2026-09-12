import React, { useState } from 'react';
import { 
  BookOpen, 
  Check, 
  Plus, 
  Star, 
  TrendingUp, 
  Sparkles, 
  Coins, 
  Calendar as CalendarIcon, 
  ChevronRight, 
  ChevronLeft, 
  Filter, 
  CheckCircle2, 
  Trophy, 
  Dumbbell, 
  Award, 
  Flame, 
  BarChart2, 
  ShieldAlert
} from 'lucide-react';
import { soundFx } from '../sound';
import heroShadowBanner from '../assets/images/hero_shadow_banner_1789201471184.jpg';
import promoCliffImg from '../assets/images/promo_cliff_1789201593655.jpg';
import questDeepworkImg from '../assets/images/quest_deepwork_1789200577920.jpg';
import questExerciseImg from '../assets/images/quest_exercise_1789200594078.jpg';
import quickAchieveImg from '../assets/images/quick_achieve_1789201550769.jpg';

export interface HistoryLogEntry {
  id: string;
  dateKey: string; // e.g. "2025-09-12"
  displayDate: string; // e.g. "TODAY · Sep 12, 2025"
  time: string; // "10:24 AM"
  type: 'completed' | 'created' | 'achievement' | 'level_up' | 'item';
  title: string;
  subtitle: string;
  category?: 'Study' | 'Health' | 'Personal' | 'Work' | 'Discipline';
  xp?: number;
  gold?: number;
  quote?: string;
  attributeBonuses?: { name: string; value: number }[];
  bgImage?: string;
}

interface HistoryViewProps {
  showToast: (message: string) => void;
  onOpenQuestBoard?: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ showToast, onOpenQuestBoard }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'created' | 'level_up' | 'achievement' | 'item'>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'This Week' | 'Last 30 Days' | 'All Time'>('This Week');
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(12); // Sep 12 default
  const [currentMonthIndex, setCurrentMonthIndex] = useState(8); // September (0-indexed: 8)
  const [selectedLogDetail, setSelectedLogDetail] = useState<HistoryLogEntry | null>(null);
  const [serverLogs, setServerLogs] = useState<HistoryLogEntry[]>([]);

  React.useEffect(() => {
    import('../services/api').then(({ api }) => {
      api.history.getHistory().then(data => {
        if (Array.isArray(data)) {
          const mapped: HistoryLogEntry[] = data.map((act: any) => ({
            id: act.id || `log-${act.timestamp}`,
            dateKey: new Date(act.timestamp || Date.now()).toISOString().split('T')[0],
            displayDate: act.timeAgo ? `TODAY · ${act.timeAgo}` : 'TODAY',
            time: act.timeAgo || 'Just now',
            type: act.type === 'completed_quest' ? 'completed' : act.type === 'item_acquired' ? 'item' : (act.type || 'completed'),
            title: act.title,
            subtitle: act.subtitle || 'Realm Activity',
            category: act.category || 'General',
            xp: act.xp,
            gold: act.gold
          }));
          setServerLogs(mapped);
        }
      }).catch(console.error);
    });
  }, []);

  // Master activity history dataset combining server logs and default history
  const defaultLogs: HistoryLogEntry[] = [

    // TODAY: Sep 12, 2025
    {
      id: 'log-1',
      dateKey: '2025-09-12',
      displayDate: 'TODAY · Sep 12, 2025',
      time: '10:24 AM',
      type: 'completed',
      title: 'Completed: Deep Work Session',
      subtitle: 'Focus for 30 minutes',
      category: 'Study',
      xp: 250,
      gold: 40,
      bgImage: questDeepworkImg
    },
    {
      id: 'log-2',
      dateKey: '2025-09-12',
      displayDate: 'TODAY · Sep 12, 2025',
      time: '08:15 AM',
      type: 'completed',
      title: 'Completed: Morning Exercise',
      subtitle: 'Complete 20 min workout',
      category: 'Health',
      xp: 300,
      gold: 50,
      bgImage: questExerciseImg
    },
    {
      id: 'log-3',
      dateKey: '2025-09-12',
      displayDate: 'TODAY · Sep 12, 2025',
      time: '07:42 AM',
      type: 'created',
      title: 'Created New Quest',
      subtitle: 'Read a Book',
      category: 'Personal'
    },
    {
      id: 'log-4',
      dateKey: '2025-09-12',
      displayDate: 'TODAY · Sep 12, 2025',
      time: '06:30 AM',
      type: 'achievement',
      title: 'Achievement Unlocked',
      subtitle: 'Consistent Mind',
      quote: '“Discipline today, results tomorrow.”',
      xp: 500,
      bgImage: quickAchieveImg
    },

    // YESTERDAY: Sep 11, 2025
    {
      id: 'log-5',
      dateKey: '2025-09-11',
      displayDate: 'YESTERDAY · Sep 11, 2025',
      time: '09:10 PM',
      type: 'completed',
      title: 'Completed: Read a Book',
      subtitle: 'Read 20 pages',
      category: 'Personal',
      xp: 200,
      gold: 30
    },
    {
      id: 'log-6',
      dateKey: '2025-09-11',
      displayDate: 'YESTERDAY · Sep 11, 2025',
      time: '04:20 PM',
      type: 'completed',
      title: 'Completed: Plan Your Day',
      subtitle: 'Organize and prioritize your tasks',
      category: 'Work',
      xp: 150,
      gold: 20
    },
    {
      id: 'log-7',
      dateKey: '2025-09-11',
      displayDate: 'YESTERDAY · Sep 11, 2025',
      time: '12:00 PM',
      type: 'level_up',
      title: 'Levelled up to Level 12',
      subtitle: 'Transcended mortal threshold',
      quote: '“Higher Standards.”',
      attributeBonuses: [
        { name: 'Discipline', value: 2 },
        { name: 'Intellect', value: 1 }
      ]
    },

    // SEP 10, 2025
    {
      id: 'log-8',
      dateKey: '2025-09-10',
      displayDate: 'SEP 10, 2025',
      time: '08:45 PM',
      type: 'completed',
      title: 'Completed: Meditation',
      subtitle: 'Meditate for 10 minutes',
      category: 'Health',
      xp: 100,
      gold: 20
    },
    {
      id: 'log-9',
      dateKey: '2025-09-10',
      displayDate: 'SEP 10, 2025',
      time: '03:30 PM',
      type: 'created',
      title: 'Created New Quest',
      subtitle: 'Clean Your Space',
      category: 'Personal'
    },

    // SEP 9, 2025
    {
      id: 'log-10',
      dateKey: '2025-09-09',
      displayDate: 'SEP 9, 2025',
      time: '07:15 PM',
      type: 'completed',
      title: 'Completed: Drink Water',
      subtitle: 'Drink 8 glasses of water.',
      category: 'Health',
      xp: 100,
      gold: 20
    }
  ];

  const allLogs = [...serverLogs, ...defaultLogs];

  // Filter logs by type and date
  const filteredLogs = allLogs.filter(log => {
    if (selectedFilter === 'completed' && log.type !== 'completed') return false;
    if (selectedFilter === 'created' && log.type !== 'created') return false;
    if (selectedFilter === 'level_up' && log.type !== 'level_up') return false;
    if (selectedFilter === 'achievement' && log.type !== 'achievement') return false;
    if (selectedFilter === 'item' && log.type !== 'item') return false;

    // Calendar day filter if active
    if (selectedCalendarDay) {
      const dayStr = selectedCalendarDay < 10 ? `0${selectedCalendarDay}` : `${selectedCalendarDay}`;
      const targetDateKey = `2025-09-${dayStr}`;
      // When day is clicked, highlight or filter
      // If user selected all, show everything or specific day
    }

    return true;
  });

  // Group by display date
  const groupedLogs: { [key: string]: HistoryLogEntry[] } = {};
  filteredLogs.forEach(log => {
    if (!groupedLogs[log.displayDate]) {
      groupedLogs[log.displayDate] = [];
    }
    groupedLogs[log.displayDate].push(log);
  });

  const getCategoryBadgeClass = (category?: string) => {
    switch (category) {
      case 'Study':
        return 'bg-purple-950/70 border-purple-500/50 text-purple-200';
      case 'Health':
        return 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200';
      case 'Personal':
        return 'bg-amber-950/70 border-amber-500/50 text-amber-200';
      case 'Work':
        return 'bg-cyan-950/70 border-cyan-500/50 text-cyan-200';
      default:
        return 'bg-slate-900 border-slate-700 text-slate-300';
    }
  };

  const getIconForType = (type: HistoryLogEntry['type']) => {
    switch (type) {
      case 'completed':
        return (
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
          </div>
        );
      case 'created':
        return (
          <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            <Plus className="w-4 h-4 text-cyan-400 stroke-[3]" />
          </div>
        );
      case 'achievement':
        return (
          <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.5)]">
            <Star className="w-4 h-4 text-amber-300 fill-amber-400" />
          </div>
        );
      case 'level_up':
        return (
          <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-400 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.5)]">
            <TrendingUp className="w-4 h-4 text-purple-300 stroke-[3]" />
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-slate-400" />
          </div>
        );
    }
  };

  // Days in September 2025 (starts on Monday = index 1 in Sun..Sat array)
  // Calendar active days with green dot markers from image: 1, 3, 4, 8, 9, 10, 11
  // Day 12 is today (purple ring)
  const activeGreenDays = [1, 3, 4, 8, 9, 10, 11];

  const handleCalendarClick = (day: number) => {
    soundFx.playClick();
    setSelectedCalendarDay(day);
    if (day === 12) {
      showToast('Showing today’s recorded actions (Sep 12, 2025).');
    } else if (day === 11) {
      showToast('Showing yesterday’s actions (Sep 11, 2025).');
    } else if (activeGreenDays.includes(day)) {
      showToast(`Showing completed history for Sep ${day}, 2025.`);
    } else {
      showToast(`Selected September ${day}, 2025.`);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* 1. Cinematic Banner: ADVENTURE LOG */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-purple-500/40 bg-[#0c071d] shadow-[0_4px_30px_rgba(0,0,0,0.7)] min-h-[140px] sm:min-h-[160px] flex items-center">
        {/* Background Artwork: Panoramic Twilight Citadel with Shadow Hunter */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={heroShadowBanner}
            alt="Adventure Log Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[center_35%] filter saturate-125 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090416] via-[#090416]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090416] via-transparent to-[#090416]/50" />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 w-full px-5 sm:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Golden Rounded Square Icon with Open Tome */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl border-2 border-amber-400/80 bg-gradient-to-b from-[#221304]/95 to-[#0f0701]/98 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.5)] group">
              <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.95)] transform group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -inset-1 rounded-2xl bg-amber-400/20 blur-md pointer-events-none" />
            </div>

            <div>
              <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wider drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">
                ADVENTURE LOG
              </h1>
              <p className="text-xs sm:text-sm text-slate-200/90 font-medium tracking-wide mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-w-2xl">
                A record of your journey. Every action counts.
              </p>
            </div>
          </div>

          {/* Far Right Top Script Quote */}
          <div className="hidden lg:flex flex-col items-end text-right">
            <p className="font-serif italic text-sm text-slate-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
              “Not just days lived, but progress made.”
            </p>
            <div className="mt-1 flex items-center gap-2 text-purple-400 text-xs select-none">
              <div className="w-6 h-[1px] bg-purple-500/50" />
              <span>✦</span>
              <div className="w-6 h-[1px] bg-purple-500/50" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Pills and Timeframe Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {/* All */}
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedFilter('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              selectedFilter === 'all'
                ? 'bg-gradient-to-r from-purple-800 to-indigo-900 text-white border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-[#100a24]/80 text-slate-400 hover:text-white border border-purple-900/40 hover:bg-purple-950/40'
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-300" />
            <span>All</span>
          </button>

          {/* Completed */}
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedFilter('completed');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              selectedFilter === 'completed'
                ? 'bg-gradient-to-r from-purple-800 to-indigo-900 text-white border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-[#100a24]/80 text-slate-400 hover:text-white border border-purple-900/40 hover:bg-purple-950/40'
            }`}
          >
            Completed
          </button>

          {/* Created */}
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedFilter('created');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              selectedFilter === 'created'
                ? 'bg-gradient-to-r from-purple-800 to-indigo-900 text-white border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-[#100a24]/80 text-slate-400 hover:text-white border border-purple-900/40 hover:bg-purple-950/40'
            }`}
          >
            Created
          </button>

          {/* Level Ups */}
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedFilter('level_up');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              selectedFilter === 'level_up'
                ? 'bg-gradient-to-r from-purple-800 to-indigo-900 text-white border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-[#100a24]/80 text-slate-400 hover:text-white border border-purple-900/40 hover:bg-purple-950/40'
            }`}
          >
            Level Ups
          </button>

          {/* Achievements */}
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedFilter('achievement');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              selectedFilter === 'achievement'
                ? 'bg-gradient-to-r from-purple-800 to-indigo-900 text-white border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-[#100a24]/80 text-slate-400 hover:text-white border border-purple-900/40 hover:bg-purple-950/40'
            }`}
          >
            Achievements
          </button>

          {/* Items */}
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedFilter('item');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              selectedFilter === 'item'
                ? 'bg-gradient-to-r from-purple-800 to-indigo-900 text-white border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-[#100a24]/80 text-slate-400 hover:text-white border border-purple-900/40 hover:bg-purple-950/40'
            }`}
          >
            Items
          </button>
        </div>

        {/* Right Timeframe Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              soundFx.playClick();
              setIsTimeframeOpen(!isTimeframeOpen);
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#100a24]/90 text-slate-200 hover:text-white border border-purple-900/50 hover:border-purple-500/60 shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>{selectedTimeframe}</span>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isTimeframeOpen ? 'rotate-90' : ''}`} />
          </button>

          {isTimeframeOpen && (
            <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-[#110926] border border-purple-700/60 shadow-2xl py-1 z-30">
              {(['This Week', 'Last 30 Days', 'All Time'] as const).map(option => (
                <button
                  key={option}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedTimeframe(option);
                    setIsTimeframeOpen(false);
                    showToast(`Timeframe set to: ${option}`);
                  }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                    selectedTimeframe === option 
                      ? 'text-purple-300 bg-purple-950/60 font-bold' 
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Split Grid: Activity Stream (Left) & Journey Stats / Calendar / Quote (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Timeline Feed (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {Object.keys(groupedLogs).length === 0 ? (
            <div className="rounded-2xl p-8 border border-purple-900/40 bg-[#0d0720]/80 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-purple-400 mx-auto opacity-60" />
              <p className="text-sm font-semibold text-slate-300">No adventure entries found for this filter.</p>
              <button
                onClick={() => setSelectedFilter('all')}
                className="px-4 py-1.5 rounded-xl bg-purple-900/60 border border-purple-500/40 text-xs font-bold text-white hover:bg-purple-800"
              >
                Reset to All
              </button>
            </div>
          ) : (
            Object.entries(groupedLogs).map(([displayDate, entries]) => (
              <div key={displayDate} className="space-y-2.5">
                {/* Date Header Row */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.8)]" />
                    <h2 className="font-sans text-xs font-black tracking-wider text-slate-200 uppercase">
                      {displayDate}
                    </h2>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">
                    {entries.length} {entries.length === 1 ? 'activity' : 'activities'}
                  </span>
                </div>

                {/* Log Entry Cards for this Date */}
                <div className="space-y-2">
                  {entries.map(entry => (
                    <div
                      key={entry.id}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedLogDetail(entry);
                      }}
                      className="group relative rounded-xl px-4 py-3 bg-[#0a0518]/90 border border-purple-950 hover:border-purple-600/50 shadow-md hover:shadow-[0_0_18px_rgba(168,85,247,0.2)] transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer overflow-hidden"
                    >
                      {/* Optional subtle background thumbnail on the right */}
                      {entry.bgImage && (
                        <div className="absolute right-0 top-0 bottom-0 w-48 pointer-events-none opacity-10 overflow-hidden group-hover:opacity-15 transition-opacity">
                          <img
                            src={entry.bgImage}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0518] to-transparent" />
                        </div>
                      )}

                      {/* Left: Time + Status Icon + Title & Subtitle */}
                      <div className="flex items-center gap-3.5 relative z-10 min-w-0">
                        {/* Time */}
                        <span className="text-[11px] font-mono font-medium text-slate-400 whitespace-nowrap w-16">
                          {entry.time}
                        </span>

                        {/* Status Icon */}
                        {getIconForType(entry.type)}

                        {/* Title & Subtitle */}
                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate group-hover:text-purple-200 transition-colors">
                            {entry.title}
                          </h3>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {entry.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Right: Badge, Rewards, Quote, Chevron */}
                      <div className="flex items-center gap-3 shrink-0 relative z-10">
                        {/* Category Badge */}
                        {entry.category && (
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${getCategoryBadgeClass(entry.category)}`}>
                            {entry.category}
                          </span>
                        )}

                        {/* Quote (for Achievement or Level Up) */}
                        {entry.quote && (
                          <span className="hidden md:inline-block text-[11px] font-serif italic text-slate-300 max-w-xs truncate">
                            {entry.quote}
                          </span>
                        )}

                        {/* Attribute Bonuses (for Level Up) */}
                        {entry.attributeBonuses && (
                          <div className="hidden sm:flex items-center gap-2 text-xs font-bold">
                            {entry.attributeBonuses.map(attr => (
                              <span key={attr.name} className={attr.name === 'Discipline' ? 'text-amber-300' : 'text-cyan-300'}>
                                {attr.name === 'Discipline' ? '★' : '✦'} +{attr.value} {attr.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* XP Reward */}
                        {entry.xp !== undefined && (
                          <div className="flex items-center gap-1 text-xs font-bold text-purple-300">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            <span>+{entry.xp} XP</span>
                          </div>
                        )}

                        {/* Gold Reward */}
                        {entry.gold !== undefined && (
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
                            <Coins className="w-3 h-3 text-amber-400" />
                            <span>+{entry.gold} Gold</span>
                          </div>
                        )}

                        {/* Chevron */}
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Stats, Calendar, and Quote (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. JOURNEY STATS PANEL */}
          <div className="relative rounded-2xl p-5 border border-purple-900/40 bg-gradient-to-b from-[#110927]/95 via-[#0c061d]/98 to-[#070312] shadow-xl">
            <h3 className="font-cinzel text-xs font-black tracking-widest text-slate-200 uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.9)]" />
              JOURNEY STATS
            </h3>

            {/* 4 Stat Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5">
              {/* Total Quests */}
              <div className="rounded-xl p-3 bg-purple-950/40 border border-purple-600/40 flex flex-col items-center justify-center text-center shadow-[0_0_12px_rgba(168,85,247,0.15)] group hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-purple-400 mb-1.5 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                <span className="text-xl font-black text-white font-sans">24</span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                  Total Quests
                </span>
              </div>

              {/* Completed */}
              <div className="rounded-xl p-3 bg-emerald-950/40 border border-emerald-600/40 flex flex-col items-center justify-center text-center shadow-[0_0_12px_rgba(16,185,129,0.15)] group hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-1.5 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-xl font-black text-white font-sans">18</span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                  Completed
                </span>
              </div>

              {/* Gold Earned */}
              <div className="rounded-xl p-3 bg-amber-950/40 border border-amber-600/40 flex flex-col items-center justify-center text-center shadow-[0_0_12px_rgba(245,158,11,0.15)] group hover:scale-105 transition-transform">
                <Coins className="w-5 h-5 text-amber-400 mb-1.5 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <span className="text-xl font-black text-white font-sans">720</span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                  Gold Earned
                </span>
              </div>

              {/* Days Active */}
              <div className="rounded-xl p-3 bg-sky-950/40 border border-sky-600/40 flex flex-col items-center justify-center text-center shadow-[0_0_12px_rgba(14,165,233,0.15)] group hover:scale-105 transition-transform">
                <BarChart2 className="w-5 h-5 text-sky-400 mb-1.5 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                <span className="text-xl font-black text-white font-sans">12</span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                  Days Active
                </span>
              </div>
            </div>
          </div>

          {/* 2. CALENDAR VIEW PANEL */}
          <div className="relative rounded-2xl p-5 border border-purple-900/40 bg-gradient-to-b from-[#110927]/95 via-[#0c061d]/98 to-[#070312] shadow-xl">
            <h3 className="font-cinzel text-xs font-black tracking-widest text-slate-200 uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.9)]" />
              CALENDAR VIEW
            </h3>

            {/* Month Header with Controls */}
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-white px-1">
              <button
                onClick={() => {
                  soundFx.playClick();
                  showToast('Navigating previous month: August 2025');
                }}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="tracking-wide">September 2025</span>

              <button
                onClick={() => {
                  soundFx.playClick();
                  showToast('Navigating next month: October 2025');
                }}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day of week headers */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days Grid: Sep 2025 starts on Monday (index 1) */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {/* Sun (empty space before Sep 1) */}
              <div className="p-2" />

              {/* Day 1 - 30 */}
              {Array.from({ length: 30 }).map((_, i) => {
                const dayNum = i + 1;
                const isGreenDot = activeGreenDays.includes(dayNum);
                const isToday = dayNum === 12;
                const isSelected = selectedCalendarDay === dayNum;

                return (
                  <button
                    key={dayNum}
                    onClick={() => handleCalendarClick(dayNum)}
                    className={`
                      relative p-2 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer text-xs font-semibold
                      ${isToday 
                        ? 'text-white border border-purple-400 bg-purple-900/60 shadow-[0_0_12px_rgba(168,85,247,0.7)] font-black' 
                        : isSelected
                        ? 'text-purple-200 bg-purple-950/70 border border-purple-600/60'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    <span>{dayNum}</span>

                    {/* Green active dot below or beside number */}
                    {isGreenDot && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)] mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. INSPIRATIONAL ARTWORK CARD (LOOK BACK NOT TO RETURN) */}
          <div className="relative rounded-2xl overflow-hidden border border-purple-500/40 bg-gradient-to-b from-[#13092b]/95 to-[#070313]/98 shadow-xl min-h-[220px] flex flex-col justify-between group">
            {/* Background Artwork: Anime Adventurer on Cliff overlooking floating spires */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <img
                src={promoCliffImg}
                alt="Look Back Adventure"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-[center_35%] filter saturate-125 opacity-70 transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090416] via-[#090416]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#090416]/90 via-[#090416]/50 to-transparent" />
            </div>

            {/* Overlaid Inspirational Typography */}
            <div className="relative z-10 p-5 max-w-[80%]">
              <p className="font-cinzel text-xs sm:text-sm font-black text-slate-100 tracking-widest leading-relaxed uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                LOOK BACK<br />
                NOT TO RETURN,<br />
                BUT TO SEE<br />
                <span className="text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">HOW FAR YOU'VE COME.</span>
              </p>
            </div>

            {/* Stone Inscription Plaque at Bottom Right */}
            <div className="relative z-10 p-4 flex justify-end">
              <div className="px-4 py-2 rounded-xl bg-gradient-to-b from-[#1e1307]/90 to-[#0d0702]/95 border border-amber-600/40 shadow-lg text-center backdrop-blur-sm">
                <p className="font-serif italic text-xs font-bold text-amber-200 tracking-wide">
                  Progress<br />Lives Forever.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Detail Modal if an entry is clicked */}
      {selectedLogDetail && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedLogDetail(null)}
        >
          <div 
            className="relative w-full max-w-md rounded-2xl p-6 bg-gradient-to-b from-[#170c32] to-[#0a0518] border border-purple-500/60 shadow-2xl space-y-4 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/50">
              <div className="flex items-center gap-2.5">
                {getIconForType(selectedLogDetail.type)}
                <h3 className="font-cinzel text-base font-bold tracking-wide">
                  Activity Details
                </h3>
              </div>
              <button 
                onClick={() => setSelectedLogDetail(null)}
                className="text-slate-400 hover:text-white text-lg font-mono"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-mono text-slate-400">{selectedLogDetail.displayDate} · {selectedLogDetail.time}</span>
                <h4 className="text-lg font-bold text-white mt-1">{selectedLogDetail.title}</h4>
                <p className="text-sm text-slate-300 mt-0.5">{selectedLogDetail.subtitle}</p>
              </div>

              {selectedLogDetail.category && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Category:</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(selectedLogDetail.category)}`}>
                    {selectedLogDetail.category}
                  </span>
                </div>
              )}

              {selectedLogDetail.quote && (
                <blockquote className="p-3 rounded-xl bg-purple-950/40 border-l-2 border-purple-400 italic text-xs text-purple-200">
                  {selectedLogDetail.quote}
                </blockquote>
              )}

              {(selectedLogDetail.xp || selectedLogDetail.gold) && (
                <div className="p-3 rounded-xl bg-[#0d0720] border border-purple-900/50 flex items-center justify-around">
                  {selectedLogDetail.xp && (
                    <div className="flex items-center gap-1.5 text-purple-300 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>+{selectedLogDetail.xp} XP</span>
                    </div>
                  )}
                  {selectedLogDetail.gold && (
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold text-sm">
                      <Coins className="w-4 h-4 text-amber-400" />
                      <span>+{selectedLogDetail.gold} Gold</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedLogDetail(null)}
              className="w-full py-2.5 rounded-xl bg-purple-800 hover:bg-purple-700 text-xs font-bold uppercase tracking-wider text-white transition-colors"
            >
              Close Record
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
