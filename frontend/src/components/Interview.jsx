import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import { FaCalendar, FaSchool, FaBuilding, FaPlus, FaTimes, FaInfoCircle, FaLightbulb, FaStar } from "react-icons/fa";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { toast } from 'react-hot-toast'
const InterviewExperienceForm = () => {
    const { user } = useContext(AuthContext);
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({
        year: new Date().getFullYear(),
        branch: "IT",
        company: "",
        type: "Placement",
        rounds: [{ roundNumber: 1, experience: "" }],
        additionalTips: ""
    });

    

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const years = Array.from({ length: 2028 - 2010 + 1 }, (_, i) => 2010 + i);
    const branches = ["AIDS", "CE", "ECE", "EnTC", "IT"];
    const types = ["Placement", "Internship"];
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleRoundChange = (index, value) => {
        setFormData(prevData => {
            const updatedRounds = [...prevData.rounds];
            updatedRounds[index].experience = value;
            return { ...prevData, rounds: updatedRounds };
        });
    };
    
    const addRound = () => {
        setFormData(prev => {
            const newTotal = prev.rounds.length + 1;
            if (newTotal > 10) return prev;
            return {
                ...prev,
                rounds: Array.from({ length: newTotal }, (_, i) => ({
                    roundNumber: i + 1,
                    experience: prev.rounds[i]?.experience || ""
                }))
            };
        });
    };
    
    const removeRound = () => {
        setFormData(prev => {
            const newTotal = prev.rounds.length - 1;
            if (newTotal < 1) return prev;
            return {
                ...prev,
                rounds: Array.from({ length: newTotal }, (_, i) => ({
                    roundNumber: i + 1,
                    experience: prev.rounds[i]?.experience || ""
                }))
            };
        });
    };

    useEffect(() => {
        axios.get("http://localhost:5000/api/companies")
          .then(response => {
            const sortedCompanies = response.data.sort((a, b) => 
              a.name.localeCompare(b.name)
            );
            setCompanies(sortedCompanies);
            // Initialize company if not set
            if (!formData.company && sortedCompanies.length > 0) {
              setFormData(prev => ({ ...prev, company: sortedCompanies[0]._id }));
            }
          })
          .catch(error => console.error("Error fetching companies:", error));
      }, []);

    // In the handleSubmit function, modify the payload creation:
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        const userData = localStorage.getItem("user");
        console.log("User Data from Local Storage:", userData);
        
        const token = userData ? JSON.parse(userData).token : null;
        console.log("Extracted Token:", token);
                if (!token) {
            alert("User is not authenticated.");
            return;
        }

        const headers = {
            Authorization: token ? `Bearer ${token}` : "",
        };

        console.log("Headers being sent:", headers); 
        // Validate all rounds have content
        if (formData.rounds.some(round => !round.experience.trim())) {
            throw new Error("Please fill all interview round experiences");
        }
        if (!formData.company) {
            throw new Error("Please select a company");
        }
        
        // Find the selected company object
        const selectedCompany = companies.find(c => c._id === formData.company);
        if (!selectedCompany) {
            throw new Error("Invalid company selection");
        }

        const payload = {
            ...formData,
            company: selectedCompany.name,  // Use company name instead of ID
            createdBy: user.id,
            totalRounds: formData.rounds.length,
        };

        // Remove the _id field if present
        delete payload._id;

        await axios.post(
            "http://localhost:5000/api/interviewExp/submit-experience",
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        
        toast.success("Response Submitted Successfully!", {
            icon: '🚀',
            style: {
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', // Smooth blue gradient
              color: '#fff', // White text for contrast
              border: '2px solid #1e3a8a', // Dark blue border for emphasis
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', // Soft shadow for depth
              padding: '12px 16px',
              fontWeight: 'bold',
              fontSize: '16px',
              textAlign: 'center',
            },
          });
          
        setIsSubmitted(true);
    } catch (err) {
        alert(
            err.response?.data?.message || 
            err.response?.data?.error || 
            err.message || 
            "Failed to submit experience"
        );
    } finally {
        setIsSubmitting(false);
    }
};
    // Animation configurations
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

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                type: "spring",
                stiffness: 120,
                damping: 12
            }
        }
    };

    const roundVariants = {
        initial: { opacity: 0, scale: 0.8, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.5, y: -20 }
    };

    const floatingStars = [...Array(15)].map((_, i) => ({
        id: i,
        size: Math.random() * 0.5 + 0.5,
        position: {
            x: Math.random() * 100,
            y: Math.random() * 100
        },
        delay: Math.random() * 2,
        duration: Math.random() * 10 + 10,
        opacity: Math.random() * 0.3 + 0.1
    }));

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-[#0a1120] to-[#1a2a4a] overflow-hidden relative">
            {/* Floating stars background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {floatingStars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute text-yellow-400"
                        style={{
                            left: `${star.position.x}%`,
                            top: `${star.position.y}%`,
                            fontSize: `${star.size}rem`,
                            opacity: star.opacity
                        }}
                        animate={{
                            y: [0, -50, 0],
                            x: [0, Math.random() * 40 - 20, 0],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: star.duration,
                            delay: star.delay,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <FaStar />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto relative z-10"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-10"
                >
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent mb-4"
                    >
                        Share Your Interview Journey
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg text-cyan-100 max-w-2xl mx-auto"
                    >
                        Help your peers by sharing your valuable experience. Your insights could be the key to someone's success!
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative p-6 md:p-8 rounded-2xl bg-[#0f172a]/80 backdrop-blur-lg border border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
                >
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
                        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl opacity-30 animate-pulse"></div>
                    </div>

                    {isSubmitted ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center p-8 rounded-xl bg-gradient-to-br from-green-900/30 to-cyan-900/30 backdrop-blur-sm border border-green-500/20"
                        >
                            <motion.div 
                                animate={{ 
                                    rotate: [0, 10, -10, 0],
                                    y: [0, -10, 0]
                                }}
                                transition={{ 
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                                className="text-6xl mb-4 inline-block"
                            >
                                🎉
                            </motion.div>
                            <h2 className="text-2xl font-bold text-green-400 mb-2">Experience Submitted Successfully!</h2>
                            <p className="text-cyan-200 mb-4">Thank you for contributing to our community.</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 bg-cyan-600/30 border border-cyan-400/50 rounded-lg text-cyan-100 hover:bg-cyan-600/40 transition-colors"
                                onClick={() => setIsSubmitted(false)}
                            >
                                Share Another Experience
                            </motion.button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Left Column - Basic Info */}
                                <motion.div 
                                    variants={itemVariants} 
                                    className="w-full lg:w-1/3 xl:w-1/4 space-y-6"
                                >
                                    <motion.div 
                                        whileHover={{ y: -5 }}
                                        className="p-6 rounded-xl bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 border border-cyan-500/20 shadow-lg"
                                    >
                                        <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                                            <FaLightbulb className="text-yellow-400" />
                                            Basic Information
                                        </h3>
                                        <div className="space-y-4">
                                            {[
                                                { icon: <FaCalendar className="text-purple-400" />, label: "Year", name: "year", options: years },
                                                { icon: <FaSchool className="text-blue-400" />, label: "Branch", name: "branch", options: branches },
                                                { icon: <FaBuilding className="text-cyan-400" />, label: "Company", name: "company", options: companies },
                                                { icon: <FaInfoCircle className="text-green-400" />, label: "Type", name: "type", options: types },
                                            ].map((field, index) => (
                                                <motion.div 
                                                    key={index} 
                                                    className="space-y-2"
                                                    whileHover={{ scale: 1.02 }}
                                                >
                                                    <label className="text-cyan-200 text-sm">
                                                        {field.label}
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute left-3 top-3 z-10">
                                                            {field.icon}
                                                        </div>
                                                        <select
                                                            name={field.name}
                                                            value={formData[field.name]}
                                                            onChange={handleChange}
                                                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1e293b]/70 border border-cyan-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white appearance-none transition-all duration-200 hover:border-cyan-400/50"
                                                        >
                                                            {field.options.map(option => (
                                                                <option 
                                                                    key={field.name === 'company' ? option._id : option} 
                                                                    value={field.name === 'company' ? option._id : option}
                                                                    className="bg-[#1e293b]"
                                                                >
                                                                    {field.name === 'company' ? option.name : option}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute right-3 top-3 pointer-events-none">
                                                            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Tips Card */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="p-4 rounded-lg bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/20"
                                    >
                                        <div className="flex items-start gap-2">
                                            <FaLightbulb className="text-yellow-400 mt-1 flex-shrink-0" />
                                            <p className="text-sm text-purple-100">
                                                <span className="font-semibold text-yellow-300">Pro Tip:</span> Be specific about questions asked, preparation resources, and your overall strategy.
                                            </p>
                                        </div>
                                    </motion.div>
                                </motion.div>

                                {/* Right Column - Rounds & Tips */}
                                <motion.div 
                                    variants={itemVariants} 
                                    className="w-full lg:w-2/3 xl:w-3/4 space-y-6"
                                >
                                    <LayoutGroup>
                                        <motion.div 
                                            whileHover={{ y: -5 }}
                                            className="p-6 rounded-xl bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 border border-blue-500/20 shadow-lg"
                                        >
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    Interview Rounds
                                                </h3>
                                                <div className="flex gap-2">
                                                    <motion.button
                                                        type="button"
                                                        onClick={addRound}
                                                        disabled={formData.rounds.length >= 10}
                                                        className="p-2 rounded-lg bg-gradient-to-br from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/40 hover:to-blue-600/40 border border-cyan-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FaPlus className="text-cyan-400" />
                                                        <span className="text-xs text-cyan-100">Add</span>
                                                    </motion.button>
                                                    <motion.button
                                                        type="button"
                                                        onClick={removeRound}
                                                        disabled={formData.rounds.length <= 1}
                                                        className="p-2 rounded-lg bg-gradient-to-br from-rose-600/30 to-pink-600/30 hover:from-rose-600/40 hover:to-pink-600/40 border border-rose-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FaTimes className="text-rose-400" />
                                                        <span className="text-xs text-rose-100">Remove</span>
                                                    </motion.button>
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                <div className="space-y-6">
                                                    {formData.rounds.map((round, index) => (
                                                        <motion.div
                                                            key={index}
                                                            variants={roundVariants}
                                                            initial="initial"
                                                            animate="animate"
                                                            exit="exit"
                                                            layout
                                                            className="relative"
                                                        >
                                                            <label className="block">
                                                                <span className="text-blue-300 text-sm block mb-2 flex items-center gap-2">
                                                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600/30 text-blue-200 text-xs border border-blue-500/30">
                                                                        {index + 1}
                                                                    </span>
                                                                    Round {index + 1} Experience
                                                                </span>
                                                                <textarea
                                                                    value={round.experience}
                                                                    onChange={(e) => handleRoundChange(index, e.target.value)}
                                                                    className="w-full p-4 rounded-lg bg-[#1e293b]/70 border border-blue-500/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white h-40 md:h-32 resize-none transition-all duration-200 hover:border-blue-400/50"
                                                                    required
                                                                    placeholder={`Describe your experience in Round ${index + 1}...`}
                                                                />
                                                            </label>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </AnimatePresence>
                                        </motion.div>

                                        <motion.div 
                                            layout
                                            whileHover={{ y: -5 }}
                                            className="p-6 rounded-xl bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 border border-purple-500/20 shadow-lg"
                                        >
                                            <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Additional Tips & Resources
                                            </h3>
                                            <textarea
                                                name="additionalTips"
                                                value={formData.additionalTips}
                                                onChange={handleChange}
                                                className="w-full p-4 rounded-lg bg-[#1e293b]/70 border border-purple-500/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-white h-40 md:h-32 resize-none transition-all duration-200 hover:border-purple-400/50"
                                                placeholder="Share any additional tips, resources, or advice that might help others..."
                                            />
                                        </motion.div>
                                    </LayoutGroup>
                                </motion.div>
                            </div>

                        <motion.div
                            variants={itemVariants}
                            className="flex justify-center pt-4"
                            >
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-cyan-500/20 flex items-center gap-2 relative overflow-hidden group"
                                whileHover={{ 
                                scale: 1.05,
                                boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)"
                                }}
                                whileTap={{ 
                                scale: 0.97,
                                boxShadow: "0 0 30px rgba(34, 211, 238, 0.8)"
                                }}
                                initial={false}
                            >
                                {/* Ripple Effect */}
                                {!isSubmitting && (
                                <motion.span
                                    className="absolute inset-0 bg-white opacity-0 rounded-full scale-0 group-hover:opacity-10"
                                    whileTap={{
                                    opacity: [0.2, 0],
                                    scale: 2,
                                    transition: { duration: 0.6 }
                                    }}
                                />
                                )}

                                {/* Particle Explosion */}
                                <AnimatePresence>
                                {isSubmitting && (
                                    <>
                                    {[...Array(12)].map((_, i) => (
                                        <motion.span
                                        key={i}
                                        className="absolute block w-2 h-2 bg-white rounded-full"
                                        initial={{ 
                                            opacity: 1,
                                            scale: 0,
                                            x: 0,
                                            y: 0
                                        }}
                                        animate={{
                                            opacity: [1, 0],
                                            scale: [0, 1.5],
                                            x: Math.cos((i * 30 * Math.PI) / 180) * 50,
                                            y: Math.sin((i * 30 * Math.PI) / 180) * 50,
                                        }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            duration: 1.2,
                                            ease: "easeOut",
                                            delay: i * 0.05
                                        }}
                                        />
                                    ))}
                                    </>
                                )}
                                </AnimatePresence>

                                {/* Neon Glow Effect */}
                                <motion.div
                                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                                style={{
                                    background: "radial-gradient(circle at center, rgba(34, 211, 238, 0.4) 0%, transparent 70%)"
                                }}
                                animate={{
                                    opacity: [0, 0.3, 0],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 1
                                }}
                                />

                                {/* Main Content */}
                                <span className="relative z-10 flex items-center gap-2">
                                {isSubmitting ? (
                                    <>
                                    <motion.div
                                        className="relative"
                                        animate={{ 
                                        rotate: 360,
                                        scale: [1, 1.2, 1]
                                        }}
                                        transition={{ 
                                        duration: 1.2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                        }}
                                    >
                                        <svg 
                                        className="w-6 h-6" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        viewBox="0 0 24 24"
                                        >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                                        />
                                        </svg>
                                    </motion.div>
                                    <motion.span
                                        animate={{
                                        opacity: [0.8, 1, 0.8],
                                        }}
                                        transition={{
                                        duration: 1.5,
                                        repeat: Infinity
                                        }}
                                    >
                                        Submitting...
                                    </motion.span>
                                    </>
                                ) : (
                                    <>
                                    <motion.span
                                        initial={{ x: -5, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        Submit Experience
                                    </motion.span>
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ 
                                        type: "spring", 
                                        stiffness: 500,
                                        damping: 10
                                        }}
                                    >
                                        <svg 
                                        className="w-5 h-5" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        viewBox="0 0 24 24"
                                        >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            d="M13 7l5 5m0 0l-5 5m5-5H6" 
                                        />
                                        </svg>
                                    </motion.span>
                                    </>
                                )}
                                </span>

                                {/* Progress Bar */}
                                {isSubmitting && (
                                <motion.div
                                    className="absolute bottom-0 left-0 h-1 bg-white/50 rounded-b-xl"
                                    initial={{ scaleX: 0 }}
                                    animate={{ 
                                    scaleX: 1,
                                    background: ["#fff", "#38bdf8", "#0ea5e9"]
                                    }}
                                    transition={{ 
                                    duration: 3,
                                    ease: "linear"
                                    }}
                                />
                                )}

                                {/* Click Flash Effect */}
                                <motion.div
                                className="absolute inset-0 bg-white opacity-0"
                                animate={{
                                    opacity: [0.8, 0],
                                    transition: { duration: 0.3 }
                                }}
                                />
                            </motion.button>
                        </motion.div>
                        </form>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default InterviewExperienceForm;