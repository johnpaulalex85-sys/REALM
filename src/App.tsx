import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { HeroBanner } from './components/HeroBanner';
import { StatCards } from './components/StatCards';
import { QuickAccess } from './components/QuickAccess';
import { RecentActivity } from './components/RecentActivity';
import { ActiveQuests } from './components/ActiveQuests';
import { StreakCard } from './components/StreakCard';
import { PromoCard } from './components/PromoCard';
import { QuestBoard } from './components/QuestBoard';
import { AddQuestView } from './components/AddQuestView';
import { HistoryView } from './components/HistoryView';
import { CharacterView } from './components/CharacterView';
import { InventoryView } from './components/InventoryView';
import { AddQuestModal } from './components/AddQuestModal';
import { CharacterModal } from './components/CharacterModal';
import { InventoryModal } from './components/InventoryModal';
import { AchievementsModal } from './components/AchievementsModal';
import { AchievementsView } from './components/AchievementsView';
import { SettingsView } from './components/SettingsView';
import { LevelUpCelebration } from './components/LevelUpCelebration';
import { QuestRewardModal } from './components/QuestRewardModal';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import { 
  initialProfile, 
  initialAttributes, 
  initialQuests, 
  initialRecentActivity,
  initialInventory,
  initialAchievements
} from './data';
import { Quest, AttributeType, RecentActivityItem } from './types';
import { soundFx } from './sound';
import { Sparkles, RefreshCw, LogOut } from 'lucide-react';
import { getQuestPicture } from './utils/questImages';

export default function App() {
  const { isAuthenticated, loading: authLoading, logout } = useAuth();

  // Core game state
  const [profile, setProfile] = useState(initialProfile);
  const [attributes, setAttributes] = useState(initialAttributes);
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [activities, setActivities] = useState<RecentActivityItem[]>(initialRecentActivity);
  const [inventory, setInventory] = useState(initialInventory);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // 7-day streak tracker
  const [streakWeek, setStreakWeek] = useState([
    { day: 'Mon', checked: true },
    { day: 'Tue', checked: false },
    { day: 'Wed', checked: false },
    { day: 'Thu', checked: false },
    { day: 'Fri', checked: false },
    { day: 'Sat', checked: false },
    { day: 'Sun', checked: false }
  ]);

  // UI state - default to 'dashboard'
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddQuestOpen, setIsAddQuestOpen] = useState(false);
  const [isCharacterOpen, setIsCharacterOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [levelUpModal, setLevelUpModal] = useState<{ open: boolean; level: number }>({
    open: false,
    level: 1
  });

  // Dedicated Quest Victory & Reward Modal
  const [questRewardModal, setQuestRewardModal] = useState<{
    open: boolean;
    questTitle: string;
    xpEarned: number;
    goldEarned: number;
    attributeType: string;
    droppedItem?: {
      name: string;
      rarity: string;
      image?: string;
      bonus: string;
    } | null;
    bonusXP?: number;
    bonusGold?: number;
  }>({
    open: false,
    questTitle: '',
    xpEarned: 0,
    goldEarned: 0,
    attributeType: 'strength',
    droppedItem: null,
    bonusXP: 0,
    bonusGold: 0
  });

  // Floating feedback banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Fetch full game state from Flask backend
  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    setDataLoading(true);
    setDataError(null);

    try {
      const data = await api.dashboard.getDashboard();
      if (data.character) {
        setProfile(prev => ({
          ...prev,
          name: data.character.name || prev.name,
          title: data.character.title || prev.title,
          level: data.character.level ?? prev.level,
          health: data.character.health ?? prev.health,
          maxHealth: data.character.maxHealth ?? prev.maxHealth,
          energy: data.character.energy ?? prev.energy,
          maxEnergy: data.character.maxEnergy ?? prev.maxEnergy,
          currentXP: data.character.currentXP ?? prev.currentXP,
          maxXP: data.character.maxXP ?? prev.maxXP,
          gold: data.character.gold ?? prev.gold,
          totalXP: data.character.totalXP ?? prev.totalXP,
          streakDays: data.character.streakDays ?? prev.streakDays,
          class: data.character.class || prev.class,
          equippedItems: data.character.equippedItems || prev.equippedItems
        }));
      }

      if (data.attributes && Array.isArray(data.attributes)) {
        setAttributes(data.attributes);
      }

      if (data.quests && Array.isArray(data.quests)) {
        setQuests(data.quests.map((q: Quest) => ({
          ...q,
          image: getQuestPicture(q)
        })));
      }

      if (data.recent_activity && Array.isArray(data.recent_activity)) {
        setActivities(data.recent_activity);
      }

      if (data.inventory && Array.isArray(data.inventory)) {
        setInventory(data.inventory);
      }

      if (data.achievements && Array.isArray(data.achievements)) {
        setAchievements(data.achievements);
      }

      if (data.streak && data.streak.streak_week) {
        setStreakWeek(data.streak.streak_week);
      }
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setDataError(err.message || "Failed to connect to REALM backend server");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  // Take a Campfire Rest / Meditate to recover Health & Energy via backend
  const handleRest = async () => {
    soundFx.playLevelUp();
    try {
      const res = await api.character.rest();
      if (res.character) {
        setProfile(prev => ({
          ...prev,
          health: res.character.health,
          energy: res.character.energy
        }));
      }
      showToast("🌙 Campfire Rest: Restored +35 Energy and +20 Health!");
    } catch (err: any) {
      showToast(`⚠️ Rest error: ${err.message}`);
    }
  };

  // Handle continuing / progressing a quest via backend API
  const handleContinueQuest = async (questId: string) => {
    const targetQuest = quests.find(q => q.id === questId);
    if (!targetQuest) return;

    if (targetQuest.completed || targetQuest.progress >= 100) {
      showToast(`Quest "${targetQuest.title}" has already been claimed!`);
      return;
    }

    if (profile.health <= 0) {
      soundFx.playClick();
      showToast("💀 Collapse! You have 0 HP and cannot quest. Rest or drink an elixir to recover!");
      return;
    }

    try {
      soundFx.playQuestProgress();
      const res = await api.quests.continueQuest(questId);

      // Update local state with authoritative server response
      if (res.quest) {
        setQuests(prev => prev.map(q => q.id === questId ? { ...q, ...res.quest } : q));
      }

      if (res.character) {
        setProfile(prev => ({
          ...prev,
          level: res.character.level,
          health: res.character.health,
          energy: res.character.energy,
          currentXP: res.character.currentXP,
          maxXP: res.character.maxXP,
          gold: res.character.gold,
          totalXP: res.character.totalXP,
          attributes: res.character.attributes || prev.attributes
        }));
        if (res.character.attributes) {
          setAttributes(res.character.attributes);
        }
      }

      if (res.completed) {
        soundFx.playQuestComplete();
        fetchDashboardData(); // Refresh history, inventory, achievements

        const reward = res.reward || {};
        const bonusXP = reward.bonus_xp || 0;
        const bonusGold = reward.bonus_gold || 0;
        const finalXP = reward.final_xp || targetQuest.xpReward;
        const finalGold = reward.final_gold || targetQuest.goldReward;
        const attrType = reward.attribute || targetQuest.attribute;
        const droppedItem = res.dropped_item;

        if (res.health_loss > 0) {
          showToast(`⚠️ Exhaustion Strain (-${res.health_loss} HP)! Quest Complete: ${targetQuest.title}! +${finalXP} XP, +${finalGold} Gold!`);
        } else {
          showToast(`⚡ -${res.energy_used} Energy! Quest Complete: ${targetQuest.title}! +${finalXP} XP, +${finalGold} Gold!`);
        }

        if (res.level_up) {
          setTimeout(() => {
            setLevelUpModal({ open: true, level: res.new_level });
          }, 400);
        }

        // Open Quest Reward Modal celebration
        setTimeout(() => {
          setQuestRewardModal({
            open: true,
            questTitle: targetQuest.title,
            xpEarned: finalXP,
            goldEarned: finalGold,
            attributeType: attrType,
            droppedItem: droppedItem ? {
              name: droppedItem.name,
              rarity: droppedItem.rarity,
              image: droppedItem.image,
              bonus: droppedItem.bonus
            } : null,
            bonusXP,
            bonusGold
          });
        }, 200);
      } else {
        showToast(`⚡ -${res.energy_used} Energy | ${targetQuest.title} is now at ${res.progress}%!`);
      }
    } catch (err: any) {
      showToast(`⚠️ ${err.message}`);
    }
  };

  // Handle direct quest completion from Quest Details via backend API
  const handleCompleteQuestDirectly = async (questId: string) => {
    const targetQuest = quests.find(q => q.id === questId);
    if (!targetQuest) return;

    if (targetQuest.completed || targetQuest.progress >= 100) {
      showToast(`Quest "${targetQuest.title}" has already been claimed!`);
      return;
    }

    try {
      soundFx.playQuestComplete();
      const res = await api.quests.completeQuest(questId);

      if (res.quest) {
        setQuests(prev => prev.map(q => q.id === questId ? { ...q, ...res.quest } : q));
      }

      if (res.character) {
        setProfile(prev => ({
          ...prev,
          level: res.character.level,
          health: res.character.health,
          energy: res.character.energy,
          currentXP: res.character.currentXP,
          maxXP: res.character.maxXP,
          gold: res.character.gold,
          totalXP: res.character.totalXP
        }));
        if (res.character.attributes) {
          setAttributes(res.character.attributes);
        }
      }

      fetchDashboardData();

      const reward = res.reward || {};
      const finalXP = reward.final_xp || targetQuest.xpReward;
      const finalGold = reward.final_gold || targetQuest.goldReward;

      showToast(`⚡ "${targetQuest.title}" completed! +${finalXP} XP, +${finalGold} Gold!`);

      if (res.level_up) {
        setTimeout(() => {
          setLevelUpModal({ open: true, level: res.new_level });
        }, 400);
      }

      setTimeout(() => {
        setQuestRewardModal({
          open: true,
          questTitle: targetQuest.title,
          xpEarned: finalXP,
          goldEarned: finalGold,
          attributeType: targetQuest.attribute,
          droppedItem: res.dropped_item,
          bonusXP: reward.bonus_xp || 0,
          bonusGold: reward.bonus_gold || 0
        });
      }, 200);
    } catch (err: any) {
      showToast(`⚠️ ${err.message}`);
    }
  };

  // Accept quest from board into active list
  const handleAcceptQuest = async (questId: string) => {
    try {
      await api.quests.updateQuest(questId, { active: true });
      setQuests(prev => prev.map(q => q.id === questId ? { ...q, active: true } : q));
      soundFx.playClick();
      const target = quests.find(q => q.id === questId);
      if (target) {
        showToast(`Quest Accepted! "${target.title}" is now active on your dashboard.`);
      }
    } catch (err: any) {
      showToast(`⚠️ ${err.message}`);
    }
  };

  // Add new quest via backend API
  const handleAddQuest = async (newQuestData: Omit<Quest, 'id' | 'progress'> | Quest) => {
    try {
      const created = await api.quests.createQuest(newQuestData);
      const withImg: Quest = { ...created, image: getQuestPicture(created) };
      setQuests(prev => [withImg, ...prev]);
      soundFx.playQuestComplete();
      showToast(`New Quest Inscribed: "${created.title}" saved to MongoDB!`);
      fetchDashboardData();
    } catch (err: any) {
      showToast(`⚠️ ${err.message}`);
    }
  };

  // Check in day via backend API
  const handleCheckInDay = async (index: number) => {
    if (streakWeek[index]?.checked) return;

    try {
      const res = await api.streak.checkIn(index);
      if (res.streak && res.streak.streak_week) {
        setStreakWeek(res.streak.streak_week);
      }
      if (res.character) {
        setProfile(prev => ({
          ...prev,
          streakDays: res.character.streakDays,
          health: res.character.health,
          energy: res.character.energy,
          currentXP: res.character.currentXP,
          gold: res.character.gold
        }));
      }

      soundFx.playQuestComplete();
      showToast(`🔥 Streak Sealed! +150 XP & +25 Gold restored!`);
      fetchDashboardData();
    } catch (err: any) {
      showToast(`⚠️ ${err.message}`);
    }
  };

  // Use / Equip inventory item via backend API
  const handleUseItem = async (itemId: string) => {
    const targetItem = inventory.find(i => i.id === itemId);
    if (!targetItem) return;

    if (targetItem.type === 'potion' || targetItem.category === 'consumables' || targetItem.category === 'boosts') {
      try {
        const res = await api.inventory.useItem(itemId);
        soundFx.playCelebration();
        showToast(`Consumed ${res.item}! Restored HP/Energy & +${res.xp_gained} XP!`);
        fetchDashboardData();
      } catch (err: any) {
        showToast(`⚠️ ${err.message}`);
      }
    } else {
      try {
        const res = await api.inventory.equipItem(itemId);
        setInventory(prev => prev.map(i => i.id === itemId ? { ...i, equipped: res.equipped } : i));
        soundFx.playClick();
        showToast(res.equipped ? `Equipped ${targetItem.name}!` : `Unequipped ${targetItem.name}.`);
      } catch (err: any) {
        showToast(`⚠️ ${err.message}`);
      }
    }
  };

  // Sell inventory item for Gold via backend API
  const handleSellItem = async (itemId: string, goldPrice: number) => {
    try {
      const res = await api.inventory.sellItem(itemId);
      soundFx.playQuestComplete();
      showToast(`Merchant Vault: Sold "${res.sold_item}" for +${res.gold_gained} Gold!`);
      fetchDashboardData();
    } catch (err: any) {
      showToast(`⚠️ ${err.message}`);
    }
  };

  // Filter quests & activities by search query
  const filteredQuests = quests.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeQuests = filteredQuests.filter(q => q.active && !q.completed);

  const filteredActivities = activities.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If Auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#070814] text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="w-10 h-10 animate-spin text-amber-400 mx-auto" />
          <p className="text-sm font-bold text-amber-200 tracking-wider">Synchronizing with REALM Server...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, render medieval Auth Modal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070814] text-slate-100 flex items-center justify-center p-4">
        <AuthModal onSuccess={() => fetchDashboardData()} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070814] text-slate-100 flex relative overflow-x-hidden">
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-purple-900/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-900/10 rounded-full blur-[130px]" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-[140px]" />
      </div>

      {/* Left Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
        }}
        openAddQuest={() => setCurrentTab('add_quest')}
        questCount={activeQuests.length}
        mobileOpen={mobileNavOpen}
        setMobileOpen={setMobileNavOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 lg:pl-64 flex flex-col relative z-10">
        {/* Top Header */}
        <TopHeader
          profile={profile}
          currentTab={currentTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          setMobileOpen={setMobileNavOpen}
          onProfileClick={() => setCurrentTab('character')}
          onNotificationsClick={() => showToast("You have pending daily trials in Active Quests!")}
          onSettingsClick={() => setCurrentTab('settings')}
          onRest={handleRest}
        />

        {/* Sync / Error Bar */}
        {dataError && (
          <div className="bg-rose-950/90 border-b border-rose-500/50 px-6 py-2 text-xs text-rose-200 flex items-center justify-between">
            <span>⚠️ Backend Notice: {dataError}</span>
            <button 
              onClick={fetchDashboardData}
              className="px-3 py-1 bg-rose-900 hover:bg-rose-800 text-white rounded font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Retry Sync
            </button>
          </div>
        )}

        {/* Main Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1600px] w-full mx-auto space-y-6">
          {currentTab === 'settings' ? (
            <SettingsView
              showToast={showToast}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
              profile={profile}
            />
          ) : currentTab === 'achievements' ? (
            <AchievementsView
              achievements={achievements}
              showToast={showToast}
              onProgressAchievement={(id) => {
                api.achievements.getAchievements().then(res => setAchievements(res));
              }}
            />
          ) : currentTab === 'inventory' ? (
            <InventoryView
              items={inventory}
              onUseItem={handleUseItem}
              onSellItem={handleSellItem}
              showToast={showToast}
            />
          ) : currentTab === 'character' ? (
            <CharacterView
              profile={profile}
              setProfile={setProfile}
              attributes={attributes}
              setAttributes={setAttributes}
              inventory={inventory}
              setInventory={setInventory}
              quests={quests}
              achievements={achievements}
              showToast={showToast}
              onOpenInventory={() => setCurrentTab('inventory')}
              onOpenAchievements={() => setCurrentTab('achievements')}
              onRest={handleRest}
            />
          ) : currentTab === 'history' ? (
            <HistoryView
              showToast={showToast}
              onOpenQuestBoard={() => setCurrentTab('quests')}
            />
          ) : currentTab === 'add_quest' ? (
            <AddQuestView
              onAddQuest={(newQuest) => {
                handleAddQuest(newQuest);
                setCurrentTab('quests');
              }}
              onCancel={() => setCurrentTab('quests')}
              showToast={showToast}
            />
          ) : currentTab === 'quests' ? (
            <QuestBoard
              quests={filteredQuests}
              onContinueQuest={handleContinueQuest}
              onCompleteQuest={handleCompleteQuestDirectly}
              onOpenAddQuest={() => setCurrentTab('add_quest')}
              onAcceptQuest={handleAcceptQuest}
            />
          ) : (
            /* Main Dashboard Grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Primary Column */}
              <div className="lg:col-span-8 space-y-6">
                <HeroBanner profile={profile} />

                <StatCards 
                  attributes={attributes} 
                  onSelectAttribute={(attrId) => {
                    const matched = attributes.find(a => a.id === attrId);
                    if (matched) {
                      showToast(`${matched.name}: ${matched.current}/${matched.max} points. Focus on ${matched.subSkills.join(', ')} to raise it!`);
                    }
                  }}
                />

                <QuickAccess
                  onAddQuest={() => setCurrentTab('add_quest')}
                  onOpenCharacter={() => setCurrentTab('character')}
                  onOpenInventory={() => setCurrentTab('inventory')}
                  onOpenAchievements={() => setCurrentTab('achievements')}
                />

                <div id="recent-activity-section">
                  <RecentActivity 
                    activities={filteredActivities}
                    onViewAll={() => {
                      soundFx.playClick();
                      setCurrentTab('history');
                    }}
                  />
                </div>
              </div>

              {/* Right RPG HUD Column */}
              <div className="lg:col-span-4 space-y-5">
                <div id="active-quests-section">
                  <ActiveQuests
                    quests={activeQuests}
                    onContinueQuest={handleContinueQuest}
                    onViewAll={() => setCurrentTab('quests')}
                    onOpenAddQuest={() => setIsAddQuestOpen(true)}
                  />
                </div>

                <StreakCard
                  streakDays={profile.streakDays}
                  streakWeek={streakWeek}
                  onCheckInDay={handleCheckInDay}
                />

                <PromoCard
                  onKeepGoing={() => {
                    setCurrentTab('quests');
                  }}
                />
              </div>

            </div>
          )}
        </main>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm px-4 py-3 rounded-xl bg-[#170e2b] border border-purple-500/60 shadow-[0_0_25px_rgba(168,85,247,0.4)] text-xs font-bold text-white flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-7 h-7 rounded-lg bg-purple-900/80 flex items-center justify-center shrink-0 text-purple-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* Interactive Modals */}
      <AddQuestModal
        isOpen={isAddQuestOpen}
        onClose={() => setIsAddQuestOpen(false)}
        onAddQuest={handleAddQuest}
      />

      <CharacterModal
        isOpen={isCharacterOpen}
        onClose={() => setIsCharacterOpen(false)}
        profile={profile}
        attributes={attributes}
      />

      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        items={inventory}
        onUseItem={handleUseItem}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={achievements}
      />

      <LevelUpCelebration
        isOpen={levelUpModal.open}
        onClose={() => setLevelUpModal({ open: false, level: levelUpModal.level })}
        newLevel={levelUpModal.level}
      />

      <QuestRewardModal
        isOpen={questRewardModal.open}
        onClose={() => setQuestRewardModal(prev => ({ ...prev, open: false }))}
        questTitle={questRewardModal.questTitle}
        xpEarned={questRewardModal.xpEarned}
        goldEarned={questRewardModal.goldEarned}
        attributeType={questRewardModal.attributeType}
        droppedItem={questRewardModal.droppedItem}
        bonusXP={questRewardModal.bonusXP}
        bonusGold={questRewardModal.bonusGold}
      />
    </div>
  );
}
