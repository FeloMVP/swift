import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
        <p className="text-slate-500 mb-8 pb-8 border-b border-gray-100">Last updated: December 2023</p>

        <div className="space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Information We Collect</h2>
            <p>
              We collect personal identification information (Name, ID Number, Phone Number) and financial information 
              (M-Pesa transaction logs) to assess your creditworthiness. This data is collected directly from you during the application process.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. How We Use Your Data</h2>
            <ul className="list-disc ml-5 space-y-2">
              <li>To process your loan applications and disburse funds.</li>
              <li>To verify your identity and credit standing via Credit Reference Bureaus (CRB).</li>
              <li>To communicate with you regarding your loan status.</li>
              <li>To comply with legal obligations under Kenyan law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Data Security</h2>
            <p>
              We implement banking-grade security measures including SSL encryption and secure server infrastructure 
              to protect your data from unauthorized access, alteration, or disclosure. We adhere strictly to the Kenya Data Protection Act.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. Third-Party Sharing</h2>
            <p>
              We do not sell your data. We only share data with authorized third parties such as CRBs and payment processors 
              (Safaricom) strictly for service delivery and legal compliance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. Your Rights</h2>
            <p>
              Under the Data Protection Act, you have the right to access, correct, or request deletion of your data. 
              Contact our Data Protection Officer at <strong>dpo@pesaswift.co.ke</strong> for any requests.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;