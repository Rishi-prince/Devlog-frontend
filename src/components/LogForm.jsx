import React, { useState, useEffect } from 'react';
import { X, Code, ShieldCheck, HelpCircle, Save, Calendar, Tags } from 'lucide-react';

const LogForm = ({ logToEdit, onSubmit, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('productive');
  const [tagsInput, setTagsInput] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState({});

  // Sync state if editing an existing log
  useEffect(() => {
    if (logToEdit) {
      setTitle(logToEdit.title || '');
      setContent(logToEdit.content || '');
      setMood(logToEdit.mood || 'productive');
      setTagsInput(logToEdit.tags ? logToEdit.tags.join(', ') : '');
      
      // Keep date as YYYY-MM-DD
      if (logToEdit.date) {
        setDate(new Date(logToEdit.date).toISOString().split('T')[0]);
      }
    } else {
      // Clear form for new log
      setTitle('');
      setContent('');
      setMood('productive');
      setTagsInput('');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setErrors({});
  }, [logToEdit]);

  const validate = () => {
    const tempErrors = {};
    if (!title.trim()) tempErrors.title = 'Title is required';
    if (!content.trim()) tempErrors.content = 'Log details are required';
    if (!mood) tempErrors.mood = 'Please select a mood';
    if (!date) tempErrors.date = 'Please pick a date';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Parse comma separated tags
    const tagsArray = tagsInput
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0);

    const payload = {
      title: title.trim(),
      content: content.trim(),
      mood,
      tags: tagsArray,
      date: new Date(date + 'T00:00:00Z').toISOString() // force UTC
    };

    onSubmit(payload);
  };

  const moodOptions = [
    {
      value: 'productive',
      label: 'Productive',
      icon: <Code className="h-5 w-5" />,
      colorClass: 'border-purple-500/30 text-purple-600 bg-purple-500/5 hover:bg-purple-500/10',
      activeClass: 'border-purple-500 bg-purple-500/20 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/50'
    },
    {
      value: 'stuck',
      label: 'Stuck',
      icon: <HelpCircle className="h-5 w-5" />,
      colorClass: 'border-orange-500/30 text-orange-600 bg-orange-500/5 hover:bg-orange-500/10',
      activeClass: 'border-orange-500 bg-orange-500/20 text-orange-700 dark:text-orange-300 ring-2 ring-orange-500/50'
    },
    {
      value: 'shipped',
      label: 'Shipped',
      icon: <ShieldCheck className="h-5 w-5" />,
      colorClass: 'border-emerald-500/30 text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500/10',
      activeClass: 'border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/50'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {logToEdit ? '✏️ Edit Log Entry' : '📝 New Log Entry'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Log Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you working on today?"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 ${errors.title ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'}`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Log Date</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            />
            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
          </div>

          {/* Mood Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Mood / Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              {moodOptions.map((opt) => {
                const isActive = mood === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setMood(opt.value)}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-2 rounded-xl border p-3.5 text-sm font-medium transition-all duration-200 ${isActive ? opt.activeClass : opt.colorClass}`}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.mood && <p className="text-xs text-red-500 mt-1">{errors.mood}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tags className="h-4 w-4 text-slate-400" />
              <span>Tags (comma separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. react, api-crud, bugs, css"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            />
          </div>

          {/* Content Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Log Details
              </label>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                Supports markdown style: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">**bold**</code> and <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">`code`</code>
              </span>
            </div>
            <textarea
              rows="6"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What did you build today? What hurdles did you face?"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-y font-normal leading-relaxed ${errors.content ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'}`}
            ></textarea>
            {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
          </div>

          {/* Action Footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all duration-200"
            >
              <Save className="h-4 w-4" />
              <span>{logToEdit ? 'Update Log' : 'Save Log'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogForm;
