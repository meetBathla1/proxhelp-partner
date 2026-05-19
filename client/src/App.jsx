import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GetStarted from './pages/GetStarted';
import Home from './pages/Home';
import Leads from './pages/Leads';
import Wallet from './pages/Wallet';
import Transactions from './pages/Transactions';
import ManageBank from './pages/ManageBank';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import DigitalID from './pages/DigitalID';
import HelpSupport from './pages/HelpSupport';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Calculator from './pages/Calculator';
import Services from './pages/Services';
import Notifications from './pages/Notifications';
import FinancialProductPage from './pages/FinancialProductPage';
import ShareProduct from './pages/ShareProduct';
import ApplyProduct from './pages/ApplyProduct';
import AdminDashboard from './pages/AdminDashboard';
import ScrollToTop from './components/ScrollToTop';
import { NotificationProvider } from './context/NotificationContext';
import './App.css';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <Routes>
            <Route path="/" element={<GetStarted />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Public Apply Route */}
            <Route path="/apply/:productId" element={<ApplyProduct />} />

            {/* Protected Routes inside MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/manage-bank" element={<ManageBank />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/digital-id" element={<DigitalID />} />
              <Route path="/support" element={<HelpSupport />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/services" element={<Services />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/credit-cards" element={<FinancialProductPage serviceName="Credit Card" title="Credit Cards" />} />
              <Route path="/secured-cards" element={<FinancialProductPage serviceName="Secured Card" title="Secured Cards" ribbonClass="green-ribbon" />} />
              <Route path="/personal-loan" element={<FinancialProductPage serviceName="Personal Loan" title="Personal Loans" ribbonClass="blue-ribbon" />} />
              <Route path="/instant-loan" element={<FinancialProductPage serviceName="Instant Loan" title="Instant Loans" ribbonClass="orange-ribbon" />} />
              <Route path="/business-loan" element={<FinancialProductPage serviceName="Business Loans" title="Business Loans" ribbonClass="purple-ribbon" />} />
              <Route path="/micro-loan" element={<FinancialProductPage serviceName="Micro Loan" title="Micro Loans" ribbonClass="green-ribbon" />} />
              <Route path="/group-loan" element={<FinancialProductPage serviceName="Group Loan" title="Group Loans" ribbonClass="blue-ribbon" />} />
              <Route path="/savings-account" element={<FinancialProductPage serviceName="Savings Account" title="Savings Accounts" ribbonClass="pink-ribbon" />} />
               <Route path="/demat-account" element={<FinancialProductPage serviceName="Demat Account" title="Demat Accounts" ribbonClass="blue-ribbon" />} />
              <Route path="/insurance" element={<FinancialProductPage serviceName="Insurance" title="Insurance" ribbonClass="green-ribbon" />} />
              <Route path="/share-product/:productId" element={<ShareProduct />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;
