import React, { useState } from "react";
import { motion } from "framer-motion";
import gymBackground from "../assets/gym-background.png"; // ✅ Local background image

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "gym@123",
};

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      form.username === ADMIN_CREDENTIALS.username &&
      form.password === ADMIN_CREDENTIALS.password
    ) {
      localStorage.setItem("isAdminLoggedIn", "true");
      onLogin();
    } else {
      setError("❌ Invalid username or password!");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${gymBackground})`,
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80 backdrop-blur-[2px]" />

      {/* Floating Particles (Subtle Animation) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.2),transparent_70%)]"
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-white/20 backdrop-blur-xl border border-white/30 p-8 rounded-3xl shadow-2xl w-[90%] max-w-md text-center"
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-white mb-8 drop-shadow-lg"
        >
          🏋️ Admin Login
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.input
            whileFocus={{ scale: 1.03 }}
            type="text"
            name="username"
            placeholder="Enter Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-600 border border-gray-300 focus:ring-4 focus:ring-indigo-500 outline-none transition-all duration-200"
          />

          <motion.input
            whileFocus={{ scale: 1.03 }}
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-600 border border-gray-300 focus:ring-4 focus:ring-indigo-500 outline-none transition-all duration-200"
          />

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm font-medium"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(99,102,241,0.6)",
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition-all"
          >
            Login
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-200 text-sm mt-5"
        >
          Forgot password?{" "}
          <motion.span
            whileHover={{ scale: 1.1, color: "#a5b4fc" }}
            className="text-indigo-300 cursor-pointer font-medium hover:underline"
          >
            Click here
          </motion.span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
