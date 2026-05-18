import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Share2, UserCheck, Eye } from 'lucide-react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="privacy-page animate-fade-in">
            {/* Header */}
            <div className="privacy-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h2>Privacy Policy</h2>
            </div>

            {/* Hero Section */}
            <div className="privacy-hero">
                <div className="hero-icon-box">
                    <img src="/logo.png" alt="Fin Exprt Logo" className="policy-logo" />
                </div>
                <p className="hero-subtitle">Your privacy is our commitment.</p>
                
                <div className="intro-card">
                    <p>
                        At Fin Exprt, we deeply value your trust and are committed to protecting your 
                        personal and financial information. This Privacy Policy explains how we collect, 
                        use, store, and safeguard your data when you use our services.
                    </p>
                </div>
            </div>

            {/* Content Sections */}
            <div className="privacy-content">
                {/* Section 1 */}
                <div className="policy-section">
                    <div className="section-number">1</div>
                    <div className="section-body">
                        <h3>Information We Collect</h3>
                        <div className="section-line"></div>
                        <p>We may collect the following information from you to provide our services efficiently:</p>
                        <ul>
                            <li><strong>Personal Information:</strong> Name, date of birth, gender, address, phone number, email ID, etc.</li>
                            <li><strong>KYC Documents:</strong> Aadhaar, PAN, Voter ID, Driving License, Passport, etc.</li>
                            <li><strong>Financial Information:</strong> Bank account details, income proof, credit score, business details (for MSMEs), etc.</li>
                            <li><strong>Usage Data:</strong> Device information, IP address, location, browsing activity, etc.</li>
                        </ul>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="policy-section">
                    <div className="section-number">2</div>
                    <div className="section-body">
                        <h3>How We Use Your Information</h3>
                        <div className="section-line"></div>
                        <p>To process applications for Credit Cards, Personal & Business Loans, Home Loans, Loan Against Property, Education Loans, Auto Loans, Savings Accounts, Demat Accounts, Microfinance, Group Loans, Private Funding, and related financial services.</p>
                        <ul>
                            <li>To verify identity and assess financial eligibility.</li>
                            <li>To provide customer support and transaction updates.</li>
                            <li>To send service-related notifications and alerts.</li>
                            <li>To improve platform security, analytics, and user experience.</li>
                            <li>To comply with legal, regulatory, and RBI requirements.</li>
                        </ul>
                    </div>
                </div>

                {/* Section 3 */}
                <div className="policy-section">
                    <div className="section-number">3</div>
                    <div className="section-body">
                        <h3>Data Sharing & Third Parties</h3>
                        <div className="section-line"></div>
                        <p>Your data may be securely shared with:</p>
                        <ul>
                            <li>Partner Banks and NBFCs for service processing</li>
                            <li>Credit bureaus for credit assessment and verification</li>
                            <li>Technology, cloud, and analytics service providers</li>
                            <li>Government or regulatory authorities when legally required</li>
                        </ul>
                        <div className="note-box">
                            <p><strong>Note:</strong> We do not sell, rent, or trade your personal data to third parties.</p>
                        </div>
                    </div>
                </div>

                {/* Section 4 */}
                <div className="policy-section">
                    <div className="section-number">4</div>
                    <div className="section-body">
                        <h3>Data Security</h3>
                        <div className="section-line"></div>
                        <p>We implement industry-standard security measures, including:</p>
                        <ul>
                            <li>SSL encryption for secure data transmission</li>
                            <li>Secure servers, cloud infrastructure, and firewalls</li>
                            <li>Restricted and role-based access to sensitive information</li>
                        </ul>
                        <p className="prec-text">
                            While we take all reasonable precautions, users are advised to protect 
                            their login credentials and personal devices.
                        </p>
                    </div>
                </div>

                {/* Section 5 */}
                <div className="policy-section">
                    <div className="section-number">5</div>
                    <div className="section-body">
                        <h3>Your Rights</h3>
                        <div className="section-line"></div>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access and update your personal information</li>
                            <li>Opt out of promotional communications</li>
                            <li>Request data deletion, subject to legal and regulatory obligations</li>
                        </ul>
                        <div className="contact-footer">
                            <p>To exercise these rights, please contact us at</p>
                            <a href="mailto:customercare@proxhelp.in">customercare@proxhelp.in</a>
                        </div>
                    </div>
                </div>

                {/* Section 6 */}
                <div className="policy-section">
                    <div className="section-number">6</div>
                    <div className="section-body">
                        <h3>Cookies and Tracking</h3>
                        <div className="section-line"></div>
                        <p>We use cookies and similar technologies to improve functionality, analyze performance, and enhance user experience. You can control cookie preferences through your browser settings.</p>
                    </div>
                </div>

                {/* Section 7 */}
                <div className="policy-section">
                    <div className="section-number">7</div>
                    <div className="section-body">
                        <h3>Policy Updates</h3>
                        <div className="section-line"></div>
                        <p>This Privacy Policy may be updated periodically. Any changes will be published on our official website. Continued use of our services constitutes acceptance of the updated policy.</p>
                    </div>
                </div>

                {/* Section 8 */}
                <div className="policy-section">
                    <div className="section-number">8</div>
                    <div className="section-body">
                        <h3>Contact & Office Details</h3>
                        <div className="section-line"></div>
                        <p>For privacy-related queries or concerns, you may contact us at:</p>
                        <div className="contact-item">
                            <span>📧 Email: customercare@proxhelp.in</span>
                        </div>
                        <div className="contact-item">
                            <span>🏢 Registered Office:</span>
                            <p style={{marginTop: '4px'}}>
                                Anjanvel Bouddhwadi, RGPPL Anjanvel,<br/>
                                Guhagar, Ratnagiri,<br/>
                                Maharashtra – 415634
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Banner */}
            <div className="privacy-footer-banner">
                <p>Fin Exprt ensures your data remains secure and handled with the highest standards of trust and responsibility.</p>
                <span className="copyright">© 2026 Fin Exprt. All rights reserved.</span>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
