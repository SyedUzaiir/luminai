import React from 'react';
import { X, Github, Linkedin, Blocks } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm transition-all duration-300"
      />
      
      {/* Modal Box */}
      <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4.5 right-4.5 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors p-1.5 rounded-xl hover:bg-slate-105 dark:hover:bg-slate-700/60 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
        
        {/* Title */}
        <div className="flex items-center gap-2 mb-5">
          <Blocks className="w-5 h-5 text-blue-500" />
          <h3 className="font-extrabold text-xs text-slate-900 dark:text-white tracking-widest uppercase">About LuminaDB</h3>
        </div>
        
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <div>
            <h4 className="font-bold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider mb-1">Developer</h4>
            <p className="font-bold text-slate-800 dark:text-slate-100">Syed Uzair Mohiuddin</p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider mb-1.5">Technical Stack</h4>
            <div className="flex flex-wrap gap-1.5 text-xxs font-semibold">
              <span className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300">React</span>
              <span className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300">Express</span>
              <span className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300">FastAPI</span>
              <span className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300">MongoDB Atlas</span>
              <span className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300">spaCy NLP</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider mb-1">Project Goal</h4>
            <p className="leading-relaxed text-xs text-slate-500 dark:text-slate-400">
              A natural language interface that translates English instructions into complex MongoDB query pipelines (MQL) and executes them against a live database cluster in real time.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200/40 dark:border-slate-700/40 flex justify-between items-center gap-3">
            <a 
              href="https://github.com/SyedUzaiir/luminai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex justify-center items-center gap-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold text-xs py-2 px-3 rounded-xl border border-slate-200/50 dark:border-slate-800 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/syed-uzair-mohiuddin/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex justify-center items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 px-3 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer shadow-[0_2px_8px_rgba(37,99,235,0.15)]"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
