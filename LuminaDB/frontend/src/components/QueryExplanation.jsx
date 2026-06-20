import React from 'react';

export default function QueryExplanation({ mql }) {
  if (!mql) return null;

  const getPluralCollection = (col) => {
    if (!col) return '';
    const map = {
      'user': 'Users',
      'product': 'Products',
      'order': 'Orders'
    };
    return map[col.toLowerCase()] || `${col}s`;
  };

  const getOperationName = (act) => {
    if (!act) return 'Find';
    return act.charAt(0).toUpperCase() + act.slice(1).toLowerCase();
  };

  const getFiltersList = (query) => {
    if (!query || Object.keys(query).length === 0) return 'None';
    
    const filters = [];
    for (const [key, value] of Object.entries(query)) {
      if (typeof value === 'object' && value !== null) {
        let conds = [];
        if (value.$gt !== undefined) conds.push(`> ${value.$gt}`);
        if (value.$gte !== undefined) conds.push(`>= ${value.$gte}`);
        if (value.$lt !== undefined) conds.push(`< ${value.$lt}`);
        if (value.$lte !== undefined) conds.push(`<= ${value.$lte}`);
        if (value.$regex !== undefined) conds.push(`matches "${value.$regex}"`);
        
        if (conds.length > 0) {
          filters.push(`${key} ${conds.join(' and ')}`);
        } else {
          filters.push(`${key} = ${JSON.stringify(value)}`);
        }
      } else {
        filters.push(`${key} = ${value}`);
      }
    }
    return filters.join(', ');
  };

  const generateDescription = (mql) => {
    const colName = getPluralCollection(mql.collection);
    let desc = `Retrieves records from the ${colName} collection`;
    
    const filters = [];
    if (mql.query && Object.keys(mql.query).length > 0) {
      for (const [key, value] of Object.entries(mql.query)) {
        if (typeof value === 'object' && value !== null) {
          let subCond = [];
          if (value.$gt) subCond.push(`greater than ${value.$gt}`);
          if (value.$gte) subCond.push(`greater than or equal to ${value.$gte}`);
          if (value.$lt) subCond.push(`less than ${value.$lt}`);
          if (value.$lte) subCond.push(`less than or equal to ${value.$lte}`);
          if (value.$regex) subCond.push(`matching '${value.$regex}'`);
          if (subCond.length > 0) {
            filters.push(`${key} is ${subCond.join(' and ')}`);
          }
        } else {
          filters.push(`${key} is "${value}"`);
        }
      }
    }

    if (filters.length > 0) {
      desc += ` where ${filters.join(' and ')}`;
    } else {
      desc += ` without any specific filtering conditions`;
    }

    if (mql.sort) {
      const sortKeys = Object.keys(mql.sort);
      if (sortKeys.length > 0) {
        const dir = mql.sort[sortKeys[0]] === -1 ? 'descending' : 'ascending';
        desc += `, sorted by ${sortKeys[0]} in ${dir} order`;
      }
    }

    if (mql.limit) {
      desc += `, returning only the top ${mql.limit} results`;
    }

    return desc + '.';
  };

  return (
    <div className="mt-4 bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/40 rounded-xl p-4.5 transition-colors">
      <div className="flex items-center gap-2 mb-3.5 border-b border-blue-100/40 dark:border-blue-900/30 pb-2">
        <span className="text-sm">💡</span>
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Query Explanation</h4>
      </div>
      
      <div className="space-y-2.5 text-xs">
        <div>
          <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Collection:</span>
          <p className="text-slate-800 dark:text-slate-200 mt-0.5 font-medium">{getPluralCollection(mql.collection)}</p>
        </div>
        
        <div>
          <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Operation:</span>
          <p className="text-slate-800 dark:text-slate-200 mt-0.5 font-medium">{getOperationName(mql.action)}</p>
        </div>
        
        <div>
          <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Filters:</span>
          <p className="text-slate-800 dark:text-slate-200 mt-0.5 font-mono bg-white/40 dark:bg-slate-900/40 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800/60 w-fit">
            {getFiltersList(mql.query)}
          </p>
        </div>
        
        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/40">
          <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Description:</span>
          <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{generateDescription(mql)}</p>
        </div>
      </div>
    </div>
  );
}
