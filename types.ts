export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DISBURSED = 'DISBURSED',
  PAID = 'PAID'
}

export interface LoanOffer {
  amount: number;
  termDays: number;
  interestRate: number; // Percentage
  totalRepayment: number;
  fees: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  nationalId: string;
  phoneNumber: string; // M-Pesa
  creditLimit: number;
  kycVerified: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'DISBURSEMENT' | 'REPAYMENT';
  status: 'SUCCESS' | 'FAILED';
}

export interface FinancialTip {
  title: string;
  content: string;
  category: 'SAVINGS' | 'CREDIT_SCORE' | 'INVESTMENT';
}