import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { analyzeLoanEligibility } from '../services/geminiService';
import Button from '../components/Button';
import { LoanOffer } from '../types';

const Apply: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const initialOffer = state?.offer as LoanOffer;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    phoneNumber: '',
    income: '25000',
    amount: initialOffer?.amount || 5000,
    termsAccepted: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAnalysis = async () => {
    setLoading(true);
    setError('');
    
    // Simulate slight delay for UX
    await new Promise(r => setTimeout(r, 1000));

    // Call Gemini to check eligibility logic
    const analysis = await analyzeLoanEligibility(
      Number(formData.amount),
      30, // Default 30 days for this logic
      Number(formData.income)
    );

    setLoading(false);

    if (analysis.eligible) {
      setStep(3); // Success
    } else {
      setError(`Application declined: ${analysis.reasoning}. Recommended: KES ${analysis.recommendedAmount || 0}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      handleAnalysis();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-slate-100 h-2 w-full">
          <div 
            className="bg-brand-600 h-full transition-all duration-500 ease-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {step === 1 && "Personal Information"}
            {step === 2 && "Loan Details & KYC"}
            {step === 3 && "Application Successful!"}
          </h2>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm">
              <p className="font-bold">Attention Needed</p>
              <p>{error}</p>
            </div>
          )}

          {step < 3 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name (as per ID)</label>
                    <input 
                      type="text" 
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition outline-none"
                      placeholder="e.g. Juma Kamau"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">National ID Number</label>
                    <input 
                      type="number" 
                      name="idNumber"
                      required
                      value={formData.idNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition outline-none"
                      placeholder="e.g. 12345678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">M-Pesa Phone Number</label>
                    <input 
                      type="tel" 
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition outline-none"
                      placeholder="07..."
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Income (Estimate)</label>
                    <input 
                      type="number" 
                      name="income"
                      required
                      value={formData.income}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition outline-none"
                    />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Requested Amount</label>
                     <input 
                      type="number" 
                      name="amount"
                      required
                      readOnly={!!initialOffer} // Read only if came from calculator
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  
                  {/* File Upload for ID */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Upload ID (Front)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-brand-400 transition cursor-pointer">
                        <input type="file" className="hidden" id="id-upload" />
                        <label htmlFor="id-upload" className="cursor-pointer">
                            <span className="text-gray-500 text-sm">Click to upload or drag and drop</span>
                        </label>
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
                      className="mt-1 h-4 w-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                      I agree to the <span className="text-brand-600 underline">Terms & Conditions</span> and consent to data processing for CRB checks.
                    </label>
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full"
                isLoading={loading}
                disabled={step === 2 && !formData.termsAccepted}
              >
                {step === 1 ? 'Next Step' : 'Submit Application'}
              </Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Application Approved!</h3>
              <p className="text-gray-600 mb-8">
                Your loan of <span className="font-bold text-slate-900">KES {Number(formData.amount).toLocaleString()}</span> is being processed. 
                You will receive an M-Pesa notification shortly.
              </p>
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Apply;