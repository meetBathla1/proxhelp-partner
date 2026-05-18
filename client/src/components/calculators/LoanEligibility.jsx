import React, { useState, useMemo } from 'react';
import { RotateCcw, Calculator as CalcIcon, ShieldCheck } from 'lucide-react';

function clamp(n, lo, hi) {
  return Math.min(Math.max(n, lo), hi);
}

function principalFromEmi(emi, annualRatePct, years) {
  const n = Math.max(1, Math.round(years * 12));
  const r = Math.max(0, annualRatePct) / 100 / 12;
  if (emi <= 0) return 0;
  if (r === 0) return emi * n;
  return (emi * (1 - Math.pow(1 + r, -n))) / r;
}

const LoanEligibility = () => {
  const [salary, setSalary] = useState(50000);
  const [currentEmi, setCurrentEmi] = useState(0);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(20);
  const [foir, setFoir] = useState(50);

  const results = useMemo(() => {
    const s = Math.max(0, salary);
    const emi = Math.max(0, currentEmi);
    const r = rate;
    const t = years;
    const foirRatio = clamp(foir / 100, 0.1, 0.95);
    const maxOb = s * foirRatio;
    const avail = Math.max(0, maxOb - emi);
    const principal = principalFromEmi(avail, r, t);
    return {
      maxObligation: Math.round(maxOb),
      availableEmi: Math.round(avail),
      eligiblePrincipal: Math.round(principal)
    };
  }, [salary, currentEmi, rate, years, foir]);

  const reset = () => {
    setSalary(50000);
    setCurrentEmi(0);
    setRate(9);
    setYears(20);
    setFoir(50);
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
        <p className="feLumpLux__kicker">Eligibility Calculator</p>
        <h1 className="feLumpLux__title">How Much Can You Borrow?</h1>
      </header>

      <section className="feLumpLux__mainCard">
        <div className="feLumpLux__inputsCol">
          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Monthly Salary (₹)</span>
            <div className="feLumpLux__inputWrap feLumpLux__inputWrap--prefix">
              <span className="feLumpLux__prefix">₹</span>
              <input
                className="feLumpLux__input"
                type="number"
                min={10000}
                max={1000000}
                step={1000}
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
              />
            </div>
          </label>

          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Current Monthly EMIs (₹)</span>
            <div className="feLumpLux__inputWrap feLumpLux__inputWrap--prefix">
              <span className="feLumpLux__prefix">₹</span>
              <input
                className="feLumpLux__input"
                type="number"
                min={0}
                max={500000}
                step={500}
                value={currentEmi}
                onChange={(e) => setCurrentEmi(Number(e.target.value))}
              />
            </div>
          </label>

          <div className="feSipLux__freq">
            <span className="feLumpLux__fieldLabel">Select FOIR (%)</span>
            <div className="feSipLux__freqSeg">
              {[50, 60, 70].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  className={`feSipLux__freqBtn ${foir === pct ? 'is-active' : ''}`}
                  onClick={() => setFoir(pct)}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          <div className="feLumpLux__topGrid">
            <label className="feLumpLux__field">
              <span className="feLumpLux__fieldLabel">Rate (% p.a.)</span>
              <input
                className="feLumpLux__input"
                type="number"
                min={1}
                max={25}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </label>
            <label className="feLumpLux__field">
              <span className="feLumpLux__fieldLabel">Tenure (Yrs)</span>
              <input
                className="feLumpLux__input"
                type="number"
                min={1}
                max={30}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </label>
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
          <span className="feLumpLux__quickLabel">Max Loan Eligibility</span>
          <span className="feLumpLux__quickVal feLumpLux__quickVal--accent">{formatINR(results.eligiblePrincipal)}</span>
        </div>
      </section>

      <section className="feLumpLux__quickRow" style={{ marginTop: '0' }}>
        <div className="feLumpLux__quickCard">
          <span className="feLumpLux__quickLabel">Max EMI</span>
          <span className="feLumpLux__quickVal">{formatINR(results.maxObligation)}</span>
        </div>
        <div className="feLumpLux__quickCard">
          <span className="feLumpLux__quickLabel">Available EMI</span>
          <span className="feLumpLux__quickVal">{formatINR(results.availableEmi)}</span>
        </div>
      </section>
    </div>
  );
};

export default LoanEligibility;
