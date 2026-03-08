import React from 'react';
import { Database, Code2 } from 'lucide-react';
import QueryExplanation from './QueryExplanation';
import ExportTools from './ExportTools';

export default function ResultsTable({ mql, results }) {
  if (!mql || !results) return null;

  // Extract keys dynamically for the table
  let headers = [];
  if (results.length > 0) {
    // Only pick the first 6 keys to avoid horizontal overflow for simple UI
    headers = Object.keys(results[0]).filter(k => k !== '__v' && k !== 'password').slice(0, 6);
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Query Preview Card */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex-grow transition-colors">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-50 dark:border-slate-700 pb-4">
            <div className="bg-blue-50 dark:bg-blue-900/40 p-2 rounded-lg transition-colors">
              <Code2 className="h-5 w-5 text-brand-accent dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 transition-colors">MQL Query Preview</h3>
          </div>
          
          <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto text-sm shadow-inner">
            <pre className="text-blue-300 font-mono">
              <code>{JSON.stringify(mql, null, 2)}</code>
            </pre>
          </div>
          <p className="text-xs text-slate-400 mt-4 px-1 text-center">
            This query was executed directly against your MongoDB cluster.
          </p>
          <QueryExplanation mql={mql} />
        </div>
      </div>

      {/* Data Table */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-0 overflow-hidden flex-grow flex flex-col transition-colors">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-slate-800 gap-4 transition-colors">
             <div className="flex items-center gap-2">
                <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-lg transition-colors">
                  <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 transition-colors">
                  {mql.collection} Results <span className="text-slate-400 dark:text-slate-500 font-normal">({results.length})</span>
                </h3>
             </div>
             {results.length > 0 && <ExportTools results={results} collectionName={mql.collection} />}
          </div>
          
          <div className="overflow-x-auto flex-grow">
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500 transition-colors">
                  <Database className="h-12 w-12 text-slate-200 dark:text-slate-600 mb-3 transition-colors" />
                  <p>No results found for this query.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider transition-colors">
                    {headers.map(header => (
                      <th key={header} className="p-4 font-semibold border-b border-slate-100 dark:border-slate-700">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm text-slate-700 dark:text-slate-300 transition-colors">
                  {results.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      {headers.map(header => {
                         let val = row[header];
                         if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
                         return (
                          <td key={header} className="p-4 max-w-[200px] truncate">
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
