import React, { useState, useMemo } from 'react';
import { RotateCcw, Calculator as CalcIcon, ShieldPlus } from 'lucide-react';

const NPSCalculator = () => {
  const [monthly, setMonthly] = useState(10000);
  const [age, setAge] = useState(30);
  const [rate, setRate] = useState(10);
  const [annuityPct, setAnnuityPct] = useState(40);
  const [annuityRate, setAnnuityRate] = useState(6);

  const results = useMemo(() => {
    const years = 60 - age;
    const months = years * 12;
    const monthlyRate = rate / 100 / 12;
    
    const corpus = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const annuityAmount = (corpus * annuityPct) / 100;
    const lumpSum = corpus - annuityAmount;
    const monthlyPension = (annuityAmount * (annuityRate / 100)) / 12;

    return {
      corpus: Math.round(corpus),
      lumpSum: Math.round(lumpSum),
      pension: Math.round(monthlyPension)
    };
  }, [monthly, age, rate, annuityPct, annuityRate]);

  const reset = () => {
    setMonthly(10000);
    setAge(30);
    setRate(10);
    setAnnuityPct(40);
    setAnnuityRate(6);
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
        <p className="feLumpLux__kicker">NPS Calculator</p>
        <h1 className="feLumpLux__title">National Pension System</h1>
      </header>

      <section className="feLumpLux__mainCard">
        <div className="feLumpLux__inputsCol">
          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Monthly Contribution (₹)</span>
            <div className="feLumpLux__inputWrap feLumpLux__inputWrap--prefix">
              <span className="feLumpLux__prefix">₹</span>
              <input
                className="feLumpLux__input"
                type="number"
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
              />
            </div>
          </label>

          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Your Current Age</span>
            <div className="feLumpLux__inputWrap">
              <input
                className="feLumpLux__input"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
              />
              <span className="feLumpLux__suffix feLumpLux__suffix--text">Yrs</span>
            </div>
            <span className="feSipLux__fieldHint">Retirement at 60</span>
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
          <span className="feLumpLux__quickLabel">Total Corpus at 60</span>
          <span className="feLumpLux__quickVal feLumpLux__quickVal--accent">{formatINR(results.corpus)}</span>
        </div>
      </section>

      <section className="feLumpLux__quickRow">
        <div className="feLumpLux__quickCard">
          <span className="feLumpLux__quickLabel">Lump Sum</span>
          <span className="feLumpLux__quickVal">{formatINR(results.lumpSum)}</span>
        </div>
        <div className="feLumpLux__quickCard">
          <span className="feLumpLux__quickLabel">Monthly Pension</span>
          <span className="feLumpLux__quickVal">{formatINR(results.pension)}</span>
        </div>
      </section>
    </div>
  );
};

export default NPSCalculator;
