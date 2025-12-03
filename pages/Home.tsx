import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoanCalculator from '../components/LoanCalculator';
import { LoanOffer } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleApply = (offer: LoanOffer) => {
    // Pass the offer state to the apply page
    navigate('/apply', { state: { offer } });
  };

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <div className="relative bg-accent-900 pt-10 pb-20 md:pt-16 md:pb-32 overflow-hidden">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0 text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-brand-500/20 text-brand-400 rounded-full text-xs md:text-sm font-semibold mb-6 border border-brand-500/30">
                #1 Trusted DCP in Kenya
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                Instant Loans to <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-200">M-Pesa</span>
              </h1>
              <p className="text-slate-300 text-base md:text-lg mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                Get up to KES 50,000 in 5 minutes. No paperwork, no collateral. Fully compliant with CBK regulations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start w-full sm:w-auto">
                <button 
                  onClick={() => navigate('/apply')}
                  className="px-8 py-3.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-500/30 w-full sm:w-auto active:scale-95 duration-150"
                >
                  Get Started
                </button>
                <button 
                  onClick={() => navigate('/compliance')}
                  className="px-8 py-3.5 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition backdrop-blur-sm w-full sm:w-auto border border-white/10"
                >
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex justify-center md:justify-end px-2 md:px-0">
              <div className="w-full max-w-md transform md:translate-y-8">
                 <LoanCalculator onApply={handleApply} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 pt-16">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              title: "Instant Disbursement",
              desc: "Money sent directly to your M-Pesa account immediately after approval.",
              icon: "🚀"
            },
            {
              title: "Low Interest Rates",
              desc: "Competitive rates starting from 0.8% per day. No hidden fees.",
              icon: "📉"
            },
            {
              title: "Secure & Private",
              desc: "Your data is encrypted and protected under the Kenya Data Protection Act.",
              icon: "🔒"
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;