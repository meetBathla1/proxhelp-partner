import React, { useState, useMemo } from 'react';
import { RotateCcw, Calculator as CalcIcon, Target } from 'lucide-react';

function clamp(n, lo, hi) {
  return Math.min(Math.max(n, lo), hi);
}

const GoalPlanner = () => {
  const [goalAmount, setGoalAmount] = useState(2500000);
  const [years, setYears] = useState(7);
  const [returnRate, setReturnRate] = useState(10);

  const monthlyNeed = useMemo(() => {
    const target = Math.max(0, goalAmount);
    const n = Math.max(1, years * 12);
    const i = Math.max(0, returnRate) / 100 / 12;
    if (i === 0) return target / n;
    return target / ((((Math.pow(1 + i, n) - 1) / i) * (1 + i)));
  }, [goalAmount, years, returnRate]);

  const reset = () => {
    setGoalAmount(2500000);
    setYears(7);
    setReturnRate(10);
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
        <p className="feLumpLux__kicker">Goal Planner</p>
        <h1 className="feLumpLux__title">Achieve Your Dreams</h1>
      </header>

      <section className="feLumpLux__mainCard">
        <div className="feLumpLux__inputsCol">
          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Target Goal Amount (₹)</span>
            <div className="feLumpLux__inputWrap feLumpLux__inputWrap--prefix">
              <span className="feLumpLux__prefix">₹</span>
              <input
                className="feLumpLux__input"
                type="number"
                min={0}
                max={100000000}
                step={50000}
                value={goalAmount}
                onChange={(e) => setGoalAmount(Number(e.target.value))}
              />
            </div>
          </label>

          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Time to Goal (Years)</span>
            <div className="feLumpLux__inputWrap">
              <input
                className="feLumpLux__input"
                type="number"
                min={1}
                max={50}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
              <span className="feLumpLux__suffix feLumpLux__suffix--text">Yrs</span>
            </div>
          </label>

          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Expected Return (% p.a)</span>
            <div className="feLumpLux__inputWrap">
              <input
                className="feLumpLux__input"
                type="number"
                min={0}
                max={30}
                step={0.1}
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
              />
              <span className="feLumpLux__suffix">%</span>
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
          <span className="feLumpLux__quickLabel">Required Monthly Investment</span>
          <span className="feLumpLux__quickVal feLumpLux__quickVal--accent">{formatINR(monthlyNeed)}</span>
        </div>
      </section>
    </div>
  );
};

export default GoalPlanner;
