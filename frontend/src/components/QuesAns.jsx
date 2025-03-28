import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaRegThumbsUp, FaRegThumbsDown, FaUserAstronaut } from 'react-icons/fa';

const QuesAns = () => {
    const { id } = useParams();
    const [allData, setAllData] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/commonQuestions/${id}`);
                setAllData(response.data || {});
            } catch (error) {
                console.error("Error fetching interview questions:", error);
            }
        };
        fetchQuestions();
    });

    // Enhanced animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const questionVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 120,
                damping: 10
            }
        }
    };

    const answerVariants = {
        hidden: { opacity: 0, x: 50, rotateX: -15 },
        visible: {
            opacity: 1,
            x: 0,
            rotateX: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                mass: 0.5,
                delay: 0.2
            }
        },
        hover: {
            y: -8,
            scale: 1.02,
            background: 'linear-gradient(145deg, #1e293b, #0f172a)',
            transition: { duration: 0.3 }
        }
    };

    async function handleDownvote(answerId) {
        const action = { action: "downvote" };
        try {
            const token = JSON.parse(localStorage.getItem("user"))?.token;
            if (!token) {
                alert("User is not authenticated.");
                return;
            }
            await axios.post(
                `http://localhost:5000/api/commonQuestions/${id}/answers/${answerId}/vote`,
                action,
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (e) {
            console.error("Error downvoting:", e);
        }
    }
  
    async function handleUpvote(answerId) {
      const action = { action: "upvote" };
      try {
          const token = JSON.parse(localStorage.getItem("user"))?.token;
          if (!token) {
              alert("User is not authenticated.");
              return;
          }
          await axios.post(
              `http://localhost:5000/api/commonQuestions/${id}/answers/${answerId}/vote`,
              action,
              { headers: { Authorization: `Bearer ${token}` } }
          );
      } catch (e) {
          console.error("Error upvoting:", e);
      }
  }

    return (
        <motion.div 
            className="min-h-screen p-8 bg-gradient-to-br from-[#0f172a] to-[#1e3a5f]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Enhanced Animated background */}
            <motion.div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-[3%]"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, 100, 0],
                            x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{
                            duration: Math.random() * 8 + 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </motion.div>

            <motion.div
                className="max-w-4xl mx-auto relative"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Glowing Question Section */}
                <motion.div
                    className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] shadow-2xl border border-cyan-400/20 relative overflow-hidden"
                    variants={questionVariants}
                    whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 20px 40px -10px rgba(8, 145, 178, 0.3)"
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10" />
                    <div className="absolute inset-0 animate-pulse-slow bg-[url('https://www.transparenttextures.com/patterns/dark-stripes.png')] opacity-10" />
                    
                    <div className="relative flex items-center gap-6">
                        <motion.div 
                            className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg relative group"
                            whileHover={{ rotate: 15 }}
                        >
                            <FaCode className="text-2xl text-white" />
                            <div className="absolute inset-0 rounded-xl border-2 border-cyan-400/30 animate-pulse group-hover:animate-none" />
                        </motion.div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                {allData?.question || (
                                    <div className="h-8 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-3/4 animate-shimmer" />
                                )}
                            </h1>
                            <motion.div 
                                className="mt-4 px-4 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-sm w-fit flex items-center gap-2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                            >
                                <FaUserAstronaut className="text-cyan-400" />
                                {allData?.answers?.length || 0} Community Answers
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Answers Section with Staggered Animations */}
                <motion.div 
                    className="space-y-8"
                    variants={containerVariants}
                >
                    <AnimatePresence mode="wait">
                    {allData?.answers?.length > 0 ? (
                        allData.answers.map((ans, index) => (
                            <motion.div 
                                key={index}
                                className="group relative"
                                variants={answerVariants}
                                whileHover="hover"
                                exit={{ opacity: 0, x: 50 }}
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-cyan-400/20 shadow-xl">
                                    {/* Profile Header */}
                                    <motion.div 
                                        className="flex items-center gap-6 mb-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <motion.div 
                                            className="relative w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg cursor-pointer"
                                            whileHover={{ scale: 1.1, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span className="text-xl font-bold text-white">
                                                {ans.username[0].toUpperCase()}
                                            </span>
                                            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping" />
                                            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20" />
                                        </motion.div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-cyan-100">{ans.username}</h3>
                                            <p className="text-sm text-cyan-400/70">Community Contributor</p>
                                        </div>
                                    </motion.div>

                                    {/* Answer Content */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <motion.p 
                                            className="text-cyan-100 text-lg leading-relaxed mb-6 font-light tracking-wide"
                                            whileHover={{ x: 5 }}
                                        >
                                            {ans.answer}
                                        </motion.p>

                                        {ans.code && (
                                            <motion.pre 
                                                className="p-6 bg-gray-900/50 rounded-xl mb-6 overflow-x-auto font-mono text-sm text-cyan-100 relative border border-cyan-400/20 group/code"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                whileHover={{ borderColor: '#22d3ee55' }}
                                            >
                                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600" />
                                                </div>
                                                <code>{ans.code}</code>
                                            </motion.pre>
                                        )}
                                    </motion.div>

                                    {/* Voting Buttons */}
                                    <motion.div 
                                        className="flex items-center gap-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <motion.button
                                            className="flex items-center gap-2 px-6 py-3 bg-cyan-500/10 text-cyan-400 rounded-full hover:bg-cyan-500/20 transition-all border border-cyan-400/20"
                                            whileHover={{ 
                                                scale: 1.05,
                                                boxShadow: '0 5px 15px -3px rgba(34, 211, 238, 0.1)'
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleUpvote(ans?._id)}
                                        >
                                            <FaRegThumbsUp className="text-lg transition-transform hover:scale-125" />
                                            <span className="font-medium">{ans.upvotes}</span>
                                        </motion.button>
                                        
                                        <motion.button
                                            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 transition-all border border-red-400/20"
                                            whileHover={{ 
                                                scale: 1.05,
                                                boxShadow: '0 5px 15px -3px rgba(239, 68, 68, 0.1)'
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDownvote(ans?._id)}
                                        >
                                            <FaRegThumbsDown className="text-lg transition-transform hover:scale-125" />
                                            <span className="font-medium">{ans.downvotes}</span>
                                        </motion.button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div 
                            className="p-8 rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-cyan-400/20 text-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ 
                                scale: 1,
                                opacity: 1,
                                transition: { type: 'spring', bounce: 0.4 }
                            }}
                        >
                            <motion.div 
                                className="text-7xl mb-6"
                                animate={{ y: [0, -20, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                            >
                                🌌
                            </motion.div>
                            <h3 className="text-xl font-semibold text-cyan-100 mb-2">
                                The Knowledge Void
                            </h3>
                            <p className="text-cyan-400/70">
                                Be the first to illuminate this space with your wisdom!
                            </p>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default QuesAns;