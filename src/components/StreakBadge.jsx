import React from 'react';
import { Flame, Trophy, CalendarCheck, Shield, ChevronRight, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StreakBadge = ({ currentStreak = 0, longestStreak = 0, totalLogs = 0 }) => {
  const { user } = useAuth();

  // Dynamic Level & XP Calculation
  const xpPerLog = 100;
  const xpPerLongestStreak = 150;
  const xpPerCurrentStreak = 50;

  const totalXP = (totalLogs * xpPerLog) + (longestStreak * xpPerLongestStreak) + (currentStreak * xpPerCurrentStreak);
  const xpThreshold = 500;
  
  const level = Math.floor(totalXP / xpThreshold) + 1;
  const currentLevelXP = totalXP % xpThreshold;
  const progressPercent = Math.min((currentLevelXP / xpThreshold) * 100, 100);

  // Ranks mapper
  const getRank = (lvl) => {
    if (lvl === 1) return 'Code Cadet';
    if (lvl === 2) return 'Syntax Squire';
    if (lvl === 3) return 'Logic Wizard';
    if (lvl === 4) return 'Async Adept';
    if (lvl === 5) return 'Stack Sentinel';
    if (lvl === 6) return 'API Alchemist';
    if (lvl === 7) return 'Architecture Architect';
    return 'Grandmaster Dev';
  };

  const rank = getRank(level);

  // Streak Messages
  let streakMessage = "Log today to keep your coding streak alive!";
  if (currentStreak === 1) {
    streakMessage = "First day logged! Keep the momentum going tomorrow.";
  } else if (currentStreak > 1 && currentStreak < 4) {
    streakMessage = "Nice work! You are establishing a routine.";
  } else if (currentStreak >= 4 && currentStreak < 7) {
    streakMessage = "Habit unlocked! Great programming consistency.";
  } else if (currentStreak >= 7) {
    streakMessage = "Unstoppable! You're coding at peak performance!";
  }

  // Initial letter for Avatar
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'D';

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row items-stretch justify-between gap-6 transition-all duration-300 hover:shadow-md border border-slate-200 dark:border-slate-800">
      
      {/* 1. Profile, XP Progress & Ranks */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-grow max-w-xl">
        {/* Avatar */}
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold text-2xl shadow-md">
            {initial}
          </div>
          {/* Level Circle */}
          <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 border-2 border-indigo-500 text-white font-extrabold text-xs shadow" title={`Level ${level}`}>
            {level}
          </div>
        </div>

        {/* Level Details */}
        <div className="flex-grow space-y-2 w-full text-center sm:text-left">
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center justify-center sm:justify-start gap-2">
              <span>{user?.name || 'Developer'}</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 dark:bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <Award className="h-3 w-3" />
                <span>{rank}</span>
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Rank Score: <span className="font-bold text-slate-500 dark:text-slate-350">{totalXP} XP</span>
            </p>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>Next Level Rank</span>
              <span>{currentLevelXP} / {xpThreshold} XP</span>
            </div>
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical separator in lg */}
      <div className="hidden lg:block w-[1px] bg-slate-200 dark:bg-slate-800"></div>

      {/* 2. Streak Flame Widget */}
      <div className="flex items-center justify-center sm:justify-start gap-4 pr-4">
        <div className={`rounded-2xl p-4 transition-all duration-300 ${currentStreak > 0 ? 'bg-orange-500/10 dark:bg-orange-500/5 shadow-inner' : 'bg-slate-100 dark:bg-slate-900'}`}>
          <Flame className={`h-11 w-11 transition-all duration-300 ${currentStreak > 0 ? 'text-orange-500 fill-orange-500 animate-pulse drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'text-slate-350 dark:text-slate-700'}`} />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
              {currentStreak}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              day{currentStreak !== 1 ? 's' : ''} streak
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium max-w-[180px] leading-relaxed">
            {streakMessage}
          </p>
        </div>
      </div>

      {/* Vertical separator in lg */}
      <div className="hidden lg:block w-[1px] bg-slate-200 dark:bg-slate-800"></div>

      {/* 3. Streak Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 min-w-[360px] w-full lg:w-auto">
        {/* Longest Streak Card */}
        <div className="flex items-center space-x-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850/80 p-3 pr-4 transition-all hover:bg-slate-100 dark:hover:bg-slate-900">
          <div className="rounded-lg bg-yellow-500/15 p-2 text-yellow-600 dark:text-yellow-450">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Longest
            </span>
            <span className="text-base font-bold text-slate-800 dark:text-slate-200">
              {longestStreak} day{longestStreak !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Total Logs Card */}
        <div className="flex items-center space-x-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850/80 p-3 pr-4 transition-all hover:bg-slate-100 dark:hover:bg-slate-900">
          <div className="rounded-lg bg-emerald-500/15 p-2 text-emerald-600 dark:text-emerald-450">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Logs
            </span>
            <span className="text-base font-bold text-slate-800 dark:text-slate-200">
              {totalLogs}
            </span>
          </div>
        </div>

        {/* Streak Shield Card */}
        <div className="group/shield relative flex items-center space-x-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850/80 p-3 pr-4 transition-all hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer">
          <div className="rounded-lg bg-cyan-500/15 p-2 text-cyan-600 dark:text-cyan-450">
            <Shield className="h-5 w-5 fill-cyan-500/10" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Shields
            </span>
            <span className="text-base font-bold text-slate-800 dark:text-slate-200">
              {Math.floor(totalLogs / 5)}
            </span>
          </div>

          {/* Shield Tooltip */}
          <div className="absolute z-50 bottom-16 right-0 w-48 rounded-xl bg-slate-900 border border-slate-850 p-3 shadow-2xl text-left text-white opacity-0 pointer-events-none group-hover/shield:opacity-100 transition-opacity duration-200">
            <h5 className="text-xs font-bold flex items-center gap-1">
              <span>🛡️</span>
              <span>Streak Shield</span>
            </h5>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Earn 1 shield for every 5 logs. Automatically consumed to protect your streak if you miss a day!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StreakBadge;
