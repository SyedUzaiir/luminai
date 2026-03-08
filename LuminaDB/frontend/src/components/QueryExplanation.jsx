import React from 'react';
import { Info } from 'lucide-react';

export default function QueryExplanation({ mql }) {
  if (!mql) return null;

  const generateExplanation = (mql) => {
    let explanation = `This query interacts with the ${mql.collection} collection. `;
    
    if (mql.action === 'aggregate') {
      explanation += `It runs a custom aggregation pipeline.`;
      return explanation;
    }

    if (mql.action === 'find') {
      explanation += `It returns ${mql.collection.toLowerCase()}s `;
      
      const conditions = [];
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
               conditions.push(`${key} is ${subCond.join(' and ')}`);
             } else {
               conditions.push(`${key} matches complex filter: ${JSON.stringify(value)}`);
             }
          } else {
            conditions.push(`${key} is exactly "${value}"`);
          }
        }
        
        if (conditions.length > 0) {
           explanation += `where ${conditions.join(' and ')}. `;
        } else {
           explanation += `with no specific filters. `;
        }
      } else {
        explanation += `with no specific filters. `;
      }

      if (mql.sort) {
        const sortKeys = Object.keys(mql.sort);
        if (sortKeys.length > 0) {
          const dir = mql.sort[sortKeys[0]] === -1 ? 'descending' : 'ascending';
          explanation += `It sorts the results by ${sortKeys[0]} in ${dir} order. `;
        }
      }

      if (mql.limit) {
        explanation += `It limits the results to the top ${mql.limit} matches.`;
      }
    }
    
    return explanation.trim();
  };

  return (
    <div className="mt-4 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-4 flex gap-3 transition-colors">
      <div className="text-blue-500 dark:text-blue-400 mt-0.5 transition-colors"><Info className="h-5 w-5" /></div>
      <div>
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1 transition-colors">Query Explanation</h4>
        <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed transition-colors">
           {generateExplanation(mql)}
        </p>
      </div>
    </div>
  );
}
