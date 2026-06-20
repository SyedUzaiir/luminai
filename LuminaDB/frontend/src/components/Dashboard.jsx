import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Activity, Clock, Github, Linkedin, ExternalLink } from 'lucide-react';
import SearchBar from './SearchBar';
import ResultsTable from './ResultsTable';
import DataVisualizer from './DataVisualizer';
import ThemeToggle from './ThemeToggle';
import AILoader from './AILoader';

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
      const newHistory = [prompt, ...prev.filter(p => p !== prompt)].slice(0, 8);
      localStorage.setItem('luminadb_history', JSON.stringify(newHistory));
      return newHistory;
    });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/query`, { prompt });
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
      
      {/* 1. Top Sticky Navigation Navbar */}
      <nav className="fixed top-0 inset-x-0 h-16 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/40 dark:border-slate-800/40 z-50 flex items-center justify-between px-6 transition-all duration-300">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 rounded-lg shadow-sm">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-sm uppercase">LuminaDB</span>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <a 
            href="https://github.com/SyedUzaiir/luminai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all duration-200 flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-sm"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        </div>
      </nav>

      {/* Background Decorators */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-50/40 dark:from-slate-800/20 to-transparent transition-colors duration-300" />
        <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-blue-500/10 dark:bg-blue-600/5 rounded-full filter blur-3xl" />
        <div className="absolute top-[30%] left-[-5%] w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full filter blur-3xl" />
      </div>

      {/* Main Container Wrapper */}
      <div className="flex-grow w-full max-w-[1400px] mx-auto px-6 pt-24 pb-16 relative z-10 flex flex-col gap-10">
        
        {/* TOP SECTION GRID: Search / Suggestions (Left) + Analytics (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Left Column: Hero Copy + SearchBar + History */}
          <div className="lg:col-span-2 flex flex-col justify-between py-2">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-blue-500/10 dark:bg-blue-400/10 px-3.5 py-1.5 rounded-full text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 border border-blue-500/20 dark:border-blue-400/20 animate-fade-in">
                <Activity className="h-3 w-3" />
                <span>MongoDB Query Interface</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
                LuminaDB
              </h1>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">
                Natural Language → MongoDB Query Engine
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400/90 max-w-xl leading-relaxed mb-6 font-medium">
                Query your MongoDB database using plain English. LuminaDB automatically translates your request into MongoDB Query Language (MQL), executes it against your database, and visualizes the results instantly.
              </p>
            </div>

            <SearchBar onSearch={handleSearch} isLoading={isLoading} />

            {/* Recent Queries block */}
            <div className="mt-8 bg-white/20 dark:bg-slate-800/20 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-4.5 max-w-3xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200/30 dark:border-slate-700/30 pb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Recent Queries</span>
              </div>
              {history.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic">No recent queries run.</p>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-16 overflow-y-auto custom-scrollbar">
                  {history.map((h, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSearch(h)}
                      className="text-[10px] font-semibold bg-white/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/80 transition-all duration-200 cursor-pointer hover:scale-102 active:scale-98"
                      title={h}
                    >
                      {h}
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

        {/* BOTTOM SECTION: Loading state OR results visualization */}
        <div className="w-full">
          {isLoading ? (
            <AILoader />
          ) : (
            mql && results && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both">
                <ResultsTable mql={mql} results={results} />
              </div>
            )
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

      {/* 2. Professional Developer Footer */}
      <footer className="mt-auto border-t border-slate-200/50 dark:border-slate-800/60 bg-white/30 dark:bg-slate-950/30 backdrop-blur-md py-12 px-6 text-center relative z-10 transition-colors">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          <div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">LuminaDB</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
              AI-powered Natural Language Interface for MongoDB
            </p>
          </div>
          
          <div className="h-px bg-slate-200/40 dark:bg-slate-800/50 max-w-xs mx-auto" />
          
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-lg mx-auto leading-relaxed font-semibold">
            Built with React • Node.js • Express • FastAPI • MongoDB Atlas • spaCy
          </p>
          
          <div className="flex flex-col gap-2.5 items-center mt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Designed & Developed by <span className="font-bold text-slate-850 dark:text-slate-200">Syed Uzair Mohiuddin</span>
            </p>
            
            <div className="flex justify-center items-center gap-4 mt-1">
              <a 
                href="https://github.com/SyedUzaiir" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 flex items-center gap-1.5 font-semibold transition-colors duration-200"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <span className="text-slate-300 dark:text-slate-800 text-sm">•</span>
              <a 
                href="https://www.linkedin.com/in/syed-uzair-mohiuddin/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 flex items-center gap-1.5 font-semibold transition-colors duration-200"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
              <span className="text-slate-300 dark:text-slate-800 text-sm">•</span>
              <a 
                href="https://github.com/SyedUzaiir/luminai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 flex items-center gap-1.5 font-semibold transition-colors duration-200"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Repository</span>
              </a>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-400 dark:text-slate-600 tracking-wider mt-2">
            © 2026 LuminaDB. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
