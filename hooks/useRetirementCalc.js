import { useState, useMemo } from 'react';
import { calculateRetirementPlan } from '../lib/retirementCalculations';

const DEFAULT_INPUTS = {
  currentAge: 30,
  retirementAge: 60,
  lifeExpectancy: 85,
  currentMonthlyExpenses: 50000,
  expectedInflationRate: 6,
  preRetirementReturn: 12,
  postRetirementReturn: 7,
  existingCorpus: 0,
  lifestyleFactor: 1.0, // 0.8 Modest, 1.0 Comfortable, 1.3 Premium
};

export function useRetirementCalc() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);

  // Use useMemo to only recalculate when inputs change
  const results = useMemo(() => {
    // Basic validation to prevent NaN or breaking errors
    const safeInputs = {
      ...inputs,
      retirementAge: Math.max(inputs.currentAge + 1, inputs.retirementAge), // ensure retirement > current age
      lifeExpectancy: Math.max(inputs.retirementAge + 1, inputs.lifeExpectancy), // ensure life > retirement
    };
    return calculateRetirementPlan(safeInputs);
  }, [inputs]);

  const updateInput = (key, value) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetToDefaults = () => setInputs(DEFAULT_INPUTS);

  return {
    inputs,
    updateInput,
    results,
    resetToDefaults,
  };
}
