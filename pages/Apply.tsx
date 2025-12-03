import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { analyzeLoanEligibility } from '../services/geminiService';
import Button from '../components/Button';
import { LoanOffer } from '../types';
import { useAuth } from '../context/AuthContext';

const Apply: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const initialOffer = state?.offer as LoanOffer;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transactionCode, setTransactionCode] = useState('');
  
  // Constants
  const INTEREST_RATE_DAY = 0.01; 
  const PROCESSING_FEE_RATE = 0.05;

  // New State for Limit Logic
  const [approvedLimit, setApprovedLimit] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    idNumber: '',
    phoneNumber: user?.phoneNumber || '',
    pin: '',
    dob: '',
    income: '',
    amount: initialOffer?.amount || 5000,
    term: initialOffer?.termDays || 30,
    termsAccepted: false
  });

  // Derived Loan Details (Calculated dynamically)
  const [loanSummary, setLoanSummary] = useState({
    fees: 0,
    interest: 0,
    total: 0
  });

  // If user is already logged in, skip Step 1 if data is present, otherwise pre-fill
  useEffect(() => {
    if (user && step === 1 && formData.fullName) {
      // Logic to auto-advance could go here, but usually safe to let them review
      // For now we just ensure form is pre-filled from context (handled in useState init)
    }
  }, [user]);

  useEffect(() => {
    const amt = Number(formData.amount);
    const trm = Number(formData.term);
    const fees = Math.round(amt * PROCESSING_FEE_RATE);
    const interest = Math.round(amt * INTEREST_RATE_DAY * trm);
    const total = amt + fees + interest;

    setLoanSummary({ fees, interest, total });
  }, [formData.amount, formData.term]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    // Validation: Phone Number (Max 10 digits, numeric only)
    if (name === 'phoneNumber') {
        if (!/^\d*$/.test(value)) return;
        if (value.length > 10) return;
    }

    // Validation: ID Number (Max 8 digits, numeric only)
    if (name === 'idNumber') {
        if (!/^\d*$/.test(value)) return;
        if (value.length > 8) return;
    }

    // Validation: PIN (Max 6 digits, numeric only)
    if (name === 'pin') {
        if (!/^\d*$/.test(value)) return;
        if (value.length > 6) return;
    }

    // Validation: Amount (Cannot exceed approved limit)
    if (name === 'amount' && approvedLimit !== null) {
        if (Number(value) > approvedLimit) return;
        if (Number(value) < 0) return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calculateAge = (dobString: string) => {
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  const generateLimit = async () => {
    setLoading(true);
    setError('');

    await new Promise(r => setTimeout(r, 1500)); // Simulate API call

    const age = calculateAge(formData.dob);
    
    // Limit Logic based on Age
    let minLimit = 1500;
    let maxLimit = 50000;

    if (age < 22) {
        maxLimit = 5000; // Young users get lower limit
    } else if (age < 28) {
        maxLimit = 25000; // Mid-range
    } else {
        maxLimit = 50000; // Older users get higher limit
    }

    // Randomize within range
    const randomLimit = Math.floor(Math.random() * (maxLimit - minLimit + 1)) + minLimit;
    // Round to nearest 100
    const finalLimit = Math.ceil(randomLimit / 100) * 100;

    setApprovedLimit(finalLimit);
    
    // Adjust requested amount if it exceeds new limit
    if (Number(formData.amount) > finalLimit) {
        setFormData(prev => ({ ...prev, amount: finalLimit }));
    }

    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      // Step 1 Validation
      const age = calculateAge(formData.dob);
      if (age < 18) {
          setError("You must be at least 18 years old to use this service.");
          return;
      }
      setError('');
      
      // LOG USER IN
      login({
        name: formData.fullName,
        phoneNumber: formData.phoneNumber
      });

      setStep(2);
    } else if (step === 2) {
        // If limit not yet checked, check it first
        if (approvedLimit === null) {
            if (!formData.income) {
                setError("Please select your monthly income range.");
                return;
            }
            generateLimit();
            return;
        }

        // If limit is checked, proceed to validation of final amount
        if (Number(formData.amount) > approvedLimit) {
            setError(`Amount cannot exceed your limit of KES ${approvedLimit.toLocaleString()}`);
            return;
        }

        setStep(3);
    } else if (step === 3) {
      // Validate transaction code
      // Must start with T and be exactly 10 characters long
      if (/^T[A-Z0-9]{9}$/.test(transactionCode)) {
        setStep(4); // Move to Pending Approval
      } else {
        setError("Please enter a valid 10-character M-Pesa transaction code starting with 'T'.");
      }
    }
  };

  // Real-time validation for Step 1
  const age = formData.dob ? calculateAge(formData.dob) : 0;
  const isAgeValid = age >= 18;
  const isIdValid = /^\d{7,8}$/.test(formData.idNumber);
  const isPhoneValid = /^\d{10}$/.test(formData.phoneNumber);
  const isNameValid = formData.fullName.trim().length > 0;
  const isPinValid = /^\d{4,6}$/.test(formData.pin);
  
  const isStep1Valid = isAgeValid && isIdValid && isPhoneValid && isNameValid && isPinValid;

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 md:py-12">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-slate-100 h-2 w-full">
          <div 
            className="bg-brand-600 h-full transition-all duration-500 ease-out" 
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {step === 1 && "Personal Information"}
            {step === 2 && (approvedLimit ? "Configure Your Loan" : "Check Loan Limit")}
            {step === 3 && "Processing Fee Payment"}
            {step === 4 && "Application Status"}
          </h2>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm">
              <p className="font-bold">Attention Needed</p>
              <p>{error}</p>
            </div>
          )}

          {step < 4 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {step === 1 && (
                <>
                  <div className="flex justify-end -mt-4 mb-2">
                    <Link to="/login" className="text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline">
                        Already have an account? Login
                    </Link>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name (as per ID)</label>
                    <input 
                      type="text" 
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition outline-none text-slate-900"
                      placeholder="e.g. Juma Kamau"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">National ID Number</label>
                        <input 
                        type="text" 
                        name="idNumber"
                        required
                        value={formData.idNumber}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 transition outline-none text-slate-900 ${
                            formData.idNumber && !isIdValid ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-brand-500 focus:border-brand-500'
                        }`}
                        placeholder="12345678"
                        inputMode="numeric"
                        />
                        <p className={`text-xs mt-1 ${formData.idNumber && !isIdValid ? 'text-red-500' : 'text-gray-500'}`}>
                            {formData.idNumber && !isIdValid ? 'Must be 7-8 digits' : '7-8 digits'}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                        <input 
                        type="date" 
                        name="dob"
                        required
                        value={formData.dob}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 transition outline-none text-slate-900 ${
                            formData.dob && !isAgeValid ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-brand-500 focus:border-brand-500'
                        }`}
                        max={new Date().toISOString().split("T")[0]}
                        />
                         <p className={`text-xs mt-1 ${formData.dob && !isAgeValid ? 'text-red-500' : 'text-gray-500'}`}>
                            {formData.dob && !isAgeValid ? 'Must be 18+ years' : 'Must be 18+ years'}
                         </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">M-Pesa Phone Number</label>
                    <input 
                      type="tel" 
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 transition outline-none text-slate-900 ${
                        formData.phoneNumber && !isPhoneValid ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-brand-500 focus:border-brand-500'
                      }`}
                      placeholder="07..."
                      inputMode="tel"
                    />
                    <p className={`text-xs mt-1 ${formData.phoneNumber && !isPhoneValid ? 'text-red-500' : 'text-gray-500'}`}>
                        {formData.phoneNumber && !isPhoneValid ? 'Must be 10 digits' : 'Max 10 digits'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Create Security PIN</label>
                    <input 
                      type="password" 
                      name="pin"
                      required
                      value={formData.pin}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 transition outline-none text-slate-900 ${
                        formData.pin && !isPinValid ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-brand-500 focus:border-brand-500'
                      }`}
                      placeholder="••••"
                      inputMode="numeric"
                    />
                    <p className={`text-xs mt-1 ${formData.pin && !isPinValid ? 'text-red-500' : 'text-gray-500'}`}>
                        {formData.pin && !isPinValid ? 'Must be 4-6 digits' : '4-6 digits'}
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full mt-6"
                    disabled={!isStep1Valid}
                  >
                    Next Step
                  </Button>
                </>
              )}

              {step === 2 && !approvedLimit && (
                <>
                 <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                    <p className="text-blue-800 text-sm">
                        Please provide your income details to help us determine your maximum loan limit.
                    </p>
                 </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Income Range</label>
                    <select 
                      name="income"
                      required
                      value={formData.income}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition outline-none bg-white ${formData.income ? 'text-slate-900' : 'text-gray-500'}`}
                    >
                        <option value="" disabled>Select your monthly income</option>
                        <option value="5000">Below KES 10,000</option>
                        <option value="20000">KES 10,000 - 30,000</option>
                        <option value="40000">KES 30,001 - 50,000</option>
                        <option value="75000">KES 50,001 - 100,000</option>
                        <option value="175000">KES 100,001 - 250,000</option>
                        <option value="300000">Above KES 250,000</option>
                    </select>
                  </div>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full"
                    isLoading={loading}
                  >
                    Check My Limit
                  </Button>
                </>
              )}

              {step === 2 && approvedLimit && (
                <>
                  <div className="bg-green-50 p-6 rounded-2xl border border-green-200 text-center mb-6">
                    <p className="text-green-800 font-medium mb-1">Congratulations! Your approved limit is</p>
                    <p className="text-3xl font-black text-green-700">KES {approvedLimit.toLocaleString()}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-2">I want to borrow (KES)</label>
                       <input 
                        type="number" 
                        name="amount"
                        required
                        max={approvedLimit}
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900 font-bold bg-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">Max: {approvedLimit.toLocaleString()}</p>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-2">Term (Days)</label>
                       <select 
                        name="term"
                        value={formData.term}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-brand-500 text-slate-900 bg-white"
                       >
                         <option value="14">14 Days</option>
                         <option value="30">30 Days</option>
                         <option value="60">60 Days</option>
                       </select>
                    </div>
                  </div>

                  {/* Loan Summary Card */}
                  <div className="bg-brand-50 p-4 rounded-xl border border-brand-100 space-y-2">
                    <h4 className="font-semibold text-brand-900 mb-2 text-sm uppercase tracking-wide">Loan Summary</h4>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Principal Amount</span>
                      <span>KES {Number(formData.amount).toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between text-sm text-slate-600">
                      <span>Processing Fee (5%)</span>
                      <span>KES {loanSummary.fees.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Interest ({formData.term} days)</span>
                      <span>KES {loanSummary.interest.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-brand-200 my-1"></div>
                    <div className="flex justify-between text-base font-bold text-brand-700">
                      <span>Total Repayment</span>
                      <span>KES {loanSummary.total.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      name="termsAccepted"
                      id="terms"
                      required
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500 cursor-pointer"
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-600 cursor-pointer">
                      I agree to the <span className="text-brand-600 underline">Terms & Conditions</span>, accept the 5% processing fee, and consent to CRB checks.
                    </label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full"
                    disabled={!formData.termsAccepted}
                  >
                    Proceed to Withdraw
                  </Button>
                </>
              )}

              {step === 3 && (
                <div className="text-center">
                  <p className="mb-6 text-slate-600">
                    Your loan has been provisionally approved! To complete the disbursement process, please pay the processing fee.
                  </p>
                  
                  <div className="bg-green-50 border border-green-200 p-6 rounded-2xl mb-8 max-w-sm mx-auto shadow-sm">
                    <div className="mb-2 text-green-800 text-xs font-bold uppercase tracking-wider">M-Pesa Buy Goods Till</div>
                    <div className="text-4xl font-black text-green-700 mb-3 tracking-tight">867334</div>
                    <div className="text-sm font-medium text-green-800 bg-green-100/50 py-1 px-3 rounded-full inline-block mb-4">PesaSwift Ltd</div>
                    <div className="border-t border-green-200 pt-4 flex justify-between items-center">
                      <span className="text-green-800 text-sm">Amount to Pay:</span>
                      <span className="text-green-900 font-bold text-lg">KES {loanSummary.fees}</span>
                    </div>
                  </div>

                  <div className="max-w-sm mx-auto text-left">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Enter M-Pesa Transaction Code</label>
                    <input 
                      type="text" 
                      required
                      value={transactionCode}
                      onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition outline-none uppercase placeholder:normal-case text-slate-900"
                      placeholder="e.g. TKA..."
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      After paying, you will receive an SMS from M-PESA with a code (e.g. TKA123...). Enter it above.
                    </p>
                  </div>
                  <div className="mt-8">
                    <Button 
                        type="submit" 
                        variant="primary" 
                        className="w-full"
                    >
                        Verify Payment
                    </Button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Pending Approval</h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                We have received your transaction code <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1 rounded">{transactionCode}</span>.
              </p>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Your application is currently being reviewed. Once approved, the funds will be sent directly to your M-Pesa account. Please check back later for progress.
              </p>
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Apply;