import React from 'react';
import { DownloadCloud, FileJson, FileSpreadsheet } from 'lucide-react';

export default function ExportTools({ results, collectionName }) {
  if (!results || results.length === 0) return null;

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${collectionName || 'LuminaDB'}_Export.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const downloadCSV = () => {
    const headers = Object.keys(results[0]).filter(k => k !== '__v' && k !== 'password');
    const csvRows = [];
    
    // Header row
    csvRows.push(headers.join(','));
    
    // Data rows
    for (const row of results) {
      const values = headers.map(header => {
        const val = row[header];
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', url);
    downloadAnchorNode.setAttribute('download', `${collectionName || 'LuminaDB'}_Export.csv`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex gap-2 mt-2 sm:mt-0 justify-end">
      <button 
        onClick={downloadCSV}
        className="flex justify-center items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 px-2.5 py-1.5 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
      >
        <span>⬇</span> CSV
      </button>
      <button 
        onClick={downloadJSON}
        className="flex justify-center items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:bg-white dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 px-2.5 py-1.5 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
      >
        <span className="font-mono">{"{}"}</span> JSON
      </button>
    </div>
  );
}
