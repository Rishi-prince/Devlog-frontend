import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, Flame, Sparkles, BarChart2, Shield, Calendar, ArrowRight } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Terminal className="h-6 w-6 text-indigo-500" />,
      title: "Daily Developer Logs",
      description: "Document daily shipping notes, bug tracking, and configuration setups with inline markdown support."
    },
    {
      icon: <Flame className="h-6 w-6 text-orange-500" />,
      title: "Streak Tracking",
      description: "Keep the momentum alive. Monitor consecutive logging days with trophies and gamified rewards."
    },
    {
      icon: <Calendar className="h-6 w-6 text-cyan-500" />,
      title: "Activity Heatmap",
      description: "A GitHub-style contribution calendar mapping your programming consistency over the past 365 days."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-yellow-500" />,
      title: "AI Weekly Reviews",
      description: "Generate deep, automated recaps of your progress and blockers using Anthropic's Claude API."
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-purple-500" />,
      title: "Tag Analytics",
      description: "Visualize dominant mood statistics and tag frequencies using interactive charts."
    },
    {
      icon: <Shield className="h-6 w-6 text-emerald-500" />,
      title: "Secure Session Storage",
      description: "Encrypted password hashing and standard JWT authorization keeps your journal completely private."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0f19] bg-grid-pattern text-white">
      
      {/* Background radial soft glows */}
      <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-16 text-center lg:pt-32">
        {/* Glow announcement badge */}
        <div className="mx-auto mb-6 inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/5 px-4 py-1.5 text-xs font-semibold text-indigo-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>DevLog is portfolio-ready</span>
        </div>

        {/* Heading */}
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          Track Your Developer Journey.{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            Day by Day.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
          Log daily progress, reflect on developer moods, visualize coding consistency with a contribution heatmap, and leverage AI weekly recaps to optimize your learning velocity.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            to={user ? "/dashboard" : "/register"}
            className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.01]"
          >
            <span>{user ? "Go to Dashboard" : "Start Your Log"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          {!user && (
            <Link
              to="/login"
              className="rounded-xl border border-slate-700 bg-slate-900/50 hover:bg-slate-800 px-6 py-3.5 text-sm font-bold text-slate-350 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </section>

      {/* Interactive Mockup Preview */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="relative rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow-2xl backdrop-blur-md">
          {/* Windows title bar */}
          <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3 mb-4">
            <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
            <span className="h-3 w-3 rounded-full bg-green-500/80"></span>
            <span className="text-xs text-slate-500 font-mono pl-2">devlog://dashboard</span>
          </div>
          
          {/* Simulated dashboard view */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 lg:col-span-2 rounded-xl bg-slate-950/50 border border-slate-900 p-4">
              <div className="h-4 w-32 rounded bg-slate-800 animate-pulse mb-3"></div>
              <div className="grid grid-cols-7 gap-1 h-24 bg-slate-900/30 rounded-lg p-2">
                {Array.from({ length: 42 }).map((_, i) => (
                  <div key={i} className={`rounded-sm h-3 w-3 ${i % 7 === 0 ? 'bg-indigo-900/40' : i % 5 === 0 ? 'bg-indigo-500/80' : 'bg-slate-900'}`}></div>
                ))}
              </div>
            </div>
            
            <div className="col-span-3 lg:col-span-1 flex flex-col justify-between rounded-xl bg-slate-950/50 border border-slate-900 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
                <div>
                  <span className="block text-xs text-slate-500 uppercase tracking-wider font-semibold">Streak Status</span>
                  <span className="font-extrabold text-lg">12 Days Active</span>
                </div>
              </div>
              <div className="h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-xs font-bold text-indigo-400">
                ✨ Claude Summary Ready
              </div>
            </div>

            <div className="col-span-3 rounded-xl bg-slate-950/30 border border-slate-900 p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div className="h-4 w-40 rounded bg-slate-800 animate-pulse"></div>
                <div className="h-3.5 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20"></div>
              </div>
              <div className="h-2 w-full rounded bg-slate-800/60 animate-pulse"></div>
              <div className="h-2 w-3/4 rounded bg-slate-800/60 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-950/50 border-t border-slate-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Engineered for Developer Productivity
            </h2>
            <p className="mt-4 text-slate-400">
              DevLog gives you the structured insights you need to measure coding momentum.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-slate-900 bg-slate-900/20 p-6 transition-all duration-300 hover:border-slate-850 hover:bg-slate-900/40 hover:shadow-lg"
              >
                <div className="rounded-xl bg-slate-900/60 border border-slate-800 w-fit p-3 mb-4 group-hover:scale-105 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} DevLog. Built for developers tracking progress.</p>
      </footer>
    </div>
  );
};

export default Landing;
