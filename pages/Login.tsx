import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock login simulation
    setTimeout(() => {
      setLoading(false);
      // Mock user data for login
      login({
        name: 'Juma Kamau',
        phoneNumber: phone
      });
      navigate('/'); // Redirect to home
    }, 1500);
  };

  const handleForgotPin = () => {
    alert("A PIN reset link has been sent to your registered M-Pesa number.");
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-100 text-brand-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to manage your loans</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <input 
              type="tel" 
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
              placeholder="07..."
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">PIN</label>
            <input 
              type="password" 
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
              placeholder="••••"
            />
            <div className="flex justify-end mt-2">
                <button 
                    type="button" 
                    onClick={handleForgotPin}
                    className="text-sm text-brand-600 hover:text-brand-700 hover:underline"
                >
                    Forgot PIN?
                </button>
            </div>
          </div>
          
          <Button type="submit" isLoading={loading} className="w-full">
            Log In
          </Button>

          <p className="text-center text-sm text-slate-500">
            Don't have an account? <span className="text-brand-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/apply')}>Apply for a loan</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
