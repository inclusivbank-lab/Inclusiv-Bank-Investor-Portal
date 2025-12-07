import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { CheckCircle, Loader2 } from 'lucide-react';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function InvestmentInterestForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    investment_amount: '',
    interest_level: '',
    message: ''
  });
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const { data, error } = await supabase
        .from('investment_inquiries')
        .insert([formData]);

      if (error) throw error;

      setStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        investment_amount: '',
        interest_level: '',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600">
            Your investment inquiry has been received. We'll be in touch shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Investment Interest Form</h2>
        <p className="text-gray-600">
          Share your details and we'll connect with you about investment opportunities.
        </p>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="john@company.com"
          />
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Company / Organization
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="Acme Investments"
          />
        </div>

        {/* Investment Amount */}
        <div>
          <label htmlFor="investment_amount" className="block text-sm font-medium text-gray-700 mb-2">
            Investment Amount Range
          </label>
          <select
            id="investment_amount"
            name="investment_amount"
            value={formData.investment_amount}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
          >
            <option value="">Select a range</option>
            <option value="Under $50K">Under $50K</option>
            <option value="$50K - $100K">$50K - $100K</option>
            <option value="$100K - $250K">$100K - $250K</option>
            <option value="$250K - $500K">$250K - $500K</option>
            <option value="$500K - $1M">$500K - $1M</option>
            <option value="$1M+">$1M+</option>
          </select>
        </div>

        {/* Interest Level */}
        <div>
          <label htmlFor="interest_level" className="block text-sm font-medium text-gray-700 mb-2">
            Interest Level
          </label>
          <select
            id="interest_level"
            name="interest_level"
            value={formData.interest_level}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
          >
            <option value="">Select interest level</option>
            <option value="Just Exploring">Just Exploring</option>
            <option value="Moderately Interested">Moderately Interested</option>
            <option value="Very Interested">Very Interested</option>
            <option value="Ready to Invest">Ready to Invest</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message / Questions
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            placeholder="Tell us about your investment goals or ask any questions..."
          />
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={status === 'loading'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Investment Inquiry'
          )}
        </button>
      </div>

      <p className="mt-6 text-sm text-gray-500 text-center">
        Your information is confidential and will only be used to contact you about investment opportunities.
      </p>
    </div>
  );
}
