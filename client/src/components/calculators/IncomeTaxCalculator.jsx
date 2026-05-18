import React, { useState, useMemo } from 'react';
import { RotateCcw, Calculator as CalcIcon, Receipt } from 'lucide-react';

function clamp(n, lo, hi) {
  return Math.min(Math.max(n, lo), hi);
}

const IncomeTaxCalculator = () => {
  const [income, setIncome] = useState(1200000);
  const [investments, setInvestments] = useState(0); // For Old Regime if needed, but keeping it simple for now

  const results = useMemo(() => {
    const stdDed = 75000;
    const taxableIncome = Math.max(0, income - stdDed);
    
    let tax = 0;
    
    if (taxableIncome <= 700000) {
      tax = 0; // Rebate under Section 87A
    } else {
      // Slab 1: 3L - 7L (4L @ 5%)
      if (taxableIncome > 300000) tax += Math.min(taxableIncome - 300000, 400000) * 0.05;
      // Slab 2: 7L - 10L (3L @ 10%)
      if (taxableIncome > 700000) tax += Math.min(taxableIncome - 700000, 300000) * 0.10;
      // Slab 3: 10L - 12L (2L @ 15%)
      if (taxableIncome > 1000000) tax += Math.min(taxableIncome - 1000000, 200000) * 0.15;
      // Slab 4: 12L - 15L (3L @ 20%)
      if (taxableIncome > 1200000) tax += Math.min(taxableIncome - 1200000, 300000) * 0.20;
      // Slab 5: Above 15L (30%)
      if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.30;
      
      tax = tax * 1.04; // 4% Cess
    }

    return {
      tax: Math.round(tax),
      takeHome: Math.round(income - tax),
      monthly: Math.round((income - tax) / 12)
    };
  }, [income]);

  const reset = () => {
    setIncome(1200000);
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="feLumpLux">
      <header className="feLumpLux__pageHead">
        <p className="feLumpLux__kicker">Income Tax Calculator</p>
        <h1 className="feLumpLux__title">FY 2024-25 (New Regime)</h1>
      </header>

      <section className="feLumpLux__mainCard">
        <div className="feLumpLux__inputsCol">
          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Annual Gross Salary (₹)</span>
            <div className="feLumpLux__inputWrap feLumpLux__inputWrap--prefix">
              <span className="feLumpLux__prefix">₹</span>
              <input
                className="feLumpLux__input"
                type="number"
                min={0}
                max={100000000}
                step={50000}
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                onBlur={() => setIncome(Math.max(0, income))}
              />
            </div>
            <span className="feSipLux__fieldHint">Includes all bonuses & allowances</span>
          </label>
          
          <div className="feLumpLux__compoundCol" style={{ minHeight: 'auto', padding: '12px' }}>
             <p className="feLumpLux__compoundHint" style={{ color: '#1a4b8c' }}>
               Standard deduction of ₹75,000 applied automatically.
             </p>
          </div>
        </div>

        <div className="feLumpLux__actions">
          <button type="button" className="feLumpLux__btnReset" onClick={reset}>
            <RotateCcw size={16} /> Reset
          </button>
          <button type="button" className="feLumpLux__btnCalc" onClick={() => {}}>
            <CalcIcon size={18} /> Calculate
          </button>
        </div>
      </section>

      <section className="feLumpLux__quickRow">
        <div className="feLumpLux__quickCard feLumpLux__quickCard--accent">
          <span className="feLumpLux__quickLabel">Total Annual Tax</span>
          <span className="feLumpLux__quickVal feLumpLux__quickVal--accent">{formatINR(results.tax)}</span>
        </div>
      </section>

      <section className="feLumpLux__quickRow" style={{ marginTop: '0' }}>
        <div className="feLumpLux__quickCard">
          <span className="feLumpLux__quickLabel">Post-tax Income</span>
          <span className="feLumpLux__quickVal">{formatINR(results.takeHome)}</span>
        </div>
        <div className="feLumpLux__quickCard">
          <span className="feLumpLux__quickLabel">Monthly Take-home</span>
          <span className="feLumpLux__quickVal">{formatINR(results.monthly)}</span>
        </div>
      </section>
    </div>
  );
};

export default IncomeTaxCalculator;
