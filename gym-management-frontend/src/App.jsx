import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import NewMemberForm from './components/NewMemberForm';
import AttendanceScanner from './components/AttendanceScanner';
import PaymentRecorder from './components/PaymentRecorder';
import MemberList from './components/MemberList';
import Login from './components/Login'; // ✅ नया Login component
import { useTheme } from './contexts/ThemeContext';
import ThemeToggleButton from './components/ThemeToggleButton';

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Login check on page load
  useEffect(() => {
    const savedLogin = localStorage.getItem('isAdminLoggedIn');
    if (savedLogin === 'true') setIsLoggedIn(true);
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    setIsLoggedIn(false);
  };

  // ✅ Button style helper
  const buttonClass = (active) =>
    `px-4 py-2 font-semibold rounded-lg transition-colors duration-200 ${
      active
        ? 'bg-indigo-600 text-white dark:bg-indigo-500'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
    }`;

  // ✅ अगर login नहीं है → Login Page दिखाओ
  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  // ✅ Otherwise, Admin Panel दिखाओ
  return (
    <div
      className={`min-h-screen ${
        theme === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-900'
      }`}
    >
      {/* Header */}
      <header
        className={`p-4 shadow-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            🏋️ GYM ADMIN PANEL
          </h1>
          <nav className="space-x-2 flex items-center">
            <button
              onClick={() => setView('dashboard')}
              className={buttonClass(view === 'dashboard')}
            >
              Dashboard
            </button>
            <button
              onClick={() => setView('addMember')}
              className={buttonClass(view === 'addMember')}
            >
              Add New Member
            </button>
            <button
              onClick={() => setView('scanner')}
              className={buttonClass(view === 'scanner')}
            >
              Attendance Scanner
            </button>
            <button
              onClick={() => setView('payment')}
              className={buttonClass(view === 'payment')}
            >
              Record Payment
            </button>
            <button
              onClick={() => setView('members')}
              className={buttonClass(view === 'members')}
            >
              Manage Members
            </button>

            {/* Theme Toggle */}
            <ThemeToggleButton toggleTheme={toggleTheme} />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main View */}
      <main className="max-w-7xl mx-auto pt-8 pb-12">
        {view === 'dashboard' && <Dashboard />}
        {view === 'addMember' && <NewMemberForm />}
        {view === 'scanner' && <AttendanceScanner />}
        {view === 'payment' && <PaymentRecorder />}
        {view === 'members' && <MemberList />}
      </main>
    </div>
  );
};

export default App;
