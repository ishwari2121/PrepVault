import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaBuilding, FaSearch, FaQuestionCircle, FaRocket, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [totalMembersRegistered, setTotalMembersRegistered] = useState([]);
  const [totalSharedInterview, setTotalSharedInterview] = useState([]);
  const [totalCompaniesCoved, setTotalCompaniesCoved] = useState([]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/interviewExp/all-experiences");
        setTotalSharedInterview(response.data);
      } catch (error) {
        console.error("Error fetching interview experiences:", error);
      }
    };

    fetchExperiences();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/all-users");
        setTotalMembersRegistered(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/companies");
        setTotalCompaniesCoved(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] text-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center text-center py-28 px-4"
      >
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            PrepVault
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-gray-300 max-w-2xl mb-12"
        >
          Master your interviews with insider knowledge from top companies. Get detailed breakdowns of interview processes, questions, and success strategies.
        </motion.p>
        
        {/* Buttons Side by Side */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6 mt-6"
        >
          {/* Share Journey Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition"></div>
            <button 
              onClick={() => navigate("/interviewexp")} 
              className="relative bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-4 rounded-lg text-xl font-bold shadow-2xl hover:shadow-cyan-500/40 transition-all"
            >
              Share Your Journey
            </button> 
          </motion.div>

          {/* Developers Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition"></div>
            <button 
              onClick={() => navigate("/developer")} 
              className="relative bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-3 rounded-lg text-lg font-bold shadow-2xl hover:shadow-purple-500/40 transition-all flex items-center gap-2"
            >
              <FaCode className="h-5 w-5" />
              Meet Our Developers
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
        >
          Unlock Your Potential
        </motion.h2>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <motion.div 
            onClick={() => navigate("/companies")}
            variants={itemVariants}
            className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="h-16 w-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 mx-auto"
            >
              <FaBuilding className="h-8 w-8 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-center mb-4">Company Profiles</h3>
            <p className="text-gray-300 text-center leading-relaxed">
              Detailed insights into company cultures, interview structures, and hiring processes of leading tech organizations.
            </p>
          </motion.div>

          <motion.div 
            onClick={() => navigate("/interviewexp")}
            variants={itemVariants}
            className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 mx-auto"
            >
              <FaSearch className="h-8 w-8 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-center mb-4">Share Interview Experience</h3>
            <p className="text-gray-300 text-center leading-relaxed">
              Post your interview questions, challenges, and tips to help others prepare! 🚀
            </p>
          </motion.div>

          <motion.div
            onClick={() => navigate("/commonQuestion")}
            variants={itemVariants}
            className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 mx-auto"
            >
              <FaQuestionCircle className="h-8 w-8 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-center mb-4">Question Bank</h3>
            <p className="text-gray-300 text-center leading-relaxed">
              Curated collection of actual interview questions categorized by role and difficulty level.
            </p>
          </motion.div>
        </motion.div>

        {/* Community Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-24 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-8 rounded-2xl border border-cyan-500/30 backdrop-blur-lg"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex-shrink-0"
            >
              <FaUsers className="h-24 w-24 text-cyan-400" />
            </motion.div>
            <div>
              <h3 className="text-3xl font-bold mb-4">Join Our Community</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Connect with thousands of aspirants, share experiences, and get real-time updates on interview processes.
                Collaborate, learn, and grow together in our vibrant community.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-24"
        >
          {[
            { value: totalMembersRegistered.length, label: 'Aspiring Members', icon: FaUsers },
            { value: totalSharedInterview.length, label: 'Interview Tips Shared', icon: FaRocket },
            { value: totalCompaniesCoved.length, label: 'Companies Covered', icon: FaBuilding },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-lg"
            >
              <stat.icon className="h-12 w-12 text-cyan-400 mb-4" />
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-300 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;
