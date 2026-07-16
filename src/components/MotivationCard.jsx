import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RefreshCw, Zap, Quote, CheckCircle2, Copy, Check, Terminal,
  Code2, FileText, Trash2, Heart, ShieldCheck, Palette, Coffee, Bug, Plus 
} from 'lucide-react';
import { triggerConfetti } from '../api/confettiHelper';

const quotes = [
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Clean code always looks like it was written by someone who cares.", author: "Michael Feathers" },
  { text: "Problems are not stop signs, they are guidelines.", author: "Robert H. Schuller" },
  { text: "Every great developer you know got there by solving problems they were unqualified to solve.", author: "Patrick McKenzie" },
  { text: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" }
];

const jokes = [
  { setup: "Why do programmers wear glasses?", punchline: "Because they can't C#." },
  { setup: "How many programmers does it take to change a light bulb?", punchline: "None, that's a hardware problem." },
  { setup: "A SQL query goes into a bar, walks up to two tables and asks...", punchline: "\"Can I join you?\"" },
  { setup: "['hip', 'hip']", punchline: "hip hip array!" },
  { setup: "There are 10 types of people in the world...", punchline: "Those who understand binary, and those who don't." },
  { setup: "Why did the programmer quit their job?", punchline: "Because they didn't get arrays." }
];

const challenges = [
  { task: "Refactor a complex helper function or conditional statement.", type: "code" },
  { task: "Write or update documentation for one of your features.", type: "doc" },
  { task: "Delete 3 unused variables, files, or packages.", type: "clean" },
  { task: "Do a 5-minute offline stretch or hydration break.", type: "wellness" },
  { task: "Test one negative path/edge case in your API or frontend.", type: "test" },
  { task: "Improve the styling or interactive hover state of a component.", type: "ui" }
];

const getQuestIcon = (type) => {
  switch (type) {
    case 'code':
      return <Code2 className="h-3.5 w-3.5" />;
    case 'doc':
      return <FileText className="h-3.5 w-3.5" />;
    case 'clean':
      return <Trash2 className="h-3.5 w-3.5" />;
    case 'wellness':
      return <Heart className="h-3.5 w-3.5 fill-current/10" />;
    case 'test':
      return <ShieldCheck className="h-3.5 w-3.5" />;
    case 'ui':
      return <Palette className="h-3.5 w-3.5" />;
    default:
      return <Zap className="h-3.5 w-3.5" />;
  }
};

const MotivationCard = () => {
  const [activeTab, setActiveTab] = useState('wisdom'); // 'wisdom' or 'joke'
  const [quoteIdx, setQuoteIdx] = useState(Math.floor(Math.random() * quotes.length));
  const [jokeIdx, setJokeIdx] = useState(Math.floor(Math.random() * jokes.length));
  const [challengeIdx, setChallengeIdx] = useState(Math.floor(Math.random() * challenges.length));
  const [isSpinning, setIsSpinning] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);
  const [punchlineRevealed, setPunchlineRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get date in YYYY-MM-DD format for daily resets
  const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  };

  // State for daily counters (Coffee, Bugs fixed)
  const [coffeeCount, setCoffeeCount] = useState(() => {
    const savedDate = localStorage.getItem('devlog-counter-date');
    const today = getTodayString();
    if (savedDate !== today) {
      localStorage.setItem('devlog-counter-date', today);
      localStorage.setItem('devlog-coffee', '0');
      return 0;
    }
    const saved = localStorage.getItem('devlog-coffee');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [bugCount, setBugCount] = useState(() => {
    const savedDate = localStorage.getItem('devlog-counter-date');
    const today = getTodayString();
    if (savedDate !== today) {
      localStorage.setItem('devlog-counter-date', today);
      localStorage.setItem('devlog-bugs', '0');
      return 0;
    }
    const saved = localStorage.getItem('devlog-bugs');
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleAddCoffee = () => {
    const nextVal = coffeeCount + 1;
    setCoffeeCount(nextVal);
    localStorage.setItem('devlog-coffee', nextVal.toString());
  };

  const handleSquashBug = () => {
    const nextVal = bugCount + 1;
    setBugCount(nextVal);
    localStorage.setItem('devlog-bugs', nextVal.toString());
    triggerConfetti(); // Playful reward!
  };

  const handleRefresh = () => {
    setIsSpinning(true);
    setPunchlineRevealed(false);
    setTimeout(() => {
      setQuoteIdx(Math.floor(Math.random() * quotes.length));
      setJokeIdx(Math.floor(Math.random() * jokes.length));
      setChallengeIdx(Math.floor(Math.random() * challenges.length));
      setChallengeDone(false);
      setIsSpinning(false);
    }, 600);
  };

  const handleCopy = () => {
    const textToCopy = activeTab === 'wisdom' 
      ? `"${quotes[quoteIdx].text}" — ${quotes[quoteIdx].author}`
      : `Setup: ${jokes[jokeIdx].setup}\nPunchline: ${jokes[jokeIdx].punchline}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleChallenge = () => {
    const nextVal = !challengeDone;
    setChallengeDone(nextVal);
    if (nextVal) {
      triggerConfetti();
    }
  };

  const currentQuote = quotes[quoteIdx];
  const currentJoke = jokes[jokeIdx];
  const currentChallenge = challenges[challengeIdx];

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-sm border border-indigo-500/10 dark:border-indigo-500/5 relative overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Background glow decorator */}
      <div className="absolute -left-12 -bottom-12 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base leading-none">
              Daily Inspiration
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1 block">
              {activeTab === 'wisdom' ? "Code Wisdom" : "Dev Humour"}
            </span>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="rounded-lg border border-slate-200 dark:border-slate-800 p-1.5 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          title="Refresh Daily Dose"
        >
          <RefreshCw className={`h-4 w-4 ${isSpinning ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-slate-100/80 dark:bg-slate-900/60 rounded-xl mb-4 relative border border-slate-200/20 dark:border-slate-800/30">
        <button
          onClick={() => { setActiveTab('wisdom'); setPunchlineRevealed(false); }}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-205 cursor-pointer ${
            activeTab === 'wisdom'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm border border-slate-100 dark:border-slate-700/50'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Quote className="h-3.5 w-3.5" />
          <span>Wisdom</span>
        </button>
        <button
          onClick={() => { setActiveTab('joke'); setPunchlineRevealed(false); }}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-205 cursor-pointer ${
            activeTab === 'joke'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm border border-slate-100 dark:border-slate-700/50'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>Dev Joke</span>
        </button>
      </div>

      {/* Quote / Joke Body */}
      <div className="min-h-[145px] flex flex-col justify-center">
        {activeTab === 'wisdom' ? (
          <div className="relative p-5 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/5 border border-indigo-500/10 dark:border-indigo-500/5 overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-300">
              <Quote className="h-20 w-20 text-indigo-500" />
            </div>
            <p className="text-sm md:text-base font-semibold text-slate-850 dark:text-slate-100 leading-relaxed relative z-10">
              "{currentQuote.text}"
            </p>
            <div className="mt-4 flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-2">
                <span className="h-[2px] w-4 bg-indigo-500 dark:bg-indigo-400 rounded"></span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {currentQuote.author}
                </span>
              </div>
              
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                title="Copy quote"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ) : (
          <div className="relative p-5 rounded-2xl bg-slate-950 border border-slate-850 dark:border-slate-800 font-mono text-xs overflow-hidden select-none group">
            {/* Terminal top header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-3 text-[10px] text-slate-500 uppercase tracking-widest">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              </div>
              <span>joke_compiler.sh</span>
            </div>

            <div className="space-y-4">
              {/* Question / Setup */}
              <div className="flex items-start space-x-2">
                <span className="text-indigo-400 font-bold shrink-0">$ query --joke</span>
                <p className="text-slate-200 font-semibold leading-relaxed">
                  {currentJoke.setup}
                </p>
              </div>

              {/* Punchline or Reveal Button */}
              {punchlineRevealed ? (
                <div className="flex items-start space-x-2 animate-fade-in pt-3 border-t border-slate-900">
                  <span className="text-emerald-400 font-bold shrink-0">&gt; response:</span>
                  <p className="text-cyan-400 font-extrabold text-sm leading-relaxed tracking-wide">
                    {currentJoke.punchline}
                  </p>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-900 flex justify-center">
                  <button
                    onClick={() => setPunchlineRevealed(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl font-sans font-bold text-xs shadow-md shadow-indigo-950/50 hover:shadow-indigo-500/20 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    <span>Reveal Punchline</span>
                    <span>🤫</span>
                  </button>
                </div>
              )}
            </div>

            {/* Copy button only when revealed */}
            {punchlineRevealed && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleCopy}
                  className="p-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-450 hover:text-white transition-colors cursor-pointer"
                  title="Copy joke"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Daily Quest Section */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center space-x-1.5 text-amber-500 mb-2.5">
          <Zap className="h-4.5 w-4.5 fill-amber-500/20" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Daily Micro-Quest
          </span>
        </div>
        
        <div className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all duration-300 ${
          challengeDone 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-500/5' 
            : 'bg-gradient-to-br from-slate-50/80 to-slate-100/40 dark:from-slate-950/40 dark:to-slate-900/20 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-355 hover:border-indigo-500/20 dark:hover:border-indigo-500/10'
        }`}>
          <div className="flex-1 space-y-1.5">
            <p className={`text-xs font-semibold leading-relaxed ${challengeDone ? 'line-through opacity-60 text-slate-400 dark:text-slate-500' : ''}`}>
              {currentChallenge.task}
            </p>
            <span className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
              challengeDone
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                : 'bg-indigo-500/10 text-indigo-650 dark:text-indigo-400'
            }`}>
              {getQuestIcon(currentChallenge.type)}
              <span>{currentChallenge.type}</span>
            </span>
          </div>
          <button
            onClick={handleToggleChallenge}
            className={`shrink-0 rounded-lg p-0.5 transition-all duration-200 active:scale-90 cursor-pointer ${
              challengeDone ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500 dark:text-slate-700 hover:scale-105'
            }`}
            title={challengeDone ? "Uncheck quest" : "Complete quest"}
          >
            <CheckCircle2 className="h-5.5 w-5.5 fill-current bg-white dark:bg-slate-900 rounded-full shadow-sm" />
          </button>
        </div>
      </div>

      {/* Daily Fuel Clickers */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center space-x-1.5 text-indigo-500 dark:text-indigo-400 mb-3">
          <Coffee className="h-4.5 w-4.5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Daily Developer Fuel
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Coffee Counter */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="text-xl">☕</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-none">Coffee</span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-white mt-1">{coffeeCount}</span>
              </div>
            </div>
            <button
              onClick={handleAddCoffee}
              className="p-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 active:scale-90 transition-all cursor-pointer"
              title="Add cup"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Bug squasher Counter */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🐛</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-none">Bugs Fixed</span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-white mt-1">{bugCount}</span>
              </div>
            </div>
            <button
              onClick={handleSquashBug}
              className="p-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 active:scale-90 transition-all cursor-pointer"
              title="Squash bug"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotivationCard;
