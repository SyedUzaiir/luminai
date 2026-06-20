import React from 'react';
import { Database, Code2 } from 'lucide-react';
import QueryExplanation from './QueryExplanation';
import ExportTools from './ExportTools';
import TypewriterCode from './TypewriterCode';

export default function ResultsTable({ mql, results }) {
  if (!mql || !results) return null;

  // Extract keys dynamically for the table
  let headers = [];
  if (results.length > 0) {
    // Only pick the first 6 keys to avoid horizontal overflow for simple UI
    headers = Object.keys(results[0]).filter(k => k !== '__v' && k !== 'password').slice(0, 6);
  }

  const getHeaderInfo = (collection, count) => {
    const col = collection.toLowerCase();
    if (col === 'order') {
      return { icon: '📦', title: 'Orders', subtitle: `${count} matching ${count === 1 ? 'document' : 'documents'}` };
    }
    if (col === 'user') {
      return { icon: '👤', title: 'Users', subtitle: `${count} matching ${count === 1 ? 'document' : 'documents'}` };
    }
    if (col === 'product') {
      return { icon: '⚡', title: 'Products', subtitle: `${count} matching ${count === 1 ? 'document' : 'documents'}` };
    }
    return { icon: '📂', title: collection, subtitle: `${count} matching ${count === 1 ? 'document' : 'documents'}` };
  };

  const headerInfo = getHeaderInfo(mql.collection, results.length);

  return (
    <div className="w-full mx-auto mt-10 grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 items-start">
      
      {/* 1. MQL Query Preview Card (Compact h-fit left column) */}
      <div className="lg:col-span-1 flex flex-col gap-4 h-fit">
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-200/40 dark:border-slate-700/40 pb-3">
            <div className="bg-blue-500/10 dark:bg-blue-400/10 p-1.5 rounded-lg">
              <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">Generated MongoDB Query</h3>
          </div>
          
          <div className="bg-slate-950 rounded-xl p-4 overflow-x-auto text-xs shadow-inner max-h-56 custom-scrollbar">
            <pre className="text-emerald-400 font-mono leading-relaxed">
              <TypewriterCode code={JSON.stringify(mql, null, 2)} />
            </pre>
          </div>
          
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3 text-center">
            Executed directly against your MongoDB cluster.
          </p>
          
          <QueryExplanation mql={mql} />
        </div>
      </div>

      {/* 2. Data Table (Spans 3 columns) */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600">
          <div className="p-5 border-b border-slate-200/40 dark:border-slate-700/40 flex flex-row items-center justify-between gap-4 bg-white/30 dark:bg-slate-800/30">
             <div className="flex items-center gap-3">
                <span className="text-2xl">{headerInfo.icon}</span>
                <div className="flex items-baseline gap-2.5">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                    {headerInfo.title}
                  </h3>
                  <span className="text-slate-300 dark:text-slate-700 text-sm">•</span>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                    {headerInfo.subtitle}
                  </p>
                </div>
             </div>
             {results.length > 0 && <ExportTools results={results} collectionName={mql.collection} />}
          </div>
          
          <div className="overflow-x-auto">
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-4xl mb-3 animate-pulse">🔍</span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">No matching documents were found</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[240px] leading-relaxed">
                  Try another natural language query.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider transition-colors border-b border-slate-200/40 dark:border-slate-700/40">
                    {headers.map(header => (
                      <th key={header} className="p-4 font-bold">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/30 dark:divide-slate-700/30 text-sm text-slate-700 dark:text-slate-300">
                  {results.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 dark:hover:bg-slate-700/10 transition-colors duration-150">
                      {headers.map(header => {
                         let val = row[header];
                         if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
                         return (
                          <td key={header} className="p-4 max-w-[200px] truncate font-medium text-slate-600 dark:text-slate-300">
                            {val?.toString() || '-'}
                          </td>
                         )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
