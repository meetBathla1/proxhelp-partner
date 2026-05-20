import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IndianRupee, User, Briefcase, Users, CloudUpload, ChevronRight, Check, FileUp } from 'lucide-react';
import './MultiStepApply.css';

const MultiStepApply = () => {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    // Step 1
    loanAmount: '',
    loanTenure: '',
    loanType: '',
    currentEmi: '',
    // Step 2
    fullName: '',
    dob: '',
    maritalStatus: '',
    phone: '',
    email: '',
    address: '',
    sameAsAadhar: 'Yes',
    aadharAddress: '',
    residentType: '',
    // Step 3
    companyName: '',
    companyAddress: '',
    designation: '',
    monthlySalary: '',
    salaryMode: '',
    officialPhone: '',
    officialEmail: '',
    // Step 4
    ref1Name: '',
    ref1Phone: '',
    ref1Address: '',
    ref2Name: '',
    ref2Phone: '',
    ref2Address: '',
    // Step 5 Files
    panFile: null,
    aadharFrontFile: null,
    aadharBackFile: null,
    bankStatementFile: null,
    salarySlip1File: null,
    salarySlip2File: null,
    salarySlip3File: null,
    form16File: null,
    electricityBillFile: null
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData(prev => ({


        ...prev,
        [name]: files[0]
      
      }));
      if (errors[name]) setErrors(prev => ({...prev, [name]: false}));
    }
  };

  useEffect(() => {
    // In a real scenario, fetch partner details to show bank name if needed
    // fetch(`http://localhost:5000/api/offline-partners/${partnerId}`)...
    setPartner({ id: partnerId, bank_name: "Partner Bank" }); // Mock for now
  }, [partnerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    
    }));
    if (errors[name]) setErrors(prev => ({...prev, [name]: false}));
  };

  const nextStep = () => {
    // Validation
    if (currentStep === 1) {
      if (!formData.loanAmount || !formData.loanTenure || !formData.loanType) {
        alert("Please fill all required fields (Amount, Tenure, Type) before proceeding.");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.fullName || !formData.dob || !formData.phone || !formData.address) {
        alert("Please fill all required personal details before proceeding.");
        return;
      }
      if (formData.sameAsAadhar === 'No' && !formData.aadharAddress) {
        alert("Please provide your Aadhar address.");
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.companyName || !formData.monthlySalary || !formData.salaryMode) {
        alert("Please fill core employment details (Company, Salary, Mode) before proceeding.");
        return;
      }
    } else if (currentStep === 4) {
      if (!formData.ref1Name || !formData.ref1Phone) {
        alert("Please provide at least one primary reference before proceeding.");
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    let newErrors = {};
    if (!formData.panFile) newErrors.panFile = true;
    if (!formData.aadharFrontFile) newErrors.aadharFrontFile = true;
    if (!formData.bankStatementFile) newErrors.bankStatementFile = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const token = localStorage.getItem('partnerToken');
    if (!token) {
        alert('Authentication error. Please log in again.');
        return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
            submitData.append(key, formData[key]);
        }
    });

    try {
        // We'll use relative path if there's a proxy, or hardcode localhost:5000 if needed.
        // Based on other files, we usually fetch relative. Let's use /api/... or fallback to localhost
        const response = await fetch('http://localhost:5000/api/apply-offline', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: submitData
        });

        if (response.ok) {
            alert('Application Submitted Successfully!');
            navigate('/'); // redirect to dashboard or home
        } else {
            const err = await response.json();
            alert(`Error: ${err.message}`);
        }
    } catch (err) {
        console.error(err);
        alert('Network error while submitting application.');
    }
  };

  return (
    <div className="multistep-apply-page">
      <header className="brand-header">
        <div className="brand-logo-container">
          <img src="/finexprt-logo.png" alt="FinExprt Logo" className="apply-brand-logo-img" />
        </div>
      </header>

      <div className="hero-section-apply">
        <h1>PERSONAL<br/><span>LOAN</span></h1>
        <p className="hero-subtitle">FREE EXPERT ADVICE</p>
        <p className="hero-features">COMPARE RATES ACROSS 60+ BANKS & NBFCS</p>
        <p className="hero-process">100% DIGITAL PROCESS</p>
      </div>

      <div className="form-card-container">
        {/* Progress Indicator */}
        <div className="progress-indicator">
          {[
            { step: 1, icon: <IndianRupee size={16} /> },
            { step: 2, icon: <User size={16} /> },
            { step: 3, icon: <Briefcase size={16} /> },
            { step: 4, icon: <Users size={16} /> },
            { step: 5, icon: <CloudUpload size={16} /> }
          ].map((item, index) => (
            <React.Fragment key={item.step}>
              <div className={`step-circle ${currentStep === item.step ? 'active' : currentStep > item.step ? 'completed' : ''}`}>
                {currentStep > item.step ? <Check size={16} color="white" /> : item.icon}
              </div>
              {index < 4 && <div className={`step-line ${currentStep > item.step ? 'completed' : ''}`}></div>}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Loan Requirements */}
        {currentStep === 1 && (
          <div className="step-content animate-fade-in">
            <div className="step-header">
              <div className="step-icon-box"><IndianRupee size={18} /></div>
              <h2>Loan Requirements</h2>
            </div>
            
            <div className="form-group">
              <label>Loan Amount Required</label>
              <input type="text" name="loanAmount" placeholder="5,00,000" value={formData.loanAmount} onChange={handleInputChange} />
              {errors.loanAmount && <span className="field-error">FIELD REQUIRED</span>}
            </div>
            
            <div className="form-group">
              <label>Loan Tenure (Months)</label>
              <select name="loanTenure" value={formData.loanTenure} onChange={handleInputChange}>
                <option value="">Select Tenure</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
                <option value="48">48 Months</option>
                <option value="60">60 Months</option>
              </select>
              {errors.loanTenure && <span className="field-error">FIELD REQUIRED</span>}
            </div>
            
            <div className="form-group">
              <label>Loan Type</label>
              <select name="loanType" value={formData.loanType} onChange={handleInputChange}>
                <option value="">Select Type</option>
                <option value="personal">Personal Loan</option>
                <option value="business">Business Loan</option>
              </select>
              {errors.loanType && <span className="field-error">FIELD REQUIRED</span>}
            </div>
            
            <div className="form-group">
              <label>Current Monthly EMI (If any)</label>
              <input type="text" name="currentEmi" placeholder="5,000" value={formData.currentEmi} onChange={handleInputChange} />
              {errors.currentEmi && <span className="field-error">FIELD REQUIRED</span>}
            </div>

            <button className="btn-next-step" onClick={nextStep}>
              Continue to Next Step <ChevronRight size={18} />
            </button>
            <div className="secure-footer">
              Step {currentStep} of {totalSteps} • Secure 256-bit SSL encrypted
            </div>
          </div>
        )}

        {/* Step 2: Personal Details */}
        {currentStep === 2 && (
          <div className="step-content animate-fade-in">
            <div className="step-header">
              <div className="step-icon-box"><User size={18} /></div>
              <h2>Personal Details</h2>
            </div>

            <div className="form-group">
              <label>Full Name (As per PAN)</label>
              <input type="text" name="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleInputChange} />
              {errors.fullName && <span className="field-error">FIELD REQUIRED</span>}
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
              {errors.dob && <span className="field-error">FIELD REQUIRED</span>}
            </div>

            <div className="form-group">
              <label>Marital Status</label>
              <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange}>
                <option value="">Select Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
              </select>
              {errors.maritalStatus && <span className="field-error">FIELD REQUIRED</span>}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" placeholder="10-digit mobile number" value={formData.phone} onChange={handleInputChange} />
              {errors.phone && <span className="field-error">FIELD REQUIRED</span>}
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="Enter personal email" value={formData.email} onChange={handleInputChange} />
              {errors.email && <span className="field-error">FIELD REQUIRED</span>}
            </div>

            <div className="form-group">
              <label>Current Residence Address (with Pincode)</label>
              <textarea name="address" rows="3" placeholder="Full address including city, state, and pincode" value={formData.address} onChange={handleInputChange}></textarea>
              {errors.address && <span className="field-error">FIELD REQUIRED</span>}
            </div>

            <div className="form-group radio-group-container">
              <label>Is this address as per Aadhar Card?</label>
              <div className="radio-options">
                <label className="radio-label">
                  <input type="radio" name="sameAsAadhar" value="Yes" checked={formData.sameAsAadhar === 'Yes'} onChange={handleInputChange} /> Yes
                </label>
                <label className="radio-label">
                  <input type="radio" name="sameAsAadhar" value="No" checked={formData.sameAsAadhar === 'No'} onChange={handleInputChange} /> No
                </label>
              </div>
            </div>

            {formData.sameAsAadhar === 'No' && (
              <div className="form-group animate-fade-in">
                <label>Aadhar Card Address (with Pincode)</label>
                <textarea name="aadharAddress" rows="3" placeholder="Full Aadhar address including city, state, and pincode" value={formData.aadharAddress} onChange={handleInputChange}></textarea>
              {errors.aadharAddress && <span className="field-error">FIELD REQUIRED</span>}
              </div>
            )}

            <div className="form-group">
              <label>Resident Type</label>
              <select name="residentType" value={formData.residentType} onChange={handleInputChange}>
                <option value="">Select Type</option>
                <option value="owned">Owned</option>
                <option value="rented">Rented</option>
              </select>
              {errors.residentType && <span className="field-error">FIELD REQUIRED</span>}
            </div>

            <div className="action-buttons-grid">
              <button className="btn-back-step" onClick={prevStep}>Back</button>
              <button className="btn-next-step" onClick={nextStep}>
                Continue to Next Step <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Employment Details */}
        {currentStep === 3 && (
          <div className="step-content animate-fade-in">
            <div className="step-header">
              <div className="step-icon-box"><Briefcase size={18} /></div>
              <h2>Employment Details</h2>
            </div>

            <div className="form-group">
              <label>Company Name</label>
              <input type="text" name="companyName" placeholder="Where do you work?" value={formData.companyName} onChange={handleInputChange} />
              {errors.companyName && <span className="field-error">FIELD REQUIRED</span>}
            </div>

            <div className="form-group">
              <label>Company Address (with Pincode)</label>
              <textarea name="companyAddress" rows="3" placeholder="Full company address with pincode" value={formData.companyAddress} onChange={handleInputChange}></textarea>
              {errors.companyAddress && <span className="field-error">FIELD REQUIRED</span>}
            </div>

            <div className="form-group">
              <label>Designation</label>
              <input type="text" name="designation" placeholder="e.g. Senior Manager" value={formData.designation} onChange={handleInputChange} />
              {errors.designation && <span className="field-error">FIELD REQUIRED</span>}
            </div>

            <div className="form-group">
              <label>Monthly In-Hand Salary</label>
              <input type="text" name="monthlySalary" placeholder="e.g. 50000" value={formData.monthlySalary} onChange={handleInputChange} />
              {errors.monthlySalary && <span className="field-error">FIELD REQUIRED</span>}
            </div>

            <div className="form-group">
              <label>Salary Transfer Mode</label>
              <select name="salaryMode" value={formData.salaryMode} onChange={handleInputChange}>
                <option value="">Select Mode</option>
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
              </select>
              {errors.salaryMode && <span className="field-error">FIELD REQUIRED</span>}
            </div>

            <div className="form-group">
              <label>Official Phone Number (Optional)</label>
              <input type="tel" name="officialPhone" placeholder="10-digit mobile number" value={formData.officialPhone} onChange={handleInputChange} />
              {errors.officialPhone && <span className="field-error">FIELD REQUIRED</span>}
            </div>

            <div className="form-group">
              <label>Official Email ID (Optional)</label>
              <input type="email" name="officialEmail" placeholder="work@company.com" value={formData.officialEmail} onChange={handleInputChange} />
              {errors.officialEmail && <span className="field-error">FIELD REQUIRED</span>}
            </div>

            <div className="action-buttons-grid">
              <button className="btn-back-step" onClick={prevStep}>Back</button>
              <button className="btn-next-step" onClick={nextStep}>
                Continue to Next Step <ChevronRight size={18} />
              </button>
            </div>
            <div className="secure-footer">
              Step {currentStep} of {totalSteps} • Secure 256-bit SSL encrypted
            </div>
          </div>
        )}

        {/* Step 4: Reference Details */}
        {currentStep === 4 && (
          <div className="step-content animate-fade-in">
            <div className="step-header">
              <div className="step-icon-box"><Users size={18} /></div>
              <h2>Reference Details</h2>
            </div>

            <div className="reference-section">
              <div className="ref-header">
                <span className="ref-number">1</span>
                <h3>Primary Reference</h3>
              </div>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="ref1Name" placeholder="Reference name" value={formData.ref1Name} onChange={handleInputChange} />
              {errors.ref1Name && <span className="field-error">FIELD REQUIRED</span>}
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="ref1Phone" placeholder="10-digit mobile number" value={formData.ref1Phone} onChange={handleInputChange} />
              {errors.ref1Phone && <span className="field-error">FIELD REQUIRED</span>}
              </div>
              <div className="form-group">
                <label>Address (with Pincode)</label>
                <input type="text" name="ref1Address" placeholder="Full address with pincode" value={formData.ref1Address} onChange={handleInputChange} />
              {errors.ref1Address && <span className="field-error">FIELD REQUIRED</span>}
              </div>
            </div>

            <div className="reference-section" style={{ marginTop: '24px' }}>
              <div className="ref-header">
                <span className="ref-number">2</span>
                <h3>Secondary Reference</h3>
              </div>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="ref2Name" placeholder="Reference name" value={formData.ref2Name} onChange={handleInputChange} />
              {errors.ref2Name && <span className="field-error">FIELD REQUIRED</span>}
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="ref2Phone" placeholder="10-digit mobile number" value={formData.ref2Phone} onChange={handleInputChange} />
              {errors.ref2Phone && <span className="field-error">FIELD REQUIRED</span>}
              </div>
              <div className="form-group">
                <label>Address (with Pincode)</label>
                <input type="text" name="ref2Address" placeholder="Full address with pincode" value={formData.ref2Address} onChange={handleInputChange} />
              {errors.ref2Address && <span className="field-error">FIELD REQUIRED</span>}
              </div>
            </div>

            <div className="action-buttons-grid">
              <button className="btn-back-step" onClick={prevStep}>Back</button>
              <button className="btn-next-step" onClick={nextStep}>
                Continue to Next Step <ChevronRight size={18} />
              </button>
            </div>
            <div className="secure-footer">
              Step {currentStep} of {totalSteps} • Secure 256-bit SSL encrypted
            </div>
          </div>
        )}

        {/* Step 5: Documents Upload */}
        {currentStep === 5 && (
          <div className="step-content animate-fade-in">
            <div className="step-header">
              <div className="step-icon-box">
                <CloudUpload size={18} />
              </div>
              <h2>Documents Upload</h2>
            </div>

            <div className="upload-section">
              <h4>PAN Card</h4>
              <label className="upload-box" htmlFor="panFile">
                <input type="file" id="panFile" name="panFile" accept=".pdf,image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                <FileUp size={24} className="upload-icon" />
                <span>{formData.panFile ? formData.panFile.name : 'Select File to Upload'}</span>
                <p>PDF or Photo of original PAN</p>
              </label>
              {errors.panFile && <span className="field-error">FIELD REQUIRED</span>}
            </div>

            <div className="upload-section">
              <h4>Aadhar Card</h4>
              <p className="upload-subtitle">Please upload clear photos of both sides or a full e-Aadhar PDF</p>
              
              <span className="upload-label">Front Side / Full PDF</span>
              <label className="upload-box" htmlFor="aadharFrontFile">
                <input type="file" id="aadharFrontFile" name="aadharFrontFile" accept=".pdf,image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                <FileUp size={24} className="upload-icon" />
                <span>{formData.aadharFrontFile ? formData.aadharFrontFile.name : 'Select File to Upload'}</span>
                <p>PDF or Photo</p>
              </label>
              {errors.aadharFrontFile && <span className="field-error">FIELD REQUIRED</span>}

              <span className="upload-label">Back Side</span>
              <label className="upload-box" htmlFor="aadharBackFile">
                <input type="file" id="aadharBackFile" name="aadharBackFile" accept=".pdf,image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                <FileUp size={24} className="upload-icon" />
                <span>{formData.aadharBackFile ? formData.aadharBackFile.name : 'Select File to Upload'}</span>
                <p>Not needed if full PDF uploaded</p>
              </label>
            </div>

            <div className="upload-section">
              <h4>Bank Statement (Last 6 Months)</h4>
              <label className="upload-box" htmlFor="bankStatementFile">
                <input type="file" id="bankStatementFile" name="bankStatementFile" accept=".pdf" style={{ display: 'none' }} onChange={handleFileChange} />
                <FileUp size={24} className="upload-icon" />
                <span>{formData.bankStatementFile ? formData.bankStatementFile.name : 'Select File to Upload'}</span>
                <p>Consolidated PDF only</p>
              </label>
              {errors.bankStatementFile && <span className="field-error">FIELD REQUIRED</span>}
            </div>

            <div className="upload-section reference-section" style={{ padding: '20px' }}>
              <h4>Last 3 Months Salary Slips</h4>
              
              <span className="upload-label" style={{ marginTop: '0' }}>Month 1</span>
              <label className="upload-box" htmlFor="salarySlip1File" style={{ marginBottom: '16px' }}>
                <input type="file" id="salarySlip1File" name="salarySlip1File" accept=".pdf,image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                <FileUp size={24} className="upload-icon" />
                <span>{formData.salarySlip1File ? formData.salarySlip1File.name : 'Select File to Upload'}</span>
              </label>

              <span className="upload-label">Month 2</span>
              <label className="upload-box" htmlFor="salarySlip2File" style={{ marginBottom: '16px' }}>
                <input type="file" id="salarySlip2File" name="salarySlip2File" accept=".pdf,image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                <FileUp size={24} className="upload-icon" />
                <span>{formData.salarySlip2File ? formData.salarySlip2File.name : 'Select File to Upload'}</span>
              </label>

              <span className="upload-label">Month 3</span>
              <label className="upload-box" htmlFor="salarySlip3File">
                <input type="file" id="salarySlip3File" name="salarySlip3File" accept=".pdf,image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                <FileUp size={24} className="upload-icon" />
                <span>{formData.salarySlip3File ? formData.salarySlip3File.name : 'Select File to Upload'}</span>
              </label>
            </div>

            <div className="upload-section">
              <h4>Form 16 / Form 130</h4>
              <label className="upload-box" htmlFor="form16File">
                <input type="file" id="form16File" name="form16File" accept=".pdf,image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                <FileUp size={24} className="upload-icon" />
                <span>{formData.form16File ? formData.form16File.name : 'Select File to Upload'}</span>
                <p>Proof of income / Tax form</p>
              </label>
            </div>

            <div className="upload-section">
              <h4>Electricity Bill</h4>
              <label className="upload-box" htmlFor="electricityBillFile">
                <input type="file" id="electricityBillFile" name="electricityBillFile" accept=".pdf,image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                <FileUp size={24} className="upload-icon" />
                <span>{formData.electricityBillFile ? formData.electricityBillFile.name : 'Select File to Upload'}</span>
                <p>Recent utility bill</p>
              </label>
            </div>

            <div className="action-buttons-grid">
              <button className="btn-back-step" onClick={prevStep}>Back</button>
              <button className="btn-next-step" onClick={handleSubmit}>
                Submit Application <ChevronRight size={18} />
              </button>
            </div>
            <div className="secure-footer">
              Step {currentStep} of {totalSteps} • Secure 256-bit SSL encrypted
            </div>
          </div>
        )}
      </div>

      <footer className="apply-footer">
        © 2026 FinExprt Financial Services. All rights reserved.
      </footer>
    </div>
  );
};

export default MultiStepApply;
