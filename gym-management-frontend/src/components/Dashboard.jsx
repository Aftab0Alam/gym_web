// src/components/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext'; // थीम हुक
import ThemeToggleButton from './ThemeToggleButton'; // टॉगल बटन
import ReportExporter from './ReportExporter'; // ✅ नया जोड़ा गया

const API_BASE_URL = 'http://localhost:5000/api/dashboard/stats';

// सहायक फ़ंक्शन: स्टैट कार्ड बनाने के लिए
const renderStatCard = (title, value, colorClass) => (
  <div className={`p-5 rounded-lg text-white shadow-lg ${colorClass}`}>
    <p className="text-sm font-medium opacity-80">{title}</p>
    <p className="text-3xl font-extrabold mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  const { theme } = useTheme(); // थीम हुक का उपयोग करें
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(API_BASE_URL);
        setStats(response.data);
      } catch (err) {
        setError("Failed to fetch dashboard data. Is the backend running on port 5000?");
        console.error("API Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center p-8 dark:text-white">Loading Dashboard...</div>;
  if (error) return <div className="text-center p-8 text-red-600 dark:text-red-400">{error}</div>;

  const { memberStats, financialStats, attendanceStats, alerts } = stats;

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          Admin Dashboard Overview
        </h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {renderStatCard("Total Members", memberStats.totalMembers, "bg-blue-600 dark:bg-blue-700")}
        {renderStatCard("Active Members", memberStats.activeMembers, "bg-green-600 dark:bg-green-700")}
        {renderStatCard("Expired Members", memberStats.expiredMembers, "bg-red-600 dark:bg-red-700")}
        {renderStatCard("Daily Check-ins (Today)", attendanceStats.dailyAttendanceCount, "bg-yellow-600 dark:bg-yellow-700")}
      </div>

      {/* Two Main Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ✅ Monthly Income Overview */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"> 
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 dark:border-gray-700">
            Monthly Income Overview
          </h2>
          <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
            ₹{financialStats.totalMonthlyIncome.toLocaleString('en-IN')}
          </p>
          <p className="text-gray-500 mt-2 dark:text-gray-400">
            Revenue collected this month (Cash Only)
          </p>

          {/* ✅ PDF Export Component */}
          <ReportExporter stats={stats} />
        </div>

        {/* 🔔 Upcoming Renewals */}
        <div className="bg-orange-100 dark:bg-orange-900/30 p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
          <h2 className="text-2xl font-semibold mb-4 text-orange-800 dark:text-orange-400">
            Alerts: Upcoming Renewals
          </h2>
          {alerts.upcomingRenewals.length > 0 ? (
            <ul className="space-y-3">
              {alerts.upcomingRenewals.slice(0, 3).map(alert => (
                <li key={alert.memberId} className="p-3 bg-white dark:bg-gray-700 rounded-md shadow-sm text-gray-700 dark:text-gray-200">
                  <p className="font-medium">{alert.name} ({alert.memberId})</p>
                  <p className="text-sm text-orange-500">
                    Due: {new Date(alert.renewalDate).toDateString()} (WhatsApp Alert Sent)
                  </p>
                </li>
              ))}
              {alerts.upcomingRenewals.length > 3 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  +{alerts.upcomingRenewals.length - 3} more...
                </p>
              )}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No renewals due in the next 7 days. Good job!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
