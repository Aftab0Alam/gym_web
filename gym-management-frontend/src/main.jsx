// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext'; // थीम प्रोवाइडर इंपोर्ट करें

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ThemeProvider से पूरे ऐप को रैप करें */}
    <ThemeProvider> 
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);