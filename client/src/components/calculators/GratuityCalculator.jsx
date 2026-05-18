import React, { useState, useMemo } from 'react';
import { RotateCcw, Calculator as CalcIcon, Gift } from 'lucide-react';

function clamp(n, lo, hi) {
  return Math.min(Math.max(n, lo), hi);
}

const GratuityCalculator = () => {
  const [monthlySalary, setMonthlySalary] = useState(50000);
  const [years, setYears] = useState(7);

  const amount = useMemo(() => {
    if (years < 5) return 0;
    return (monthlySalary * 15 * years) / 26;
  }, [monthlySalary, years]);

  const reset = () => {
    setMonthlySalary(50000);
    setYears(7);
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
        <p className="feLumpLux__kicker">Gratuity Calculator</p>
        <h1 className="feLumpLux__title">Retirement Benefits</h1>
      </header>

      <section className="feLumpLux__mainCard">
        <div className="feLumpLux__inputsCol">
          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Last Drawn Salary (Basic + DA)</span>
            <div className="feLumpLux__inputWrap feLumpLux__inputWrap--prefix">
              <span className="feLumpLux__prefix">₹</span>
              <input
                className="feLumpLux__input"
                type="number"
                min={0}
                max={10000000}
                step={1000}
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(Number(e.target.value))}
              />
            </div>
          </label>

          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Years of Service</span>
            <div className="feLumpLux__inputWrap">
              <input
                className="feLumpLux__input"
                type="number"
                min={0}
                max={50}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
              <span className="feLumpLux__suffix feLumpLux__suffix--text">Yrs</span>
            </div>
            <span className="feSipLux__fieldHint">Minimum 5 years required for eligibility</span>
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
          <span className="feLumpLux__quickLabel">Estimated Gratuity</span>
          <span className="feLumpLux__quickVal feLumpLux__quickVal--accent">
            {years < 5 ? 'Not eligible' : formatINR(amount)}
          </span>
        </div>
      </section>
    </div>
  );
};

export default GratuityCalculator;
