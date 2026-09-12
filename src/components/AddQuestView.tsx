import React, { useState } from 'react';
import { 
  Feather, 
  Sparkles, 
  Coins, 
  Calendar, 
  BarChart2, 
  Layers, 
  Target, 
  BarChart3, 
  Gift, 
  Star, 
  Plus, 
  BookOpen, 
  FileText, 
  Bell, 
  Dumbbell, 
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import { Quest, AttributeType } from '../types';
import { soundFx } from '../sound';
import inscribeBannerImg from '../assets/images/inscribe_banner_1789201955914.jpg';
import goalRealityImg from '../assets/images/goal_reality_cliff_1789201973062.jpg';
import questDeepworkImg from '../assets/images/quest_deepwork_1789200577920.jpg';

interface AddQuestViewProps {
  onAddQuest: (newQuest: Quest) => void;
  onCancel: () => void;
  showToast: (message: string) => void;
}

export const AddQuestView: React.FC<AddQuestViewProps> = ({
  onAddQuest,
  onCancel,
  showToast
}) => {
  // Form state
  const [questName, setQuestName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Quest['category'] | ''>('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Epic' | ''>('');
  const [xpReward, setXpReward] = useState<string>('');
  const [goldReward, setGoldReward] = useState<string>('');
  const [attributeImpact, setAttributeImpact] = useState<AttributeType | ''>('');
  const [dueDate, setDueDate] = useState('');

  // Auto-adjust reward suggestions based on difficulty
  const handleDifficultyChange = (diff: 'Easy' | 'Medium' | 'Hard' | 'Epic' | '') => {
    setDifficulty(diff);
    if (diff === 'Easy') {
      setXpReward('100');
      setGoldReward('20');
    } else if (diff === 'Medium') {
      setXpReward('250');
      setGoldReward('40');
    } else if (diff === 'Hard') {
      setXpReward('400');
      setGoldReward('70');
    } else if (diff === 'Epic') {
      setXpReward('600');
      setGoldReward('100');
    }
  };

  // Quick preset from tips
  const applyTipPreset = (presetType: string) => {
    soundFx.playClick();
    if (presetType === 'specific') {
      setQuestName('Solve 3 Algorithmic Coding Challenges');
      setDescription('Dedicate 45 uninterrupted minutes to master dynamic programming algorithms.');
      setCategory('STUDY');
      handleDifficultyChange('Medium');
      setAttributeImpact('INTELLECT');
      showToast('Applied tip: Specific goal focused on deliberate algorithmic practice!');
    } else if (presetType === 'realistic') {
      setQuestName('Complete 20-Min Calisthenics Routine');
      setDescription('Warm-up, 4 sets of push-ups, pull-ups, and core holds to maintain daily streak.');
      setCategory('HEALTH');
      handleDifficultyChange('Easy');
      setAttributeImpact('STRENGTH');
      showToast('Applied tip: Realistic and energizing physical habit!');
    } else if (presetType === 'rewards') {
      setXpReward('300');
      setGoldReward('50');
      showToast('Rewards calibrated: +300 XP and +50 Gold bounty configured.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!questName.trim()) {
      showToast('Please provide a name for your quest.');
      return;
    }

    const xp = parseInt(xpReward, 10) || 150;
    const gold = parseInt(goldReward, 10) || 30;
    const finalCategory = category || 'PERSONAL';
    const finalAttr: AttributeType = (attributeImpact ? attributeImpact.toLowerCase() as AttributeType : 'discipline');

    const newQuest: Quest = {
      id: `quest-${Date.now()}`,
      title: questName.trim(),
      description: description.trim() || 'Execute your daily discipline with unwavering focus.',
      category: finalCategory,
      xpReward: xp,
      goldReward: gold,
      progress: 0,
      completed: false,
      frequency: 'Daily',
      attribute: finalAttr,
      estimatedMinutes: 30,
      currentMinutes: 0,
      difficulty: difficulty || 'Medium',
      image: questDeepworkImg
    };

    soundFx.playQuestComplete();
    onAddQuest(newQuest);
    showToast(`Quest Inscribed: "${newQuest.title}" (+${xp} XP, +${gold} Gold) added to your codex!`);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* 1. Cinematic Banner: INSCRIBE A NEW QUEST */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-purple-500/40 bg-[#0c071d] shadow-[0_4px_30px_rgba(0,0,0,0.7)] min-h-[140px] sm:min-h-[160px] flex items-center">
        {/* Background Artwork */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={inscribeBannerImg}
            alt="Inscribe Quest Study"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[center_35%] filter saturate-125 opacity-75"
          />
          {/* Subtle atmospheric vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090416] via-[#090416]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090416] via-transparent to-[#090416]/50" />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 w-full px-5 sm:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Golden Circle Emblem with Feather Quill */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full border-2 border-amber-400/80 bg-gradient-to-b from-[#1b1003]/90 to-[#0c0702]/95 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.5)] group">
              <Feather className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.95)] transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
              <div className="absolute -inset-1 rounded-full bg-amber-400/20 blur-md pointer-events-none" />
            </div>

            <div>
              <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wider drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">
                INSCRIBE A NEW QUEST
              </h1>
              <p className="text-xs sm:text-sm text-slate-200/90 font-medium tracking-wide mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-w-2xl">
                Turn your intentions into actions. Every great journey starts with a single quest.
              </p>
            </div>
          </div>

          {/* Hanging Velvet Banner on the Right */}
          <div className="hidden lg:flex flex-col items-center justify-center px-4 py-2.5 rounded-xl border border-purple-400/40 bg-gradient-to-b from-purple-950/80 to-[#120526]/90 shadow-[0_0_18px_rgba(168,85,247,0.35)] backdrop-blur-sm">
            <span className="text-[10px] font-black tracking-widest text-purple-300 uppercase">
              TURN TASKS
            </span>
            <span className="text-xs font-black tracking-wider text-white font-cinzel">
              INTO LEGENDS
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Split: Form (Left) & Preview / Tips / Quote (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: QUEST DETAILS Form (col-span-8) */}
        <div className="lg:col-span-8">
          <div className="relative rounded-2xl p-6 sm:p-7 border border-purple-500/50 bg-gradient-to-b from-[#110927]/95 via-[#0b051a]/98 to-[#070311] shadow-[0_4px_35px_rgba(0,0,0,0.6)]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-purple-900/40 mb-6">
              <h2 className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-white flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.9)]" />
                QUEST DETAILS
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Quest Name */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-300">
                  <Bell className="w-3.5 h-3.5 text-purple-400" />
                  <span>Quest Name <span className="text-rose-400">*</span></span>
                </div>
                <input
                  id="quest-name-input"
                  type="text"
                  maxLength={100}
                  required
                  value={questName}
                  onChange={(e) => setQuestName(e.target.value)}
                  placeholder="Give your quest a powerful name..."
                  className="w-full px-4 py-3 rounded-xl bg-[#090516]/90 border border-purple-900/50 focus:border-purple-400 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 shadow-inner transition-all"
                />
                <div className="text-right text-[11px] text-slate-500 mt-1 font-mono">
                  {questName.length}/100
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>Description</span>
                </div>
                <textarea
                  id="quest-description-input"
                  maxLength={500}
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your quest. What will you do? Why is it important?"
                  className="w-full px-4 py-3 rounded-xl bg-[#090516]/90 border border-purple-900/50 focus:border-purple-400 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 shadow-inner transition-all resize-none"
                />
                <div className="text-right text-[11px] text-slate-500 mt-1 font-mono">
                  {description.length}/500
                </div>
              </div>

              {/* Row 1: Category & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-300">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Category <span className="text-rose-400">*</span></span>
                  </div>
                  <select
                    id="quest-category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Quest['category'])}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#090516]/90 border border-purple-900/50 focus:border-purple-400 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all cursor-pointer"
                  >
                    <option value="" disabled>Select a category</option>
                    <option value="STUDY">Study (Deep Work, Learning, Coding)</option>
                    <option value="WORK">Work (Strategy, Projects, Career)</option>
                    <option value="HEALTH">Health (Gym, Sleep, Hydration)</option>
                    <option value="PERSONAL">Personal (Reading, Meditation, Organization)</option>
                    <option value="DISCIPLINE">Discipline (Habits, Consistency)</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-300">
                    <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Difficulty <span className="text-rose-400">*</span></span>
                  </div>
                  <select
                    id="quest-difficulty-select"
                    value={difficulty}
                    onChange={(e) => handleDifficultyChange(e.target.value as 'Easy' | 'Medium' | 'Hard' | 'Epic')}
                    className="w-full px-4 py-3 rounded-xl bg-[#090516]/90 border border-purple-900/50 focus:border-purple-400 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all cursor-pointer"
                  >
                    <option value="" disabled>Select difficulty</option>
                    <option value="Easy">Easy (+100 XP, +20 Gold)</option>
                    <option value="Medium">Medium (+250 XP, +40 Gold)</option>
                    <option value="Hard">Hard (+400 XP, +70 Gold)</option>
                    <option value="Epic">Epic (+600 XP, +100 Gold)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: XP Reward & Gold Reward */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* XP Reward */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-purple-300">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>XP Reward <span className="text-rose-400">*</span></span>
                  </div>
                  <div className="relative">
                    <input
                      id="quest-xp-input"
                      type="number"
                      min={10}
                      max={5000}
                      value={xpReward}
                      onChange={(e) => setXpReward(e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full px-4 py-3 rounded-xl bg-[#090516]/90 border border-purple-900/50 focus:border-purple-400 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all font-mono"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-purple-400 font-bold">
                      XP
                    </span>
                  </div>
                </div>

                {/* Gold Reward */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-300">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>Gold Reward <span className="text-rose-400">*</span></span>
                  </div>
                  <div className="relative">
                    <input
                      id="quest-gold-input"
                      type="number"
                      min={0}
                      max={1000}
                      value={goldReward}
                      onChange={(e) => setGoldReward(e.target.value)}
                      placeholder="e.g. 20"
                      className="w-full px-4 py-3 rounded-xl bg-[#090516]/90 border border-purple-900/50 focus:border-amber-400 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-amber-400 font-bold">
                      Gold
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 3: Attribute Impact & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Attribute Impact */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-300">
                    <Dumbbell className="w-3.5 h-3.5 text-purple-400" />
                    <span>Attribute Impact</span>
                  </div>
                  <select
                    id="quest-attribute-select"
                    value={attributeImpact}
                    onChange={(e) => setAttributeImpact(e.target.value as AttributeType)}
                    className="w-full px-4 py-3 rounded-xl bg-[#090516]/90 border border-purple-900/50 focus:border-purple-400 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all cursor-pointer"
                  >
                    <option value="">Select attribute (optional)</option>
                    <option value="STRENGTH">Strength (Gym, Calisthenics, Heavy Training)</option>
                    <option value="INTELLECT">Intellect (Reading, Coding, Problem Solving)</option>
                    <option value="WISDOM">Wisdom (Mindfulness, Journaling, Reflection)</option>
                    <option value="DISCIPLINE">Discipline (Routine, Consistency, Self Control)</option>
                    <option value="VITALITY">Vitality (Sleep, Nutrition, Hydration)</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span>Due Date</span>
                  </div>
                  <input
                    id="quest-duedate-input"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#090516]/90 border border-purple-900/50 focus:border-purple-400 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Actions: Cancel & + Create Quest */}
              <div className="flex items-center justify-between pt-4 border-t border-purple-900/40 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    onCancel();
                  }}
                  className="px-6 py-3 rounded-xl border border-white/15 hover:border-white/30 text-slate-300 hover:text-white font-bold text-sm transition-all bg-[#090516]/60 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  id="create-quest-submit-btn"
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-700 hover:from-purple-500 hover:to-fuchsia-500 text-white font-black text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:shadow-[0_0_35px_rgba(168,85,247,0.8)] transition-all flex items-center gap-2 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                  <span>Create Quest</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Preview, Tips, and Reality Quote (col-span-4) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* QUEST PREVIEW CARD */}
          <div>
            <h3 className="font-cinzel text-xs font-black tracking-widest text-slate-300 uppercase mb-2.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
              QUEST PREVIEW
            </h3>

            <div className="relative rounded-2xl p-5 border border-amber-500/50 bg-gradient-to-b from-[#1c1206]/95 via-[#120b02]/98 to-[#090502] shadow-[0_0_25px_rgba(245,158,11,0.2)] overflow-hidden">
              
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Glowing Tome Icon */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-amber-600/40 to-yellow-950/60 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                    <BookOpen className="w-6 h-6 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
                  </div>

                  <div>
                    <h4 className="font-sans text-sm font-bold text-white tracking-wide leading-snug line-clamp-1">
                      {questName.trim() || 'Your Quest Title'}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {description.trim() || 'A short description will appear here...'}
                    </p>
                  </div>
                </div>

                {/* Category Pill */}
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/60 text-cyan-200 tracking-wider uppercase shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  {category || 'CATEGORY'}
                </span>
              </div>

              {/* Rewards Row */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-amber-950/40 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-purple-300">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>+{xpReward ? parseInt(xpReward, 10).toLocaleString() : '0'} XP</span>
                </div>

                <div className="flex items-center gap-1.5 text-amber-300">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>+{goldReward ? parseInt(goldReward, 10).toLocaleString() : '0'} Gold</span>
                </div>
              </div>

              {/* Progress Bar placeholder */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-[#080502] border border-amber-900/40 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 w-0" />
                </div>
                <span className="text-[11px] font-mono text-slate-400 font-bold">
                  0%
                </span>
              </div>
            </div>
          </div>

          {/* TIPS FOR A GREAT QUEST */}
          <div className="relative rounded-2xl p-5 border border-purple-900/40 bg-gradient-to-b from-[#0e0a1e]/90 to-[#070512]/95 shadow-xl">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-purple-950/50">
              <Lightbulb className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
              <h3 className="font-cinzel text-xs font-bold tracking-wider text-amber-200 uppercase">
                TIPS FOR A GREAT QUEST
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Tip 1 */}
              <div 
                onClick={() => applyTipPreset('specific')}
                className="flex items-start gap-3 group cursor-pointer hover:bg-white/5 p-1.5 rounded-lg transition-colors"
                title="Click to apply example"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-950/70 border border-purple-500/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Target className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 group-hover:text-purple-300 transition-colors">Be Specific</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Clear goals are easier to complete.</p>
                </div>
              </div>

              {/* Tip 2 */}
              <div 
                onClick={() => applyTipPreset('realistic')}
                className="flex items-start gap-3 group cursor-pointer hover:bg-white/5 p-1.5 rounded-lg transition-colors"
                title="Click to apply example"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5">
                  <BarChart3 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">Keep It Realistic</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Set achievable and meaningful targets.</p>
                </div>
              </div>

              {/* Tip 3 */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-cyan-950/70 border border-cyan-500/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">Choose the Right Category</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Help yourself stay organized.</p>
                </div>
              </div>

              {/* Tip 4 */}
              <div 
                onClick={() => applyTipPreset('rewards')}
                className="flex items-start gap-3 group cursor-pointer hover:bg-white/5 p-1.5 rounded-lg transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-950/70 border border-amber-500/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Gift className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 group-hover:text-amber-300 transition-colors">Set a Reward</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Give yourself a reason to be excited!</p>
                </div>
              </div>

              {/* Tip 5 */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-yellow-950/70 border border-yellow-500/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Star className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">Link to an Attribute</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Align with the area you want to improve.</p>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ARTWORK & QUOTE CARD */}
          <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 bg-gradient-to-b from-[#100824]/90 to-[#070412]/95 shadow-xl min-h-[145px] flex items-center">
            {/* Artwork: Hunter on Cliff under Crescent Moon and Purple Cosmos */}
            <div className="absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none overflow-hidden">
              <img
                src={goalRealityImg}
                alt="Goal Reality Cliff"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-[center_top] filter saturate-125 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d0720] via-[#0d0720]/70 to-transparent" />
            </div>

            <div className="relative z-10 p-5 max-w-[65%]">
              <p className="font-cinzel text-sm sm:text-base font-bold text-purple-200 tracking-wider leading-relaxed italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                “A GOAL GIVEN FORM BECOMES A REALITY.”
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Golden Filigree Bottom Motto Divider */}
      <div className="py-4 flex items-center justify-center gap-3 text-[11px] sm:text-xs font-black tracking-widest text-amber-300 uppercase select-none">
        <div className="h-[1px] w-12 sm:w-28 bg-gradient-to-r from-transparent to-amber-500/50" />
        <span className="text-amber-400">✦</span>
        <span>INTENTIONS TODAY. ACHIEVEMENTS TOMORROW.</span>
        <span className="text-amber-400">✦</span>
        <div className="h-[1px] w-12 sm:w-28 bg-gradient-to-l from-transparent to-amber-500/50" />
      </div>

    </div>
  );
};
