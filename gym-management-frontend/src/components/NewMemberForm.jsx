// src/components/NewMemberForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext'; // थीम हुक

// सुनिश्चित करें कि यह URL आपके बैकएंड से मेल खाता है
const API_URL = 'http://localhost:5000/api/members/register';

const NewMemberForm = () => {
  const { theme } = useTheme();
  
  // फॉर्म इनपुट के लिए राज्य (State)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male', 
    contact: '',
    planType: 'Monthly', 
    cashAmount: '',
  });

  // UI प्रतिक्रिया (Response) के लिए राज्य
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // इनपुट onChange हैंडलर
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // सबमिट हैंडलर
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setQrCodeImage(null);
    setResponseMessage('');

    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age), 
        cashAmount: parseFloat(formData.cashAmount), 
      };

      const response = await axios.post(API_URL, payload);

      setResponseMessage(`Success! Member ID: ${response.data.member.memberId}. WhatsApp Welcome Alert Sent!`);
      setQrCodeImage(response.data.qrCodeImage);
      setIsSuccess(true);
      
      // फॉर्म को साफ़ करें
      setFormData({ 
        name: '', age: '', gender: 'Male', contact: '', planType: 'Monthly', cashAmount: '',
      });

    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed due to server error. Check console.';
      setResponseMessage(msg);
      setIsSuccess(false);
      console.error('Registration error:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Tailwind Classes for consistent input styling
  const inputClass = "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors duration-200";

  return (
    <div className={`p-8 max-w-4xl mx-auto rounded-xl shadow-2xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <h2 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">Add New Member</h2>
      
      {/* 1. संदेश / अलर्ट */}
      {responseMessage && (
        <div className={`p-4 mb-4 rounded-lg font-medium ${isSuccess ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
          {responseMessage}
        </div>
      )}

      {/* 2. QR Code डिस्प्ले */}
      {qrCodeImage && (
        <div className="flex flex-col items-center mb-6 p-6 border rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <p className="text-xl font-semibold mb-3 text-indigo-500 dark:text-indigo-300">Member's Personal QR Code</p>
          {/* QR Code is a Base64 string from the API */}
          <img src={qrCodeImage} alt="Member QR Code" className="w-48 h-48 p-2 bg-white border-4 border-indigo-500 dark:border-indigo-400 rounded-lg shadow-xl" />
          <p className="mt-4 text-md text-gray-600 dark:text-gray-400 font-medium">Scan this code daily for attendance tracking.</p>
        </div>
      )}

      {/* 3. फॉर्म */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact (Phone Number)</label>
            <input type="tel" name="contact" value={formData.contact} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputClass} required min="10" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <h3 className="text-xl font-semibold pt-4 text-indigo-600 dark:text-indigo-400 border-t pt-4 dark:border-gray-700">Membership Details (Cash Only)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Plan Type</label>
            <select name="planType" value={formData.planType} onChange={handleChange} className={inputClass}>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Annual">Annual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cash Amount Received (₹)</label>
            <input type="number" name="cashAmount" value={formData.cashAmount} onChange={handleChange} className={inputClass} required min="1" />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full py-3 mt-6 text-white font-bold rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'}`}
        >
          {/* Lucide icon for registration (assumed availability) */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4"/></svg>
          <span>{isLoading ? 'Registering...' : 'Register New Member & Send WhatsApp Alert'}</span>
        </button>
      </form>
    </div>
  );
};

export default NewMemberForm;
