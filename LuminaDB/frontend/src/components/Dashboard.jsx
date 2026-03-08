import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Activity } from 'lucide-react';
import SearchBar from './SearchBar';
import ResultsTable from './ResultsTable';
import DataVisualizer from './DataVisualizer';
import ThemeToggle from './ThemeToggle';
import { Clock } from 'lucide-react';

export default function Dashboard() {
  const [results, setResults] = useState(null);
  const [mql, setMql] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // History state
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('luminadb_history');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSearch = async (prompt) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setMql(null);
    
    // Save to history (avoid exact duplicates consecutively)
    setHistory(prev => {
      const newHistory = [prompt, ...prev.filter(p => p !== prompt)].slice(0, 10);
      localStorage.setItem('luminadb_history', JSON.stringify(newHistory));
      return newHistory;
    });

    try {
      const response = await axios.post('http://localhost:5000/api/query', { prompt });
      setMql(response.data.mql);
      setResults(response.data.results);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'An error occurred during query translation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300 flex flex-col relative">
      <ThemeToggle />
      
      {/* Background Decorators */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/80 dark:from-slate-800/80 to-transparent transition-colors duration-300" />
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-10" />
        <div className="absolute top-[10%] left-[-5%] w-72 h-72 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-10" />
      </div>
      
      {/* Header */}
      <header className="pt-20 pb-16 px-6 text-center relative z-10 w-full">
        <div className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 px-4 py-1.5 rounded-full shadow-sm text-sm font-medium text-brand-accent dark:text-blue-400 mb-6 border border-blue-100 dark:border-slate-700 transition-colors">
           <Activity className="h-4 w-4" />
           <span>Retail Operations Analytics</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 flex justify-center items-center gap-4 transition-colors">
          LuminaDB <Sparkles className="h-10 w-10 text-brand-accent dark:text-blue-400" />
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed transition-colors">
          Query your MongoDB cluster using plain English. Type a request below to auto-generate valid MQL and see the results instantly.
        </p>
      </header>

      {/* Layout Wrapper */}
      <div className="flex max-w-[1400px] mx-auto w-full items-start relative z-10 px-4">
        
        {/* Main Content */}
        <main className="flex-1 w-full max-w-5xl mx-auto pb-24">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        {/* Error Toast */}
        {error && (
          <div className="max-w-3xl mx-auto mt-8 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm animate-in fade-in slide-in-from-bottom-4 transition-colors">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
            <div className="lg:col-span-1 h-64 bg-slate-200/50 dark:bg-slate-700/50 rounded-2xl transition-colors" />
            <div className="lg:col-span-2 h-96 bg-slate-200/50 dark:bg-slate-700/50 rounded-2xl transition-colors" />
          </div>
        )}

        {/* Results */}
        {!isLoading && mql && results && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both">
            <ResultsTable mql={mql} results={results} />
            <div className="w-full max-w-6xl mx-auto">
               <DataVisualizer results={results} collectionName={mql.collection} />
            </div>
          </div>
        )}
        </main>
        
        {/* Query History Sidebar (Sticky & Scrollable) */}
        <aside className="hidden xl:block w-80 shrink-0 ml-8">
          <div className="sticky top-8 flex flex-col h-fit max-h-[calc(100vh-64px)] z-20 transition-all duration-300">
            <div className="bg-white/50 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200 font-semibold border-b border-slate-100 dark:border-slate-700 pb-3">
                <Clock className="w-4 h-4 text-brand-accent dark:text-blue-400" />
                Recent Queries
              </div>
              <div className="overflow-y-auto flex-grow custom-scrollbar pr-1">
                {history.length === 0 ? (
                   <p className="text-xs text-slate-400 dark:text-slate-500 italic">No recent queries.</p>
                ) : (
                  <ul className="space-y-2">
                    {history.map((h, i) => (
                      <li key={i}>
                        <button 
                          onClick={() => handleSearch(h)}
                          className="text-left w-full text-sm text-slate-600 dark:text-slate-300 hover:text-brand-accent dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700/50 p-2 rounded-lg transition-colors truncate block relative group overflow-hidden"
                          title={h}
                        >
                          <span className="relative z-10">{h}</span>
                          <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

    </div>
  );
}
