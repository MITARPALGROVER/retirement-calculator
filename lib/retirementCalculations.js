/**
 * Financial formulas for HDFC Retirement Planner.
 * All functions are pure and mathematically exact as per industry standards.
 */

/**
 * STEP 1: Inflate Current Expenses to Retirement Age
 * Calculates the future value of current expenses based on general inflation.
 * 
 * Formula: Retirement Annual Expense = Current Annual Expense × (1 + inflation_rate)^(retirement_age - current_age)
 * 
 * @param {number} currentAnnualExpense - Current yearly expenses in ₹
 * @param {number} currentAge - User's current age (years)
 * @param {number} retirementAge - User's planned retirement age (years)
 * @param {number} inflationRate - Expected annual inflation rate (decimal, e.g., 0.06 for 6%)
 * @returns {number} Future projected annual expense at retirement age in ₹
 */
export function calculateRetirementAnnualExpense(currentAnnualExpense, currentAge, retirementAge, inflationRate) {
  if (currentAge >= retirementAge) return currentAnnualExpense;
  const yearsToRetirement = retirementAge - currentAge;
  return currentAnnualExpense * Math.pow(1 + inflationRate, yearsToRetirement);
}

/**
 * STEP 2: Calculate Required Retirement Corpus
 * Uses the Present Value of an Annuity formula.
 * 
 * Formula: Corpus = Retirement Annual Expense × [(1 − (1 + r)^−t) ÷ r]
 * 
 * @param {number} retirementAnnualExpense - Future projected annual expense in ₹
 * @param {number} postRetirementReturn - Expected annual returns post-retirement (decimal, e.g., 0.07 for 7%)
 * @param {number} retirementDuration - Expected duration of retirement in years (Life Expectancy - Retirement Age)
 * @returns {number} Total corpus required at the start of retirement in ₹
 */
export function calculateRequiredCorpus(retirementAnnualExpense, postRetirementReturn, retirementDuration) {
  if (retirementDuration <= 0) return 0;
  if (postRetirementReturn === 0) return retirementAnnualExpense * retirementDuration; // Fallback if 0% return
  
  const discountFactor = 1 - Math.pow(1 + postRetirementReturn, -retirementDuration);
  return retirementAnnualExpense * (discountFactor / postRetirementReturn);
}

/**
 * STEP 3: Calculate Monthly SIP Required to Build That Corpus
 * Accumulation phase calculation.
 * 
 * Formula: Required Monthly SIP = Corpus × r_monthly ÷ [((1 + r_monthly)^n − 1) × (1 + r_monthly)]
 * 
 * @param {number} targetCorpus - Total retirement corpus needed in ₹
 * @param {number} preRetirementReturn - Expected annual returns pre-retirement (decimal, e.g., 0.12 for 12%)
 * @param {number} currentAge - User's current age (years)
 * @param {number} retirementAge - User's planned retirement age (years)
 * @returns {number} Required Monthly SIP investment amount in ₹
 */
export function calculateRequiredMonthlySIP(targetCorpus, preRetirementReturn, currentAge, retirementAge) {
  if (targetCorpus <= 0) return 0;
  const yearsToInvest = retirementAge - currentAge;
  if (yearsToInvest <= 0) return 0; // cannot invest retroactively or 0 duration
  
  const totalMonths = yearsToInvest * 12;
  const monthlyRate = preRetirementReturn / 12;
  
  if (monthlyRate === 0) return targetCorpus / totalMonths; // Fallback if 0% return
  
  const compoundFactor = Math.pow(1 + monthlyRate, totalMonths) - 1;
  return (targetCorpus * monthlyRate) / (compoundFactor * (1 + monthlyRate));
}

/**
 * Comprehensive Wrapper Function
 * Executes all three steps sequentially based on raw user inputs.
 * 
 * @param {Object} inputs - The state form object
 * @param {number} inputs.currentAge
 * @param {number} inputs.retirementAge
 * @param {number} inputs.lifeExpectancy
 * @param {number} inputs.currentMonthlyExpenses
 * @param {number} inputs.expectedInflationRate - entered as percentage (e.g. 6)
 * @param {number} inputs.preRetirementReturn - entered as percentage (e.g. 12)
 * @param {number} inputs.postRetirementReturn - entered as percentage (e.g. 7)
 * @param {number} [inputs.existingCorpus=0] - Optional existing savings
 * @param {number} [inputs.lifestyleFactor=1.0] - Optional multiplier for post-retirement expenses
 * @returns {Object} Complete calculation results containing both step metrics and display values
 */
export function calculateRetirementPlan(inputs) {
  const {
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentMonthlyExpenses,
    expectedInflationRate,
    preRetirementReturn,
    postRetirementReturn,
    existingCorpus = 0,
    lifestyleFactor = 1.0,
  } = inputs;

  // Convert percentages to decimals
  const inflationDec = expectedInflationRate / 100;
  const preRetReturnDec = preRetirementReturn / 100;
  const postRetReturnDec = postRetirementReturn / 100;

  // Derived timeline variables
  const currentAnnualExpense = currentMonthlyExpenses * 12;
  const retirementDuration = lifeExpectancy - retirementAge;
  const accumulationYears = retirementAge - currentAge;

  // STEP 1: Inflate Expenses
  let futureAnnualExpense = calculateRetirementAnnualExpense(
    currentAnnualExpense,
    currentAge,
    retirementAge,
    inflationDec
  );

  // Apply lifestyle modifier (e.g., Modest 0.8, Premium 1.3)
  futureAnnualExpense *= lifestyleFactor;

  // STEP 2: Calculate Corpus Needed
  let requiredCorpus = calculateRequiredCorpus(
    futureAnnualExpense,
    postRetReturnDec,
    retirementDuration
  );

  // Factoring in Existing Corpus (compounded to retirement age)
  let futureExistingCorpusValue = 0;
  if (existingCorpus > 0 && accumulationYears > 0) {
     futureExistingCorpusValue = existingCorpus * Math.pow(1 + preRetReturnDec, accumulationYears);
  }
  
  // Calculate gap
  const corpusGap = Math.max(0, requiredCorpus - futureExistingCorpusValue);

  // STEP 3: Calculate Monthly SIP
  const requiredSIP = calculateRequiredMonthlySIP(
    corpusGap,
    preRetReturnDec,
    currentAge,
    retirementAge
  );

  return {
    futureMonthlyExpense: futureAnnualExpense / 12,
    futureAnnualExpense,
    totalRequiredCorpus: requiredCorpus,
    futureValueOfExistingCorpus: futureExistingCorpusValue,
    corpusShortfall: corpusGap,
    requiredMonthlySIP: requiredSIP,
    accumulationYears,
    retirementDuration,
    totalInvestedVal: requiredSIP * accumulationYears * 12,
  };
}
