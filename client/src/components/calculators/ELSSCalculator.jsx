import React, { useState, useMemo } from 'react';
import { RotateCcw, Calculator as CalcIcon, TrendingUp } from 'lucide-react';

function clamp(n, lo, hi) {
  return Math.min(Math.max(n, lo), hi);
}

const ELSSCalculator = () => {
  const [amount, setAmount] = useState(5000);
  const [rate, setRate] = useState(14);
  const [years, setYears] = useState(3); // Minimum lock-in

  const results = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const totalInvested = amount * months;
    const futureValue = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    
    // Tax saving: assuming 30% slab for max benefit
    const annualInvested = amount * 12;
    const taxSaving = Math.min(annualInvested, 150000) * 0.312; // 30% + 4% cess

    return {
      invested: Math.round(totalInvested),
      future: Math.round(futureValue),
      earnings: Math.round(futureValue - totalInvested),
      taxSaving: Math.round(taxSaving)
    };
  }, [amount, rate, years]);

  const reset = () => {
    setAmount(5000);
    setRate(14);
    setYears(3);
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
        <p className="feLumpLux__kicker">ELSS Tax Saving Plan</p>
        <h1 className="feLumpLux__title">Save Tax & Build Wealth</h1>
      </header>

      <section className="feLumpLux__mainCard">
        <div className="feLumpLux__inputsCol">
          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Monthly SIP Amount (₹)</span>
            <div className="feLumpLux__inputWrap feLumpLux__inputWrap--prefix">
              <span className="feLumpLux__prefix">₹</span>
              <input
                className="feLumpLux__input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
          </label>

          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Expected Return (% p.a.)</span>
            <div className="feLumpLux__inputWrap">
              <input
                className="feLumpLux__input"
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
              <span className="feLumpLux__suffix">%</span>
            </div>
          </label>

          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Tenure (Years)</span>
            <div className="feLumpLux__inputWrap">
              <input
                className="feLumpLux__input"
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
              <span className="feLumpLux__suffix feLumpLux__suffix--text">Yrs</span>
            </div>
            <span className="feSipLux__fieldHint">Minimum 3-year lock-in period</span>
          </label>
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
        <div className="feLumpLux__quickCard">
          <span className="feLumpLux__quickLabel">Future Value</span>
          <span className="feLumpLux__quickVal">{formatINR(results.future)}</span>
        </div>
        <div className="feLumpLux__quickCard feLumpLux__quickCard--accent">
          <span className="feLumpLux__quickLabel">Annual Tax Saved</span>
          <span className="feLumpLux__quickVal feLumpLux__quickVal--accent">{formatINR(results.taxSaving)}</span>
        </div>
      </section>

      <div className="feLumpLux__compoundCol" style={{ minHeight: 'auto', padding: '12px' }}>
         <p className="feLumpLux__compoundHint" style={{ color: '#1a4b8c' }}>
           Invest up to ₹1.5 Lakh under Section 80C to save tax.
         </p>
      </div>
    </div>
  );
};

export default ELSSCalculator;
