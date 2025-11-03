// src/contexts/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

// 1️⃣ Context बनाएं
const ThemeContext = createContext();

// 2️⃣ Custom Hook ताकि किसी भी कंपोनेंट में आसानी से उपयोग किया जा सके
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// 3️⃣ Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // लोकल स्टोरेज से थीम प्राप्त करें या डिफ़ॉल्ट 'light'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  // थीम बदलने पर HTML में dark क्लास लगाएं और लोकल स्टोरेज अपडेट करें
  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // टॉगल फंक्शन
  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
