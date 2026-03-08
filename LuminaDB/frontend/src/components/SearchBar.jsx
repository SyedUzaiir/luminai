import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto -mt-8 relative z-10">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-brand-accent transition-colors group-hover:text-blue-600" />
        </div>
        
        <input
          type="text"
          className="glass block w-full pl-12 pr-32 py-4 rounded-2xl border-white/40 dark:border-slate-700/50 text-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent/50 transition-all placeholder-slate-400 dark:placeholder-slate-500 bg-white/60 dark:text-white"
          placeholder="Try 'Show me the top 3 most expensive electronics'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex items-center gap-2 bg-brand-accent hover:bg-blue-600 text-white px-5 py-2 rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <span className="animate-pulse">Thinking...</span>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Search DB</span>
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs font-medium">
        <span className="hidden sm:inline text-slate-400 dark:text-slate-500 mt-1.5 mr-1 transition-colors">Suggestions:</span>
        <button 
          onClick={() => { setQuery("Show products under 500"); onSearch("Show products under 500"); }} 
          className="bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-brand-accent dark:hover:text-blue-400 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
        >
          Show products under 500
        </button>
        <button 
          onClick={() => { setQuery("Find electronic products"); onSearch("Find electronic products"); }} 
          className="bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-brand-accent dark:hover:text-blue-400 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
        >
          Find electronic products
        </button>
        <button 
          onClick={() => { setQuery("List all admin users"); onSearch("List all admin users"); }} 
          className="bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-brand-accent dark:hover:text-blue-400 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
        >
          List all admin users
        </button>
        <button 
          onClick={() => { setQuery("Show orders above 1000"); onSearch("Show orders above 1000"); }} 
          className="bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-brand-accent dark:hover:text-blue-400 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
        >
          Show orders above 1000
        </button>
      </div>
    </div>
  );
}
