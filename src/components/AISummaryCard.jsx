import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Sparkles, RefreshCw, AlertCircle, Calendar } from 'lucide-react';

// Light-weight Markdown parser for summary response
const formatSummary = (markdownText) => {
  if (!markdownText) return '';

  let html = markdownText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers: ### text -> <h4>, #### text -> <h5>
  html = html.replace(/### (.*?)\n/g, '<h4 class="text-sm font-bold text-slate-800 dark:text-white mt-4 mb-2 flex items-center gap-1.5">$1</h4>');
  html = html.replace(/#### (.*?)\n/g, '<h5 class="text-xs font-bold uppercase tracking-wider text-indigo-500 mt-3 mb-1.5">$1</h5>');

  // Bullet points: - text or * text
  html = html.replace(/^\- (.*?)$/gm, '<li class="ml-4 list-disc text-sm text-slate-600 dark:text-slate-350 py-0.5">$1</li>');
  html = html.replace(/^\* (.*?)$/gm, '<li class="ml-4 list-disc text-sm text-slate-600 dark:text-slate-350 py-0.5">$1</li>');

  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-800 dark:text-slate-200">$1</strong>');

  // Inline code: `code`
  html = html.replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-slate-800 text-pink-600 dark:text-pink-400 px-1 py-0.5 rounded font-mono text-xs">$1</code>');

  // Paragraph breaks
  html = html.replace(/\n\n/g, '<div class="h-3"></div>');
  html = html.replace(/\n/g, '<br />');

  return <div className="space-y-1.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
};

const AISummaryCard = () => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    setLoading(true);
    setError('');
    setSummary('');
    try {
      const res = await axiosInstance.post('/ai/summary');
      if (res.data.success) {
        setSummary(res.data.summary);
      } else {
        setError('Could not generate weekly summary');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while connecting to AI service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-sm border border-indigo-500/10 dark:border-indigo-500/5 relative overflow-hidden transition-all duration-300 hover:shadow-md">
      
      {/* Background soft glow decoration */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-indigo-500/15 p-2 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              AI Weekly Recap
            </h3>
            <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <Calendar className="h-3 w-3" />
              Past 7 days analysis
            </span>
          </div>
        </div>

        {summary && !loading && (
          <button
            onClick={fetchSummary}
            className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Regenerate</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="mt-4">
        {!summary && !loading && !error && (
          <div className="text-center py-6 space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Get an automated, intelligent analysis of your logging activity over the past week to highlight achievements and focus areas.
            </p>
            <button
              onClick={fetchSummary}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/15 transition-all duration-200 hover:scale-[1.01]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Summarize My Week</span>
            </button>
          </div>
        )}

        {/* Loading Pulse */}
        {loading && (
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <div className="flex space-x-2">
              <div className="h-3.5 w-3.5 animate-bounce rounded-full bg-indigo-500" style={{ animationDelay: '0ms' }}></div>
              <div className="h-3.5 w-3.5 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: '150ms' }}></div>
              <div className="h-3.5 w-3.5 animate-bounce rounded-full bg-indigo-300" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 animate-pulse font-medium">
              Claude is analyzing your logs and synthesizing metrics...
            </p>
          </div>
        )}

        {/* Error panel */}
        {error && (
          <div className="flex items-start space-x-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <h5 className="font-bold text-sm">Failed to generate summary</h5>
              <p className="text-xs text-red-500/80 dark:text-red-400/80 mt-0.5">{error}</p>
              <button
                onClick={fetchSummary}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold border-b border-red-500 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* AI Summary Display */}
        {summary && !loading && (
          <div className="bg-slate-50/50 dark:bg-slate-950/30 rounded-xl p-4 border border-slate-100 dark:border-slate-800/40 text-slate-700 dark:text-slate-300">
            {formatSummary(summary)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AISummaryCard;
