import React, { useState } from 'react';
import { Calculator, DollarSign, PieChart, ArrowRight, X } from 'lucide-react';

const SalaryCalculatorModal = ({ onClose }) => {
  const [gross, setGross] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  
  const calculate = () => {
    const grossNum = parseFloat(gross) || 0;
    const tax = grossNum * 0.10; // 10% standard tax estimate
    const pf = grossNum * 0.05;  // 5% standard PF/deduction
    const net = grossNum - tax - pf;
    return { gross: grossNum, tax, pf, net };
  };

  const results = calculate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-green-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Salary Calculator</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gross Salary</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                <input
                  type="number"
                  value={gross}
                  onChange={(e) => setGross(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-colors"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Estimated Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Gross {frequency === 'monthly' ? 'Monthly' : 'Yearly'}</span>
                <span className="font-semibold text-gray-900">₹{results.gross.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Est. Taxes (10%)</span>
                <span className="font-semibold text-red-500">- ₹{results.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm pb-3 border-b border-gray-200">
                <span className="text-gray-600">PF/Deductions (5%)</span>
                <span className="font-semibold text-orange-500">- ₹{results.pf.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-gray-900">Net Take Home</span>
                <span className="font-extrabold text-xl text-green-600">₹{results.net.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaxEstimatorModal = ({ onClose }) => {
  const [income, setIncome] = useState('');

  const calculateTax = () => {
    const amount = parseFloat(income) || 0;
    let tax = 0;
    
    // Simplified Indian New Tax Regime (FY 2023-24)
    if (amount <= 300000) tax = 0;
    else if (amount <= 600000) tax = (amount - 300000) * 0.05;
    else if (amount <= 900000) tax = 15000 + (amount - 600000) * 0.10;
    else if (amount <= 1200000) tax = 45000 + (amount - 900000) * 0.15;
    else if (amount <= 1500000) tax = 90000 + (amount - 1200000) * 0.20;
    else tax = 150000 + (amount - 1500000) * 0.30;

    // Rebate u/s 87A (income <= 7L is tax free)
    if (amount <= 700000) tax = 0;

    return tax;
  };

  const estimatedTax = calculateTax();
  const effectiveRate = income ? ((estimatedTax / parseFloat(income)) * 100).toFixed(1) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Tax Estimator (New Regime)</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Income</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="e.g. 800000"
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
            <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Estimated Tax Liability</p>
            <div className="text-4xl font-extrabold text-blue-600 mb-2">
              ₹{estimatedTax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            {income && (
              <p className="text-sm font-medium text-gray-500">
                Effective Tax Rate: <span className="font-bold text-gray-800">{effectiveRate}%</span>
              </p>
            )}
            
            {income && estimatedTax === 0 && (
              <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                No tax applicable under New Regime (Rebate u/s 87A)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoanCalculatorModal = ({ onClose }) => {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [years, setYears] = useState(5);

  const calculateLoan = () => {
    const p = parseFloat(amount) || 0;
    const r = (parseFloat(rate) || 0) / 12 / 100;
    const n = (parseFloat(years) || 0) * 12;

    if (p === 0 || r === 0 || n === 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    return { emi, totalInterest, totalPayment };
  };

  const results = calculateLoan();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-purple-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">EMI Calculator</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-sm font-semibold text-gray-700">
              <label>Loan Amount (₹)</label>
              <span className="text-purple-600">₹{amount.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="5000000"
              step="10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1 text-sm font-semibold text-gray-700">
              <label>Interest Rate (% p.a.)</label>
              <span className="text-purple-600">{rate}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1 text-sm font-semibold text-gray-700">
              <label>Loan Tenure (Years)</label>
              <span className="text-purple-600">{years} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mt-6 text-center">
            <p className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Monthly EMI</p>
            <div className="text-3xl font-extrabold text-purple-600 mb-4">
              ₹{Math.round(results.emi).toLocaleString('en-IN')}
            </div>
            
            <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
              <span className="text-gray-500 font-medium">Total Interest</span>
              <span className="font-bold text-gray-900">₹{Math.round(results.totalInterest).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500 font-medium">Total Amount Payable</span>
              <span className="font-bold text-gray-900">₹{Math.round(results.totalPayment).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Financial = () => {
  const [activeModal, setActiveModal] = useState(null);

  const financialServices = [
    {
      id: 'salary',
      title: 'Salary Calculator',
      description: 'Estimate your take-home pay after taxes and deductions.',
      icon: Calculator,
      color: 'bg-green-100 text-green-700'
    },
    {
      id: 'tax',
      title: 'Tax Estimator',
      description: 'Understand your tax bracket and optimize your deductions.',
      icon: PieChart,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'loan',
      title: 'Personal Loans',
      description: 'Explore low-interest loan options for relocation or education.',
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-700'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-96px)] py-12 px-4 sm:px-6 lg:px-8">
      {activeModal === 'salary' && <SalaryCalculatorModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'tax' && <TaxEstimatorModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'loan' && <LoanCalculatorModal onClose={() => setActiveModal(null)} />}

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Financial Tools</h1>
          <p className="text-lg text-gray-600">
            Manage your finances better with our suite of free tools and resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {financialServices.map((service) => (
            <div 
              key={service.id} 
              onClick={() => setActiveModal(service.id)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col h-full group cursor-pointer hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${service.color}`}>
                <service.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                <button className="flex items-center gap-1 text-blue-600 font-bold group-hover:text-blue-700 transition-colors">
                  Try Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Financial;
