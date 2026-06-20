import React, { useState, useEffect } from 'react';

export default function TypewriterCode({ code }) {
  const [displayedCode, setDisplayedCode] = useState('');

  useEffect(() => {
    if (!code) {
      setDisplayedCode('');
      return;
    }

    setDisplayedCode('');
    let index = 0;
    
    // Auto-scale step chunk size based on length of the JSON string
    // This keeps the animation feeling fast and lively, and ensures it finishes in 1-2 seconds.
    const stepSize = Math.max(1, Math.ceil(code.length / 150)); 
    
    const interval = setInterval(() => {
      const nextSlice = code.substring(index, index + stepSize);
      setDisplayedCode(prev => prev + nextSlice);
      index += stepSize;
      
      if (index >= code.length) {
        clearInterval(interval);
      }
    }, 8);

    return () => clearInterval(interval);
  }, [code]);

  return (
    <code>{displayedCode}</code>
  );
}
