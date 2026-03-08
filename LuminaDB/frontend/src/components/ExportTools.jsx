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
    <div className="flex gap-3 mt-4 sm:mt-0 justify-end w-full sm:w-auto">
      <button 
        onClick={downloadCSV}
        className="flex flex-1 sm:flex-none justify-center items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-brand-accent dark:hover:text-blue-400 px-3 py-1.5 rounded-lg transition-colors"
      >
        <FileSpreadsheet className="w-3.5 h-3.5" /> Export CSV
      </button>
      <button 
        onClick={downloadJSON}
        className="flex flex-1 sm:flex-none justify-center items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-brand-accent dark:hover:text-blue-400 px-3 py-1.5 rounded-lg transition-colors"
      >
        <FileJson className="w-3.5 h-3.5" /> Export JSON
      </button>
    </div>
  );
}
