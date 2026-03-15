import { Info } from 'lucide-react';
import { useState } from 'react';

const Disclosure = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-12 mb-8 bg-blue-50/30 border border-blue-100 rounded-2xl overflow-hidden text-sm text-[#6b6a6a] shadow-[0_4px_20px_-4px_rgba(34,76,135,0.05)] transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-5 bg-white/50 hover:bg-blue-50/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#224c87] focus-visible:ring-inset ${isOpen ? 'rounded-t-2xl' : 'rounded-2xl'}`}
        aria-expanded={isOpen}
        aria-controls="disclosure-content"
      >
        <div className="flex items-center gap-3">
          <Info size={18} className="text-[#224c87]" />
          <h4 className="font-bold text-[#224c87] tracking-wide">Assumptions & Disclosure</h4>
        </div>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        id="disclosure-content"
        className={`px-5 py-6 space-y-5 bg-white/40 backdrop-blur-sm border-t border-blue-50 ${isOpen ? 'block' : 'hidden'} print:block print:border-none print:shadow-none print:p-0`}
      >
        <p className="font-medium text-gray-800 leading-relaxed bg-white/60 p-4 rounded-xl border border-gray-100 shadow-sm">
          <strong className="text-[#da3832]">Mandatory Disclaimer:</strong> This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.
        </p>

        <div className="px-2">
          <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#224c87]"></div>
            Underlying Assumptions
          </h5>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
               <span className="text-gray-400 mt-0.5">•</span>
               <span>Inflation implies a constant rate over the entire investment and retirement period.</span>
            </li>
            <li className="flex items-start gap-2">
               <span className="text-gray-400 mt-0.5">•</span>
               <span>Returns are assumed as constant annual compound growth rates. Actual market returns are volatile.</span>
            </li>
            <li className="flex items-start gap-2">
               <span className="text-gray-400 mt-0.5">•</span>
               <span>The calculator computes purely mathematical estimates (illustrative only) using the Present Value of an Annuity formula for the retirement depletion phase.</span>
            </li>
            <li className="flex items-start gap-2">
               <span className="text-gray-400 mt-0.5">•</span>
               <span>No taxes, market fees, or expense ratios have been factored into these illustrative estimates.</span>
            </li>
            <li className="flex items-start gap-2">
               <span className="text-gray-400 mt-0.5">•</span>
               <span>Life expectancy and retirement duration define the depletion period strictly based on user inputs.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Disclosure;
