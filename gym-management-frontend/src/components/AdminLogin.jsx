import React, { useState } from 'react';
import axios from 'axios';

/**
 * Lightweight Admin Login panel
 * Props:
 *  - onLoginSuccess(token) optional callback
 *  - onCancel() optional callback (to go back to dashboard)
 */
const AdminLogin = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // change this if you use proxy; else keep full url
  const LOGIN_API = '/api/auth/login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please enter username and password.');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(LOGIN_API, { username, password });
      const token = res.data?.token;
      if (token) {
        localStorage.setItem('gym_admin_token', token);
        if (onLoginSuccess) onLoginSuccess(token);
      } else {
        setError('Login failed: invalid response from server.');
      }
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Login failed. Check credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      {/* Background layer */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1558611848-73f7eb4001d6?q=80&w=1600&auto=format&fit=crop&s=0f7e6b9f7e28c3d7e1f1b2b5f7a3a9f0')",
          filter: 'blur(2px) saturate(0.9)'
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              Admin Login
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-300">Secure Access</div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Sign in to manage members, payments, and reports.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="admin"
                autoComplete="username"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>
            )}

            <div className="flex items-center justify-between gap-3">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-white transition ${
                  loading ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('gym_admin_token');
                  setUsername(''); setPassword(''); setError('');
                  if (onCancel) onCancel();
                }}
                className="px-4 py-2 rounded-lg font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Tip: default admin credentials are set in backend env (for demo).
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
