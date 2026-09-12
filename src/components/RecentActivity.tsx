import React from 'react';
import { CheckCircle2, Trophy, ArrowUpCircle, ArrowRight, Package } from 'lucide-react';
import { RecentActivityItem } from '../types';

interface RecentActivityProps {
  activities: RecentActivityItem[];
  onViewAll?: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities, onViewAll }) => {
  const renderIcon = (type: RecentActivityItem['type']) => {
    switch (type) {
      case 'completed_quest':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.35)]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        );
      case 'achievement':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-950/80 border border-amber-500/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.35)]">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
        );
      case 'item_acquired':
        return (
          <div className="w-8 h-8 rounded-full bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.35)]">
            <Package className="w-4 h-4 text-cyan-300" />
          </div>
        );
      case 'level_up':
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-purple-950/80 border border-purple-500/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.35)]">
            <ArrowUpCircle className="w-4 h-4 text-purple-300" />
          </div>
        );
    }
  };

  return (
    <div className="w-full rounded-2xl p-5 bg-[#0b0c1e]/85 border border-purple-900/30 backdrop-blur-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase">
          RECENT ACTIVITY
        </h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2-column list of activity cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activities.slice(0, 6).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-xl bg-[#111329]/80 border border-purple-950/40 hover:border-purple-800/50 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              {renderIcon(item.type)}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {item.xp !== undefined && (
                    <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-0.5">
                      +{item.xp} XP
                    </span>
                  )}
                  {item.gold !== undefined && (
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-0.5">
                      +{item.gold} Gold
                    </span>
                  )}
                </div>
              </div>
            </div>

            <span className="text-[11px] font-medium text-slate-500 shrink-0 ml-2">
              {item.timeAgo}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
