import React, { useState, useMemo } from 'react';
import { RotateCcw, Calculator as CalcIcon, PieChart } from 'lucide-react';

function clamp(n, lo, hi) {
  return Math.min(Math.max(n, lo), hi);
}

const EMICalculator = () => {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(5);

  const results = useMemo(() => {
    const p = Number(amount) || 0;
    const r = (Number(rate) || 0) / 12 / 100;
    const n = (Number(years) || 0) * 12;
    const emi = (p === 0 || r === 0 || n === 0) ? 0 : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment > p ? totalPayment - p : 0;

    return {
      emi: Math.round(emi) || 0,
      interest: Math.round(totalInterest) || 0,
      total: Math.round(totalPayment) || 0
    };
  }, [amount, rate, years]);

  const reset = () => {
    setAmount(1000000);
    setRate(9);
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
        <p className="feLumpLux__kicker">Loan EMI Calculator</p>
        <h1 className="feLumpLux__title">Plan Your Repayments</h1>
      </header>

      <section className="feLumpLux__mainCard">
        <div className="feLumpLux__inputsCol">
          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Loan Amount (₹)</span>
            <div className="feLumpLux__inputWrap feLumpLux__inputWrap--prefix">
              <span className="feLumpLux__prefix">₹</span>
              <input
                className="feLumpLux__input"
                type="number"
                min={10000}
                max={100000000}
                step={10000}
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                onBlur={() => setAmount(amount === '' ? '' : clamp(Math.round(Number(amount)), 10000, 100000000))}
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
                max={50}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(e.target.value === '' ? '' : Number(e.target.value))}
                onBlur={() => setRate(rate === '' ? '' : clamp(Number(rate), 1, 50))}
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
                max={30}
                step={1}
                value={years}
                onChange={(e) => setYears(e.target.value === '' ? '' : Number(e.target.value))}
                onBlur={() => setYears(years === '' ? '' : clamp(Math.round(Number(years)), 1, 30))}
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
        <div className="feLumpLux__quickCard feLumpLux__quickCard--accent">
          <span className="feLumpLux__quickLabel">Monthly EMI</span>
          <span className="feLumpLux__quickVal feLumpLux__quickVal--accent">{formatINR(results.emi)}</span>
        </div>
      </section>

      <section className="feLumpLux__quickRow" style={{ marginTop: '0' }}>
        <div className="feLumpLux__quickCard">
          <span className="feLumpLux__quickLabel">Principal</span>
          <span className="feLumpLux__quickVal">{formatINR(amount)}</span>
        </div>
        <div className="feLumpLux__quickCard">
          <span className="feLumpLux__quickLabel">Interest</span>
          <span className="feLumpLux__quickVal">{formatINR(results.interest)}</span>
        </div>
        <div className="feLumpLux__quickCard">
          <span className="feLumpLux__quickLabel">Total Payable</span>
          <span className="feLumpLux__quickVal">{formatINR(results.total)}</span>
        </div>
      </section>
    </div>
  );
};

export default EMICalculator;
