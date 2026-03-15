import React from 'react';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            {/* SVG Placeholder for HDFC Logo to ensure it looks branded without needing external images */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="32" height="32" rx="4" fill="#224c87"/>
              <rect x="8" y="8" width="16" height="4" fill="white"/>
              <rect x="8" y="14" width="16" height="4" fill="white"/>
              <rect x="8" y="20" width="16" height="4" fill="white"/>
            </svg>
            <h1 className="text-xl font-bold text-[#224c87]">
              HDFC Retirement Planner
            </h1>
          </div>
          <div className="hidden md:block bg-blue-50/50 px-4 py-1.5 rounded-full border border-blue-100/50">
            <span className="text-xs font-bold tracking-wider text-[#224c87] uppercase">Investor Education & Awareness</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
