import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getFinancialAdvice } from '../services/geminiService';
import Button from '../components/Button';
import { LoanStatus } from '../types';

const Dashboard: React.FC = () => {
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Mock Data
  const creditLimit = 15000;
  const currentLoan = {
    amount: 5000,
    dueDate: '2025-12-20',
    status: LoanStatus.DISBURSED,
    balance: 5600
  };

  const repaymentData = [
    { month: 'Aug', amount: 3000 },
    { month: 'Sep', amount: 4500 },
    { month: 'Oct', amount: 2000 },
    { month: 'Nov', amount: 6000 },
  ];

  const handleGetAdvice = async () => {
    setLoadingAdvice(true);
    const result = await getFinancialAdvice({
      income: '45000',
      expenses: '30000',
      goal: 'Increase Credit Limit to 50k'
    });
    setAdvice(result);
    setLoadingAdvice(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Hello, Juma 👋</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Credit Limit Card */}
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-brand-100 text-sm font-medium mb-1">Available Credit Limit</p>
          <h2 className="text-3xl font-bold mb-4">KES {creditLimit.toLocaleString()}</h2>
          <div className="flex items-center text-xs bg-brand-500/30 w-fit px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></span>
            You qualify for a top-up
          </div>
        </div>

        {/* Current Loan Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm">Outstanding Balance</p>
              <h3 className="text-2xl font-bold text-slate-900">KES {currentLoan.balance.toLocaleString()}</h3>
            </div>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">
              DUE SOON
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full mb-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '70%' }}></div>
          </div>
          <p className="text-xs text-gray-500">Due on {currentLoan.dueDate}</p>
          <Button variant="outline" className="w-full mt-4 py-2 text-sm">
            Pay with M-Pesa
          </Button>
        </div>

        {/* Action Center */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center space-y-3">
          <Button variant="primary" className="w-full">Request New Loan</Button>
          <Button variant="secondary" className="w-full">View Statement</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Repayment History Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg text-slate-900 mb-6">Repayment History</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={repaymentData}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `K${value/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {repaymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === repaymentData.length - 1 ? '#16a34a' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Financial Advisor */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-slate-900 flex items-center">
              <span className="mr-2">✨</span> AI Financial Advisor
            </h3>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Beta</span>
          </div>
          
          <div className="flex-grow bg-slate-50 rounded-xl p-4 mb-4 text-sm text-slate-700 overflow-y-auto">
            {advice ? (
              <div className="whitespace-pre-line leading-relaxed">{advice}</div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p>Get personalized tips to improve your credit limit.</p>
              </div>
            )}
          </div>

          <Button 
            variant="secondary" 
            onClick={handleGetAdvice} 
            isLoading={loadingAdvice}
            className="w-full"
          >
            {advice ? 'Refresh Advice' : 'Analyze My Finances'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;