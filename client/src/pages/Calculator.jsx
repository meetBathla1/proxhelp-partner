import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUpRight, 
  Landmark, 
  Clock, 
  Bell,
  Wallet,
  ShieldCheck,
  Receipt,
  Gift,
  Coins,
  TrendingUp,
  Car,
  Home,
  Target,
  ChevronRight,
  Calculator as CalcIcon,
  ShieldPlus,
  ArrowLeft
} from 'lucide-react';
import './Calculator.css';

// Import Calculator Components
import SIPCalculator from '../components/calculators/SIPCalculator';
import LumpsumCalculator from '../components/calculators/LumpsumCalculator';
import EMICalculator from '../components/calculators/EMICalculator';
import FDCalculator from '../components/calculators/FDCalculator';
import RDCalculator from '../components/calculators/RDCalculator';
import PPFCalculator from '../components/calculators/PPFCalculator';
import IncomeTaxCalculator from '../components/calculators/IncomeTaxCalculator';
import GratuityCalculator from '../components/calculators/GratuityCalculator';
import GoalPlanner from '../components/calculators/GoalPlanner';
import LoanEligibility from '../components/calculators/LoanEligibility';
import HRACalculator from '../components/calculators/HRACalculator';
import ELSSCalculator from '../components/calculators/ELSSCalculator';
import NPSCalculator from '../components/calculators/NPSCalculator';

const Calculator = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [selectedCalc, setSelectedCalc] = useState(null);
  const carouselRef = useRef(null);

  const investmentCalculators = [
    { id: 'sip', title: 'SIP', subtitle: 'SYSTEMATIC PLAN', icon: <TrendingUp size={24} strokeWidth={2.5} />, accent: 'orange', iconBg: '#f1f5f9' },
    { id: 'fd', title: 'Fixed Deposit', subtitle: 'SECURE RETURNS', icon: <Landmark size={24} strokeWidth={2.5} />, accent: 'navy', iconBg: '#f1f5f9' },
    { id: 'lumpsum', title: 'Lumpsum', subtitle: 'ONE-TIME INVESTMENT', icon: <ArrowUpRight size={24} strokeWidth={2.5} />, accent: 'none', iconBg: '#f1f5f9' },
    { id: 'rd', title: 'RD', subtitle: 'RECURRING DEPOSIT', icon: <Clock size={24} strokeWidth={2.5} />, accent: 'none', iconBg: '#f1f5f9' }
  ];

  const loanCalculators = [
    { id: 'emi', title: 'EMI Calculator', subtitle: 'Calculate monthly payments', icon: <CalcIcon size={24} color="#f97316" />, iconBg: '#fff7ed' },
    { id: 'loan-eligibility', title: 'Loan Eligibility', subtitle: 'Check how much you can borrow', icon: <ShieldCheck size={24} color="#ca8a04" />, iconBg: '#fef3c7' }
  ];

  const taxCalculators = [
    { id: 'income-tax', title: 'Income Tax', subtitle: 'FY 2024-25 READY', icon: <Receipt size={24} color="#3b82f6" />, iconBg: '#eff6ff' },
    { id: 'gratuity', title: 'Gratuity', subtitle: 'RETIREMENT BENEFITS', icon: <Gift size={24} color="#16a34a" />, iconBg: '#f0fdf4' },
    { id: 'hra', title: 'HRA Calculator', subtitle: 'SAVE TAX ON RENT', icon: <Home size={24} color="#7c3aed" />, iconBg: '#f5f3ff' },
    { id: 'elss', title: 'ELSS Funds', subtitle: 'TAX SAVING PLAN', icon: <TrendingUp size={24} color="#2563eb" />, iconBg: '#eff6ff' },
    { id: 'ppf', title: 'PPF', subtitle: 'SECURE SAVINGS', icon: <ShieldPlus size={24} color="#4f46e5" />, iconBg: '#eef2ff' },
    { id: 'nps', title: 'NPS', subtitle: 'RETIREMENT PLAN', icon: <ShieldPlus size={24} color="#4f46e5" />, iconBg: '#eef2ff' }
  ];

  const moreCalculators = [
    { id: 'home-loan', title: 'Home Loan EMI', subtitle: 'Long-term EMI plan', icon: <CalcIcon size={24} color="#f97316" />, iconBg: '#eff6ff' },
    { id: 'car-loan', title: 'Car Loan EMI', subtitle: 'Vehicle finance estimate', icon: <CalcIcon size={24} color="#f97316" />, iconBg: '#eff6ff' },
    { id: 'goal-planner', title: 'Goal Planner', subtitle: 'Save for life goals', icon: <Landmark size={24} color="#7c3aed" />, iconBg: '#f1f5f9' }
  ];

  // Auto Slider Logic for Tax Carousel
  useEffect(() => {
    if (selectedCalc) return; // Don't slide if calculator is open
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % taxCalculators.length);
      
      if (carouselRef.current) {
        const cardWidth = 157; // 145px card + 12px gap
        carouselRef.current.scrollTo({
          left: activeIndex * cardWidth,
          behavior: 'smooth'
        });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [activeIndex, taxCalculators.length, selectedCalc]);

  const renderCalculator = () => {
    switch (selectedCalc) {
      case 'sip': return <SIPCalculator />;
      case 'lumpsum': return <LumpsumCalculator />;
      case 'emi': 
      case 'home-loan':
      case 'car-loan':
        return <EMICalculator />;
      case 'fd': return <FDCalculator />;
      case 'rd': return <RDCalculator />;
      case 'ppf': return <PPFCalculator />;
      case 'income-tax': return <IncomeTaxCalculator />;
      case 'gratuity': return <GratuityCalculator />;
      case 'goal-planner': return <GoalPlanner />;
      case 'loan-eligibility': return <LoanEligibility />;
      case 'hra': return <HRACalculator />;
      case 'elss': return <ELSSCalculator />;
      case 'ppf': return <PPFCalculator />;
      case 'nps': return <NPSCalculator />;
      default: return null;
    }
  };

  if (selectedCalc && renderCalculator()) {
    return (
      <div className="calculator-container animate-fade-in">
        <button className="calc-back-btn" onClick={() => setSelectedCalc(null)}>
          <ArrowLeft size={20} /> Back to Calculators
        </button>
        {renderCalculator()}
      </div>
    );
  }

  return (
    <div className="calculator-container animate-fade-in">
      <header className="calc-header">
        <h1 className="calc-title"><span>FinExprt</span> Calculator</h1>
        <button className="bell-btn">
          <Bell size={22} fill="#F59A2D" color="#F59A2D" />
        </button>
      </header>

      {/* ── Investment Section (Grid) ── */}
      <section className="calc-section">
        <h2 className="section-label">Investment</h2>
        <div className="calc-grid">
          {investmentCalculators.map((calc, i) => (
            <div key={i} className={`calc-card accent-${calc.accent}`} onClick={() => setSelectedCalc(calc.id)}>
              <div className="card-icon-circle" style={{ backgroundColor: calc.iconBg }}>
                {calc.icon}
              </div>
              <h3 className="card-title">{calc.title}</h3>
              <p className="card-subtitle">{calc.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Loans & EMI Section (Wide) ── */}
      <section className="calc-section">
        <h2 className="section-label">Loans & EMI</h2>
        <div className="calc-list">
          {loanCalculators.map((calc, i) => (
            <div key={i} className="calc-card calc-card-wide" onClick={() => setSelectedCalc(calc.id)}>
              <div className="card-icon-circle" style={{ backgroundColor: calc.iconBg }}>
                {calc.icon}
              </div>
              <div className="card-info">
                <h3 className="card-title-wide">{calc.title}</h3>
                <p className="card-subtitle-wide">{calc.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tax & Savings Section (Carousel) ── */}
      <section className="calc-section">
        <h2 className="section-label">Tax & Savings</h2>
        <div className="calc-carousel-wrapper">
          <div className="calc-carousel" ref={carouselRef}>
            {taxCalculators.map((calc, i) => (
              <div key={i} className="calc-card carousel-card" onClick={() => setSelectedCalc(calc.id)}>
                <div className="card-icon-circle" style={{ backgroundColor: calc.iconBg }}>
                  {calc.icon}
                </div>
                <h3 className="card-title">{calc.title}</h3>
                <p className="card-subtitle">{calc.subtitle}</p>
              </div>
            ))}
          </div>
          <div className="pagination-dots">
            {taxCalculators.map((_, i) => (
              <span key={i} className={`dot ${i === activeIndex ? 'active' : ''}`}></span>
            ))}
          </div>
        </div>
      </section>

      {/* ── More Calculators Section (Wide) ── */}
      <section className="calc-section">
        <h2 className="section-label">More Calculators</h2>
        <div className="calc-list">
          {moreCalculators.map((calc, i) => (
            <div key={i} className="calc-card calc-card-wide" onClick={() => setSelectedCalc(calc.id)}>
              <div className="card-icon-circle" style={{ backgroundColor: calc.iconBg }}>
                {calc.icon}
              </div>
              <div className="card-info">
                <h3 className="card-title-wide">{calc.title}</h3>
                <p className="card-subtitle-wide">{calc.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Calculator;
