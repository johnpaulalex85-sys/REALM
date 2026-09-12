import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Sparkles, 
  ChevronDown, 
  Clock, 
  Coins, 
  Shield, 
  Check, 
  Zap, 
  Flame, 
  Compass, 
  Dumbbell, 
  Brain, 
  Leaf, 
  Trophy, 
  Scroll, 
  BookOpen, 
  Coffee, 
  Feather, 
  Apple, 
  Hourglass, 
  FlaskRound as Flask, 
  Footprints,
  CheckCircle2
} from 'lucide-react';
import { InventoryItem } from '../types';
import { soundFx } from '../sound';

import inventoryVaultBanner from '../assets/images/inventory_vault_banner.jpg';
import showcaseMindfulCloak from '../assets/images/showcase_mindful_cloak.jpg';
import itemCloakImg from '../assets/images/item_mindful_cloak_1789202806025.jpg';
import itemRingImg from '../assets/images/item_pathfinders_ring.jpg';
import itemBladeImg from '../assets/images/item_trackers_blade_1789202830581.jpg';
import itemJournalImg from '../assets/images/item_explorers_journal_1789202848219.jpg';
import itemTimeShard from '../assets/images/item_time_shard.jpg';
import itemFocusPotion from '../assets/images/item_focus_potion.jpg';
import itemHealthPotion from '../assets/images/item_health_potion.jpg';
import itemKnowledgeTome from '../assets/images/item_knowledge_tome.jpg';
import itemEnergyBar from '../assets/images/item_energy_bar.jpg';
import itemPhoenixFeather from '../assets/images/item_phoenix_feather.jpg';
import itemProductivityBrew from '../assets/images/item_productivity_brew.jpg';
import itemExplorersCompass from '../assets/images/item_explorers_compass.jpg';
import itemIronToken from '../assets/images/item_iron_token.jpg';
import itemClarityCrystal from '../assets/images/item_clarity_crystal.jpg';
import itemVitalityLeaf from '../assets/images/item_vitality_leaf.jpg';
import itemChampionsTrophy from '../assets/images/item_champions_trophy.jpg';
import itemAncientScroll from '../assets/images/item_ancient_scroll.jpg';
import itemStreakGuardian from '../assets/images/item_streak_guardian.jpg';
import itemGrandmasterBadge from '../assets/images/item_grandmaster_badge.jpg';

// Comprehensive picture map for every single inventory item
export const ITEM_PICTURES: Record<string, string> = {
  mindful_cloak: itemCloakImg,
  time_shard: itemTimeShard,
  focus_potion: itemFocusPotion,
  health_potion: itemHealthPotion,
  knowledge_tome: itemKnowledgeTome,
  energy_bar: itemEnergyBar,
  phoenix_feather: itemPhoenixFeather,
  productivity_brew: itemProductivityBrew,
  pathfinders_ring: itemRingImg,
  explorers_compass: itemExplorersCompass,
  iron_token: itemIronToken,
  clarity_crystal: itemClarityCrystal,
  vitality_leaf: itemVitalityLeaf,
  champions_trophy: itemChampionsTrophy,
  ancient_scroll: itemAncientScroll,
  streak_guardian: itemStreakGuardian,
  grandmaster_badge: itemGrandmasterBadge,
  trackers_blade_item: itemBladeImg,
};

interface InventoryViewProps {
  items: InventoryItem[];
  onUseItem: (itemId: string) => void;
  onSellItem: (itemId: string, goldPrice: number) => void;
  showToast: (msg: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  items,
  onUseItem,
  onSellItem,
  showToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'boosts' | 'consumables' | 'special' | 'trophies'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'curated' | 'rarity' | 'name' | 'quantity'>('curated');
  const [selectedItemId, setSelectedItemId] = useState<string>('mindful_cloak');

  // Selected item object
  const selectedItem = items.find(i => i.id === selectedItemId) || items[0];

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: items.length,
      boosts: items.filter(i => i.category === 'boosts').length,
      consumables: items.filter(i => i.category === 'consumables').length,
      special: items.filter(i => i.category === 'special').length,
      trophies: items.filter(i => i.category === 'trophies').length,
    };
  }, [items]);

  // Filtering & Sorting
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(i => i.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i => 
        i.name.toLowerCase().includes(q) ||
        i.bonus.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortOption === 'rarity') {
      const rarityRank: Record<string, number> = {
        Legendary: 5,
        Epic: 4,
        Rare: 3,
        Uncommon: 2,
        Common: 1
      };
      result.sort((a, b) => (rarityRank[b.rarity] || 0) - (rarityRank[a.rarity] || 0));
    } else if (sortOption === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'quantity') {
      result.sort((a, b) => b.quantity - a.quantity);
    }

    return result;
  }, [items, selectedCategory, searchQuery, sortOption]);

  // Render dynamic picture icon for each item
  const renderItemIcon = (item: InventoryItem, isLarge = false) => {
    const imgSrc = ITEM_PICTURES[item.id] || item.image || itemCloakImg;
    const sizeClasses = isLarge ? "w-20 h-20 sm:w-24 sm:h-24" : "w-14 h-14 sm:w-16 sm:h-16";

    // Glowing border color based on item rarity
    let borderGlow = "border-slate-700/80 shadow-[0_0_8px_rgba(148,163,184,0.2)]";
    if (item.rarity === 'Legendary') {
      borderGlow = "border-amber-500/80 shadow-[0_0_14px_rgba(245,158,11,0.5)]";
    } else if (item.rarity === 'Epic') {
      borderGlow = "border-purple-500/80 shadow-[0_0_14px_rgba(168,85,247,0.5)]";
    } else if (item.rarity === 'Rare') {
      borderGlow = "border-cyan-500/80 shadow-[0_0_14px_rgba(6,182,212,0.5)]";
    } else if (item.rarity === 'Uncommon') {
      borderGlow = "border-emerald-500/80 shadow-[0_0_14px_rgba(16,185,129,0.5)]";
    }

    return (
      <div className={`relative ${sizeClasses} rounded-2xl overflow-hidden border-2 ${borderGlow} bg-[#0a0518] group-hover:border-purple-300 transition-all duration-300 shrink-0`}>
        <img
          src={imgSrc}
          alt={item.name}
          className="w-full h-full object-cover object-center filter saturate-110 group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        {/* Subtle radial inner glow */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
    );
  };

  // Rarity Styling Helper
  const getRarityBadgeStyle = (rarity: InventoryItem['rarity']) => {
    switch (rarity) {
      case 'Legendary':
        return 'bg-amber-950/90 border-amber-500/80 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]';
      case 'Epic':
        return 'bg-purple-950/90 border-purple-500/80 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.4)]';
      case 'Rare':
        return 'bg-cyan-950/90 border-cyan-500/80 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]';
      case 'Uncommon':
        return 'bg-emerald-950/90 border-emerald-500/80 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]';
      case 'Common':
      default:
        return 'bg-slate-900/90 border-slate-700 text-slate-300';
    }
  };

  const getCardBorderStyle = (rarity: InventoryItem['rarity'], isSelected: boolean) => {
    if (isSelected) {
      return 'border-2 border-purple-400 bg-gradient-to-b from-[#1c0e3a] via-[#100722] to-[#0a0416] shadow-[0_0_24px_rgba(168,85,247,0.65),inset_0_0_12px_rgba(168,85,247,0.3)] scale-[1.02]';
    }

    switch (rarity) {
      case 'Legendary':
        return 'border border-amber-500/50 bg-gradient-to-b from-[#1f1505]/90 to-[#0c0802]/95 hover:border-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.15)]';
      case 'Epic':
        return 'border border-purple-500/50 bg-gradient-to-b from-[#180a2a]/90 to-[#0b0416]/95 hover:border-purple-400 shadow-[0_0_14px_rgba(168,85,247,0.15)]';
      case 'Rare':
        return 'border border-cyan-500/50 bg-gradient-to-b from-[#091726]/90 to-[#040c16]/95 hover:border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.15)]';
      case 'Uncommon':
        return 'border border-emerald-500/50 bg-gradient-to-b from-[#081816]/90 to-[#030d0b]/95 hover:border-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.15)]';
      case 'Common':
      default:
        return 'border border-slate-800 bg-gradient-to-b from-[#101322]/90 to-[#090b14]/95 hover:border-slate-700';
    }
  };

  return (
    <div className="w-full space-y-6">

      {/* 1. Header Banner: Ancient Treasure Vault & Armory */}
      <div className="relative rounded-2xl overflow-hidden border border-purple-900/50 bg-[#0c081e] shadow-[0_4px_30px_rgba(0,0,0,0.8)] min-h-[140px] sm:min-h-[160px] flex items-center p-6 sm:p-8">
        {/* Background Vault Artwork */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={inventoryVaultBanner}
            alt="Treasure Vault"
            className="w-full h-full object-cover object-center filter saturate-125 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070414] via-[#070414]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070414] via-transparent to-[#070414]/40" />
        </div>

        {/* Banner Content: Backpack Icon + INVENTORY + Subtitle */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Golden Backpack Icon Badge */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-yellow-500 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-2xl bg-[#1a0f04] flex items-center justify-center text-amber-300">
                <Package className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
            </div>

            <div>
              <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-widest uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                INVENTORY
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-sans tracking-wide pt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                Tools for your journey. Every item has a purpose.
              </p>
            </div>
          </div>

          {/* Right Banner Ribbon: "DISCIPLINE COLLECTS REWARDS." */}
          <div className="hidden lg:flex items-center px-4 py-2 rounded-xl bg-purple-950/80 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)] backdrop-blur-md">
            <span className="font-cinzel text-xs font-black tracking-widest text-purple-200 uppercase">
              DISCIPLINE COLLECTS REWARDS.
            </span>
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs & Search Bar Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedCategory('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-purple-900/90 border border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-[#100b24]/80 border border-purple-950 text-slate-300 hover:bg-purple-950/50 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>All ({categoryCounts.all})</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedCategory('boosts');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'boosts'
                ? 'bg-purple-900/90 border border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-[#100b24]/80 border border-purple-950 text-slate-300 hover:bg-purple-950/50 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Boosts ({categoryCounts.boosts})</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedCategory('consumables');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'consumables'
                ? 'bg-purple-900/90 border border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-[#100b24]/80 border border-purple-950 text-slate-300 hover:bg-purple-950/50 hover:text-white'
            }`}
          >
            <Flask className="w-3.5 h-3.5 text-cyan-300" />
            <span>Consumables ({categoryCounts.consumables})</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedCategory('special');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'special'
                ? 'bg-purple-900/90 border border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-[#100b24]/80 border border-purple-950 text-slate-300 hover:bg-purple-950/50 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span>Special ({categoryCounts.special})</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedCategory('trophies');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'trophies'
                ? 'bg-purple-900/90 border border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-[#100b24]/80 border border-purple-950 text-slate-300 hover:bg-purple-950/50 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-300" />
            <span>Trophies ({categoryCounts.trophies})</span>
          </button>
        </div>

        {/* Right Search Input & Sort Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#0f0924]/90 text-slate-200 placeholder-slate-500 rounded-xl border border-purple-900/50 focus:outline-none focus:border-purple-400 shadow-inner"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="appearance-none px-4 py-2 pr-8 rounded-xl bg-[#0f0924]/90 border border-purple-900/50 text-xs font-bold text-slate-200 focus:outline-none focus:border-purple-400 cursor-pointer shadow-md"
            >
              <option value="curated">Sort: Rarity</option>
              <option value="name">Sort: Name</option>
              <option value="quantity">Sort: Quantity</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Main Split: Item Grid (Left 8 cols) & Item Details Inspector (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Item Grid Column */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedItemId(item.id);
                  }}
                  className={`relative rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 group min-h-[160px] ${getCardBorderStyle(item.rarity, isSelected)} ${item.quantity === 0 && !item.equipped ? 'opacity-65 hover:opacity-95 bg-[#080512]/60' : ''}`}
                >
                  {/* Top: Rarity Badge on Right */}
                  <div className="flex justify-end w-full mb-1">
                    <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getRarityBadgeStyle(item.rarity)}`}>
                      {item.rarity}
                    </span>
                  </div>

                  {/* Center: Custom Item Icon / Artwork */}
                  <div className="flex flex-col items-center justify-center my-1.5 group-hover:scale-110 transition-transform">
                    {renderItemIcon(item)}
                  </div>

                  {/* Bottom: Name, Quantity & Effect */}
                  <div className="text-center mt-1">
                    <h4 className="text-xs font-bold text-white tracking-wide truncate group-hover:text-purple-200">
                      {item.name}
                    </h4>

                    <div className="text-[11px] font-semibold mt-0.5">
                      {item.quantity > 0 ? (
                        <span className="text-purple-300 font-sans font-bold">x{item.quantity}</span>
                      ) : (
                        <span className="text-slate-500 font-sans text-[10px]">x0 (Unowned)</span>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-300/80 leading-tight mt-1 line-clamp-2 h-7 flex items-center justify-center">
                      {item.bonus}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: ITEM DETAILS Card */}
        {selectedItem && (
          <div className="lg:col-span-4 rounded-2xl p-5 sm:p-6 border border-purple-500/40 bg-gradient-to-b from-[#130a2a]/95 via-[#0c061d]/98 to-[#070312] shadow-2xl space-y-5 sticky top-20">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-purple-950/60 pb-3">
              <h3 className="font-cinzel text-xs font-black tracking-widest text-slate-200 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.9)]" />
                ITEM DETAILS
              </h3>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${getRarityBadgeStyle(selectedItem.rarity)}`}>
                {selectedItem.rarity}
              </span>
            </div>

            {/* Showcase Display Pedestal */}
            <div className="relative rounded-2xl overflow-hidden border border-purple-500/40 bg-[#0a0518] min-h-[230px] sm:min-h-[250px] flex flex-col items-center justify-center p-4 shadow-inner group">
              {/* Background ambient lighting */}
              <div className="absolute inset-0 pointer-events-none bg-radial from-purple-500/15 via-indigo-950/20 to-transparent" />

              {/* Showcase Image Frame */}
              <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-purple-400/60 shadow-[0_0_30px_rgba(168,85,247,0.45)] bg-[#070314] flex items-center justify-center group-hover:border-purple-300 transition-all duration-300">
                <img
                  src={selectedItem.id === 'mindful_cloak' ? showcaseMindfulCloak : (ITEM_PICTURES[selectedItem.id] || itemCloakImg)}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover object-center filter saturate-125 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Floating Pedestal Shadow / Ring */}
              <div className="relative z-10 w-36 h-3 rounded-full bg-purple-500/30 blur-md mt-3 animate-pulse" />
            </div>

            {/* Item Title & Lore Description */}
            <div className="space-y-2">
              <h2 className="font-cinzel text-xl font-black text-white tracking-wider">
                {selectedItem.name}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedItem.description}
              </p>
            </div>

            {/* Effect & Bonus Pills */}
            <div className="space-y-2 pt-1 border-t border-purple-950/60">
              {/* Primary Stat Boost */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{selectedItem.bonus}</span>
              </div>

              {/* Passive or Effect Type */}
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#0e0722] border border-purple-900/40 text-xs text-slate-300">
                <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Passive Effect</span>
                  <span className="text-[11px] text-slate-400">
                    {selectedItem.passiveEffect || 'Applies automatically upon use or equip'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quote */}
            {selectedItem.quote && (
              <p className="font-serif italic text-xs text-slate-400 text-center px-2">
                {selectedItem.quote}
              </p>
            )}

            {/* Quantity */}
            <div className="text-xs font-bold text-slate-400">
              Quantity: {selectedItem.quantity > 0 ? (
                <span className="text-emerald-300 font-sans font-bold">{selectedItem.quantity} (In Vault)</span>
              ) : (
                <span className="text-rose-400 font-sans font-bold">0 (Not Owned — Complete Quests to Loot)</span>
              )}
            </div>

            {/* Action Buttons: Equip / Consume + Sell for Gold */}
            <div className="space-y-2.5 pt-1">
              {/* Primary Button */}
              {selectedItem.type === 'equipment' ? (
                <button
                  disabled={selectedItem.quantity <= 0 && !selectedItem.equipped}
                  onClick={() => {
                    if (selectedItem.quantity <= 0 && !selectedItem.equipped) {
                      soundFx.playClick();
                      showToast(`You do not own "${selectedItem.name}" yet! Complete quests to loot it.`);
                      return;
                    }
                    soundFx.playCelebration();
                    onUseItem(selectedItem.id);
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                    selectedItem.equipped 
                      ? 'bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-400/60 shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer'
                      : selectedItem.quantity > 0
                      ? 'bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-white border border-purple-400/60 shadow-[0_0_18px_rgba(168,85,247,0.5)] cursor-pointer'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>
                    {selectedItem.equipped 
                      ? 'Equipped (Active)' 
                      : selectedItem.quantity > 0 
                      ? 'Equip' 
                      : 'Not Owned (Cannot Equip)'}
                  </span>
                </button>
              ) : (
                <button
                  disabled={selectedItem.quantity <= 0}
                  onClick={() => {
                    if (selectedItem.quantity <= 0) {
                      soundFx.playClick();
                      showToast(`None left in vault! Complete quests to loot "${selectedItem.name}".`);
                      return;
                    }
                    soundFx.playCelebration();
                    onUseItem(selectedItem.id);
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                    selectedItem.quantity > 0
                      ? 'bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-white border border-purple-400/60 shadow-[0_0_18px_rgba(168,85,247,0.5)] cursor-pointer'
                      : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60'
                  }`}
                >
                  {selectedItem.type === 'potion' ? <Flask className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{selectedItem.quantity > 0 ? (selectedItem.type === 'potion' ? 'Drink / Consume' : 'Use Item') : 'Depleted (0 Charges)'}</span>
                </button>
              )}

              {/* Sell for Gold Button */}
              <button
                onClick={() => {
                  const price = selectedItem.sellPrice || 50;
                  soundFx.playQuestComplete();
                  onSellItem(selectedItem.id, price);
                  showToast(`Sold 1x ${selectedItem.name} for +${price} Gold!`);
                }}
                disabled={selectedItem.quantity <= 0}
                className="w-full py-2 rounded-xl bg-[#140b28]/80 hover:bg-purple-950/60 border border-purple-900/50 hover:border-amber-500/60 text-xs font-bold text-amber-300 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              >
                <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-[10px]">
                  ★
                </div>
                <span>Sell for {selectedItem.sellPrice || 50} Gold</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* 4. Bottom Atmospheric Quote Bar */}
      <div className="rounded-2xl p-4 sm:p-5 border border-purple-950/40 bg-gradient-to-r from-[#0d061c]/90 via-[#130a2a]/95 to-[#0d061c]/90 text-center shadow-lg relative overflow-hidden">
        {/* Subtle candlelight glowing dots */}
        <div className="flex items-center justify-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,1)] animate-ping" />
          <p className="font-serif italic text-xs sm:text-sm text-slate-300 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            “The right tools turn effort into extraordinary results.”
          </p>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,1)] animate-ping" />
        </div>
      </div>

    </div>
  );
};
