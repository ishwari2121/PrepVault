import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams, Link,useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertCircle,
  FiMail,
  FiLock,
  FiLogIn,
  FiUser,
  FiEye,
  FiEyeOff,
  FiArrowRight
} from "react-icons/fi";
import { AuthContext } from "../Context/AuthContext";
import { toast } from 'react-hot-toast';

// Add global styles once
const toastStyles = `
  @keyframes border-pulse {
    0% { opacity: 0.8; background-position: 0% 50%; }
    50% { opacity: 1; background-position: 100% 50%; }
    100% { opacity: 0.8; background-position: 0% 50%; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(15deg); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes text-glow {
    0%, 100% { filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.4)); }
    50% { filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)); }
  }
  @keyframes shine {
    0% { transform: rotate(45deg) translateX(-100%); }
    100% { transform: rotate(45deg) translateX(100%); }
  }
`;
const styleSheet = document.createElement('style');
styleSheet.innerText = toastStyles;
document.head.appendChild(styleSheet);

const Signin = () => {
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = e => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const from = location.state?.from?.pathname || "/dashboard";
    setIsSubmitting(true);
    try {
      const res = await axios.post("${import.meta.env.VITE_API_BASE_URL}/auth/signin", formData,{ withCredentials: true });      
      login(res.data);

      toast.success(
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '16px 24px',
        }}>
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: '16px',
            background: 'linear-gradient(45deg, #3b82f6, #60a5fa, #a5b4fc)',
            animation: 'border-pulse 3s ease infinite',
            zIndex: -1,
          }}/>
          {['✨','🌟','🎊'].map((emoji,i) => (
            <div key={i} style={{
              position: 'absolute',
              fontSize: '20px',
              animation: `float ${3+i}s infinite`,
              top: `${Math.random()*80+10}%`,
              left: `${Math.random()*80+10}%`,
              opacity: 0.6,
            }}>{emoji}</div>
          ))}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 1,
          }}>
            <div style={{ animation: 'bounce 1.5s infinite', fontSize: '28px' }}>🎉</div>
            <div style={{
              animation: 'text-glow 2s ease-in-out infinite',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #fff, #e0f2fe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Login Successful!
            </div>
          </div>
          <div style={{
            position: 'absolute',
            top: '-50%', left: '-50%',
            width: '200%', height: '200%',
            background: `linear-gradient(
              45deg,
              transparent 25%,
              rgba(255,255,255,0.1) 50%,
              transparent 75%
            )`,
            animation: 'shine 3s infinite',
            transform: 'rotate(45deg)',
          }}/>
        </div>,
        {
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(96,165,250,0.9))',
            backdropFilter: 'blur(8px)',
            border: '2px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(31,38,135,0.37)',
            borderRadius: '16px',
            color: 'white',
          }
        }
      );
      navigate(from, { replace: true });    
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
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Welcome Back
          </motion.h1>
          <motion.p
            className="text-gray-300 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Sign in to continue your journey
          </motion.p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username/Email */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-300 mb-2">
              Username or Email
            </label>
            <div className="relative">
              <FiUser className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="usernameOrEmail"
                name="usernameOrEmail"
                className="w-full px-4 py-3 pl-11 border border-white/10 rounded-xl bg-white/5 text-gray-200"
                placeholder="username or you@example.com"
                onChange={handleChange}
                required
              />
            </div>
          </motion.div>

          {/* Password with show/hide */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="w-full px-4 py-3 pl-11 pr-11 border border-white/10 rounded-xl bg-white/5 text-gray-200"
                placeholder="Enter Password"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 focus:outline-none"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </motion.div>

          {/* Error */}
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

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isSubmitting ? "Signing in..." : (
              <span className="flex items-center justify-center gap-2">
                <FiLogIn className="w-5 h-5" />
                Sign In
              </span>
            )}
          </motion.button>
        </form>

        {/* Don’t have an account */}
        <motion.div
          className="text-center text-gray-300 mt-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 120 }}
        >
          Don’t have an account?{" "}
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 underline font-medium cursor-pointer"
          >
            <Link to="/signup">Create one</Link>
            <motion.span
              className="ml-1"
              whileHover={{ x: 4 }}
              transition={{ type: 'tween' }}
            >
              <FiArrowRight />
            </motion.span>
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signin;
