import React, { useState, useMemo } from 'react';
import { RotateCcw, Calculator as CalcIcon, Clock } from 'lucide-react';

function clamp(n, lo, hi) {
  return Math.min(Math.max(n, lo), hi);
}

const RDCalculator = () => {
  const [amount, setAmount] = useState(5000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);

  const results = useMemo(() => {
    const P = amount;
    const r = rate / 100;
    const n = 4; // Compounded quarterly
    const months = years * 12;
    
    let maturityValue = 0;
    for (let i = 1; i <= months; i++) {
        maturityValue += P * Math.pow(1 + r/n, n * (months - i + 1) / 12);
    }

    const totalInvested = P * months;
    const totalInterest = maturityValue - totalInvested;

    return {
      invested: Math.round(totalInvested),
      interest: Math.round(totalInterest),
      maturity: Math.round(maturityValue)
    };
  }, [amount, rate, years]);

  const reset = () => {
    setAmount(5000);
    setRate(7);
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
        <p className="feLumpLux__kicker">RD Calculator</p>
        <h1 className="feLumpLux__title">Recurring Savings</h1>
      </header>

      <section className="feLumpLux__mainCard">
        <div className="feLumpLux__inputsCol">
          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Monthly Deposit (₹)</span>
            <div className="feLumpLux__inputWrap feLumpLux__inputWrap--prefix">
              <span className="feLumpLux__prefix">₹</span>
              <input
                className="feLumpLux__input"
                type="number"
                min={500}
                max={1000000}
                step={500}
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                onBlur={() => setAmount(amount === '' ? '' : clamp(Math.round(Number(amount)), 500, 1000000))}
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
                max={25}
                step={1}
                value={years}
                onChange={(e) => setYears(e.target.value === '' ? '' : Number(e.target.value))}
                onBlur={() => setYears(years === '' ? '' : clamp(Math.round(Number(years)), 1, 25))}
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

export default RDCalculator;
