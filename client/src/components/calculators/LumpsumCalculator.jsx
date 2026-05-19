import React, { useState, useMemo, useId } from 'react';
import { RotateCcw, Calculator as CalcIcon, TrendingUp } from 'lucide-react';

function clamp(n, lo, hi) {
  return Math.min(Math.max(n, lo), hi);
}

function futureAtYear(principal, ratePct, y) {
  const p = Math.max(0, principal);
  const r = Math.max(0, ratePct) / 100;
  if (y <= 0) return p;
  return p * Math.pow(1 + r, y);
}

const LumpsumCalculator = () => {
  const [amount, setAmount] = useState(50000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const areaGradId = `feLumpArea-${useId().replace(/:/g, '')}`;

  const futureValue = useMemo(() => futureAtYear(amount, rate, years), [amount, rate, years]);
  const invested = amount;
  const earnings = Math.max(0, futureValue - invested);

  const chartPaths = useMemo(() => {
    const padL = 38;
    const padR = 14;
    const padT = 18;
    const padB = 30;
    const W = 340;
    const H = 178;
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;
    const n = Math.max(1, Math.round(years));

    const topVal = Math.max(futureValue, invested, 1);
    const botVal = Math.min(invested, futureValue);
    const padY = Math.max(topVal * 0.02, 1);
    const yMax = topVal + padY * 2;
    const yMin = Math.max(0, botVal - padY);
    const yRange = Math.max(yMax - yMin, 1);

    const xAtYear = (ty) => padL + (ty / n) * innerW;
    const yAt = (v) => padT + innerH - ((v - yMin) / yRange) * innerH;
    const yBase = padT + innerH;

    const samples = 72;
    const futPts = [];
    for (let s = 0; s <= samples; s += 1) {
      const ty = (s / samples) * n;
      const fv = futureAtYear(amount, rate, ty);
      futPts.push({ x: xAtYear(ty), y: yAt(fv) });
    }
    const futPath = futPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');

    const invY = yAt(invested);
    const invPath = `M ${padL.toFixed(2)} ${invY.toFixed(2)} L ${(padL + innerW).toFixed(2)} ${invY.toFixed(2)}`;

    const last = futPts[futPts.length - 1];
    const areaPath = `${futPath} L ${last.x.toFixed(2)} ${yBase} L ${padL.toFixed(2)} ${yBase} Z`;

    const ticks = Array.from({ length: n + 1 }, (_, i) => i);

    return { futPath, invPath, areaPath, ticks, W, H, padT, yBase, xAt: xAtYear };
  }, [amount, rate, years, futureValue, invested]);

  const reset = () => {
    setAmount(50000);
    setRate(12);
    setYears(10);
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
        <p className="feLumpLux__kicker">Lumpsum Calculator</p>
        <h1 className="feLumpLux__title">One-time Investment</h1>
      </header>

      <section className="feLumpLux__mainCard">
        <div className="feLumpLux__inputsCol">
          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Investment amount (₹)</span>
            <div className="feLumpLux__inputWrap feLumpLux__inputWrap--prefix">
              <span className="feLumpLux__prefix">₹</span>
              <input
                className="feLumpLux__input"
                type="number"
                min={5000}
                max={10000000}
                step={5000}
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                onBlur={() => setAmount(amount === '' ? '' : clamp(Math.round(Number(amount)), 5000, 10000000))}
              />
            </div>
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
          <span className="feLumpLux__quickVal">{formatINR(futureValue)}</span>
        </div>
        <div className="feLumpLux__quickCard">
          <span className="feLumpLux__quickLabel">Invested</span>
          <span className="feLumpLux__quickVal">{formatINR(invested)}</span>
        </div>
        <div className="feLumpLux__quickCard feLumpLux__quickCard--accent">
          <span className="feLumpLux__quickLabel">Earnings</span>
          <span className="feLumpLux__quickVal feLumpLux__quickVal--accent">{formatINR(earnings)}</span>
        </div>
      </section>

      <section className="feLumpLux__chartCard">
        <div className="feLumpLux__chartHead">
          <div className="feLumpLux__chartIcon"><TrendingUp size={20} /></div>
          <h2 className="feLumpLux__chartTitle">Wealth Growth</h2>
        </div>
        <div className="feLumpLux__chartSvgWrap">
          <svg className="feLumpLux__chartSvg" viewBox={`0 0 ${chartPaths.W} ${chartPaths.H}`} preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id={areaGradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a4b8c" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#1a4b8c" stopOpacity="0" />
              </linearGradient>
            </defs>
            {chartPaths.ticks.map((i) => (
              <line key={i} x1={chartPaths.xAt(i)} y1={chartPaths.padT} x2={chartPaths.xAt(i)} y2={chartPaths.yBase} className="feLumpLux__chartGridV" />
            ))}
            <line x1={38} y1={chartPaths.yBase} x2={chartPaths.W - 14} y2={chartPaths.yBase} className="feLumpLux__chartAxisX" />
            <path d={chartPaths.areaPath} fill={`url(#${areaGradId})`} />
            <path d={chartPaths.invPath} fill="none" stroke="#ff7a1a" strokeWidth="2.5" />
            <path d={chartPaths.futPath} fill="none" stroke="#1a4b8c" strokeWidth="2.5" />
          </svg>
        </div>
        <div className="feLumpLux__legend">
          <span className="feLumpLux__legendItem"><span className="feLumpLux__dot feLumpLux__dot--blue" /> Future Value</span>
          <span className="feLumpLux__legendItem"><span className="feLumpLux__dot feLumpLux__dot--orange" /> Invested</span>
        </div>
      </section>
    </div>
  );
};

export default LumpsumCalculator;
