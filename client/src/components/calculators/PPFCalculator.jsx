import React, { useState, useMemo } from 'react';
import { RotateCcw, Calculator as CalcIcon, ShieldPlus } from 'lucide-react';

function clamp(n, lo, hi) {
  return Math.min(Math.max(n, lo), hi);
}

const PPFCalculator = () => {
  const [amount, setAmount] = useState(50000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(15);

  const results = useMemo(() => {
    const P = amount;
    const r = rate / 100;
    const n = years;
    
    // PPF compounding: annually
    // F = P [({(1+i)^n}-1)/i] * (1+i) if deposited at start of year
    // But usually calculated year by year
    let maturityValue = 0;
    for (let i = 1; i <= n; i++) {
        maturityValue = (maturityValue + P) * (1 + r);
    }

    const totalInvested = P * n;
    const totalInterest = maturityValue - totalInvested;

    return {
      invested: Math.round(totalInvested),
      interest: Math.round(totalInterest),
      maturity: Math.round(maturityValue)
    };
  }, [amount, rate, years]);

  const reset = () => {
    setAmount(50000);
    setRate(7.1);
    setYears(15);
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
        <p className="feLumpLux__kicker">PPF Calculator</p>
        <h1 className="feLumpLux__title">Secure Long-term Savings</h1>
      </header>

      <section className="feLumpLux__mainCard">
        <div className="feLumpLux__inputsCol">
          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Yearly Deposit (₹)</span>
            <div className="feLumpLux__inputWrap feLumpLux__inputWrap--prefix">
              <span className="feLumpLux__prefix">₹</span>
              <input
                className="feLumpLux__input"
                type="number"
                min={500}
                max={150000}
                step={500}
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                onBlur={() => setAmount(amount === '' ? '' : clamp(Math.round(Number(amount)), 500, 150000))}
              />
            </div>
            <span className="feSipLux__fieldHint">Max limit: ₹1,50,000 per year</span>
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
                readOnly
                style={{ opacity: 0.8 }}
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
                min={15}
                max={50}
                step={5}
                value={years}
                onChange={(e) => setYears(e.target.value === '' ? '' : Number(e.target.value))}
                onBlur={() => setYears(years === '' ? '' : clamp(Math.round(Number(years)), 15, 50))}
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
          <span className="feLumpLux__quickVal">{formatINR(results.invested)}</span>
        </div>
        <div className="feLumpLux__quickCard feLumpLux__quickCard--accent">
          <span className="feLumpLux__quickLabel">Interest Earned</span>
          <span className="feLumpLux__quickVal feLumpLux__quickVal--accent">{formatINR(results.interest)}</span>
        </div>
      </section>
    </div>
  );
};

export default PPFCalculator;
