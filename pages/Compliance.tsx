import React from 'react';

const Compliance: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Legal & Compliance</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">1. Data Protection Statement</h2>
            <p className="text-slate-600 leading-relaxed">
              PesaSwift operates in strict compliance with the Data Protection Act of Kenya. 
              We collect and process your personal information (including ID number and M-Pesa transaction history) 
              solely for the purpose of credit scoring and loan facilitation. Your data is encrypted at rest and in transit. 
              We do not share your data with third parties without your explicit consent, except as required by law (e.g., CRB listing).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">2. Digital Credit Providers (DCP) Regulations</h2>
            <p className="text-slate-600 leading-relaxed">
              We are a licensed Digital Credit Provider regulated by the Central Bank of Kenya (CBK). 
              Our pricing model is transparent:
            </p>
            <ul className="list-disc list-inside mt-3 text-slate-600 space-y-1 ml-4">
              <li>Interest rates are calculated daily.</li>
              <li>No hidden access fees or rollover penalties.</li>
              <li>We do not use debt shaming or intrusive collection tactics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">3. Credit Reference Bureau (CRB)</h2>
            <p className="text-slate-600 leading-relaxed">
              By applying for a loan, you consent to PesaSwift obtaining your credit information from licensed Credit Reference Bureaus. 
              Default on repayment may result in negative listing, which affects your ability to access credit from other financial institutions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">4. Contact Information</h2>
            <p className="text-slate-600">
              For complaints or inquiries, please contact our Data Protection Officer:<br />
              Email: dpo@pesaswift.co.ke<br />
              Tel: +254 700 000 000
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Compliance;