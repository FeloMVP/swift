import React, { useState, useEffect } from 'react';
import { LoanOffer } from '../types';

interface LoanCalculatorProps {
  onApply: (offer: LoanOffer) => void;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ onApply }) => {
  const [amount, setAmount] = useState<number>(5000);
  const [term, setTerm] = useState<number>(30);
  const [offer, setOffer] = useState<LoanOffer | null>(null);

  // Constants for calculation
  const INTEREST_RATE_DAY = 0.01; // 1% per day simulation
  const PROCESSING_FEE_RATE = 0.05; // 5% flat fee

  useEffect(() => {
    const interest = amount * INTEREST_RATE_DAY * term;
    const fees = amount * PROCESSING_FEE_RATE;
    const total = amount + interest + fees;
    
    setOffer({
      amount,
      termDays: term,
      interestRate: INTEREST_RATE_DAY * 100, // as percentage
      totalRepayment: Math.round(total),
      fees: Math.round(fees)
    });
  }, [amount, term]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 md:p-8 border border-gray-100 max-w-md mx-auto">
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center">
        <span className="bg-brand-100 text-brand-600 p-2 rounded-lg mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </span>
        Quick Loan Calculator
      </h3>

      {/* Amount Slider */}
      <div className="mb-6">
        <div className="flex justify-between mb-3 items-end">
          <label className="text-sm font-medium text-gray-500">I want to borrow</label>
          <span className="text-xl font-bold text-brand-700">KES {amount.toLocaleString()}</span>
        </div>
        <input 
          type="range" 
          min="500" 
          max="50000" 
          step="500" 
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600 touch-none"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>KES 500</span>
          <span>KES 50,000</span>
        </div>
      </div>

      {/* Tenure Slider */}
      <div className="mb-8">
        <div className="flex justify-between mb-3 items-end">
          <label className="text-sm font-medium text-gray-500">Repayment Period</label>
          <span className="text-xl font-bold text-brand-700">{term} Days</span>
        </div>
        <input 
          type="range" 
          min="7" 
          max="60" 
          step="1" 
          value={term}
          onChange={(e) => setTerm(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600 touch-none"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>7 Days</span>
          <span>60 Days</span>
        </div>
      </div>

      {/* Summary Box */}
      {offer && (
        <div className="bg-brand-50/80 rounded-xl p-4 mb-6 space-y-3 border border-brand-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Interest ({term} days @ {offer.interestRate}%)</span>
            <span className="font-semibold text-gray-900">KES {(offer.totalRepayment - offer.amount - offer.fees).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Processing Fees (5%)</span>
            <span className="font-semibold text-gray-900">KES {offer.fees.toLocaleString()}</span>
          </div>
          <div className="h-px bg-brand-200 my-1"></div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Total to Repay</span>
            <span className="text-2xl font-bold text-brand-700">KES {offer.totalRepayment.toLocaleString()}</span>
          </div>
        </div>
      )}

      <button 
        onClick={() => offer && onApply(offer)}
        className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 flex justify-center items-center active:scale-[0.98] duration-150 text-lg"
      >
        Check Loan Limit
        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
      </button>
      
      <p className="text-xs text-gray-400 text-center mt-4">
        Licensed by the Central Bank of Kenya (CBK). T&Cs apply.
      </p>
    </div>
  );
};

export default LoanCalculator;