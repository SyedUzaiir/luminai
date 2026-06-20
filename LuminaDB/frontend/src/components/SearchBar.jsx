import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  { text: 'Find electronic products', display: '⚡ Find electronic products' },
  { text: 'List all admin users', display: '👤 Show all admin users' },
  { text: 'Find all pending orders with an amount greater than 1000', display: '📦 Orders above ₹1000' },
  { text: 'Show products under 500', display: '💰 Products under ₹500' },
  { text: 'What are the top 3 most expensive products?', display: '📈 Top 3 expensive products' }
];

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative z-10 px-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 dark:text-slate-500 transition-colors group-hover:text-blue-500" />
        </div>
        
        <input
          type="text"
          className="glass block w-full h-[60px] pl-14 pr-52 rounded-full border-slate-200/60 dark:border-slate-800/80 text-base shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500/35 focus:border-blue-500/60 transition-all duration-300 placeholder-slate-400 dark:placeholder-slate-500 bg-white/70 dark:bg-slate-900/60 dark:text-white"
          placeholder="Try 'Show me the top 3 most expensive electronics'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        
        <div className="absolute inset-y-0 right-3 flex items-center">
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 h-[44px] rounded-full transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.4)] active:scale-95 cursor-pointer text-sm"
          >
            {isLoading ? (
              <span className="animate-pulse flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </span>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-blue-200" />
                <span>✨ Generate & Execute</span>
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-5 flex flex-wrap gap-2 justify-center text-xs font-semibold px-2">
        <span className="text-slate-450 dark:text-slate-500 self-center mr-1 font-bold text-[10px] uppercase tracking-wider">Suggestions:</span>
        {SUGGESTIONS.map((chip, idx) => (
          <button 
            key={idx}
            type="button"
            onClick={() => { setQuery(chip.text); onSearch(chip.text); }}
            disabled={isLoading}
            className="bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700/80 text-slate-650 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 px-3.5 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/80 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_15px_rgba(37,99,235,0.08)] dark:hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] cursor-pointer"
          >
            {chip.display}
          </button>
        ))}
      </div>
    </div>
  );
}
