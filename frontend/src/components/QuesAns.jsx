import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    };

    const questionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                type: 'spring', 
                stiffness: 100,
                damping: 10
            }
        }
    };

    const answerVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { 
                type: 'spring', 
                stiffness: 120,
                mass: 0.5
            }
        },
        hover: {
            y: -5,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
        }
    };

    const buttonVariants = {
        hover: { 
            scale: 1.05,
            filter: 'brightness(1.1)'
        },
        tap: { scale: 0.95 }
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
            className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <AnimatePresence mode='wait'>
                {!allData && (
                    <motion.div
                        className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <motion.div
                            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="max-w-3xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Question Section */}
                <motion.div
                    className="mb-8 p-8 bg-gradient-to-r from-blue-50 to-white rounded-2xl shadow-xl border-l-8 border-blue-500"
                    variants={questionVariants}
                    whileHover={{ 
                        x: 5,
                        transition: { type: 'spring', stiffness: 300 }
                    }}
                >
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 shadow-inner">
                            <span className="text-2xl">❓</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {allData?.question || (
                                <div className="animate-pulse h-8 bg-gray-200 rounded w-3/4"></div>
                            )}
                        </h1>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                            {allData?.answers?.length || 0} Answers
                        </span>
                    </div>
                </motion.div>

                {/* Answers Section */}
                <motion.div 
                    className="space-y-8"
                    variants={containerVariants}
                >
                    <AnimatePresence>
                    {allData?.answers?.length > 0 ? (
                        allData.answers.map((ans, index) => (
                            <motion.div 
                                key={index}
                                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                                variants={answerVariants}
                                whileHover="hover"
                                initial="hidden"
                                animate="visible"
                            >
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="flex items-center mb-6">
                                    <motion.div 
                                        className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4 shadow-lg"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', delay: index * 0.1 }}
                                    >
                                        <span className="text-white text-xl font-bold">
                                            {ans.username[0].toUpperCase()}
                                        </span>
                                    </motion.div>
                                    <div>
                                      {console.log(ans._id)}
                                        <h3 className="font-bold text-gray-800">{ans.username}</h3>
                                        <p className="text-sm text-gray-500">Community Member</p>
                                    </div>
                                </div>

                                <motion.p 
                                    className="text-gray-800 mb-6 text-lg leading-relaxed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {ans.answer}
                                </motion.p>

                                {ans.code && (
                                    <motion.pre 
                                        className="p-6 bg-gray-800 text-gray-100 rounded-xl mb-6 overflow-x-auto font-mono text-sm relative"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <div className="absolute top-2 right-2 flex space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <code>{ans.code}</code>
                                    </motion.pre>
                                )}

                                <div className="flex items-center space-x-4">
                                    <motion.button
                                        className="flex items-center px-5 py-2.5 bg-green-100 text-green-600 rounded-full shadow-md hover:shadow-lg transition-shadow"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        onClick={(e)=>handleUpvote(ans?._id)}
                                    >
                                        <span className="mr-2 text-lg">👍</span>
                                        <span className="font-medium">{ans.upvotes}</span>
                                    </motion.button>
                                    
                                    <motion.button
                                        className="flex items-center px-5 py-2.5 bg-red-100 text-red-600 rounded-full shadow-md hover:shadow-lg transition-shadow"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        onClick={(e)=>handleDownvote(ans?._id)}
                                    >
                                        <span className="mr-2 text-lg">👎</span>
                                        <span className="font-medium">{ans.downvotes}</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div 
                            className="p-8 bg-white rounded-2xl shadow-xl text-center"
                            variants={answerVariants}
                        >
                            <div className="text-8xl mb-6 animate-bounce">😕</div>
                            <p className="text-gray-600 text-xl font-medium mb-4">No answers yet</p>
                            <p className="text-gray-500">Be the first to share your knowledge!</p>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default QuesAns;