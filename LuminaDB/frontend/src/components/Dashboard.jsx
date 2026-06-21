import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Activity, Clock, Github, Linkedin, ExternalLink, Info } from 'lucide-react';
import SearchBar from './SearchBar';
import ResultsTable from './ResultsTable';
import DataVisualizer from './DataVisualizer';
import ThemeToggle from './ThemeToggle';
import AILoader from './AILoader';
import StatusCard from './StatusCard';
import AboutModal from './AboutModal';

export default function Dashboard() {
  const [results, setResults] = useState(null);
  const [mql, setMql] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  // Tick state to force re-render relative timestamps
  const [timeTick, setTimeTick] = useState(0);
  
  // History state stores objects: [{ text, timestamp }]
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('luminadb_history');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map(item => {
        if (typeof item === 'string') {
          return { text: item, timestamp: Date.now() - 300000 };
        }
        return item;
      });
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTick(t => t + 1);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'recently';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 45) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return 'yesterday';
  };

  const handleSearch = async (prompt) => {
    const startTime = Date.now();
    setIsLoading(true);
    setError(null);
    setResults(null);
    setMql(null);
    
    // Save to history as objects
    setHistory(prev => {
      const newHistory = [
        { text: prompt, timestamp: Date.now() },
        ...prev.filter(item => (typeof item === 'object' ? item.text : item) !== prompt)
      ].slice(0, 6);
      localStorage.setItem('luminadb_history', JSON.stringify(newHistory));
      return newHistory;
    });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/query`, { prompt });
      
      // Enforce a minimum display duration of 3.5 seconds for the loader steps
      const elapsed = Date.now() - startTime;
      const minDelay = 3500;
      if (elapsed < minDelay) {
        await new Promise(r => setTimeout(r, minDelay - elapsed));
      }

      setMql(response.data.mql);
      setResults(response.data.results);
    } catch (err) {
      // Enforce delay on errors too to prevent flashing
      const elapsed = Date.now() - startTime;
      const minDelay = 3500;
      if (elapsed < minDelay) {
        await new Promise(r => setTimeout(r, minDelay - elapsed));
      }
      setError(err.response?.data?.error || err.message || 'An error occurred during query translation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300 flex flex-col relative">
      
      {/* 1. Top Navigation Navbar */}
      <nav className="fixed top-0 inset-x-0 h-16 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/40 dark:border-slate-800/40 z-50 flex items-center justify-between px-6 transition-all duration-300">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 rounded-lg shadow-sm">
            <Sparkles className="h-4 w-4 text-white animate-pulse" />
          </div>
          <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-xs uppercase">LuminaDB</span>
        </div>
        
        <div className="flex items-center gap-3">
          <StatusCard />
          <ThemeToggle />
          
          <button
            onClick={() => setIsAboutOpen(true)}
            className="p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-350 transition-all duration-200 cursor-pointer"
            title="About This Project"
          >
            <Info className="w-4 h-4" />
          </button>
          
          <div className="h-4 w-px bg-slate-200/60 dark:bg-slate-800/60" />
          
          <a 
            href="https://github.com/SyedUzaiir/luminai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-bold text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-all duration-200 flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GitHub ↗</span>
          </a>
          
          <a 
            href="https://www.linkedin.com/in/syed-uzair-mohiuddin/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-bold text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-all duration-200 flex items-center gap-1.5"
          >
            <Linkedin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">LinkedIn ↗</span>
          </a>
        </div>
      </nav>

      {/* About Modal Dialog */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Background Decorators */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-blue-50/30 dark:from-slate-800/10 to-transparent transition-colors duration-300" />
        <div className="absolute top-[8%] right-[-5%] w-96 h-96 bg-blue-500/10 dark:bg-blue-650/5 rounded-full filter blur-3xl" />
        <div className="absolute top-[25%] left-[-5%] w-96 h-96 bg-indigo-500/10 dark:bg-indigo-650/5 rounded-full filter blur-3xl" />
      </div>

      {/* Main Container Wrapper */}
      <div className="flex-grow w-full max-w-[1400px] mx-auto px-6 pt-24 pb-16 relative z-10 flex flex-col gap-8">
        
        {/* TOP SECTION GRID: Search / Suggestions (Left) + Analytics (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Left Column: Hero Copy + SearchBar + History */}
          <div className="lg:col-span-2 flex flex-col justify-between py-1.5">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-blue-500/10 dark:bg-blue-400/10 px-3 py-1 rounded-full text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 border border-blue-500/20 dark:border-blue-400/20">
                <Activity className="h-3 w-3 animate-pulse" />
                <span>MongoDB Query Interface</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
                LuminaDB
              </h1>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">
                Natural Language → MongoDB Query Engine
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400/90 max-w-xl leading-relaxed mb-4 font-semibold">
                Query your MongoDB database using plain English. LuminaDB automatically translates your request into MongoDB Query Language (MQL), executes it against your database, and visualizes the results instantly.
              </p>
            </div>

            <SearchBar onSearch={handleSearch} isLoading={isLoading} />

            {/* Recent Queries block */}
            <div className="mt-6 bg-white/20 dark:bg-slate-800/20 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-4 max-w-3xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-2.5 text-[10px] font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200/30 dark:border-slate-700/30 pb-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>🕒 Recent Queries</span>
              </div>
              {history.length === 0 ? (
                <p className="text-xs text-slate-450 dark:text-slate-500 italic">No recent queries run.</p>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-16 overflow-y-auto custom-scrollbar">
                  {history.map((h, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSearch(h.text)}
                      className="text-[10px] font-bold bg-white/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200/50 dark:border-slate-800/80 transition-all duration-200 cursor-pointer flex items-center gap-1.5 hover:scale-102 active:scale-98"
                      title={h.text}
                    >
                      <span className="truncate max-w-[200px]">{h.text}</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-550 font-medium">({formatTimeAgo(h.timestamp)})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Analytics Chart (Always Visible, Placeholder when empty) */}
          <div className="lg:col-span-1 flex flex-col justify-center">
            <DataVisualizer results={results} collectionName={mql?.collection} />
          </div>

        </div>

        {/* BOTTOM SECTION: Loading state OR initial empty state OR results visualization */}
        <div className="w-full">
          {isLoading ? (
            <AILoader />
          ) : !mql && !results ? (
            /* Premium Interactive Initial Empty State */
            <div className="max-w-2xl mx-auto mt-4 bg-white/30 dark:bg-slate-800/30 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col items-center text-center">
                <span className="text-4xl mb-3 animate-bounce">✨</span>
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mb-1.5">Ask anything about your MongoDB database</h3>
                <p className="text-xs text-slate-450 dark:text-slate-500 max-w-sm leading-relaxed mb-6 font-semibold">
                  Enter queries in plain English. LuminaDB parses your text, translates it into valid MQL syntax, and pulls matching rows from your cluster.
                </p>
                
                <div className="w-full text-left bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl p-4.5 border border-slate-250/20 dark:border-slate-800/60 max-w-lg">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2.5">
                    Example Queries
                  </h4>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-600 dark:text-slate-350">
                    <li className="flex items-center gap-2.5">
                      <span className="text-blue-500 text-sm">•</span>
                      <span>Show electronic products</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="text-blue-500 text-sm">•</span>
                      <span>List admin users</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="text-blue-500 text-sm">•</span>
                      <span>Orders above 1000</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="text-blue-500 text-sm">•</span>
                      <span>Most expensive products</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both">
              <ResultsTable mql={mql} results={results} />
            </div>
          )}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="max-w-3xl mx-auto w-full bg-red-500/10 dark:bg-red-950/20 border border-red-500/30 dark:border-red-500/20 p-4.5 rounded-2xl shadow-sm transition-all duration-300">
            <div className="flex gap-3">
              <span className="text-red-500">⚠️</span>
              <div>
                <p className="text-sm text-red-800 dark:text-red-400 font-bold">Query Translation Error</p>
                <p className="text-xs text-red-700 dark:text-red-500/80 mt-1 leading-relaxed">{error}</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 2. Professional Developer Footer (Minimalist Upgrade) */}
      <footer className="mt-auto border-t border-slate-200/50 dark:border-slate-800/60 bg-white/20 dark:bg-slate-950/20 py-10 px-6 text-center z-10 transition-colors">
        <div className="max-w-3xl mx-auto flex flex-col gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white leading-none">LuminaDB</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              Natural Language Interface for MongoDB
            </p>
          </div>
          
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Built with React • Express • FastAPI • MongoDB • spaCy
          </p>
          
          <div className="text-[10px] text-slate-400 dark:text-slate-500">
            Designed & Developed by <span className="font-bold text-slate-700 dark:text-slate-350">Syed Uzair Mohiuddin</span>
          </div>
          
          <div className="flex justify-center gap-3.5 text-[10px] text-slate-400 dark:text-slate-500">
            <a 
              href="https://github.com/SyedUzaiir" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              GitHub
            </a>
            <span>•</span>
            <a 
              href="https://www.linkedin.com/in/syeduzairmohiuddin/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              LinkedIn
            </a>
          </div>
          
          <p className="text-[9px] text-slate-400 dark:text-slate-600 mt-2 font-normal">
            © 2026 LuminaDB. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
