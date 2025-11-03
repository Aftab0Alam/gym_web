// src/components/AttendanceScanner.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

const SCAN_API_URL = 'http://localhost:5000/api/attendance/scan';
const HISTORY_API_URL = 'http://localhost:5000/api/attendance/history';

const AttendanceScanner = () => {
  const { theme } = useTheme();
  const [memberId, setMemberId] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  // ✅ Debug + Safe Fetch Function
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await axios.get(HISTORY_API_URL);

      // 🔍 Debug log (backend response देखने के लिए)
      console.log("🟢 [DEBUG] Attendance history raw response:", res.data);

      // Handle both array or object responses
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.history || [];

      setAttendanceHistory(data);
    } catch (error) {
      console.error('🔴 [DEBUG] Failed to fetch attendance history:', error);
      setAttendanceHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getStatusClasses = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-500';
      case 'expired':
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-500';
      case 'not_found':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-500';
      default:
        return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!memberId) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const res = await axios.post(SCAN_API_URL, { memberId });

      // 🔍 Debug log for scan success
      console.log("🟢 [DEBUG] Scan success response:", res.data);

      setResponse({
        message: res.data.message,
        status: 'success',
        memberName: res.data.member.name,
      });

      // ✅ Refresh history after check-in
      fetchHistory();
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;

      // 🔴 Debug log for scan error
      console.log("🔴 [DEBUG] Scan error response:", data);

      let statusType = 'error';
      if (status === 404) statusType = 'not_found';
      if (status === 403) statusType = 'expired';

      setResponse({
        message: data?.message || 'Error occurred while checking attendance.',
        status: statusType,
        memberName: data?.member?.name,
      });
    } finally {
      setIsLoading(false);
      setMemberId('');
    }
  };

  const tableHeadClass = "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400";
  const tableRowClass = "px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100";

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* --- Scanner Section --- */}
      <div className={`md:col-span-1 p-6 rounded-xl shadow-2xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <h2 className="text-2xl font-bold mb-5 text-indigo-600 dark:text-indigo-400 text-center border-b pb-2">
          QR-Based Check-In
        </h2>
        <form onSubmit={handleScan} className="space-y-4 mb-6">
          <input
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="Enter Member ID (e.g., GM-123456)"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            required
          />
          <button
            type="submit"
            disabled={isLoading || !memberId}
            className={`w-full py-3 text-white font-bold rounded-lg transition-colors duration-200 ${isLoading || !memberId ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'}`}
          >
            {isLoading ? 'Checking...' : 'Check-In'}
          </button>
        </form>

        {response && (
          <div className={`p-4 border-l-4 rounded-lg font-bold transition-all duration-300 border-4 ${getStatusClasses(response.status)}`}>
            <p className="text-xl mb-1">
              {response.status === 'success' ? '✅ SUCCESS' : '❌ ALERT'}
            </p>
            <p className="text-md">{response.message}</p>
            {(response.status === 'expired' || response.status === 'not_found') && (
              <p className="mt-2 text-xs italic font-normal">WhatsApp alert sent.</p>
            )}
          </div>
        )}
      </div>

      {/* --- History Section --- */}
      <div className={`md:col-span-2 p-6 rounded-xl shadow-2xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <h2 className="text-2xl font-bold mb-6 text-indigo-600 dark:text-indigo-400 border-b pb-2">
          Last 10 Days Attendance History
        </h2>

        {historyLoading ? (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">Loading history...</p>
        ) : attendanceHistory.length === 0 ? (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">No attendance records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className={tableHeadClass}>Member Name</th>
                  <th className={tableHeadClass}>Member ID</th>
                  <th className={tableHeadClass}>Date</th>
                  <th className={tableHeadClass}>Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {attendanceHistory.map((record, index) => (
                  <tr key={index} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className={tableRowClass}>{record.memberName}</td>
                    <td className={tableRowClass + " font-mono"}>{record.memberId}</td>
                    <td className={tableRowClass}>{new Date(record.checkInTime).toLocaleDateString()}</td>
                    <td className={tableRowClass}>{new Date(record.checkInTime).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Showing {attendanceHistory.length} records.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceScanner;
