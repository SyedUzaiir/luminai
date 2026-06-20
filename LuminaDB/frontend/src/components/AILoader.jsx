import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { id: 0, text: 'Understanding request...', icon: '🧠' },
  { id: 1, text: 'Generating MongoDB Query...', icon: '⚙️' },
  { id: 2, text: 'Executing query...', icon: '☁️' },
  { id: 3, text: 'Rendering results...', icon: '📊' }
];

export default function AILoader() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const intervals = [900, 1800, 2700];
    const timers = intervals.map((delay, index) => {
      return setTimeout(() => {
        setCurrentStep(index + 1);
      }, delay);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto my-12 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 rounded-full bg-brand-accent dark:bg-blue-400 animate-ping" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">AI Query Pipeline</h4>
      </div>
      
      <ul className="space-y-4">
        {STEPS.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <li 
              key={step.id} 
              className={`flex items-center justify-between text-sm transition-all duration-300 ${
                isCompleted 
                  ? 'text-green-600 dark:text-green-400 font-medium' 
                  : isActive 
                    ? 'text-brand-accent dark:text-blue-400 font-semibold scale-[1.01]' 
                    : 'text-slate-400 dark:text-slate-600 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-base transition-transform ${isActive ? 'animate-bounce' : ''}`}>{step.icon}</span>
                <span>{step.text}</span>
              </div>
              
              <div className="flex items-center justify-center w-5 h-5">
                {isCompleted ? (
                  <Check className="w-4 h-4 text-green-500 dark:text-green-400 animate-in zoom-in duration-200" />
                ) : isActive ? (
                  <div className="w-2 h-2 rounded-full bg-brand-accent dark:bg-blue-400 animate-pulse" />
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
