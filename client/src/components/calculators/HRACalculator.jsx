import React, { useState, useMemo } from 'react';
import { RotateCcw, Calculator as CalcIcon, Home } from 'lucide-react';

const HRACalculator = () => {
  const [basic, setBasic] = useState(500000);
  const [hra, setHra] = useState(200000);
  const [rent, setRent] = useState(150000);
  const [isMetro, setIsMetro] = useState(true);

  const exemption = useMemo(() => {
    const basicDA = basic;
    const hraReceived = hra;
    const rentPaid = rent;
    
    const condition1 = hraReceived;
    const condition2 = isMetro ? 0.5 * basicDA : 0.4 * basicDA;
    const condition3 = Math.max(0, rentPaid - 0.1 * basicDA);
    
    return Math.min(condition1, condition2, condition3);
  }, [basic, hra, rent, isMetro]);

  const reset = () => {
    setBasic(500000);
    setHra(200000);
    setRent(150000);
    setIsMetro(true);
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
        <p className="feLumpLux__kicker">HRA Calculator</p>
        <h1 className="feLumpLux__title">Save Tax on Rent</h1>
      </header>

      <section className="feLumpLux__mainCard">
        <div className="feLumpLux__inputsCol">
          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Annual Basic Salary + DA (₹)</span>
            <div className="feLumpLux__inputWrap feLumpLux__inputWrap--prefix">
              <span className="feLumpLux__prefix">₹</span>
              <input
                className="feLumpLux__input"
                type="number"
                value={basic}
                onChange={(e) => setBasic(Number(e.target.value))}
              />
            </div>
          </label>

          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Annual HRA Received (₹)</span>
            <div className="feLumpLux__inputWrap feLumpLux__inputWrap--prefix">
              <span className="feLumpLux__prefix">₹</span>
              <input
                className="feLumpLux__input"
                type="number"
                value={hra}
                onChange={(e) => setHra(Number(e.target.value))}
              />
            </div>
          </label>

          <label className="feLumpLux__field">
            <span className="feLumpLux__fieldLabel">Annual Rent Paid (₹)</span>
            <div className="feLumpLux__inputWrap feLumpLux__inputWrap--prefix">
              <span className="feLumpLux__prefix">₹</span>
              <input
                className="feLumpLux__input"
                type="number"
                value={rent}
                onChange={(e) => setRent(Number(e.target.value))}
              />
            </div>
          </label>

          <div className="feSipLux__freq">
            <span className="feLumpLux__fieldLabel">City Type</span>
            <div className="feSipLux__freqSeg">
              <button
                type="button"
                className={`feSipLux__freqBtn ${isMetro ? 'is-active' : ''}`}
                onClick={() => setIsMetro(true)}
              >
                Metro
              </button>
              <button
                type="button"
                className={`feSipLux__freqBtn ${!isMetro ? 'is-active' : ''}`}
                onClick={() => setIsMetro(false)}
              >
                Non-Metro
              </button>
            </div>
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

      <section className="feLumpLux__quickRow" style={{ gridTemplateColumns: '1fr' }}>
        <div className="feLumpLux__quickCard feLumpLux__quickCard--accent" style={{ padding: '24px' }}>
          <span className="feLumpLux__quickLabel" style={{ fontSize: '12px' }}>Exempt HRA Amount</span>
          <span className="feLumpLux__quickVal feLumpLux__quickVal--accent" style={{ fontSize: '32px' }}>{formatINR(exemption)}</span>
        </div>
      </section>

      <section className="feLumpLux__quickRow">
        <div className="feLumpLux__quickCard">
          <span className="feLumpLux__quickLabel">Taxable HRA</span>
          <span className="feLumpLux__quickVal">{formatINR(Math.max(0, hra - exemption))}</span>
        </div>
      </section>
    </div>
  );
};

export default HRACalculator;
