import React from 'react';
import { Edit2, Trash2, Code, ShieldCheck, HelpCircle, Calendar, Hash } from 'lucide-react';

// Light-weight custom Markdown parser for code snippets and bold text
const renderMarkdown = (text) => {
  if (!text) return '';
  
  // Escaping HTML tags to prevent XSS
  let escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold text: **text**
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Code block: `code`
  escaped = escaped.replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-slate-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded font-mono text-xs">$1</code>');

  // Convert newlines to breaks
  escaped = escaped.replace(/\n/g, '<br />');

  return <div dangerouslySetInnerHTML={{ __html: escaped }} />;
};

const LogCard = ({ log, onEdit, onDelete, onTagClick }) => {
  const { _id, title, content, mood, tags, date } = log;

  // Format date to local readable format
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC' // Keep consistent with database
  });

  // Mood configuration styles
  const moodConfigs = {
    productive: {
      bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      icon: <Code className="h-3.5 w-3.5" />,
      label: 'Productive'
    },
    stuck: {
      bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
      icon: <HelpCircle className="h-3.5 w-3.5" />,
      label: 'Stuck'
    },
    shipped: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      label: 'Shipped'
    }
  };

  const currentMood = moodConfigs[mood] || moodConfigs.productive;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-md hover:shadow-indigo-500/5 animate-fade-in">
      
      {/* Top Section: Date & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{formattedDate}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(log)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            title="Edit Log"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(_id)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-500 dark:hover:bg-red-500/20 transition-colors"
            title="Delete Log"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-3 text-lg font-bold text-slate-800 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-200">
        {title}
      </h3>

      {/* Mood pill */}
      <div className="mt-2 flex">
        <span className={`inline-flex items-center space-x-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${currentMood.bg}`}>
          {currentMood.icon}
          <span>{currentMood.label}</span>
        </span>
      </div>

      {/* Content body */}
      <div className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {renderMarkdown(content)}
      </div>

      {/* Tag Chips */}
      {tags && tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <button
              key={i}
              onClick={() => onTagClick && onTagClick(tag)}
              className="inline-flex items-center space-x-0.5 rounded-lg bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/20 hover:bg-indigo-500/5 hover:text-indigo-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 transition-all duration-200"
            >
              <Hash className="h-3 w-3 text-slate-400 group-hover:text-indigo-400" />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogCard;
