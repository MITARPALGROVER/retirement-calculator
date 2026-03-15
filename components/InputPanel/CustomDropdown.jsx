import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

const CustomDropdown = ({ label, value, options, onChange, description }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[1];

  return (
    <div className="mb-6 flex flex-col gap-2 relative group" ref={dropdownRef}>
      <label className="font-bold text-[#224c87] text-sm tracking-wide flex items-center gap-2 relative">
        {label}
        {description && (
          <div className="relative group/tooltip flex items-center z-50">
            <Info size={16} className="text-[#919090] hover:text-[#224c87] cursor-help transition-colors" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)] w-48 p-2.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 shadow-xl text-center font-medium leading-relaxed pointer-events-none">
              {description}
              <div className="absolute left-1/2 -translate-x-1/2 top-100 border-4 border-transparent border-t-gray-800" style={{top: '100%'}}></div>
            </div>
          </div>
        )}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full text-left p-3 pr-10 bg-gray-50/50 hover:bg-gray-100 border transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-[#224c87]/20 font-bold text-gray-800 shadow-sm ${isOpen ? 'border-[#224c87] bg-white' : 'border-transparent hover:border-gray-200'}`}
        >
          {selectedOption.label}
        </button>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#919090] group-hover:text-[#224c87] transition-colors">
          <svg className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full bottom-full mb-2 bg-white rounded-lg shadow-[0_-8px_30px_rgb(0,0,0,0.1)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors focus:outline-none ${
                  value === option.value
                    ? 'bg-[#224c87] text-white'
                    : 'text-gray-700 hover:bg-blue-50/50 hover:text-[#224c87]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDropdown;
