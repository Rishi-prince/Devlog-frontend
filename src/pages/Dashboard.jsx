import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import StreakBadge from '../components/StreakBadge';
import Heatmap from '../components/Heatmap';
import LogCard from '../components/LogCard';
import LogForm from '../components/LogForm';
import AISummaryCard from '../components/AISummaryCard';
import MotivationCard from '../components/MotivationCard';
import AchievementsCard from '../components/AchievementsCard';
import { triggerConfetti, triggerLevelUpConfetti } from '../api/confettiHelper';
import { Plus, Search, Filter, RefreshCcw, BookOpen, AlertCircle, Sparkles, PieChart as PieIcon, BarChart2 } from 'lucide-react';

// Recharts components for premium visualizations
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip
} from 'recharts';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [activeTheme, setActiveTheme] = useState(localStorage.getItem('devlog-theme') || '');
  const prevLevelRef = React.useRef(null);

  const getRank = (lvl) => {
    if (lvl === 1) return 'Code Cadet';
    if (lvl === 2) return 'Syntax Squire';
    if (lvl === 3) return 'Logic Wizard';
    if (lvl === 4) return 'Async Adept';
    if (lvl === 5) return 'Stack Sentinel';
    if (lvl === 6) return 'API Alchemist';
    if (lvl === 7) return 'Algorithm Architect';
    return 'Grandmaster Dev';
  };

  const [stats, setStats] = useState({
    totalLogs: 0,
    currentStreak: 0,
    longestStreak: 0,
    heatmap: [],
    moodDistribution: { productive: 0, stuck: 0, shipped: 0 },
    topTags: []
  });

  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState('');

  // Form Modal States
  const [showFormModal, setShowFormModal] = useState(false);
  const [logToEdit, setLogToEdit] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query to prevent redundant API thrashing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch Logs
  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const params = {};
      if (moodFilter) params.mood = moodFilter;
      if (tagFilter) params.tag = tagFilter;
      if (debouncedSearch) params.search = debouncedSearch;

      const res = await axiosInstance.get('/logs', { params });
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch logs. Please try again.');
    } finally {
      setLoadingLogs(false);
    }
  };

  // Fetch Stats
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await axiosInstance.get('/logs/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Initial load and filter change trigger
  useEffect(() => {
    fetchLogs();
  }, [moodFilter, tagFilter, debouncedSearch]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Level Up Celebration effect
  useEffect(() => {
    if (stats.totalLogs > 0) {
      const currentXP = (stats.totalLogs * 100) + (stats.longestStreak * 150) + (stats.currentStreak * 50);
      const currentLevel = Math.floor(currentXP / 500) + 1;
      
      if (prevLevelRef.current !== null && currentLevel > prevLevelRef.current) {
        triggerLevelUpConfetti();
      }
      prevLevelRef.current = currentLevel;
    }
  }, [stats]);

  // Sync activeTheme with document.body.classList
  useEffect(() => {
    document.body.classList.remove('theme-cyberpunk', 'theme-oceanic', 'theme-amber');
    if (activeTheme) {
      document.body.classList.add(activeTheme);
    }
    return () => {
      document.body.classList.remove('theme-cyberpunk', 'theme-oceanic', 'theme-amber');
    };
  }, [activeTheme]);

  // Create or Update Log Submit
  const handleFormSubmit = async (payload) => {
    try {
      if (logToEdit) {
        // Edit log
        await axiosInstance.put(`/logs/${logToEdit._id}`, payload);
      } else {
        // Create new log
        await axiosInstance.post('/logs', payload);
      }
      setShowFormModal(false);
      setLogToEdit(null);
      // Reload both logs and statistics
      fetchLogs();
      fetchStats();
      // Fire confetti explosion!
      triggerConfetti();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving log');
    }
  };

  // Delete Log
  const handleDeleteLog = async (id) => {
    if (window.confirm('Are you sure you want to delete this log entry?')) {
      try {
        const res = await axiosInstance.delete(`/logs/${id}`);
        if (res.data.success) {
          fetchLogs();
          fetchStats();
        }
      } catch (err) {
        console.error(err);
        alert('Could not delete log');
      }
    }
  };

  const handleEditClick = (log) => {
    setLogToEdit(log);
    setShowFormModal(true);
  };

  const handleCreateClick = () => {
    setLogToEdit(null);
    setShowFormModal(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setMoodFilter('');
    setTagFilter('');
  };

  // Prepare Recharts data for Mood Distribution Pie
  const pieData = [
    { name: 'Productive', value: stats.moodDistribution.productive, color: '#6366f1' },
    { name: 'Stuck', value: stats.moodDistribution.stuck, color: '#f59e0b' },
    { name: 'Shipped', value: stats.moodDistribution.shipped, color: '#10b981' }
  ].filter(item => item.value > 0);

  // Prepare Recharts data for Top Tags Bar
  const barData = stats.topTags.map(tagItem => ({
    name: tagItem.tag,
    count: tagItem.count
  })).slice(0, 5); // top 5 tags

  const now = new Date();
  const todayStr = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
  const hasLoggedToday = stats.heatmap.some(h => h.date === todayStr && h.count > 0);

  const totalXP = (stats.totalLogs * 100) + (stats.longestStreak * 150) + (stats.currentStreak * 50);
  const userLevel = Math.floor(totalXP / 500) + 1;

  const themesList = [
    { id: '', name: 'Default Slate', minLevel: 1, color: 'bg-slate-500' },
    { id: 'theme-cyberpunk', name: 'Cyberpunk Neon', minLevel: 1, color: 'bg-pink-500' },
    { id: 'theme-oceanic', name: 'Oceanic Abyss', minLevel: 1, color: 'bg-cyan-500' },
    { id: 'theme-amber', name: 'Solarized Amber', minLevel: 1, color: 'bg-amber-500' }
  ];

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-[#0b0f19] bg-grid-pattern text-slate-800 dark:text-slate-200 transition-colors duration-300 ${activeTheme}`}>
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        
        {/* Dashboard Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Developer Dashboard
            </h1>
            <p className="text-sm text-slate-555 dark:text-slate-400 mt-1">
              Reflect on your progress, visualize consistency, and synthesize logs.
            </p>
            
            {/* Theme Selector Widget */}
            <div className="flex items-center gap-3 mt-3 bg-slate-100/50 dark:bg-slate-900/60 w-fit px-3 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-800">
              <span className="text-[10px] font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Themes:</span>
              <div className="flex items-center gap-2">
                {themesList.map((t) => {
                  const isLocked = userLevel < t.minLevel;
                  const isActive = activeTheme === t.id;
                  
                  return (
                    <button
                      key={t.id}
                      disabled={isLocked}
                      onClick={() => {
                        setActiveTheme(t.id);
                        localStorage.setItem('devlog-theme', t.id);
                      }}
                      className={`group/dot relative flex h-4.5 w-4.5 items-center justify-center rounded-full border transition-all ${isActive ? 'ring-2 ring-indigo-500 border-white scale-105' : 'border-transparent hover:scale-110'} ${t.color} ${isLocked ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}`}
                      title={isLocked ? `Unlocks at Level ${t.minLevel}` : t.name}
                    >
                      {isLocked && <span className="text-[8px] text-white">🔒</span>}
                      
                      {/* Tooltip on theme hover */}
                      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded bg-slate-900 border border-slate-800 px-1.5 py-0.5 text-[8px] font-bold text-white whitespace-nowrap opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none z-50">
                        {isLocked ? `Unlocks at Lvl ${t.minLevel}` : t.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.01]"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Write Daily Log</span>
          </button>
        </div>

        {/* At-Risk Warning Banner */}
        {!hasLoggedToday && stats.totalLogs > 0 && (
          <div className="animate-pulse rounded-2xl border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-red-600 dark:text-red-455 shadow-[0_0_15px_rgba(239,68,68,0.08)] border-l-4 border-l-red-500">
            <div className="flex items-center space-x-3 text-center sm:text-left">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider">Streak At Risk!</h4>
                <p className="text-xs text-red-500/70 dark:text-red-450 mt-0.5 font-medium">
                  You haven't logged today. Write a daily log to protect your {stats.currentStreak}-day coding momentum!
                </p>
              </div>
            </div>
            <button
              onClick={handleCreateClick}
              className="rounded-xl bg-red-600 px-4 py-2 text-xs font-black text-white hover:bg-red-700 transition-all hover:scale-[1.02]"
            >
              Protect Streak
            </button>
          </div>
        )}

        {/* 1. Streak Tracker */}
        <StreakBadge
          currentStreak={stats.currentStreak}
          longestStreak={stats.longestStreak}
          totalLogs={stats.totalLogs}
        />

        {/* 2. Heatmap Visual */}
        <Heatmap data={stats.heatmap} />

        {/* 3. Main Dashboard Layout (Split Screen) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Analytics + AI Summary */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Daily Inspiration / Quote */}
            <MotivationCard />

            {/* Achievements Showcase */}
            <AchievementsCard
              totalLogs={stats.totalLogs}
              longestStreak={stats.longestStreak}
              moodDistribution={stats.moodDistribution}
              topTags={stats.topTags}
            />

            {/* AI Summary Section */}
            <AISummaryCard />

            {/* Visual Analytics Card */}
            <div className="glass-panel rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-800 dark:text-white text-base pb-3 border-b border-slate-100 dark:border-slate-850">
                📊 Activity Analytics
              </h3>

              {/* Mood breakdown pie chart */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <PieIcon className="h-4 w-4" />
                  <span>Mood Breakdown</span>
                </h4>
                {pieData.length > 0 ? (
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '11px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-400">
                    No data to represent mood distribution
                  </div>
                )}
                
                {/* Pie legend */}
                {pieData.length > 0 && (
                  <div className="flex justify-center gap-4 text-xs mt-2 font-medium">
                    {pieData.map((d, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                        <span className="text-slate-600 dark:text-slate-400">{d.name} ({d.value})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tag Frequency Bar Chart */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <BarChart2 className="h-4 w-4" />
                  <span>Top Technology Tags</span>
                </h4>
                {barData.length > 0 ? (
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} layout="vertical" margin={{ left: -15, right: 10 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={70} stroke="#94a3b8" tickLine={false} style={{ fontSize: '11px' }} />
                        <ChartTooltip
                          cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '11px'
                          }}
                        />
                        <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={12}>
                          {barData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="#6366f1" />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-850 rounded-xl text-xs text-slate-400">
                    No tags logged yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Search filters + Daily Logs Feed */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Filter Dashboard Card */}
            <div className="glass-panel rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                
                {/* Search query input */}
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search logs by keyword..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                {/* Mood selection drop down */}
                <div className="relative min-w-[140px]">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                    <Filter className="h-4 w-4" />
                  </div>
                  <select
                    value={moodFilter}
                    onChange={(e) => setMoodFilter(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-10 pr-4 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">All Moods</option>
                    <option value="productive">Productive</option>
                    <option value="stuck">Stuck</option>
                    <option value="shipped">Shipped</option>
                  </select>
                </div>
              </div>

              {/* Tag filtering status info banner */}
              {(tagFilter || moodFilter || debouncedSearch) && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 px-4 py-2 border border-indigo-500/15">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-indigo-700 dark:text-indigo-400 font-semibold">
                    <span>Active Filters:</span>
                    {debouncedSearch && <span className="bg-indigo-500/15 dark:bg-indigo-500/20 px-2 py-0.5 rounded">Search: "{debouncedSearch}"</span>}
                    {moodFilter && <span className="bg-indigo-500/15 dark:bg-indigo-500/20 px-2 py-0.5 rounded uppercase">Mood: {moodFilter}</span>}
                    {tagFilter && <span className="bg-indigo-500/15 dark:bg-indigo-500/20 px-2 py-0.5 rounded">Tag: #{tagFilter}</span>}
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-xs font-bold text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <RefreshCcw className="h-3 w-3" />
                    <span>Clear All</span>
                  </button>
                </div>
              )}
            </div>

            {/* Daily Logs Feed List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-base">
                  <BookOpen className="h-4.5 w-4.5 text-indigo-500" />
                  <span>Journal Feed ({logs.length})</span>
                </h3>
              </div>

              {/* Loading Feed status */}
              {loadingLogs ? (
                <div className="space-y-4 py-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 space-y-3">
                      <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-4.5 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-3.5 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : logs.length > 0 ? (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <LogCard
                      key={log._id}
                      log={log}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteLog}
                      onTagClick={(tag) => setTagFilter(tag)} // dynamic interactive filter!
                    />
                  ))}
                </div>
              ) : (
                /* Empty Feed State */
                <div className="text-center py-16 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900/50 p-8 space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
                    <BookOpen className="h-7 w-7" />
                  </div>
                  <div className="max-w-xs mx-auto">
                    <h4 className="font-bold text-base text-slate-800 dark:text-white">No logs found</h4>
                    <p className="text-xs text-slate-400 mt-1.5">
                      {tagFilter || moodFilter || debouncedSearch 
                        ? "Try clearing your filters or updating your search query to see matching entries." 
                        : "You haven't added any log entries yet! Tap 'Write Daily Log' to write your first journal entry."}
                    </p>
                  </div>
                  {(tagFilter || moodFilter || debouncedSearch) && (
                    <button
                      onClick={clearFilters}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>

      </main>

      {/* Log Form editor overlay Modal */}
      {showFormModal && (
        <LogForm
          logToEdit={logToEdit}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowFormModal(false);
            setLogToEdit(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
