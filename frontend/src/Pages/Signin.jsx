import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { AuthContext } from "../Context/AuthContext";
import { LoginFromInterviewExp } from "../App"; 

const Signin = () => {
  const { login } = useContext(AuthContext);
  const { loginFromInterview, setLoginFromInterview } = useContext(LoginFromInterviewExp);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Context in Signin:", loginFromInterview); 
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signin", formData);
      console.log("Login Response:", res.data);
      login(res.data);
      if (loginFromInterview) 
      {
        setLoginFromInterview(false); 
        navigate("/interviewexp");
      } 
      else
      {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] relative overflow-hidden">
      <motion.div 
        className="w-full max-w-md p-8 space-y-6 rounded-2xl bg-white/5 backdrop-blur-lg shadow-2xl border border-white/10"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <motion.div className="text-center">
          <motion.h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Welcome Back
          </motion.h1>
          <motion.p className="text-gray-300 font-medium">
            Sign in to continue your journey
          </motion.p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 pl-11 border border-white/10 rounded-xl bg-white/5 text-gray-200"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  required
                />
                <FiMail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-4 py-3 pl-11 border border-white/10 rounded-xl bg-white/5 text-gray-200"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                />
                <FiLock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

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

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all relative"
            >
              {isSubmitting ? "Signing in..." : (
                <span className="flex items-center justify-center gap-2">
                  <FiLogIn className="w-5 h-5" />
                  Sign In
                </span>
              )}
            </motion.button>
          </div>
        </form>

        <motion.div className="text-center text-gray-300">
          Don't have an account?{" "}
          <motion.a href="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">
            Create one
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signin;
