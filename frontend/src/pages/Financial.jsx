import React from 'react';
import { Calculator, DollarSign, PieChart, ArrowRight } from 'lucide-react';

const financialServices = [
  {
    title: 'Salary Calculator',
    description: 'Estimate your take-home pay after taxes and deductions.',
    icon: Calculator,
    color: 'bg-green-100 text-green-700'
  },
  {
    title: 'Tax Estimator',
    description: 'Understand your tax bracket and optimize your deductions.',
    icon: PieChart,
    color: 'bg-blue-100 text-blue-700'
  },
  {
    title: 'Personal Loans',
    description: 'Explore low-interest loan options for relocation or education.',
    icon: DollarSign,
    color: 'bg-purple-100 text-purple-700'
  }
];

const Financial = () => {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-96px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Financial Tools</h1>
          <p className="text-lg text-gray-600">
            Manage your finances better with our suite of free tools and resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {financialServices.map((service, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col h-full group cursor-pointer">
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
