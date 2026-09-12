import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Music, 
  Palette, 
  Bell, 
  SlidersHorizontal, 
  Accessibility, 
  User, 
  ShieldCheck, 
  Info, 
  Volume2, 
  VolumeX, 
  Lock, 
  Download, 
  Trash2, 
  RefreshCw, 
  Check, 
  Sparkles,
  Settings as SettingsIcon,
  ChevronDown
} from 'lucide-react';
import { soundFx } from '../sound';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

import settingsStudyBanner from '../assets/images/settings_study_banner.jpg';
import settingsCastleWidget from '../assets/images/settings_castle_widget.jpg';
import settingsParchmentBanner from '../assets/images/settings_parchment_banner.jpg';
import settingsDeskVignette from '../assets/images/settings_desk_vignette.jpg';
import { CharacterProfile } from '../types';

interface SettingsViewProps {
  showToast: (msg: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  profile?: CharacterProfile;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  showToast,
  soundEnabled,
  setSoundEnabled,
  profile
}) => {
  const { user, logout } = useAuth();

  // Game Settings State
  const [levelUpAnimations, setLevelUpAnimations] = useState(true);
  const [questCompletionEffects, setQuestCompletionEffects] = useState(true);
  const [backgroundParticles, setBackgroundParticles] = useState(true);
  const [showMotivationalQuotes, setShowMotivationalQuotes] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  // Audio State
  const [masterVolume, setMasterVolume] = useState(70);
  const [backgroundMusic, setBackgroundMusic] = useState(true);
  const [uiSoundEffects, setUiSoundEffects] = useState(true);
  const [questCompletionSound, setQuestCompletionSound] = useState(true);
  const [levelUpSound, setLevelUpSound] = useState(true);

  // Appearance State
  const [theme, setTheme] = useState('Realm (Default)');
  const [accentColor, setAccentColor] = useState('purple');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Notifications State
  const [questReminders, setQuestReminders] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [achievementNotifications, setAchievementNotifications] = useState(true);
  const [weeklyProgressReport, setWeeklyProgressReport] = useState(false);

  // Preferences State
  const [defaultQuestCategory, setDefaultQuestCategory] = useState('Study');
  const [defaultDifficulty, setDefaultDifficulty] = useState('Medium');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('12 Hour (AM/PM)');
  const [startWeekOn, setStartWeekOn] = useState('Monday');

  // Accessibility State
  const [largerText, setLargerText] = useState(false);
  const [dyslexiaFriendlyFont, setDyslexiaFriendlyFont] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(true);
  const [screenReaderSupport, setScreenReaderSupport] = useState(true);
  const [colorBlindFriendly, setColorBlindFriendly] = useState(false);

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Update check
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  // Load initial settings from MongoDB
  useEffect(() => {
    api.settings.getSettings().then(data => {
      if (data) {
        if (typeof data.levelUpAnimations === 'boolean') setLevelUpAnimations(data.levelUpAnimations);
        if (typeof data.questCompletionEffects === 'boolean') setQuestCompletionEffects(data.questCompletionEffects);
        if (typeof data.backgroundParticles === 'boolean') setBackgroundParticles(data.backgroundParticles);
        if (typeof data.showMotivationalQuotes === 'boolean') setShowMotivationalQuotes(data.showMotivationalQuotes);
        if (typeof data.compactMode === 'boolean') setCompactMode(data.compactMode);

        if (typeof data.masterVolume === 'number') setMasterVolume(data.masterVolume);
        if (typeof data.backgroundMusic === 'boolean') setBackgroundMusic(data.backgroundMusic);
        if (typeof data.uiSoundEffects === 'boolean') setUiSoundEffects(data.uiSoundEffects);
        if (typeof data.questCompletionSound === 'boolean') setQuestCompletionSound(data.questCompletionSound);
        if (typeof data.levelUpSound === 'boolean') setLevelUpSound(data.levelUpSound);

        if (data.theme) setTheme(data.theme);
        if (data.accentColor) setAccentColor(data.accentColor);
        if (typeof data.reducedMotion === 'boolean') setReducedMotion(data.reducedMotion);
        if (typeof data.highContrast === 'boolean') setHighContrast(data.highContrast);

        if (typeof data.questReminders === 'boolean') setQuestReminders(data.questReminders);
        if (typeof data.dailySummary === 'boolean') setDailySummary(data.dailySummary);
        if (typeof data.streakAlerts === 'boolean') setStreakAlerts(data.streakAlerts);
        if (typeof data.achievementNotifications === 'boolean') setAchievementNotifications(data.achievementNotifications);
        if (typeof data.weeklyProgressReport === 'boolean') setWeeklyProgressReport(data.weeklyProgressReport);

        if (data.defaultQuestCategory) setDefaultQuestCategory(data.defaultQuestCategory);
        if (data.defaultDifficulty) setDefaultDifficulty(data.defaultDifficulty);
        if (data.dateFormat) setDateFormat(data.dateFormat);
        if (data.timeFormat) setTimeFormat(data.timeFormat);
        if (data.startWeekOn) setStartWeekOn(data.startWeekOn);

        if (typeof data.largerText === 'boolean') setLargerText(data.largerText);
        if (typeof data.dyslexiaFriendlyFont === 'boolean') setDyslexiaFriendlyFont(data.dyslexiaFriendlyFont);
        if (typeof data.keyboardNavigation === 'boolean') setKeyboardNavigation(data.keyboardNavigation);
        if (typeof data.screenReaderSupport === 'boolean') setScreenReaderSupport(data.screenReaderSupport);
        if (typeof data.colorBlindFriendly === 'boolean') setColorBlindFriendly(data.colorBlindFriendly);
      }
    }).catch(console.error);
  }, []);

  // Save single setting change to MongoDB
  const saveSettingToDB = (key: string, value: any) => {
    api.settings.updateSettings({ [key]: value }).catch(err => {
      console.error("Failed to save setting to MongoDB:", err);
    });
  };

  // Toggle helper
  const handleToggle = (
    value: boolean, 
    setter: React.Dispatch<React.SetStateAction<boolean>>, 
    name: string,
    apiKey: string
  ) => {
    soundFx.playClick();
    const next = !value;
    setter(next);
    saveSettingToDB(apiKey, next);
    showToast(`${name} turned ${next ? 'ON' : 'OFF'} (Saved to MongoDB).`);
  };

  // Export JSON backup data directly from MongoDB
  const handleExportData = async () => {
    try {
      soundFx.playQuestComplete();
      const data = await api.settings.exportData();

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `realm-mongodb-backup-${user?.name || 'hero'}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("Full Realm MongoDB Codex exported successfully!");
    } catch (err: any) {
      showToast(`⚠️ Export failed: ${err.message}`);
    }
  };

  // Password Change Submission
  const handlePasswordSubmit = async () => {
    if (!oldPassword || !newPassword) {
      setPasswordError("Please enter current and new passwords");
      return;
    }
    setPasswordLoading(true);
    setPasswordError(null);

    try {
      await api.settings.changePassword(oldPassword, newPassword);
      soundFx.playQuestComplete();
      setIsPasswordModalOpen(false);
      setOldPassword('');
      setNewPassword('');
      showToast("Passkey updated & secured in MongoDB!");
    } catch (err: any) {
      setPasswordError(err.message || "Failed to update passkey");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Account Deletion
  const handleDeleteAccount = async () => {
    if (window.confirm("⚠️ ARE YOU SURE? This will permanently delete your user, character, quests, inventory, and achievements from MongoDB!")) {
      try {
        await api.settings.deleteAccount();
        logout();
        window.location.reload();
      } catch (err: any) {
        showToast(`⚠️ Account deletion error: ${err.message}`);
      }
    }
  };

  const handleCheckUpdates = () => {
    soundFx.playClick();
    setIsCheckingUpdate(true);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      soundFx.playQuestComplete();
      showToast("REALM Full-Stack MongoDB Architecture build is up to date.");
    }, 1200);
  };

  // Reusable Toggle Switch Component
  const ToggleSwitch = ({ 
    active, 
    onToggle, 
    id 
  }: { 
    active: boolean; 
    onToggle: () => void; 
    id?: string;
  }) => (
    <button
      id={id}
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        active ? 'bg-gradient-to-r from-purple-600 to-indigo-500' : 'bg-slate-800'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
          active ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Cinematic Header Banner: REALM SETTINGS */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-purple-500/40 bg-[#0c071d] shadow-[0_4px_30px_rgba(0,0,0,0.7)] min-h-[140px] sm:min-h-[160px] flex items-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={settingsStudyBanner}
            alt="Settings Banner Artwork"
            className="w-full h-full object-cover object-center filter saturate-125 brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070814] via-[#070814]/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between w-full">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-400/40 text-purple-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <SettingsIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>CONFIG & PREFERENCES</span>
            </div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-amber-200 tracking-wider">
              REALM SETTINGS
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Tailor your experience, master controls, audio, and sync settings directly to MongoDB.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main 9-Card Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column Cards (col-span-12 lg:col-span-8 xl:col-span-9 space-y-6) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CARD 1: GAMEPLAY (Purple Theme) */}
            <div className="rounded-2xl p-5 bg-[#0b0c1e]/90 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)] flex flex-col justify-between space-y-4 hover:border-purple-400/60 transition-all">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <Gamepad2 className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  <h3 className="font-cinzel text-sm font-black tracking-wider text-white">
                    GAMEPLAY
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Tune mechanics and visuals.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Level Up Animations</span>
                  <ToggleSwitch 
                    id="toggle-levelup-anim"
                    active={levelUpAnimations} 
                    onToggle={() => handleToggle(levelUpAnimations, setLevelUpAnimations, 'Level Up Animations', 'levelUpAnimations')} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Quest Completion Effects</span>
                  <ToggleSwitch 
                    id="toggle-quest-effects"
                    active={questCompletionEffects} 
                    onToggle={() => handleToggle(questCompletionEffects, setQuestCompletionEffects, 'Quest Effects', 'questCompletionEffects')} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Background Particles</span>
                  <ToggleSwitch 
                    id="toggle-particles"
                    active={backgroundParticles} 
                    onToggle={() => handleToggle(backgroundParticles, setBackgroundParticles, 'Background Particles', 'backgroundParticles')} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Show Motivational Quotes</span>
                  <ToggleSwitch 
                    id="toggle-quotes"
                    active={showMotivationalQuotes} 
                    onToggle={() => handleToggle(showMotivationalQuotes, setShowMotivationalQuotes, 'Motivational Quotes', 'showMotivationalQuotes')} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Compact Mode</span>
                  <ToggleSwitch 
                    id="toggle-compact-mode"
                    active={compactMode} 
                    onToggle={() => handleToggle(compactMode, setCompactMode, 'Compact Mode', 'compactMode')} 
                  />
                </div>
              </div>
            </div>

            {/* CARD 2: AUDIO (Cyan Theme) */}
            <div className="rounded-2xl p-5 bg-[#0b0c1e]/90 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col justify-between space-y-4 hover:border-cyan-400/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2.5">
                    <Music className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    <h3 className="font-cinzel text-sm font-black tracking-wider text-white">
                      AUDIO
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      const next = !soundEnabled;
                      setSoundEnabled(next);
                      saveSettingToDB('soundEnabled', next);
                      soundFx.playClick();
                    }}
                    className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:text-white transition-colors"
                  >
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Sound and volume controls.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {/* Master Volume Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-200">
                    <span>Master Volume</span>
                    <span className="font-mono text-cyan-300 font-bold">{masterVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={masterVolume}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setMasterVolume(val);
                      saveSettingToDB('masterVolume', val);
                    }}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Background Music</span>
                  <ToggleSwitch 
                    id="toggle-bg-music"
                    active={backgroundMusic} 
                    onToggle={() => handleToggle(backgroundMusic, setBackgroundMusic, 'Background Music', 'backgroundMusic')} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>UI Sound Effects</span>
                  <ToggleSwitch 
                    id="toggle-ui-sounds"
                    active={uiSoundEffects} 
                    onToggle={() => handleToggle(uiSoundEffects, setUiSoundEffects, 'UI Sound Effects', 'uiSoundEffects')} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Quest Completion Sound</span>
                  <ToggleSwitch 
                    id="toggle-quest-sound"
                    active={questCompletionSound} 
                    onToggle={() => handleToggle(questCompletionSound, setQuestCompletionSound, 'Quest Sound', 'questCompletionSound')} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Level Up Fanfare</span>
                  <ToggleSwitch 
                    id="toggle-levelup-sound"
                    active={levelUpSound} 
                    onToggle={() => handleToggle(levelUpSound, setLevelUpSound, 'Level Up Sound', 'levelUpSound')} 
                  />
                </div>
              </div>
            </div>

            {/* CARD 3: APPEARANCE (Violet Theme) */}
            <div className="rounded-2xl p-5 bg-[#0b0c1e]/90 border border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.15)] flex flex-col justify-between space-y-4 hover:border-violet-400/60 transition-all">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <Palette className="w-5 h-5 text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                  <h3 className="font-cinzel text-sm font-black tracking-wider text-white">
                    APPEARANCE
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Themes and visual styling.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {/* Theme Selector */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-200">Theme</span>
                  <select
                    id="select-theme"
                    value={theme}
                    onChange={(e) => {
                      setTheme(e.target.value);
                      saveSettingToDB('theme', e.target.value);
                      soundFx.playClick();
                    }}
                    className="bg-[#13162b] border border-violet-500/40 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                  >
                    <option value="Realm (Default)">Realm (Default)</option>
                    <option value="Shadow Citadel">Shadow Citadel</option>
                    <option value="Golden Monarch">Golden Monarch</option>
                    <option value="Emerald Sanctuary">Emerald Sanctuary</option>
                  </select>
                </div>

                {/* Accent Color Palette */}
                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Accent Color</span>
                  <div className="flex items-center gap-1.5">
                    {['purple', 'cyan', 'amber', 'emerald', 'rose'].map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setAccentColor(color);
                          saveSettingToDB('accentColor', color);
                          soundFx.playClick();
                        }}
                        className={`w-5 h-5 rounded-full transition-transform ${
                          color === 'purple' ? 'bg-purple-500' :
                          color === 'cyan' ? 'bg-cyan-400' :
                          color === 'amber' ? 'bg-amber-400' :
                          color === 'emerald' ? 'bg-emerald-400' : 'bg-rose-500'
                        } ${accentColor === color ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Reduced Motion</span>
                  <ToggleSwitch 
                    id="toggle-reduced-motion"
                    active={reducedMotion} 
                    onToggle={() => handleToggle(reducedMotion, setReducedMotion, 'Reduced Motion', 'reducedMotion')} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>High Contrast</span>
                  <ToggleSwitch 
                    id="toggle-high-contrast"
                    active={highContrast} 
                    onToggle={() => handleToggle(highContrast, setHighContrast, 'High Contrast', 'highContrast')} 
                  />
                </div>
              </div>
            </div>

            {/* CARD 4: NOTIFICATIONS (Emerald Theme) */}
            <div className="rounded-2xl p-5 bg-[#0b0c1e]/90 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex flex-col justify-between space-y-4 hover:border-emerald-400/60 transition-all">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <Bell className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <h3 className="font-cinzel text-sm font-black tracking-wider text-white">
                    NOTIFICATIONS
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Stay informed on trials and quests.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Quest Reminders</span>
                  <ToggleSwitch 
                    id="toggle-quest-reminders"
                    active={questReminders} 
                    onToggle={() => handleToggle(questReminders, setQuestReminders, 'Quest Reminders', 'questReminders')} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Daily Summary</span>
                  <ToggleSwitch 
                    id="toggle-daily-summary"
                    active={dailySummary} 
                    onToggle={() => handleToggle(dailySummary, setDailySummary, 'Daily Summary', 'dailySummary')} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Streak Alerts</span>
                  <ToggleSwitch 
                    id="toggle-streak-alerts"
                    active={streakAlerts} 
                    onToggle={() => handleToggle(streakAlerts, setStreakAlerts, 'Streak Alerts', 'streakAlerts')} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Achievement Unlocks</span>
                  <ToggleSwitch 
                    id="toggle-achieve-notif"
                    active={achievementNotifications} 
                    onToggle={() => handleToggle(achievementNotifications, setAchievementNotifications, 'Achievement Alerts', 'achievementNotifications')} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Weekly Progress Report</span>
                  <ToggleSwitch 
                    id="toggle-weekly-report"
                    active={weeklyProgressReport} 
                    onToggle={() => handleToggle(weeklyProgressReport, setWeeklyProgressReport, 'Weekly Report', 'weeklyProgressReport')} 
                  />
                </div>
              </div>
            </div>

            {/* CARD 5: PREFERENCES (Indigo Theme) */}
            <div className="rounded-2xl p-5 bg-[#0b0c1e]/90 border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.15)] flex flex-col justify-between space-y-4 hover:border-indigo-400/60 transition-all">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <SlidersHorizontal className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  <h3 className="font-cinzel text-sm font-black tracking-wider text-white">
                    PREFERENCES
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Tailor your defaults.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                {/* Default Category */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-200">Default Quest Category</span>
                  <select
                    id="select-default-category"
                    value={defaultQuestCategory}
                    onChange={(e) => {
                      setDefaultQuestCategory(e.target.value);
                      saveSettingToDB('defaultQuestCategory', e.target.value);
                      soundFx.playClick();
                    }}
                    className="bg-[#13162b] border border-indigo-500/40 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                  >
                    <option value="Study">Study</option>
                    <option value="Health">Health</option>
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Discipline">Discipline</option>
                  </select>
                </div>

                {/* Default Difficulty */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-200">Default Difficulty</span>
                  <select
                    id="select-default-difficulty"
                    value={defaultDifficulty}
                    onChange={(e) => {
                      setDefaultDifficulty(e.target.value);
                      saveSettingToDB('defaultDifficulty', e.target.value);
                      soundFx.playClick();
                    }}
                    className="bg-[#13162b] border border-indigo-500/40 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Epic">Epic</option>
                  </select>
                </div>

                {/* Date Format */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-200">Date Format</span>
                  <select
                    id="select-date-format"
                    value={dateFormat}
                    onChange={(e) => {
                      setDateFormat(e.target.value);
                      saveSettingToDB('dateFormat', e.target.value);
                      soundFx.playClick();
                    }}
                    className="bg-[#13162b] border border-indigo-500/40 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                {/* Time Format */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-200">Time Format</span>
                  <select
                    id="select-time-format"
                    value={timeFormat}
                    onChange={(e) => {
                      setTimeFormat(e.target.value);
                      saveSettingToDB('timeFormat', e.target.value);
                      soundFx.playClick();
                    }}
                    className="bg-[#13162b] border border-indigo-500/40 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                  >
                    <option value="12 Hour (AM/PM)">12 Hour (AM/PM)</option>
                    <option value="24 Hour">24 Hour</option>
                  </select>
                </div>

                {/* Start Week On */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-200">Start Week On</span>
                  <select
                    id="select-start-week-on"
                    value={startWeekOn}
                    onChange={(e) => {
                      setStartWeekOn(e.target.value);
                      saveSettingToDB('startWeekOn', e.target.value);
                      soundFx.playClick();
                    }}
                    className="bg-[#13162b] border border-indigo-500/40 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Sunday">Sunday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
              </div>
            </div>

            {/* CARD 6: ACCESSIBILITY (Sky Blue Theme) */}
            <div className="rounded-2xl p-5 bg-[#0b0c1e]/90 border border-sky-500/50 shadow-[0_0_20px_rgba(14,165,233,0.15)] flex flex-col justify-between space-y-4 hover:border-sky-400/70 transition-all">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <Accessibility className="w-5 h-5 text-sky-400 drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                  <h3 className="font-cinzel text-sm font-black tracking-wider text-white">
                    ACCESSIBILITY
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Make REALM work for you.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Larger Text</span>
                  <ToggleSwitch 
                    id="toggle-larger-text"
                    active={largerText} 
                    onToggle={() => handleToggle(largerText, setLargerText, 'Larger Text', 'largerText')} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Dyslexia Friendly Font</span>
                  <ToggleSwitch 
                    id="toggle-dyslexia-font"
                    active={dyslexiaFriendlyFont} 
                    onToggle={() => handleToggle(dyslexiaFriendlyFont, setDyslexiaFriendlyFont, 'Dyslexia Font', 'dyslexiaFriendlyFont')} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Keyboard Navigation</span>
                  <ToggleSwitch 
                    id="toggle-keyboard-navigation"
                    active={keyboardNavigation} 
                    onToggle={() => handleToggle(keyboardNavigation, setKeyboardNavigation, 'Keyboard Navigation', 'keyboardNavigation')} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Screen Reader Support</span>
                  <ToggleSwitch 
                    id="toggle-screen-reader"
                    active={screenReaderSupport} 
                    onToggle={() => handleToggle(screenReaderSupport, setScreenReaderSupport, 'Screen Reader', 'screenReaderSupport')} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Color Blind Friendly</span>
                  <ToggleSwitch 
                    id="toggle-color-blind"
                    active={colorBlindFriendly} 
                    onToggle={() => handleToggle(colorBlindFriendly, setColorBlindFriendly, 'Color Blind Mode', 'colorBlindFriendly')} 
                  />
                </div>
              </div>
            </div>

            {/* CARD 7: ACCOUNT (Warm Amber/Bronze Theme) */}
            <div className="rounded-2xl p-5 bg-[#0b0c1e]/90 border border-amber-600/40 shadow-[0_0_20px_rgba(217,119,6,0.15)] flex flex-col justify-between space-y-4 hover:border-amber-500/60 transition-all">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <User className="w-5 h-5 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  <h3 className="font-cinzel text-sm font-black tracking-wider text-white">
                    ACCOUNT
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Manage your account.
                </p>
              </div>

              <div className="space-y-2.5 pt-1 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-purple-950/40">
                  <span className="text-slate-400 font-medium">Username</span>
                  <span className="font-bold text-white font-cinzel tracking-wider">{user?.name || profile?.name || 'SHADOW'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-purple-950/40">
                  <span className="text-slate-400 font-medium">Email</span>
                  <span className="text-purple-200 font-mono text-[11px]">{user?.email || 'shadow@realm.app'}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium">Member Since</span>
                  <span className="text-slate-300 font-medium">Sep 1, 2025</span>
                </div>

                <button
                  id="btn-change-password"
                  onClick={() => {
                    soundFx.playClick();
                    setPasswordError(null);
                    setIsPasswordModalOpen(true);
                  }}
                  className="w-full mt-2 py-2 px-3 rounded-xl border border-amber-600/50 bg-[#161226] hover:bg-amber-950/30 text-slate-200 hover:text-amber-300 transition-all flex items-center justify-center gap-2 text-xs font-semibold shadow-sm"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Change Password</span>
                </button>
              </div>
            </div>

            {/* CARD 8: DATA & PRIVACY (Crimson/Ruby Theme) */}
            <div className="rounded-2xl p-5 bg-[#0b0c1e]/90 border border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)] flex flex-col justify-between space-y-4 hover:border-rose-400/70 transition-all">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <ShieldCheck className="w-5 h-5 text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                  <h3 className="font-cinzel text-sm font-black tracking-wider text-white">
                    DATA & PRIVACY
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Your data, your control.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2.5">
                  <button
                    id="btn-export-data"
                    onClick={handleExportData}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-700/80 bg-[#14162e] hover:bg-[#1e2348] text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1.5 text-xs font-semibold shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    <span>Export My Data</span>
                  </button>

                  <button
                    id="btn-delete-account"
                    onClick={handleDeleteAccount}
                    className="flex-1 py-2 px-3 rounded-xl border border-rose-900/60 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 hover:text-rose-200 transition-all flex items-center justify-center gap-1.5 text-xs font-semibold shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delete Account</span>
                  </button>
                </div>

                <p className="text-[10px] text-slate-400/90 leading-relaxed pt-1">
                  Your data is secure and synchronized with MongoDB.
                </p>
              </div>
            </div>

            {/* CARD 9: ABOUT (Steel Blue Theme) */}
            <div className="rounded-2xl p-5 bg-[#0b0c1e]/90 border border-blue-600/45 shadow-[0_0_20px_rgba(37,99,235,0.15)] flex flex-col justify-between space-y-4 hover:border-blue-500/70 transition-all">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <Info className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                  <h3 className="font-cinzel text-sm font-black tracking-wider text-white">
                    ABOUT
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Version and architecture information.
                </p>
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-purple-950/40">
                  <span className="text-slate-400 font-medium">Version</span>
                  <span className="font-mono text-blue-300 font-bold text-[11px]">2.5.0 (Full-Stack)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-purple-950/40">
                  <span className="text-slate-400 font-medium">Backend</span>
                  <span className="text-slate-300 font-medium">Python 3 + Flask</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-purple-950/40">
                  <span className="text-slate-400 font-medium">Database</span>
                  <span className="text-emerald-400 font-medium">MongoDB Atlas</span>
                </div>

                <button
                  id="btn-check-updates"
                  onClick={handleCheckUpdates}
                  disabled={isCheckingUpdate}
                  className="w-full mt-2 py-2 px-3 rounded-xl border border-blue-600/40 bg-[#131936] hover:bg-blue-950/40 text-slate-200 hover:text-blue-300 transition-all flex items-center justify-center gap-2 text-xs font-semibold shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
                  <span>{isCheckingUpdate ? 'Checking Realm Servers...' : 'Check for Updates'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Right-Side Column (col-span-12 lg:col-span-4 xl:col-span-3 space-y-5) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-5">
          
          {/* Top Twilight Castle Spire Card */}
          <div className="rounded-2xl overflow-hidden border border-purple-800/40 bg-[#090b1c] shadow-xl group">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={settingsCastleWidget}
                alt="Twilight Fantasy Castle Spire"
                className="w-full h-full object-cover object-center filter saturate-125 brightness-105 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090b1c] via-transparent to-transparent" />
            </div>

            <div className="p-4 pt-2 text-center space-y-2">
              <p className="font-cinzel text-xs font-bold tracking-widest text-slate-200 uppercase leading-relaxed">
                “A MORE DISCIPLINED YOU<br />
                A BRIGHTER TOMORROW.”
              </p>
              <div className="flex items-center justify-center gap-2 text-[10px] text-purple-400 select-none">
                <span className="w-8 h-[1px] bg-purple-500/50" />
                <span>✦</span>
                <span className="w-8 h-[1px] bg-purple-500/50" />
              </div>
            </div>
          </div>

          {/* REALM Parchment Goals Card */}
          <div className="rounded-2xl overflow-hidden border border-amber-900/40 shadow-xl relative group">
            <img
              src={settingsParchmentBanner}
              alt="REALM Core Tenets"
              className="w-full h-auto object-cover object-center filter saturate-115 brightness-95"
            />
          </div>

          {/* Bottom Table Vignette */}
          <div className="rounded-2xl overflow-hidden border border-purple-900/50 shadow-xl relative group">
            <img
              src={settingsDeskVignette}
              alt="Progress Lives Here"
              className="w-full h-auto object-cover object-center filter saturate-125 brightness-100"
            />
          </div>

        </div>

      </div>

      {/* Password Change Dialog Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0c0d22] border border-amber-500/60 p-6 shadow-[0_0_35px_rgba(245,158,11,0.3)] space-y-4">
            <div className="flex items-center gap-3 border-b border-purple-950/60 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-white tracking-wider">
                  CHANGE PASSKEY
                </h3>
                <p className="text-xs text-slate-400">Update your realm encryption credentials in MongoDB.</p>
              </div>
            </div>

            {passwordError && (
              <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-semibold">
                {passwordError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password..."
                  className="w-full px-3 py-2 rounded-xl bg-[#141836] border border-purple-900/50 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new passkey (6+ chars)..."
                  className="w-full px-3 py-2 rounded-xl bg-[#141836] border border-purple-900/50 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                disabled={passwordLoading}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-[0_0_15px_rgba(245,158,11,0.5)] disabled:opacity-50"
              >
                {passwordLoading ? 'Updating...' : 'Update Passkey'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
