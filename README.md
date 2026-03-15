# HDFC Retirement Planner

A high-precision financial tool designed to estimate required retirement corpuses and monthly SIP investments with mathematical accuracy and strict compliance to HDFC brand guidelines.

## Overview

The HDFC Retirement Planner provides users with a comprehensive view of their financial future. By factoring in current age, retirement goals, inflation, and investment returns, the application calculates the total wealth needed to maintain a specific lifestyle throughout retirement.

## Key Features

- **Dynamic Financial Projections**: Uses the Present Value of Annuity formula to calculate the exact retirement corpus required based on inflation-adjusted expenses.
- **Interactive Modeling**: Real-time updates for SIP requirements as users adjust variables like inflation, returns, and lifestyle standards.
- **Intelligent Validation**: Logical constraints prevent erroneous inputs (e.g., current age exceeding retirement age), ensuring the integrity of financial data.
- **Glassmorphism UI**: A premium, modern interface optimized for clarity, responsiveness (Desktop/Mobile), and accessibility (WCAG 2.1 AA Compliance).
- **Professional Reporting**: Integrated "Download Report" functionality that generates a clean, print-optimized summary of the retirement analysis.

## Tech Stack

- **Framework**: Next.js 15
- **Logic**: Vanilla JavaScript with high-precision mathematical functions.
- **Styling**: Tailwind CSS for responsive and theme-consistent design.
- **Visuals**: Recharts for interactive corpus projection modeling.
- **Testing**: Jest and React Testing Library for verifying financial logic accuracy.
- **Icons**: Lucide-React.

## Getting Started

### Prerequisites

- Node.js (v20.x or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MITARPALGROVER/retirement-calculator.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Financial Logic & Validation

The core calculation engine is located in `lib/retirementCalculations.js`. It performs three primary steps:
1. **Expense Inflation**: Projects current annual expenses to the date of retirement using the compound interest formula.
2. **Corpus Accumulation**: Calculates the target amount needed to sustain those expenses over the user's expected lifespan, adjusted for post-retirement growth.
3. **SIP Derivation**: Determines the monthly investment required to reach the target corpus from the current starting point.

Automated unit tests are available in the `__tests__` directory. Run them using:
```bash
npm test
```

## Compliance Note

This application includes a mandatory disclaimer as per financial regulation requirements. The tool is designed for illustrative purposes and estimates are based on mathematical assumptions.

---
*Created for the HDFC Fintech Hackathon.*
