import {
  calculateRetirementAnnualExpense,
  calculateRequiredCorpus,
  calculateRequiredMonthlySIP,
  calculateRetirementPlan
} from '../lib/retirementCalculations';

describe('retirementCalculations', () => {
  describe('calculateRetirementAnnualExpense (Step 1)', () => {
    it('calculates future expense correctly', () => {
      // 600,000 current annual expense, 30 years old retiring at 60 (30 years) at 6% inflation
      // expected: 600,000 * (1.06)^30 ≈ 3446095
      const result = calculateRetirementAnnualExpense(600000, 30, 60, 0.06);
      expect(Math.round(result)).toBe(3446095);
    });

    it('returns exact expense if current age >= retirement age', () => {
      const result = calculateRetirementAnnualExpense(600000, 60, 60, 0.06);
      expect(result).toBe(600000);
    });
  });

  describe('calculateRequiredCorpus (Step 2)', () => {
    it('calculates required corpus using Present Value of Annuity', () => {
      // 3,446,092 future expense, 7% post-retire return, 25 years duration (85 - 60)
      // expected: 3446095 * [(1 - (1.07)^-25) / 0.07] ≈ 40159320
      const result = calculateRequiredCorpus(3446092, 0.07, 25);
      expect(Math.round(result)).toBe(40159320);
    });

    it('handles zero duration correctly', () => {
      const result = calculateRequiredCorpus(3446092, 0.07, 0);
      expect(result).toBe(0);
    });
  });

  describe('calculateRequiredMonthlySIP (Step 3)', () => {
    it('calculates exact monthly SIP needed for given gap', () => {
      // 40,158,819 target gap, 12% pre-retire return, 30 years (60 - 30)
      // months = 360, rate = 0.01
      // expected: 40,158,819 * 0.01 / [((1.01)^360 - 1) * 1.01] ≈ 11377
      const result = calculateRequiredMonthlySIP(40158819, 0.12, 30, 60);
      expect(Math.round(result)).toBe(11377);
    });

    it('returns 0 if gap is zero', () => {
      const result = calculateRequiredMonthlySIP(0, 0.12, 30, 60);
      expect(result).toBe(0);
    });
  });

  describe('calculateRetirementPlan wrapper', () => {
    it('calculates end-to-end plan correctly', () => {
      const inputs = {
        currentAge: 30,
        retirementAge: 60,
        lifeExpectancy: 85,
        currentMonthlyExpenses: 50000,
        expectedInflationRate: 6,
        preRetirementReturn: 12,
        postRetirementReturn: 7,
        existingCorpus: 0,
        lifestyleFactor: 1.0,
      };

      const result = calculateRetirementPlan(inputs);
      
      expect(result).toHaveProperty('futureMonthlyExpense');
      expect(result).toHaveProperty('futureAnnualExpense');
      expect(result).toHaveProperty('totalRequiredCorpus');
      expect(result).toHaveProperty('requiredMonthlySIP');
      
      // Math verify
      expect(Math.round(result.futureAnnualExpense)).toBe(3446095);
      expect(Math.round(result.totalRequiredCorpus)).toBe(40159351);
      expect(Math.round(result.requiredMonthlySIP)).toBe(11377); // Exact verified SIP format
      expect(Math.round(result.futureValueOfExistingCorpus)).toBe(0);
    });

    it('applies existing corpus properly', () => {
      const inputsWithCorpus = {
        currentAge: 30,
        retirementAge: 60,
        lifeExpectancy: 85,
        currentMonthlyExpenses: 50000,
        expectedInflationRate: 6,
        preRetirementReturn: 12,
        postRetirementReturn: 7,
        existingCorpus: 500000, // 5 Lakhs existing
        lifestyleFactor: 1.0,
      };

      const result = calculateRetirementPlan(inputsWithCorpus);
      
      // 5,00,000 growing at 12% for 30 years -> ~1,49,79,961
      expect(Math.round(result.futureValueOfExistingCorpus)).toBe(14979961);
      
      // Shortfall
      expect(Math.round(result.corpusShortfall)).toBe(25179390);
      
      // New required SIP should be lower
      expect(Math.round(result.requiredMonthlySIP)).toBeLessThan(11377);
    });

    it('applies lifestyle factor appropriately', () => {
      const modestInput = {
        currentAge: 30,
        retirementAge: 60,
        lifeExpectancy: 85,
        currentMonthlyExpenses: 50000,
        expectedInflationRate: 6,
        preRetirementReturn: 12,
        postRetirementReturn: 7,
        existingCorpus: 0,
        lifestyleFactor: 0.8, // Modest
      };

      const result = calculateRetirementPlan(modestInput);
      expect(Math.round(result.futureAnnualExpense)).toBe(2756876);
    });
  });
});
