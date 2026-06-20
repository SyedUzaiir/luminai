import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Check } from 'lucide-react';

export default function StatusCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online', 'sleeping', 'waking', 'checking'
  const [nlpStatus, setNlpStatus] = useState('checking'); // 'online', 'sleeping', 'waking', 'checking'
  
  const containerRef = useRef(null);

  const getBackendUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getNlpUrl = () => {
    const backendUrl = getBackendUrl();
    if (backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1')) {
      return 'http://localhost:8000';
    }
    return 'https://luminadb-nlp.onrender.com';
  };

  const checkStatus = async () => {
    try {
      const res = await fetch(`${getBackendUrl()}/health`, { method: 'GET', mode: 'cors' });
      if (res.ok) setBackendStatus('online');
      else setBackendStatus('sleeping');
    } catch {
      setBackendStatus('sleeping');
    }

    try {
      const res = await fetch(`${getNlpUrl()}/health`, { method: 'GET', mode: 'cors' });
      if (res.ok) setNlpStatus('online');
      else setNlpStatus('sleeping');
    } catch {
      setNlpStatus('sleeping');
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 25000);
    return () => clearInterval(interval);
  }, []);

  const wakeServices = async () => {
    if (backendStatus !== 'online') setBackendStatus('waking');
    if (nlpStatus !== 'online') setNlpStatus('waking');

    // Wake NLP
    const wakeNlp = async () => {
      for (let i = 0; i < 25; i++) {
        try {
          const res = await fetch(`${getNlpUrl()}/health`, { method: 'GET', mode: 'cors' });
          if (res.ok) {
            setNlpStatus('online');
            return true;
          }
        } catch (e) {}
        await new Promise(r => setTimeout(r, 2000));
      }
      setNlpStatus('sleeping');
      return false;
    };

    // Wake Backend
    const wakeBackend = async () => {
      for (let i = 0; i < 25; i++) {
        try {
          const res = await fetch(`${getBackendUrl()}/health`, { method: 'GET', mode: 'cors' });
          if (res.ok) {
            setBackendStatus('online');
            return true;
          }
        } catch (e) {}
        await new Promise(r => setTimeout(r, 2000));
      }
      setBackendStatus('sleeping');
      return false;
    };

    await Promise.all([
      nlpStatus !== 'online' ? wakeNlp() : Promise.resolve(true),
      backendStatus !== 'online' ? wakeBackend() : Promise.resolve(true)
    ]);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAllOnline = backendStatus === 'online' && nlpStatus === 'online';
  const isAnyWaking = backendStatus === 'waking' || nlpStatus === 'waking';

  return (
    <div className="relative" ref={containerRef}>
      {/* Status Pill Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer select-none focus:outline-none ${
          isAllOnline
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
            : isAnyWaking
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 animate-pulse'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${
          isAllOnline 
            ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
            : isAnyWaking
              ? 'bg-blue-500 animate-ping'
              : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse'
        }`} />
        <span>{isAllOnline ? 'Systems Online' : isAnyWaking ? 'Waking...' : 'Services Sleeping'}</span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-none z-50 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-200/40 dark:border-slate-700/40 pb-2 mb-3">
            Service Status
          </h4>
          
          <div className="space-y-3 mb-4">
            {/* Backend Row */}
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500 dark:text-slate-400">Backend Server</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  backendStatus === 'online' ? 'bg-emerald-500' : backendStatus === 'waking' ? 'bg-blue-500 animate-pulse' : 'bg-amber-500'
                }`} />
                <span className={
                  backendStatus === 'online' ? 'text-emerald-600 dark:text-emerald-400' : backendStatus === 'waking' ? 'text-blue-500' : 'text-amber-500'
                }>
                  {backendStatus === 'online' ? 'Online' : backendStatus === 'waking' ? 'Waking...' : 'Sleeping'}
                </span>
              </div>
            </div>
            
            {/* NLP Row */}
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500 dark:text-slate-400">NLP spaCy Service</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  nlpStatus === 'online' ? 'bg-emerald-500' : nlpStatus === 'waking' ? 'bg-blue-500 animate-pulse' : 'bg-amber-500'
                }`} />
                <span className={
                  nlpStatus === 'online' ? 'text-emerald-600 dark:text-emerald-400' : nlpStatus === 'waking' ? 'text-blue-500' : 'text-amber-500'
                }>
                  {nlpStatus === 'online' ? 'Online' : nlpStatus === 'waking' ? 'Waking...' : 'Sleeping'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          <button
            onClick={wakeServices}
            disabled={isAnyWaking || isAllOnline}
            className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-700/60 disabled:text-slate-400 dark:disabled:text-slate-500 text-white font-semibold text-xs py-2 px-3 rounded-xl transition-all duration-200 active:scale-95 shadow-[0_2px_8px_rgba(37,99,235,0.15)] disabled:shadow-none cursor-pointer"
          >
            {isAnyWaking ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Waking Services...</span>
              </>
            ) : isAllOnline ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Services Active</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3 h-3" />
                <span>Wake Services</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
