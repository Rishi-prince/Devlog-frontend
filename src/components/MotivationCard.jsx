import React, { useState } from 'react';
import { Sparkles, RefreshCw, Zap, Quote, CheckCircle2 } from 'lucide-react';

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
  "Why do programmers wear glasses? Because they can't C#.",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "A SQL query goes into a bar, walks up to two tables and asks, 'Can I join you?'",
  "['hip', 'hip'] — hip hip array!",
  "There are 10 types of people: those who understand binary, and those who don't.",
  "Why did the programmer quit their job? Because they didn't get arrays."
];

const challenges = [
  { task: "Refactor a complex helper function or conditional statement.", type: "code" },
  { task: "Write or update documentation for one of your features.", type: "doc" },
  { task: "Delete 3 unused variables, files, or packages.", type: "clean" },
  { task: "Do a 5-minute offline stretch or hydration break.", type: "wellness" },
  { task: "Test one negative path/edge case in your API or frontend.", type: "test" },
  { task: "Improve the styling or interactive hover state of a component.", type: "ui" }
];

const MotivationCard = () => {
  const [quoteIdx, setQuoteIdx] = useState(Math.floor(Math.random() * quotes.length));
  const [jokeIdx, setJokeIdx] = useState(Math.floor(Math.random() * jokes.length));
  const [challengeIdx, setChallengeIdx] = useState(Math.floor(Math.random() * challenges.length));
  const [showJoke, setShowJoke] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);

  const handleRefresh = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setQuoteIdx(Math.floor(Math.random() * quotes.length));
      setJokeIdx(Math.floor(Math.random() * jokes.length));
      setChallengeIdx(Math.floor(Math.random() * challenges.length));
      setChallengeDone(false);
      setIsSpinning(false);
    }, 600);
  };

  const currentQuote = quotes[quoteIdx];
  const currentJoke = jokes[jokeIdx];
  const currentChallenge = challenges[challengeIdx];

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-sm border border-indigo-500/10 dark:border-indigo-500/5 relative overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Background glow decorator */}
      <div className="absolute -left-12 -bottom-12 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-600 dark:text-cyan-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Daily Inspiration
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {showJoke ? "Dev Humour" : "Code Wisdom"}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setShowJoke(!showJoke)}
            className="text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:underline px-2 py-1"
          >
            {showJoke ? "Read Quote" : "Tell Joke"}
          </button>
          <button
            onClick={handleRefresh}
            className="rounded-lg border border-slate-200 dark:border-slate-800 p-1.5 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
            title="Refresh Daily Dose"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quote / Joke Body */}
      <div className="mt-4 min-h-[90px] flex flex-col justify-center">
        {showJoke ? (
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-350 italic leading-relaxed">
              "{currentJoke}"
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative">
              <Quote className="absolute -top-3.5 -left-2.5 h-7 w-7 text-indigo-500/10" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-250 pl-5 leading-relaxed">
                {currentQuote.text}
              </p>
            </div>
            <span className="block text-right text-xs font-semibold text-slate-400 pl-5">
              — {currentQuote.author}
            </span>
          </div>
        )}
      </div>

      {/* Daily Quest Section */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center space-x-1.5 text-amber-500 mb-2">
          <Zap className="h-4.5 w-4.5 fill-amber-500/20" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Daily Micro-Quest
          </span>
        </div>
        
        <div className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-all ${challengeDone ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-200/60 dark:border-slate-850 text-slate-600 dark:text-slate-300'}`}>
          <p className={`text-xs font-medium leading-relaxed ${challengeDone ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
            {currentChallenge.task}
          </p>
          <button
            onClick={() => setChallengeDone(!challengeDone)}
            className={`shrink-0 rounded-lg p-0.5 transition-colors ${challengeDone ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500 dark:text-slate-700'}`}
            title={challengeDone ? "Uncheck quest" : "Complete quest"}
          >
            <CheckCircle2 className="h-5 w-5 fill-current bg-white dark:bg-slate-900 rounded-full" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MotivationCard;
