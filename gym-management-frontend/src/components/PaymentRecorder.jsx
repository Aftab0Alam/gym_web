// src/components/PaymentRecorder.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

const API_URL = 'http://localhost:5000/api/payments/record'; 
const HISTORY_URL = 'http://localhost:5000/api/payments/history/'; 

const PaymentRecorder = () => {
  const { theme } = useTheme();
  const [memberId, setMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [durationInMonths, setDurationInMonths] = useState(1);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState(null);
  const [historyError, setHistoryError] = useState(null);

  const inputClass = "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white";

  // भुगतान इतिहास प्राप्त करें
  const fetchHistory = async (id) => {
    setHistory(null);
    setHistoryError(null);
    if (!id) return;
    try {
      const res = await axios.get(HISTORY_URL + id);
      setHistory(res.data);
    } catch (err) {
      setHistoryError(err.response?.data?.message || 'Failed to fetch payment history.');
      setHistory(null);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);

    try {
      const payload = {
        memberId,
        amount: parseFloat(amount),
        durationInMonths: parseInt(durationInMonths),
      };

      const res = await axios.post(API_URL, payload);

      setResponse({
        message: `Payment of ₹${amount} recorded. New renewal date: ${new Date(res.data.newRenewalDate).toDateString()}.`,
        status: 'success',
      });
      // भुगतान के बाद इतिहास को अपडेट करें
      fetchHistory(memberId); 
      setAmount(''); // फॉर्म साफ़ करें

    } catch (error) {
      setResponse({
        message: error.response?.data?.message || 'Payment recording failed.',
        status: 'error',
      });
      console.error('Payment Error:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* 1. भुगतान रिकॉर्डर फॉर्म */}
      <div className={`rounded-xl shadow-2xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6`}>
        <h2 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">Record Cash Payment</h2>

        {/* सदस्य ID इनपुट - इतिहास खोज के लिए भी उपयोग करें */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Member ID (Search/Record)</label>
          <div className="flex space-x-2">
            <input 
              type="text" 
              value={memberId} 
              onChange={(e) => setMemberId(e.target.value)} 
              placeholder="Enter Member ID (e.g., GM-123456)" 
              className={inputClass}
            />
            <button 
              onClick={() => fetchHistory(memberId)}
              type="button"
              className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </div>
        
        {response && (
          <div className={`p-4 mb-4 rounded-lg font-medium ${response.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
            {response.message}
          </div>
        )}
        
        <form onSubmit={handleRecordPayment} className="space-y-4 border-t pt-4 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount (₹)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} required min="1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration (Months)</label>
              <select value={durationInMonths} onChange={(e) => setDurationInMonths(e.target.value)} className={inputClass} required>
                <option value={1}>1 Month</option>
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !memberId || !amount}
            className={`w-full py-3 text-white font-bold rounded-lg transition-colors duration-200 ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'}`}
          >
            {isLoading ? 'Recording...' : 'Record Payment & Renew Membership'}
          </button>
        </form>
      </div>

      {/* 2. भुगतान इतिहास (Payment History) */}
      <div className={`rounded-xl shadow-2xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6 h-full`}>
        <h2 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400 border-b pb-2 dark:border-gray-700">Payment History</h2>

        {historyError && (
          <div className="p-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
            {historyError}
          </div>
        )}

        {history && history.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((item, index) => (
              <div key={index} className="p-3 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <p className="font-bold text-lg text-green-600 dark:text-green-400">₹{item.amount.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date: {new Date(item.paymentDate).toLocaleDateString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Duration: {item.durationInMonths} Months | Method: {item.paymentMethod}</p>
              </div>
            ))}
          </div>
        ) : history !== null && (
          <p className="text-gray-500 dark:text-gray-400">No payment records found for this member.</p>
        )}
      </div>

    </div>
  );
};

export default PaymentRecorder;
