import React, { useState, useRef, useMemo } from 'react';
import { TrendingUp, RotateCcw, Calculator as CalcIcon, ArrowUpRight } from 'lucide-react';

function clamp(n, lo, hi) {
  return Math.min(Math.max(n, lo), hi);
}

const STEP_UP_PCT = 10;

const SIPCalculator = () => {
  const [frequency, setFrequency] = useState('monthly');
  const [amount, setAmount] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [stepUp, setStepUp] = useState(false);

  const ctaRef = useRef(null);

  const reset = () => {
    setFrequency('monthly');
    setAmount(5000);
    setRate(12);
    setYears(10);
    setStepUp(false);
  };

  const calculateSIP = () => {
    let totalInvested = 0;
    let futureValue = 0;
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    let currentAmount = amount;

    if (frequency === 'monthly') {
      if (stepUp) {
        for (let year = 1; year <= years; year++) {
          for (let month = 1; month <= 12; month++) {
            totalInvested += currentAmount;
            futureValue = (futureValue + currentAmount) * (1 + monthlyRate);
          }
          currentAmount = currentAmount * (1 + STEP_UP_PCT / 100);
        }
      } else {
        totalInvested = amount * months;
        futureValue = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      }
    } else {
      // Yearly logic
      const yearlyRate = rate / 100;
      if (stepUp) {
        for (let year = 1; year <= years; year++) {
          totalInvested += currentAmount;
          futureValue = (futureValue + currentAmount) * (1 + yearlyRate);
          currentAmount = currentAmount * (1 + STEP_UP_PCT / 100);
        }
      } else {
        totalInvested = amount * years;
        futureValue = amount * ((Math.pow(1 + yearlyRate, years) - 1) / yearlyRate) * (1 + yearlyRate);
      }
    }

    return {
      invested: Math.round(totalInvested),
      future: Math.round(futureValue),
      earnings: Math.round(futureValue - totalInvested)
    };
  };

  const results = useMemo(calculateSIP, [amount, rate, years, stepUp, frequency]);

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const investLabel = frequency === 'monthly' ? 'Investment amount (₹)' : 'Yearly investment (₹)';
  const investHint = frequency === 'monthly' ? 'Per month' : 'Once every year';
  const amountMin = frequency === 'monthly' ? 500 : 5000;
  const amountMax = frequency === 'monthly' ? 1000000 : 5000000;
  const amountStep = frequency === 'monthly' ? 500 : 5000;

  return (
    <div className="feLumpLux">
      <header className="feLumpLux__pageHead">
        <p className="feLumpLux__kicker">SIP Calculator</p>
        <h1 className="feLumpLux__title">Wealth Builder Plan</h1>
      </header>

      <section className="feLumpLux__mainCard">
        <div className="feLumpLux__topGrid">
          <div className="feLumpLux__inputsCol">
            <div className="feSipLux__freq">
              <span className="feLumpLux__fieldLabel">Frequency</span>
              <div className="feSipLux__freqSeg">
                <button
                  type="button"
                  className={`feSipLux__freqBtn ${frequency === 'monthly' ? 'is-active' : ''}`}
                  onClick={() => setFrequency('monthly')}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  className={`feSipLux__freqBtn ${frequency === 'yearly' ? 'is-active' : ''}`}
                  onClick={() => setFrequency('yearly')}
                >
                  Yearly
                </button>
              </div>
            </div>

            <label className="feLumpLux__field">
              <span className="feLumpLux__fieldLabel">{investLabel}</span>
              <div className="feLumpLux__inputWrap feLumpLux__inputWrap--prefix">
                <span className="feLumpLux__prefix">₹</span>
                <input
                  className="feLumpLux__input"
                  type="number"
                  min={amountMin}
                  max={amountMax}
                  step={amountStep}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  onBlur={() => setAmount(amount === '' ? '' : clamp(Math.round(Number(amount)), amountMin, amountMax))}
                />
              </div>
              <span className="feSipLux__fieldHint">{investHint}</span>
            </label>

            <label className="feLumpLux__field">
              <span className="feLumpLux__fieldLabel">Expected returns (% p.a.)</span>
              <div className="feLumpLux__inputWrap">
                <input
                  className="feLumpLux__input"
                  type="number"
                  min={1}
                  max={30}
                  step={0.1}
                  value={rate}
                  onChange={(e) => setRate(e.target.value === '' ? '' : Number(e.target.value))}
                  onBlur={() => setRate(rate === '' ? '' : clamp(Number(rate), 1, 30))}
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

          <div className="feLumpLux__compoundCol">
            <div className="feSipLux__stepRow">
              <div className="feSipLux__stepTitles">
                <span className="feSipLux__stepName">Annual step-up</span>
                <span className="feSipLux__stepCaps">Increase yearly</span>
              </div>
              <button
                type="button"
                className={`feLumpLux__switch ${stepUp ? 'is-on' : ''}`}
                onClick={() => setStepUp(!stepUp)}
              >
                <span className="feLumpLux__switchKnob" />
              </button>
            </div>
            <p className="feLumpLux__compoundHint">
              {stepUp
                ? `Investment rises ${STEP_UP_PCT}% every year.`
                : 'Fixed instalment every year.'}
            </p>
            <div className="feLumpLux__actions" style={{ flexDirection: 'column', width: '100%' }}>
              <button type="button" className="feLumpLux__btnCalc" style={{ width: '100%' }} onClick={() => {}}>
                <CalcIcon size={18} /> Calculate
              </button>
              <button type="button" className="feLumpLux__btnReset" style={{ width: '100%', minWidth: 'auto' }} onClick={reset}>
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="feLumpLux__quickRow">
        <div className="feLumpLux__quickCard">
          <span className="feLumpLux__quickLabel">Future Value</span>
          <span className="feLumpLux__quickVal">{formatINR(results.future)}</span>
        </div>
        <div className="feLumpLux__quickCard">
          <span className="feLumpLux__quickLabel">Invested</span>
          <span className="feLumpLux__quickVal">{formatINR(results.invested)}</span>
        </div>
        <div className="feLumpLux__quickCard feLumpLux__quickCard--accent">
          <span className="feLumpLux__quickLabel">Earnings</span>
          <span className="feLumpLux__quickVal feLumpLux__quickVal--accent">{formatINR(results.earnings)}</span>
        </div>
      </section>
    </div>
  );
};

export default SIPCalculator;
