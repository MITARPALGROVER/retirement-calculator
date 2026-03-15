'use client';

import React from 'react';
import { Download, Printer } from 'lucide-react';
import Header from '../components/Header';
import { useRetirementCalc } from '../hooks/useRetirementCalc';
import SliderInput from '../components/InputPanel/SliderInput';
import CustomDropdown from '../components/InputPanel/CustomDropdown';
import { ResultCard } from '../components/ResultPanel/ResultCard';
import CorpusChart from '../components/ResultPanel/CorpusChart';
import Disclosure from '../components/Disclosure';
import { formatCurrency, formatLargeCurrency } from '../lib/formatters';

export default function Home() {
  const { inputs, updateInput, results, resetToDefaults } = useRetirementCalc();

  const hasAgeError = inputs.currentAge >= inputs.retirementAge;
  const hasLifeExpectancyError = inputs.retirementAge >= inputs.lifeExpectancy;
  const hasError = hasAgeError || hasLifeExpectancyError;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Main 2-column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT PANEL: Inputs */}
          <section 
            className="w-full lg:w-[35%] bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
            aria-labelledby="input-panel-heading"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 id="input-panel-heading" className="text-2xl font-extrabold text-[#224c87] tracking-tight">Your Details</h2>
              <button 
                onClick={resetToDefaults}
                className="text-sm text-[#da3832] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[#da3832] rounded px-2 py-1"
                aria-label="Reset all inputs to default values"
              >
                Reset
              </button>
            </div>

            {hasAgeError && (
              <div role="alert" className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg font-medium shadow-sm animate-in fade-in slide-in-from-top-2">
                <span className="font-bold flex items-center gap-2 mb-1">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                   Invalid Input
                </span>
                Retirement age must be strictly greater than your current age.
              </div>
            )}

            {hasLifeExpectancyError && (
              <div role="alert" className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg font-medium shadow-sm animate-in fade-in slide-in-from-top-2">
                <span className="font-bold flex items-center gap-2 mb-1">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                   Invalid Input
                </span>
                Life expectancy must be strictly greater than your retirement age.
              </div>
            )}

            <SliderInput
              label="Current Age"
              value={inputs.currentAge}
              min={18}
              max={Math.min(65, inputs.retirementAge - 1)}
              onChange={(v) => updateInput('currentAge', v)}
              description="Your current age in years"
            />
            
            <SliderInput
              label="Retirement Age"
              value={inputs.retirementAge}
              min={Math.max(40, inputs.currentAge + 1)}
              max={Math.min(75, inputs.lifeExpectancy - 1)}
              onChange={(v) => updateInput('retirementAge', v)}
              description="When do you plan to stop working?"
            />

            <SliderInput
              label="Life Expectancy"
              value={inputs.lifeExpectancy}
              min={Math.max(60, inputs.retirementAge + 1)}
              max={100}
              onChange={(v) => updateInput('lifeExpectancy', v)}
              description="Expected lifespan to calculate total depletion period"
            />

            <SliderInput
              label="Current Monthly Expenses"
              value={inputs.currentMonthlyExpenses}
              min={10000}
              max={500000}
              step={1000}
              isCurrency={true}
              onChange={(v) => updateInput('currentMonthlyExpenses', v)}
              description="Your total living costs per month today"
            />

            <div className="my-8 border-t border-gray-100" aria-hidden="true" />
            <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Assumptions</h3>

            <SliderInput
              label="Expected Inflation Rate"
              value={inputs.expectedInflationRate}
              min={1}
              max={15}
              step={0.5}
              isPercentage={true}
              onChange={(v) => updateInput('expectedInflationRate', v)}
              description="Average rate at which living costs increase yearly"
            />

            <SliderInput
              label="Pre-Retirement Return"
              value={inputs.preRetirementReturn}
              min={1}
              max={20}
              step={0.5}
              isPercentage={true}
              onChange={(v) => updateInput('preRetirementReturn', v)}
              description="Expected return during accumulation phase"
            />
            
            <SliderInput
              label="Post-Retirement Return"
              value={inputs.postRetirementReturn}
              min={1}
              max={15}
              step={0.5}
              isPercentage={true}
              onChange={(v) => updateInput('postRetirementReturn', v)}
              description="Expected return during withdrawal phase"
            />
            
            <div className="my-8 border-t border-gray-100" aria-hidden="true" />
            <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Enhancements</h3>

            <SliderInput
              label="Existing Savings / Corpus"
              value={inputs.existingCorpus}
              min={0}
              max={50000000}
              step={50000}
              isCurrency={true}
              onChange={(v) => updateInput('existingCorpus', v)}
              description="Total savings already invested for retirement"
            />

            <CustomDropdown
              label="Retirement Lifestyle Standard"
              value={inputs.lifestyleFactor}
              onChange={(value) => updateInput('lifestyleFactor', value)}
              description="Adjust your projected spending relative to current standard"
              options={[
                { value: 0.8, label: 'Modest (0.8x Expenses)' },
                { value: 1.0, label: 'Comfortable (1.0x Expenses)' },
                { value: 1.3, label: 'Premium (1.3x Expenses)' }
              ]}
            />

          </section>

          {/* RIGHT PANEL: Results */}
          <section 
            className={`w-full lg:w-[65%] flex flex-col gap-6 ${hasError ? 'opacity-40 grayscale pointer-events-none' : ''}`}
            aria-live="polite"
            aria-atomic="true"
          >
            {/* Print-Only Header */}
            <div className="print-header">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#224c87]">Retirement Planning Report</h1>
                  <p className="text-gray-500 font-medium">Personalized Financial Projection</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#224c87]">HDFC Retirement Planner</p>
                  <p className="text-xs text-gray-400">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center no-print">
              <h2 className="text-xl font-bold text-gray-800">Your Retirement Analysis</h2>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-[#224c87] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#224c87]/20 hover:bg-[#1a3b69] transition-all transform hover:scale-105 active:scale-95"
              >
                <Download size={18} />
                Download Report
              </button>
            </div>

            {/* Print-Only Input Summary */}
            <div className="hidden print:block mb-6 bg-gray-50 border border-gray-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#224c87] mb-4 border-b pb-2">Investment Parameters</h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
                <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                  <span className="text-gray-500">Current Age:</span>
                  <span className="font-bold">{inputs.currentAge} Years</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                  <span className="text-gray-500">Retirement Age:</span>
                  <span className="font-bold">{inputs.retirementAge} Years</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                  <span className="text-gray-500">Life Expectancy:</span>
                  <span className="font-bold">{inputs.lifeExpectancy} Years</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                  <span className="text-gray-500">Monthly Expenses:</span>
                  <span className="font-bold">{formatCurrency(inputs.currentMonthlyExpenses)}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                  <span className="text-gray-500">Existing Corpus:</span>
                  <span className="font-bold">{formatCurrency(inputs.existingCorpus)}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                  <span className="text-gray-500">Exp. Inflation Rate:</span>
                  <span className="font-bold">{inputs.expectedInflationRate}%</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                  <span className="text-gray-500">Pre-Retire Return:</span>
                  <span className="font-bold">{inputs.preRetirementReturn}%</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                  <span className="text-gray-500">Post-Retire Return:</span>
                  <span className="font-bold">{inputs.postRetirementReturn}%</span>
                </div>
              </div>
            </div>

            {/* Primary Result Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ResultCard 
                title="Target Retirement Corpus" 
                value={hasError ? "--" : formatLargeCurrency(results.totalRequiredCorpus)} 
                highlight={true}
                iconType="target"
              />
              <ResultCard 
                title="Required Monthly SIP" 
                value={hasError ? "--" : formatCurrency(results.requiredMonthlySIP)} 
                iconType="calculator"
              />
              <ResultCard 
                title="Future Monthly Expense" 
                value={hasError ? "--" : formatCurrency(results.futureMonthlyExpense)} 
                iconType="trending"
              />
              <ResultCard 
                title="Years to Retire" 
                value={hasError ? "--" : `${results.accumulationYears} Years`} 
                isCurrency={false}
                iconType="calendar"
              />
            </div>

            {/* Visual Chart */}
            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mt-2">
              <CorpusChart inputs={inputs} results={results} hasError={hasError} />
            </div>

            {/* Additional Insights showing progress */}
            {inputs.existingCorpus > 0 && !hasError && (
               <div className="bg-[#e6effc] border border-blue-200 rounded-lg p-5 text-[#224c87]">
                 <span className="font-semibold block mb-1">Progress with Existing Savings</span>
                 <p className="text-sm">
                   Your current corpus of {formatLargeCurrency(inputs.existingCorpus)} is projected to grow to <span className="font-bold">{formatLargeCurrency(results.futureValueOfExistingCorpus)}</span> by age {inputs.retirementAge}. 
                   This covers <span className="font-bold">{Math.round((results.futureValueOfExistingCorpus / results.totalRequiredCorpus) * 100)}%</span> of your goal!
                 </p>
               </div>
            )}

            {/* Secondary Informational Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
               <div>
                 <span className="block text-xs uppercase text-gray-500 font-semibold">Total Invested (SIPs)</span>
                 <span className="text-lg font-bold text-gray-800">{hasError ? "--" : formatLargeCurrency(results.totalInvestedVal)}</span>
               </div>
               <div>
                 <span className="block text-xs uppercase text-gray-500 font-semibold">Estimated Wealth Gained</span>
                 <span className="text-lg font-bold text-[#da3832]">
                   {hasError 
                     ? "--" 
                     : formatLargeCurrency(Math.max(results.totalRequiredCorpus, results.futureValueOfExistingCorpus) - inputs.existingCorpus - results.totalInvestedVal)}
                 </span>
               </div>
               <div>
                 <span className="block text-xs uppercase text-gray-500 font-semibold">Retirement Duration</span>
                 <span className="text-lg font-bold text-gray-800">{hasError ? "--" : `${results.retirementDuration} Years`}</span>
               </div>
            </div>

            {/* Assumptions & Compliance Footer */}
            <Disclosure />
          </section>

        </div>
      </div>
    </div>
  );
}
