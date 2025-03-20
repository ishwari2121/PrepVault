import { useState, useEffect,useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { AuthContext } from "../Context/AuthContext";

const Signin = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const  res  = await axios.post("http://localhost:5000/api/auth/signin", formData);
      console.log("Login Response:", res.data);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] relative overflow-hidden">
      {/* Floating Background Elements */}
      <motion.div 
        className="absolute top-20 left-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-xl"
        initial={{ y: -50, scale: 0.8 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror' }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-xl"
        initial={{ y: 50, scale: 0.8 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: 5, repeat: Infinity, repeatType: 'mirror' }}
      />

      <motion.div 
        className={`w-full max-w-md p-8 space-y-6 rounded-2xl bg-white/5 backdrop-blur-lg shadow-2xl border border-white/10 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <motion.div 
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2"
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-gray-300 font-medium"
          >
            Sign in to continue your journey
          </motion.p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.01 }}
              >
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 pl-11 border border-white/10 rounded-xl bg-white/5 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  required
                />
                <FiMail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </motion.div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.01 }}
              >
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-4 py-3 pl-11 border border-white/10 rounded-xl bg-white/5 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                />
                <FiLock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </motion.div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20"
                >
                  <FiAlertCircle className="flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence>
                {isSubmitting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center"
                  >
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className={isSubmitting ? "opacity-0" : "opacity-100 flex items-center justify-center gap-2"}>
                <FiLogIn className="w-5 h-5" />
                Sign In
              </span>
            </motion.button>
          </motion.div>
        </form>

        <motion.div 
          className="text-center text-gray-300"
          variants={itemVariants}
        >
          Don't have an account?{" "}
          <motion.a
            href="/signup"
            className="text-cyan-400 hover:text-cyan-300 font-medium relative"
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative">
              Create one
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </span>
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signin;