// src/components/ThemeToggleButton.jsx

import React from 'react';
import { useTheme } from '../contexts/ThemeContext'; // Context से हुक इंपोर्ट करें
// आप यहाँ Heroicons या किसी अन्य आइकन लाइब्रेरी का उपयोग कर सकते हैं

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md transition-colors duration-300"
      title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {/* सरल आइकन अनुकरण (Simple Icon Simulation) */}
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggleButton;