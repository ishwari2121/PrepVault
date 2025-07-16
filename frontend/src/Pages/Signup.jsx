import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiLock,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiArrowRight
} from "react-icons/fi";

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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('${import.meta.env.VITE_API_BASE_URL}/auth/all-users');
        setAllUsers(response.data);
      } catch {
        toast.error('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const validateUsername = (username) => {
    const regex = /^(?=(?:.*[a-z]){4,})[a-z0-9_]{6,}$/;

    if (!username) return 'Username is required';
    if (!regex.test(username)) return ' ';
    return allUsers.some(u => u.username === username)
      ? 'Username already exists, try a different one'
      : '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(password)) return 'Must contain at least one capital letter';
    if (!/\d/.test(password)) return 'Must contain at least one number';
    return '';
  };

  const validateForm = () => {
    const newErrors = {
      username: validateUsername(formData.username),
      password: validatePassword(formData.password),
      confirmPassword:
        formData.password === formData.confirmPassword
          ? ''
          : 'Passwords do not match'
    };
    setErrors(newErrors);
    setTouched({ username: true, password: true, confirmPassword: true });
    return !Object.values(newErrors).some(e => e);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    setTouched(t => ({ ...t, [name]: true }));
    if (name === 'username') setErrors(e => ({ ...e, username: validateUsername(value) }));
    if (name === 'password') setErrors(e => ({ ...e, password: validatePassword(value) }));
    if (name === 'confirmPassword') {
      setErrors(e => ({
        ...e,
        confirmPassword:
          value === formData.password ? '' : 'Passwords do not match'
      }));
    }
  };

  const handleGoogleSignup = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before continuing');
      return;
    }
    setIsSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (allUsers.some(u => u.email === email)) {
        toast.error('Email is already registered.');
        return;
      }

      await axios.post('${import.meta.env.VITE_API_BASE_URL}/auth/signup', {
        username: formData.username,
        email,
        password: formData.password
      });

      toast.success('Registration successful!');
      navigate('/signin');
    } catch {
      toast.error('Registration failed. Please try again.');
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

  const usernameRequirements = [
    { text: '6+ chars (in total)', met: formData.username.length >= 6 },
    { text: '4+ lowercase letters', met: (formData.username.match(/[a-z]/g) || []).length >= 4 },
    // { text: 'At least 1 number', met: /\d/.test(formData.username) },
    { text: 'Only a-z, 0-9, _', met: /^[a-z0-9_]*$/.test(formData.username) }
  ];

  const passwordRequirements = [
    { text: '6+ chars', met: formData.password.length >= 6 },
    { text: 'A-Z (at least 1)', met: /[A-Z]/.test(formData.password) },
    { text: '0-9 (at least 1)', met: /\d/.test(formData.password) }
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] relative overflow-hidden">
      {/* Background blobs */}
      <motion.div
        className="absolute w-80 h-80 bg-cyan-500/20 rounded-full -top-48 -left-48"
        animate={{ scale: [1,1.2,1], rotate: [0,180] }}
        transition={{ duration:12, repeat:Infinity, ease:"linear" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-purple-500/20 rounded-full -bottom-64 -right-64"
        animate={{ scale: [1,1.3,1], rotate: [180,360] }}
        transition={{ duration:15, repeat:Infinity, ease:"linear" }}
      />

      <motion.div
        className="w-full max-w-sm p-8 space-y-6 rounded-3xl bg-white/5 backdrop-blur-2xl shadow-2xl border border-white/10 relative overflow-hidden"
        initial={{ scale:0.9, opacity:0, y:20 }}
        animate={{ scale:1, opacity:1, y:0 }}
        transition={{ type:'spring', stiffness:100, damping:15 }}
        whileHover={{ scale:1.02 }}
      >
        {/* Header */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:0.2 }}
        >
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            initial={{ y:-20 }}
            animate={{ y:0 }}
          >
            Create Account
          </motion.h1>
          <motion.p
            className="text-gray-300/80 text-sm"
            initial={{ y:-10 }}
            animate={{ y:0 }}
            transition={{ delay:0.1 }}
          >
            Join our community in just a few steps
          </motion.p>
        </motion.div>

        {/* Username Field */}
        <motion.div
          initial={{ opacity:0, x:-20 }}
          animate={{ opacity:1, x:0 }}
          transition={{ delay:0.4 }}
        >
          <label htmlFor="username" className="block text-gray-200 mb-1">Username</label>
          <div className="relative">
            <FiUser
              className={`
                w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 transition-colors
                ${errors.username
                  ? 'text-red-400'
                  : touched.username && !errors.username
                  ? 'text-green-400'
                  : 'text-gray-400'
                }
              `}
            />
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="your_username_123"
              className={`
                w-full px-4 py-3 pl-11 rounded-xl bg-white text-gray-900 placeholder-gray-500 transition-all
                ${errors.username
                  ? 'border-2 border-red-500'
                  : touched.username && !errors.username
                  ? 'border-2 border-green-500'
                  : 'border border-gray-300'
                }
                focus:border-green-500 focus:ring-2 focus:ring-green-100
              `}
              autoComplete="off"
            />
          </div>
          <AnimatePresence>
            {errors.username && (
              <motion.div
                initial={{ opacity:0, height:0 }}
                animate={{ opacity:1, height:'auto' }}
                exit={{ opacity:0, height:0 }}
                className="flex items-center gap-2 mt-2 text-red-500 text-sm"
              >
                <FiAlertCircle className="flex-shrink-0" />
                <span>{errors.username}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex flex-wrap gap-4 mt-3">
            {usernameRequirements.map((req, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-1"
                initial={{ scale:0 }}
                animate={{ scale:1 }}
                transition={{ delay:0.4 + i*0.1 }}
              >
                {req.met ? (
                  <FiCheck className="text-green-400" />
                ) : (
                  <FiX className="text-gray-500" />
                )}
                <span className={`text-xs ${req.met ? 'text-green-400' : 'text-gray-400'}`}>
                  {req.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ opacity:0, x:-20 }}
          animate={{ opacity:1, x:0 }}
          transition={{ delay:0.6 }}
        >
          <label htmlFor="password" className="block text-gray-200 mb-1">Password</label>
          <div className="relative">
            <FiLock
              className={`
                w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 transition-colors
                ${errors.password
                  ? 'text-red-400'
                  : touched.password && !errors.password
                  ? 'text-green-400'
                  : 'text-gray-400'
                }
              `}
            />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create Your Password"
              className={`
                w-full px-4 py-3 pl-11 rounded-xl bg-white/5 text-gray-200 placeholder-gray-400 transition-all
                ${errors.password
                  ? 'border-2 border-red-400/50'
                  : touched.password && !errors.password
                  ? 'border-2 border-green-400/50'
                  : 'border border-white/10'
                }
                focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:bg-white/10
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-300 hover:text-cyan-500 transition-colors"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <div className="flex gap-4 mt-3">
            {passwordRequirements.map((req, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-1"
                initial={{ scale:0 }}
                animate={{ scale:1 }}
                transition={{ delay:0.6 + i*0.1 }}
              >
                {req.met ? (
                  <FiCheck className="text-green-400" />
                ) : (
                  <FiX className="text-gray-500" />
                )}
                <span className={`text-xs ${req.met ? 'text-green-400' : 'text-gray-400'}`}>
                  {req.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Confirm Password Field */}
        <motion.div
          initial={{ opacity:0, x:-20 }}
          animate={{ opacity:1, x:0 }}
          transition={{ delay:0.8 }}
        >
          <label htmlFor="confirmPassword" className="block text-gray-200 mb-1">Confirm Password</label>
          <div className="relative">
            <FiLock
              className={`
                w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 transition-colors
                ${errors.confirmPassword
                  ? 'text-red-400'
                  : touched.confirmPassword && !errors.confirmPassword
                  ? 'text-green-400'
                  : 'text-gray-400'
                }
              `}
            />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Re-Enter Your Password"
              className={`
                w-full px-4 py-3 pl-11 rounded-xl bg-white/5 text-gray-200 placeholder-gray-400 transition-all
                ${errors.confirmPassword
                  ? 'border-2 border-red-400/50'
                  : touched.confirmPassword && !errors.confirmPassword
                  ? 'border-2 border-green-400/50'
                  : 'border border-white/10'
                }
                focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:bg-white/10
              `}
            />
          </div>
          <AnimatePresence>
            {errors.confirmPassword && (
              <motion.div
                initial={{ opacity:0, height:0 }}
                animate={{ opacity:1, height:'auto' }}
                exit={{ opacity:0, height:0 }}
                className="flex items-center gap-2 mt-2 text-red-400 text-sm"
              >
                <FiAlertCircle className="flex-shrink-0" />
                <span>{errors.confirmPassword}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Google Signup Button */}
        <motion.button
          onClick={handleGoogleSignup}
          disabled={!isFormValid || isSubmitting}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group"
          whileHover={isFormValid ? { scale:1.02 } : {}}
          whileTap={isFormValid ? { scale:0.98 } : {}}
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:1.0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center gap-2">
            {isSubmitting ? (
              <motion.div
                animate={{ rotate:360 }}
                transition={{ duration:1, repeat:Infinity }}
                className="h-5 w-5 border-2 border-white rounded-full border-t-transparent"
              />
            ) : (
              <>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                </svg>
                <span>SignUp with Google</span>
              </>
            )}
          </div>
        </motion.button>

        {/* Animated “Already have an account?” */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 120 }}
          className="text-center text-gray-300/80 text-sm mt-4"
        >
          Already have an account?{" "}
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 underline font-medium cursor-pointer"
          >
            <Link to="/signin">Sign in here</Link>
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
}

