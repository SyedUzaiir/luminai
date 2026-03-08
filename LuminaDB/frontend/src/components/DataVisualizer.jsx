import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { BarChart3, PieChartIcon } from 'lucide-react';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1'];

export default function DataVisualizer({ results, collectionName }) {
  if (!results || results.length === 0) return null;

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
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mt-6 w-full transition-colors">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-50 dark:border-slate-700 pb-4 transition-colors">
        <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded-lg transition-colors">
           {chartType === 'pie' ? <PieChartIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" /> : <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 transition-colors">
           {chartType === 'pie' 
             ? `${categoryField} Distribution` 
             : `Top 10 ${numericField} Comparison`}
        </h3>
      </div>
      
      <div className="h-72 w-full">
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
