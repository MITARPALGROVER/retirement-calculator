'use client';

import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TrendingUp, Target, Calculator, CalendarClock } from 'lucide-react';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const ResultCard = ({ title, value, highlight = false, isCurrency = true, iconType = 'calculator' }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => setIsAnimating(false), 400);
    setDisplayValue(value);
    
    return () => clearTimeout(timeout);
  }, [value]);

  const IconMap = {
    target: <Target size={20} className={highlight ? "text-blue-200" : "text-[#224c87] opacity-80"} />,
    trending: <TrendingUp size={20} className={highlight ? "text-blue-200" : "text-[#224c87] opacity-80"} />,
    calculator: <Calculator size={20} className={highlight ? "text-blue-200" : "text-[#224c87] opacity-80"} />,
    calendar: <CalendarClock size={20} className={highlight ? "text-blue-200" : "text-[#224c87] opacity-80"} />
  };

  return (
    <div 
      className={cn(
        "p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden group border",
        highlight 
          ? "bg-gradient-to-br from-[#224c87] to-[#1a3a68] text-white shadow-xl shadow-blue-900/10 border-transparent" 
          : "bg-white text-gray-800 border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)]",
        isAnimating && !highlight ? "ring-1 ring-[#224c87] ring-opacity-30" : ""
      )}
      aria-live="polite"
      role="status"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          "p-2 rounded-lg transition-colors",
          highlight ? "bg-white/10" : "bg-blue-50 group-hover:bg-blue-100"
        )}>
          {IconMap[iconType] || IconMap.calculator}
        </div>
        <h3 className={cn(
          "text-sm font-semibold tracking-wide uppercase",
          highlight ? "text-blue-100" : "text-gray-500"
        )}>
          {title}
        </h3>
      </div>
      
      <p className={cn(
        "text-3xl font-extrabold tracking-tight transition-transform duration-300",
        isAnimating ? "scale-[1.03] text-[#da3832]" : "scale-100",
        highlight && isAnimating ? "text-white" : ""
      )}>
        {displayValue}
      </p>

      {/* Premium subtle shine effect on hover */}
      {highlight && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" aria-hidden="true" />
      )}
    </div>
  );
};
