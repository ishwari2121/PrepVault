import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCode, 
  FaRegThumbsUp, 
  FaRegThumbsDown, 
  FaUserAstronaut, 
  FaPlus, 
  FaPaperPlane, 
  FaTimes,
  FaTrash,
  FaSort,
  FaFire,
  FaClock,
  FaCalendarAlt
} from 'react-icons/fa';
import LikeDislikeButtons from './LikeDislikeButtons'; 

const QuesAns = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [allData, setAllData] = useState(null);
    const [showAnswerForm, setShowAnswerForm] = useState(false);
    const [formData, setFormData] = useState({ answer: '', code: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [answerToDelete, setAnswerToDelete] = useState(null);
    const [sortType, setSortType] = useState('newest');

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

        const user = JSON.parse(localStorage.getItem("user"));
        setCurrentUser(user?.username);
    },[id]);

    const sortedAnswers = () => {
        if (!allData?.answers) return [];
        
        return [...allData.answers].sort((a, b) => {
            switch(sortType) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'rating':
                    return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
                default:
                    return 0;
            }
        });
    };

    const handleSubmitAnswer = async (e) => {
        e.preventDefault();
        setFormError('');
        
        if (!formData.answer.trim()) {
            setFormError('Answer is required');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = JSON.parse(localStorage.getItem("user"))?.token;
            if (!token) {
                alert("Please login to submit an answer");
                navigate('/signin');
                return;
            }

            await axios.post(`http://localhost:5000/api/commonQuestions/answers/${id}`, {
                username: JSON.parse(localStorage.getItem("user")).username,
                answer: formData.answer,
                code: formData.code
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh data after successful submission
            const response = await axios.get(`http://localhost:5000/api/commonQuestions/${id}`);
            setAllData(response.data);
            setFormData({ answer: '', code: '' });
            setShowAnswerForm(false);
        } catch (error) {
            console.error("Error submitting answer:", error);
            setFormError('Error submitting answer. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (answerId) => {
        setAnswerToDelete(answerId);
        setShowDeleteConfirm(true);
    };

    const handleDeleteAnswer = async () => {
        if (!answerToDelete) return;
        
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user.token;
            if (!token) {
                alert("Please login to delete this answer");
                navigate('/signin');
                return;
            }
            //sabke sab is answerID ke votes delete ho jayenge
            const vote = await axios.get(`http://localhost:5000/api/vote/${user.username}/${id}/${answerToDelete}/votehistory`);
            console.log(vote);
            if(!vote.data)await axios.delete(`http://localhost:5000/api/vote/${id}/${answerToDelete}/delete_all_votes`);

            await axios.delete(
                `http://localhost:5000/api/commonQuestions/${id}/answers/${answerToDelete}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Refresh the question data
            const response = await axios.get(`http://localhost:5000/api/commonQuestions/${id}`);
            setAllData(response.data);
            
        } catch (error) {
            console.error("Error deleting answer:", error);
            alert("Failed to delete answer. Please try again.");
        } finally {
            setShowDeleteConfirm(false);
            setAnswerToDelete(null);
        }
    };

    const handleAddAnswerBtn = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("Please login to submit an answer");
            navigate(`/signin/addAns/${id}`);
            return;
        }
        setShowAnswerForm(!showAnswerForm);
    };

    async function handleDownvote(answerId) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("First login to vote");
            navigate(`/signin/addAns/${id}`);
            return;
        }
        const token = user.token;
        const action = { action: "downvote" };

        try {

            const vote = await axios.get(`http://localhost:5000/api/vote/${user.username}/${id}/${answerId}/votehistory`);

            if(vote.data.success == false)
            {
                //downvote ++ ho gaya
                await axios.post(
                    `http://localhost:5000/api/commonQuestions/${id}/answers/${answerId}/vote`,
                    {action : "downvote"},
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // data base mai user ki entry ho gayi
                await axios.post(`http://localhost:5000/api/vote/${id}/answers/${answerId}/votehistory`,
                    {
                        username : user.username,
                        action : "downvote"
                    }
                )
            }

            if(vote.data.action === "downvote")
            {
                // downvote decrease ho gaya
                await axios.post(
                    `http://localhost:5000/api/commonQuestions/${id}/answers/${answerId}/reduce_vote`,
                    action,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                //database mai se entry remove ho gayi
                await axios.delete(`http://localhost:5000/api/vote/${user.username}/${id}/${answerId}/delete`);
            }

            if(vote.data.action === "upvote")
            {
                // downvote decrease ho gaya
                await axios.post(
                    `http://localhost:5000/api/commonQuestions/${id}/answers/${answerId}/reduce_vote`,
                    {action : "upvote"},
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                //downvote ++ ho gaya
                await axios.post(
                    `http://localhost:5000/api/commonQuestions/${id}/answers/${answerId}/vote`,
                    action,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                //user action ko upvote upvote se downvote mai update karenge
                await axios.put(`http://localhost:5000/api/vote/${user.username}/${id}/${answerId}/update`,
                    {action : "downvote"}
                );

            }

            // Refresh data after vote
            const response = await axios.get(`http://localhost:5000/api/commonQuestions/${id}`);
            setAllData(response.data);
        } catch (e) {
            console.error("Error downvoting:", e);
        }
    }
  
    async function handleUpvote(answerId) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("First login to vote");
            navigate(`/signin/addAns/${id}`);
            return;
        }
        const token = user.token;
        const action = { action: "upvote" };

        try {
           
            const vote = await axios.get(`http://localhost:5000/api/vote/${user.username}/${id}/${answerId}/votehistory`);
    
            if(vote.data.success === false)
            {
                // upvote ka count increase ho gaya
                await axios.post(
                    `http://localhost:5000/api/commonQuestions/${id}/answers/${answerId}/vote`,
                    action,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                // data base mai user ki entry ho gayi
                await axios.post(`http://localhost:5000/api/vote/${id}/answers/${answerId}/votehistory`,
                    {
                        username : user.username,
                        action : "upvote"
                    }
                )
            }

            if(vote.data.action === "upvote")
            {
                // upvote decrease ho gaya
                await axios.post(
                    `http://localhost:5000/api/commonQuestions/${id}/answers/${answerId}/reduce_vote`,
                    action,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                //database mai se entry delete ho gayi
                await axios.delete(`http://localhost:5000/api/vote/${user.username}/${id}/${answerId}/delete`);

            }

            if(vote.data.action === "downvote")
            {
                // downvote ka count decrease ho gaya
                await axios.post(
                    `http://localhost:5000/api/commonQuestions/${id}/answers/${answerId}/reduce_vote`,
                    {action : "downvote"},
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // upvote ka count increase ho gaya
                await axios.post(
                    `http://localhost:5000/api/commonQuestions/${id}/answers/${answerId}/vote`,
                    action,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                //user action ko upvote downvote se upvote mai update karenge
                await axios.put(`http://localhost:5000/api/vote/${user.username}/${id}/${answerId}/update`,
                    {action : "upvote"}
                );

            }

            // Refresh data after vote
            const response = await axios.get(`http://localhost:5000/api/commonQuestions/${id}`);
            setAllData(response.data);

        } catch (e) {
            console.error("Error upvoting:", e);
        }
    }

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

    const formVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 120,
                damping: 15
            }
        },
        exit: { opacity: 0, y: 50, scale: 0.95 }
    };

    const floatingButtonVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: { type: 'spring', stiffness: 150 }
        },
        hover: { 
            scale: 1.1,
            rotate: 90,
            boxShadow: '0 10px 20px rgba(8, 145, 178, 0.3)'
        }
    };

    const confirmDialogVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { type: 'spring', stiffness: 100 }
        },
        exit: { opacity: 0, scale: 0.8 }
    };

    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 },
        confirm: { 
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            transition: { duration: 0.2 }
        },
        cancel: { 
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div className="min-h-screen p-8 bg-gradient-to-br from-[#0f172a] to-[#1e3a5f]">
            {/* Delete Confirmation Dialog */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div 
                        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl p-8 max-w-md w-full border border-cyan-400/20 shadow-2xl relative"
                            variants={confirmDialogVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-stripes.png')] opacity-10 rounded-2xl" />
                            <div className="relative z-10">
                                <motion.div 
                                    className="text-center mb-6"
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="text-6xl mb-4 text-red-500 flex justify-center">
                                        <motion.div
                                            animate={{ 
                                                rotate: [0, 10, -10, 0],
                                                scale: [1, 1.1, 1.1, 1]
                                            }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            ❗
                                        </motion.div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-cyan-100 mb-2">Delete Answer</h2>
                                    <p className="text-cyan-400/80">Are you sure you want to delete this answer? This action cannot be undone.</p>
                                </motion.div>

                                <div className="flex justify-center gap-4 mt-8">
                                    <motion.button
                                        className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 text-white"
                                        variants={buttonVariants}
                                        whileHover={{ scale: 1.05, backgroundColor: '#DC2626' }} // Explicitly define hover state
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleDeleteAnswer}
                                        initial={{ scale: 0.9 }}
                                        animate={{ 
                                            scale: 1,
                                            backgroundColor: '#EF4444',
                                            transition: { 
                                                backgroundColor: { duration: 0.3 },
                                                scale: { type: 'spring', stiffness: 300 }
                                            }
                                        }}
                                        style={{ backgroundColor: '#EF4444' }}
                                    >
                                        <motion.span
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        >
                                            Delete
                                        </motion.span>
                                    </motion.button>
                                    <motion.button
                                        className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 text-cyan-100"
                                        variants={buttonVariants}
                                        whileHover={{ scale: 1.05, backgroundColor: '#3B82F6', color: '#FFFFFF' }} // Explicitly define hover state
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowDeleteConfirm(false)}
                                        initial={{ scale: 0.9 }}
                                        animate={{ 
                                            scale: 1,
                                            backgroundColor: 'rgba(55,65,81,0.8)',
                                            transition: { 
                                                backgroundColor: { duration: 0.3 },
                                                scale: { type: 'spring', stiffness: 300 }
                                            }
                                        }}
                                        style={{ backgroundColor: 'rgba(55,65,81,0.8)' }}
                                    >
                                        Cancel
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Add Answer Button */}
            <motion.button
                className="fixed bottom-8 right-8 z-50 p-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-2xl flex items-center gap-2 group"
                variants={floatingButtonVariants}
                initial="hidden"
                animate="visible"
                whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.3, ease: "easeInOut" } // Smooth ease-in-out animation
                }}
                onClick={handleAddAnswerBtn}
            >
                <FaPlus className="text-xl text-white" /> {/* Removed rotating animation */}
                <span className="text-white font-semibold pr-2 cursor-pointer">Add Answer</span>
            </motion.button>

            {/* Answer Submission Form */}
            <AnimatePresence>
                {showAnswerForm && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.form
                            className="w-full max-w-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl p-8 relative border border-cyan-400/20 shadow-xl mt-16"
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onSubmit={handleSubmitAnswer}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-2xl" />
                            <div className="relative z-10">
                                <button
                                    type="button"
                                    onClick={() => setShowAnswerForm(false)}
                                    className="absolute top-4 right-4 p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                    <FaTimes className="text-xl" />
                                </button>

                                <h2 className="text-2xl font-bold text-cyan-100 mb-6">Share Your Knowledge</h2>
                                
                                {formError && (
                                    <motion.div
                                        className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        {formError}
                                    </motion.div>
                                )}

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-cyan-300 mb-2">Your Answer *</label>
                                        <textarea
                                            className="w-full bg-gray-900/50 rounded-xl p-4 text-cyan-100 border border-cyan-400/20 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                                            rows="4"
                                            value={formData.answer}
                                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                            placeholder="Write your detailed answer here..."
                                            required
                                        />
                                    </div>

                                    {allData?.type === 'coding' && (
                                        <div>
                                            <label className="block text-cyan-300 mb-2">Code Snippet (Optional)</label>
                                            <textarea
                                                className="w-full bg-gray-900/50 rounded-xl p-4 text-cyan-100 font-mono text-sm border border-cyan-400/20 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                                                rows="4"
                                                value={formData.code}
                                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                                placeholder="Paste your code here..."
                                            />
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <motion.button
                                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:shadow-cyan-500/20 hover:shadow-xl transition-all disabled:opacity-50"
                                            type="submit"
                                            disabled={isSubmitting}
                                            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                                            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                        >
                                            {isSubmitting ? (
                                                <motion.div
                                                    className="w-5 h-5 border-2 border-white/50 border-t-cyan-400 rounded-full animate-spin"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                />
                                            ) : (
                                                <>
                                                    <FaPaperPlane className="text-lg" />
                                                    Post Answer
                                                </>
                                            )}
                                        </motion.button>

                                        <motion.button
                                            type="button"
                                            onClick={() => setShowAnswerForm(false)}
                                            className="w-1/3 py-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:shadow-red-500/20 hover:shadow-xl transition-all"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>

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

                {/* Sorting Controls */}
                <motion.div 
                    className="mb-8 flex items-center gap-4 p-4 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl border border-cyan-400/20 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center gap-2 text-cyan-400">
                        <FaSort className="text-lg" />
                        <span className="font-medium">Sort by:</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <motion.button
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${sortType === 'newest' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30' : 'bg-gray-800/50 text-gray-400'}`}
                            onClick={() => setSortType('newest')}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <FaCalendarAlt />
                            Newest
                        </motion.button>
                        <motion.button
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${sortType === 'oldest' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30' : 'bg-gray-800/50 text-gray-400'}`}
                            onClick={() => setSortType('oldest')}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <FaClock />
                            Oldest
                        </motion.button>
                        <motion.button
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${sortType === 'rating' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30' : 'bg-gray-800/50 text-gray-400'}`}
                            onClick={() => setSortType('rating')}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <FaFire />
                            Top Rated
                        </motion.button>
                    </div>
                </motion.div>

                {/* Answers Section with Staggered Animations */}
                <motion.div 
                    className="space-y-8"
                    variants={containerVariants}
                >
                    <AnimatePresence mode="wait">
                    {sortedAnswers().length > 0 ? (
                        sortedAnswers().map((ans, index) => (
                            <motion.div 
                                key={index}
                                className="group relative"
                                variants={answerVariants}
                                whileHover="hover"
                                exit={{ opacity: 0, x: 50 }}
                            >
                                {/* Delete Button (only shown for current user's answers) */}
                                {currentUser === ans.username && (
                                    <motion.button
                                        className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition-colors z-10 cursor-pointer"
                                        onClick={() => handleDeleteClick(ans._id)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        title="Delete this answer"
                                    >
                                        <FaTrash className="text-lg" />
                                    </motion.button>
                                )}

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
                                        <div className="flex items-center gap-4">
                                            <LikeDislikeButtons 
                                                initialLikes={ans.upvotes}
                                                initialDislikes={ans.downvotes}
                                                onLike={() => handleUpvote(ans._id)}
                                                onDislike={() => handleDownvote(ans._id)}
                                            />
                                        </div>
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