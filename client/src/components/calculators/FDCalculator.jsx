import React, { useState, useMemo } from 'react';
import { RotateCcw, Calculator as CalcIcon, Landmark } from 'lucide-react';

function clamp(n, lo, hi) {
  return Math.min(Math.max(n, lo), hi);
}

const FDCalculator = () => {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(7.5);
  const [years, setYears] = useState(5);

  const results = useMemo(() => {
    const p = amount;
    const r = rate / 100;
    const t = years;
    const n = 4; // Quarterly compounding
    const maturity = p * Math.pow(1 + r / n, n * t);
    const interest = maturity - p;

    return {
      interest: Math.round(interest),
      maturity: Math.round(maturity)
    };
  }, [amount, rate, years]);

  const reset = () => {
    setAmount(100000);
    setRate(7.5);
    setYears(5);
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
        <p className="feLumpLux__kicker">Fixed Deposit Calculator</p>
        <h1 className="feLumpLux__title">Secure Your Savings</h1>
      </header>

      <section className="feLumpLux__mainCard">
        <div className="feLumpLux__inputsCol">
          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Deposit Amount (₹)</span>
            <div className="feLumpLux__inputWrap feLumpLux__inputWrap--prefix">
              <span className="feLumpLux__prefix">₹</span>
              <input
                className="feLumpLux__input"
                type="number"
                min={1000}
                max={10000000}
                step={5000}
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                onBlur={() => setAmount(amount === '' ? '' : clamp(Math.round(Number(amount)), 1000, 10000000))}
              />
            </div>
          </label>

          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Interest Rate (% p.a.)</span>
            <div className="feLumpLux__inputWrap">
              <input
                className="feLumpLux__input"
                type="number"
                min={1}
                max={15}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(e.target.value === '' ? '' : Number(e.target.value))}
                onBlur={() => setRate(rate === '' ? '' : clamp(Number(rate), 1, 15))}
              />
              <span className="feLumpLux__suffix">%</span>
            </div>
          </label>

          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Tenure (years)</span>
            <div className="feLumpLux__inputWrap">
              <input
                className="feLumpLux__input"
                type="number"
                min={1}
                max={10}
                step={1}
                value={years}
                onChange={(e) => setYears(e.target.value === '' ? '' : Number(e.target.value))}
                onBlur={() => setYears(years === '' ? '' : clamp(Math.round(Number(years)), 1, 10))}
              />
              <span className="feLumpLux__suffix feLumpLux__suffix--text">Yrs</span>
            </div>
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
          <span className="feLumpLux__quickLabel">Maturity Amount</span>
          <span className="feLumpLux__quickVal">{formatINR(results.maturity)}</span>
        </div>
        <div className="feLumpLux__quickCard">
          <span className="feLumpLux__quickLabel">Invested</span>
          <span className="feLumpLux__quickVal">{formatINR(amount)}</span>
        </div>
        <div className="feLumpLux__quickCard feLumpLux__quickCard--accent">
          <span className="feLumpLux__quickLabel">Interest Earned</span>
          <span className="feLumpLux__quickVal feLumpLux__quickVal--accent">{formatINR(results.interest)}</span>
        </div>
      </section>
    </div>
  );
};

export default FDCalculator;
