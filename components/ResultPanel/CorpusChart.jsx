'use client';

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { formatLargeCurrency, formatCurrency } from '../../lib/formatters';

const CorpusChart = ({ results, inputs, hasError }) => {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    preRetirementReturn,
    postRetirementReturn
  } = inputs;

  const {
    requiredMonthlySIP,
    futureValueOfExistingCorpus,
    futureAnnualExpense,
    totalRequiredCorpus
  } = results;

  // Generate chart data series
  const data = [];
  
  if (hasError) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
        <p className="text-gray-400 font-medium tracking-wide">--</p>
      </div>
    );
  }

  if (!totalRequiredCorpus || requiredMonthlySIP === 0 && futureValueOfExistingCorpus === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 italic text-gray-500">
        Enter your details to generate corpus projection
      </div>
    );
  }

  const preRetReturnMnt = (preRetirementReturn / 100) / 12;
  const postRetReturnAnn = postRetirementReturn / 100;
  
  let currentAccumulated = inputs.existingCorpus || 0;

  // Accumulation Phase
  for (let age = currentAge; age <= retirementAge; age++) {
    // End of year values
    if (age > currentAge) {
      // Calculate 12 months of compounding and SIPs
      for(let m = 0; m < 12; m++) {
        currentAccumulated = currentAccumulated * (1 + preRetReturnMnt) + requiredMonthlySIP;
      }
    }
    
    data.push({
      age,
      accumulation: currentAccumulated,
      depletion: age === retirementAge ? currentAccumulated : null, // Bridge the point
      isRetirement: age === retirementAge,
    });
  }

  // Depletion Phase
  let currentCorpusPostRetire = totalRequiredCorpus; // This is the exact needed amount
  
  // Actually, we should start from currentAccumulated.
  currentCorpusPostRetire = currentAccumulated;
  
  // The withdrawal increases by inflation factor? No, standard formula assumes fixed withdrawal of `futureAnnualExpense` at start of each year?
  // The Present Value Annuity formula uses constant withdrawals during retirement, but real-world would inflate. 
  // Let's model constant withdrawal equal to `futureAnnualExpense` for simplicity as per strict formula.
  const withdrawal = futureAnnualExpense;

  for(let age = retirementAge + 1; age <= lifeExpectancy; age++) {
    // End of year valuation: Returns logic
    currentCorpusPostRetire = currentCorpusPostRetire * (1 + postRetReturnAnn) - withdrawal;
    if (currentCorpusPostRetire < 0) currentCorpusPostRetire = 0;
    
    data.push({
      age,
      accumulation: null,
      depletion: currentCorpusPostRetire,
    });
    
    if (currentCorpusPostRetire === 0) break;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-2 border border-blue-100 shadow-xl rounded-lg text-[10px] sm:text-xs">
          <p className="font-bold text-[#224c87] mb-1">Age: {label}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex justify-between gap-3 mb-0.5 last:mb-0">
              <span className="text-gray-500">{entry.name}:</span>
              <span className="font-bold text-gray-900">{formatLargeCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-[#224c87] mb-4">Corpus Projection Timeline</h3>
      <div className="h-[280px] sm:h-[350px] w-full" role="img" aria-label="Line chart showing corpus accumulation during working years and depletion during retirement.">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 35,
              right: 5,
              left: -15, // Negative margin to tuck axis closer
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="age" 
              tick={{fill: '#919090', fontSize: 10}}
              tickLine={false}
              axisLine={false}
              minTickGap={20}
              interval="preserveStartEnd"
              label={{ value: 'Age', position: 'insideBottom', offset: -5, fill: '#919090', fontSize: 11, fontWeight: 500 }}
            />
            <YAxis 
              tickFormatter={(value) => formatLargeCurrency(value)}
              tick={{fill: '#919090', fontSize: 10}}
              tickLine={false}
              axisLine={false}
              width={65}
              hide={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#224c87', strokeWidth: 1, strokeDasharray: '4 4' }} />
            
            <ReferenceLine 
              x={retirementAge} 
              stroke="#224c87" 
              strokeDasharray="4 4" 
              label={{ 
                position: 'top', 
                value: 'Retire', 
                fill: '#224c87', 
                fontSize: 10, 
                fontWeight: 'bold',
                offset: 10
              }} 
            />
            
            <Area 
              type="monotone" 
              dataKey="accumulation" 
              name="Building Corpus"
              stroke="#224c87" 
              fillOpacity={1} 
              fill="url(#colorAccumulation)" 
              strokeWidth={3}
            />
            <Area 
              type="monotone" 
              dataKey="depletion" 
              name="Drawing Down"
              stroke="#da3832" 
              fillOpacity={1} 
              fill="url(#colorDepletion)" 
              strokeWidth={3}
            />
            <defs>
              <linearGradient id="colorAccumulation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#224c87" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#224c87" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDepletion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#da3832" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#da3832" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="sr-only">
        This chart starts at age {currentAge}. Corpus peaks at age {retirementAge} approximately around {formatLargeCurrency(data.find(d => d.age === retirementAge)?.accumulation || 0)}. Expected depletion over {lifeExpectancy - retirementAge} years.
      </p>
    </div>
  );
};

export default CorpusChart;
