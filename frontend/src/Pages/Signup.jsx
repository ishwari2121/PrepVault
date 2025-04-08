import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiLock, FiCheck, FiX, FiAlertCircle } from "react-icons/fi";

export default function Signup() {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({
    username: false,
    password: false,
    confirmPassword: false
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/all-users');
        setAllUsers(response.data);
      } catch (error) {
        toast.error('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const validateUsername = (username) => {
    const regex = /^(?=(?:.*[a-z]){6,})(?=.*\d)[a-z0-9_]{8,}$/;
    if (!username) return 'Username is required';
    if (!regex.test(username)) {
      return 'Username must have 6+ lowercase letters, at least 1 number, and underscores (optional)';
    }
    const exists = allUsers.some(user => user.username === username);
    return exists
      ? 'Username already exists, try a different one'
      : '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!hasUpperCase) return 'Must contain at least one capital letter';
    if (!hasNumber) return 'Must contain at least one number';
    return '';
  };

  const validateForm = () => {
    const newErrors = {
      username: validateUsername(formData.username),
      password: validatePassword(formData.password),
      confirmPassword: formData.password === formData.confirmPassword ? '' : 'Passwords do not match'
    };
    setErrors(newErrors);
    setTouched({
      username: true,
      password: true,
      confirmPassword: true
    });
    return !Object.values(newErrors).some(error => error);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (name === 'username') {
      setErrors(prev => ({ ...prev, username: validateUsername(value) }));
    }
    if (name === 'password') {
      setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    }
    if (name === 'confirmPassword') {
      setErrors(prev => ({ ...prev, confirmPassword: value === formData.password ? '' : 'Passwords do not match' }));
    }
  };

  const handleGoogleSignup = async () => {
    const isValid = validateForm();
    if (!isValid) {
      toast.error('Please fix the errors before continuing');
      return;
    }

    setIsSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const { email } = result.user;

      const emailExists = allUsers.some(user => user.email === email);
      if (emailExists) {
        toast.error('Email is already registered.');
        return;
      }

      await axios.post('http://localhost:5000/api/auth/signup', {
        username: formData.username,
        email,
        password: formData.password
      });

      toast.success('Registration successful!');
      navigate('/signin');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.username &&
    formData.password &&
    formData.confirmPassword &&
    !errors.username &&
    !errors.password &&
    !errors.confirmPassword;

  const passwordRequirements = [
    { text: '6+ chars', met: formData.password.length >= 6 },
    { text: 'A-Z', met: /[A-Z]/.test(formData.password) },
    { text: '0-9', met: /\d/.test(formData.password) },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] relative overflow-hidden">
      <motion.div 
        className="absolute w-80 h-80 bg-cyan-500/20 rounded-full -top-48 -left-48"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute w-96 h-96 bg-purple-500/20 rounded-full -bottom-64 -right-64"
        animate={{ scale: [1, 1.3, 1], rotate: [180, 360] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <motion.div 
        className="w-full max-w-sm p-8 space-y-6 rounded-3xl bg-white/5 backdrop-blur-2xl shadow-2xl border border-white/10 relative overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 opacity-0"
          animate={{ opacity: [0, 0.2, 0], x: [-100, 100] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="text-center space-y-2">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Create Account
          </motion.h1>
          <motion.p 
            className="text-gray-300/80 text-sm"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Join our community in just a few steps
          </motion.p>
        </div>

        <div className="space-y-5">
          {/* Username Field */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <label htmlFor="username" className="block text-gray-200 mb-1">Username</label>
            <div className="relative group">
              <FiUser className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                errors.username ? 'text-red-400' : 'text-gray-400'
              } ${touched.username && !errors.username ? 'text-green-400' : ''}`} />
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pl-11 rounded-xl bg-white/5 text-gray-200 placeholder-gray-400 transition-all 
                  ${
                    errors.username 
                      ? 'border-2 border-red-400/50' 
                      : touched.username && !errors.username 
                      ? 'border-2 border-green-400/50' 
                      : 'border border-white/10'
                  }
                  focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:bg-white/10`}
                placeholder="your_username_123"
              />
            </div>
            <AnimatePresence>
              {errors.username && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 mt-2 text-red-400 text-sm"
                >
                  <FiAlertCircle className="flex-shrink-0" />
                  <span>{errors.username}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Password Field */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
            <label htmlFor="password" className="block text-gray-200 mb-1">Password</label>
            <div className="relative group">
              <FiLock className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                errors.password ? 'text-red-400' : 'text-gray-400'
              } ${touched.password && !errors.password ? 'text-green-400' : ''}`} />
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pl-11 rounded-xl bg-white/5 text-gray-200 placeholder-gray-400 transition-all 
                  ${
                    errors.password 
                      ? 'border-2 border-red-400/50' 
                      : touched.password && !errors.password 
                      ? 'border-2 border-green-400/50' 
                      : 'border border-white/10'
                  }
                  focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:bg-white/10`}
                placeholder="••••••••"
              />
            </div>
            <motion.div className="flex gap-4 mt-3">
              {passwordRequirements.map((req, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <div className={`transition-colors ${req.met ? 'text-green-400' : 'text-gray-500'}`}>
                    {req.met ? <FiCheck /> : <FiX />}
                  </div>
                  <span className={`text-xs ${req.met ? 'text-green-400' : 'text-gray-400'}`}>
                    {req.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Confirm Password Field */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }}>
            <label htmlFor="confirmPassword" className="block text-gray-200 mb-1">Confirm Password</label>
            <div className="relative group">
              <FiLock className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                errors.confirmPassword ? 'text-red-400' : 'text-gray-400'
              } ${touched.confirmPassword && !errors.confirmPassword ? 'text-green-400' : ''}`} />
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 pl-11 rounded-xl bg-white/5 text-gray-200 placeholder-gray-400 transition-all 
                  ${
                    errors.confirmPassword 
                      ? 'border-2 border-red-400/50' 
                      : touched.confirmPassword && !errors.confirmPassword 
                      ? 'border-2 border-green-400/50' 
                      : 'border border-white/10'
                  }
                  focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:bg-white/10`}
                placeholder="••••••••"
              />
            </div>
            <AnimatePresence>
              {errors.confirmPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 mt-2 text-red-400 text-sm"
                >
                  <FiAlertCircle className="flex-shrink-0" />
                  <span>{errors.confirmPassword}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Google Signup Button */}
        <motion.button
          onClick={handleGoogleSignup}
          disabled={!isFormValid || isSubmitting}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group"
          whileHover={isFormValid ? { scale: 1.02 } : {}}
          whileTap={isFormValid ? { scale: 0.98 } : {}}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center gap-2">
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="h-5 w-5 border-2 border-white rounded-full border-t-transparent"
              />
            ) : (
              <>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </div>
        </motion.button>

        <motion.div 
          className="text-center text-gray-300/80 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          Already have an account?{" "}
          <a 
            href="/signin" 
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Sign in here
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
