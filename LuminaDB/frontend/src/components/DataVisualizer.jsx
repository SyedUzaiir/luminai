import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { BarChart3, PieChartIcon } from 'lucide-react';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1'];

export default function DataVisualizer({ results, collectionName }) {
  if (!results || results.length === 0) {
    return (
      <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 flex flex-col justify-center items-center text-center h-[280px] w-full transition-all duration-300">
        <span className="text-3xl mb-3 animate-pulse">📊</span>
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Awaiting Data</h4>
        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[220px] leading-relaxed">
          Run a search query to visualize your MongoDB data.
        </p>
      </div>
    );
  }

  // 1. Analyze data to find numeric and categorical fields
  let numericField = null;
  let categoryField = null;
  
  const sample = results[0];
  const keys = Object.keys(sample).filter(k => k !== '__v' && k !== '_id' && k !== 'password');
  
  for (const key of keys) {
    if (typeof sample[key] === 'number') {
      numericField = key;
    } else if (typeof sample[key] === 'string' && new Set(results.map(r => r[key])).size < 10) {
      // Categorical field (e.g., status, category, role)
      categoryField = key;
    }
  }

  // 2. Prepare Data for Bar Chart (if both numeric and categorical exist) or just numeric distribution
  let chartType = null;
  let chartData = [];

  if (categoryField) {
    // Group by category and sum numeric field OR count occurrences
    const grouped = {};
    results.forEach(row => {
      const cat = row[categoryField] || 'Unknown';
      if (!grouped[cat]) grouped[cat] = { name: cat, value: 0 };
      grouped[cat].value += numericField ? (row[numericField] || 0) : 1;
    });
    chartData = Object.values(grouped).sort((a,b) => b.value - a.value);
    chartType = 'pie'; // Default to pie for categorical distribution
  } else if (numericField && results.length > 2) {
    // Just show numeric distribution across top results
    chartData = results.slice(0, 10).map((row, i) => ({
      name: row.name || `Item ${i+1}`,
      value: row[numericField]
    }));
    chartType = 'bar';
  }

  if (!chartType || chartData.length === 0) return null;

  return (
    <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-5 w-full h-[280px] flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-slate-300/80 dark:hover:border-slate-600/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      <div className="flex items-center gap-2 mb-3 border-b border-slate-200/40 dark:border-slate-700/40 pb-2 transition-colors">
        <div className="bg-purple-500/10 dark:bg-purple-400/10 p-1.5 rounded-lg transition-colors">
           {chartType === 'pie' ? <PieChartIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" /> : <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
        </div>
        <h3 className="font-bold text-xs text-slate-700 dark:text-slate-300 transition-colors uppercase tracking-wider">
           {chartType === 'pie' 
             ? `${categoryField} Distribution` 
             : `Top 10 ${numericField} Comparison`}
        </h3>
      </div>
      
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 formatter={(value) => numericField && categoryField ? [value, `Total ${numericField}`] : [value, 'Count']} 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={False} hide={chartData.length > 5} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickLine={False} axisLine={False} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }} 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      
    </div>
  );
}
