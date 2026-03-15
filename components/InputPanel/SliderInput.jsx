'use client';

import React, { useId, useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { parseCurrency, formatCurrency } from '../../lib/formatters';

const SliderInput = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  isCurrency = false,
  isPercentage = false,
  description,
}) => {
  const idStr = useId();
  const inputId = `input-${idStr}`;
  const sliderId = `slider-${idStr}`;
  const helpTextId = `help-${idStr}`;

  const [localValue, setLocalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Sync local display value when not focused, format it nicely
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(isCurrency ? formatCurrency(value) : `${value}${isPercentage ? '%' : ''}`);
    }
  }, [value, isFocused, isCurrency, isPercentage]);

  const handleInputChange = (e) => {
    setLocalValue(e.target.value); // Allow free typing without instantly clamping
  };

  const commitValue = () => {
    setIsFocused(false);
    let rawValue = localValue;
    
    if (isCurrency) {
      rawValue = parseCurrency(rawValue);
    } else {
      // Strip anything that isn't a number or decimal
      rawValue = parseFloat(rawValue.toString().replace(/[^0-9.-]/g, '') || '0');
    }
    
    // Clamp to min/max to guarantee safety
    const numValue = Math.max(min, Math.min(max, isNaN(rawValue) ? min : rawValue));
    onChange(numValue);
    
    // Safety fallback: if they typed something invalid and it clamped, force local sync right now
    if (!isFocused) {
      setLocalValue(isCurrency ? formatCurrency(numValue) : `${numValue}${isPercentage ? '%' : ''}`);
    }
  };

  const handleBlur = () => {
    commitValue();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      commitValue();
    }
  };

  const handleSliderChange = (e) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="mb-8 flex flex-col gap-2 relative group">
      <div className="flex justify-between items-center mb-1 relative">
        <label htmlFor={inputId} className="font-bold text-[#224c87] text-sm tracking-wide flex items-center gap-2">
          {label}
          {description && (
            <div className="relative group/tooltip flex items-center">
              <Info size={16} className="text-[#919090] hover:text-[#224c87] cursor-help transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)] w-48 p-2.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 shadow-xl z-50 text-center font-medium leading-relaxed">
                {description}
                <div className="absolute left-1/2 -translate-x-1/2 top-100 border-4 border-transparent border-t-gray-800" style={{top: '100%'}}></div>
              </div>
            </div>
          )}
        </label>
        {/* Visual-only representation or direct input */}
        <div className="relative">
          <input
            type="text"
            id={inputId}
            value={localValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-32 text-right p-1.5 bg-gray-50/50 hover:bg-gray-100 border border-transparent hover:border-gray-200 focus:border-[#224c87] focus:bg-white rounded-md focus:outline-none transition-all font-bold text-gray-800 focus:ring-2 focus:ring-[#224c87]/20"
            aria-describedby={description ? helpTextId : undefined}
            style={{ appearance: 'textfield' }}
          />
        </div>
      </div>

      {/* Accessible Slider (WCAG AA) */}
      <div className="relative w-full h-6 flex items-center group-hover:scale-[1.01] transition-transform duration-300">
        <div className="absolute inset-y-0 left-0 bg-[#224c87]/10 rounded-full w-full h-2 my-auto pointer-events-none" />
        <input
          type="range"
          id={sliderId}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="slider-enhanced absolute w-full h-2 bg-transparent appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#224c87] focus:ring-offset-2 rounded-lg"
          aria-label={`${label} slider`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={isFocused ? localValue : (isCurrency ? formatCurrency(value) : value.toString())}
          style={{
            background: `linear-gradient(to right, #224c87 0%, #224c87 ${(value - min) / (max - min) * 100}%, #e5e7eb ${(value - min) / (max - min) * 100}%, #e5e7eb 100%)`
          }}
        />
      </div>
    </div>
  );
};

export default SliderInput;
