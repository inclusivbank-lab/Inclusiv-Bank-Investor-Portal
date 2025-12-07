import React from 'react';
import InvestmentInterestForm from './InvestmentInterestForm';

export default function InvestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Invest With Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our community of forward-thinking investors. Share your details below 
            and we'll connect with you about exclusive investment opportunities.
          </p>
        </div>

        {/* Form Component */}
        <InvestmentInterestForm />
      </div>
    </div>
  );
}
