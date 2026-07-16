import React, { useState } from 'react';
import { Trophy, CheckCircle, Lock, Info } from 'lucide-react';

const AchievementsCard = ({ totalLogs = 0, longestStreak = 0, moodDistribution = {}, topTags = [] }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const shippedCount = moodDistribution.shipped || 0;
  const stuckCount = moodDistribution.stuck || 0;
  const uniqueTagsCount = topTags.length || 0;

  const badges = [
    {
      id: 'hello_world',
      title: 'Hello World',
      description: 'Write your first developer log entry.',
      icon: '🎓',
      isUnlocked: totalLogs >= 1,
      progress: Math.min(totalLogs, 1),
      maxProgress: 1
    },
    {
      id: 'streak_3',
      title: 'Triple Threat',
      description: 'Achieve a 3-day logging streak.',
      icon: '🔥',
      isUnlocked: longestStreak >= 3,
      progress: Math.min(longestStreak, 3),
      maxProgress: 3
    },
    {
      id: 'streak_7',
      title: 'Week Warrior',
      description: 'Achieve a 7-day logging streak.',
      icon: '⚡',
      isUnlocked: longestStreak >= 7,
      progress: Math.min(longestStreak, 7),
      maxProgress: 7
    },
    {
      id: 'shipper',
      title: 'Master Shipper',
      description: 'Log 3 or more shipped entries.',
      icon: '📦',
      isUnlocked: shippedCount >= 3,
      progress: Math.min(shippedCount, 3),
      maxProgress: 3
    },
    {
      id: 'debugger',
      title: 'Code Surgeon',
      description: 'Log 3 or more stuck entries.',
      icon: '🛠️',
      isUnlocked: stuckCount >= 3,
      progress: Math.min(stuckCount, 3),
      maxProgress: 3
    },
    {
      id: 'tagger',
      title: 'Tag Explorer',
      description: 'Categorize with 3 or more unique tech tags.',
      icon: '🏷️',
      isUnlocked: uniqueTagsCount >= 3,
      progress: Math.min(uniqueTagsCount, 3),
      maxProgress: 3
    }
  ];

  const unlockedCount = badges.filter(b => b.isUnlocked).length;

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-sm border border-indigo-500/10 dark:border-indigo-500/5 relative overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Background glow */}
      <div className="absolute -right-12 -bottom-12 h-28 w-28 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-yellow-500/15 p-2 text-yellow-600 dark:text-yellow-450">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Achievements
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {unlockedCount} of {badges.length} Unlocked
            </span>
          </div>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-3 gap-3.5 mt-4">
        {badges.map((badge) => {
          const { id, title, description, icon, isUnlocked, progress, maxProgress } = badge;
          const isHovered = activeTooltip === id;

          return (
            <div
              key={id}
              className="relative flex flex-col items-center"
              onMouseEnter={() => setActiveTooltip(id)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              {/* Badge Cell */}
              <div
                className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-slate-50 dark:bg-slate-900 border-indigo-500/30 text-2xl shadow-sm drop-shadow-[0_0_8px_rgba(99,102,241,0.15)] hover:scale-105 cursor-pointer'
                    : 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-850 opacity-40 hover:opacity-60 grayscale'
                }`}
              >
                <span className="select-none">{icon}</span>
                {/* Lock icon overlay for locked badges */}
                {!isUnlocked && (
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-slate-250 dark:bg-slate-800 p-0.5 border border-slate-300 dark:border-slate-700">
                    <Lock className="h-2.5 w-2.5 text-slate-400 dark:text-slate-500" />
                  </div>
                )}
                {/* Checked icon overlay for unlocked badges */}
                {isUnlocked && (
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-indigo-600 p-0.5 border border-white dark:border-slate-900">
                    <CheckCircle className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
              </div>

              {/* Badge Label */}
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1.5 text-center truncate max-w-full">
                {title}
              </span>

              {/* Popup Tooltip */}
              {isHovered && (
                <div className="absolute z-50 bottom-20 w-44 rounded-xl bg-slate-900 border border-slate-800 p-3 shadow-2xl text-left text-white pointer-events-none animate-fade-in">
                  <h5 className="text-xs font-bold flex items-center gap-1">
                    <span>{icon}</span>
                    <span>{title}</span>
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    {description}
                  </p>
                  
                  {/* Progress Indicator */}
                  <div className="mt-2.5 space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-slate-400">
                      <span>Progress</span>
                      <span>{progress}/{maxProgress}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${(progress / maxProgress) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsCard;
