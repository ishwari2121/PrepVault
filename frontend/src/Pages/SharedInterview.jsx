import { useState, useEffect,  useContext} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaBuilding, FaUser, FaCalendarAlt, FaStar, FaSearch, FaBriefcase, FaGraduationCap, FaRocket } from "react-icons/fa";
import { AuthContext } from "../Context/AuthContext";

const SharedInterview = () => {
    const [experiences, setExperiences] = useState([]);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("Both");
    const navigate = useNavigate();

    // Filter experiences
    const filteredExperiences = experiences.filter((exp) => {
        console.log(user);
        console.log(user.id);
        console.log(exp.createdBy._id);
        const matchesType =
            selectedType === "Both" ||
            exp.type === selectedType ||
            (selectedType === "My" &&
                (exp.createdBy._id === user.id));
        return matchesType;
    });
    

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await axios.get("https://prepvault-adkn.onrender.com/api/interviewExp/all-experiences");
                setExperiences(response.data);
                console.log(response.data);
                
            } catch (error) {
                console.error("Error fetching interview experiences:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExperiences();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: { 
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 0.5
            }
        },
        hover: {
            y: -8,
            scale: 1.03,
            transition: { duration: 0.4 }
        },
        tap: { scale: 0.98 }
    };

    const floatingVariants = {
        float: {
            y: [0, -15, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-850 to-gray-800">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-7xl mx-auto"
            >
                {/* Enhanced Header Section */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-12 relative"
                >
                    <motion.div
                        variants={floatingVariants}
                        animate="float"
                        className="absolute -top-8 left-1/2 -translate-x-1/2"
                    >
                        <FaRocket className="text-6xl text-cyan-400 opacity-30" />
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 relative">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="inline-block"
                        >
                            Interview Chronicles
                        </motion.span>
                    </h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg text-cyan-100/90 max-w-2xl mx-auto tracking-wide"
                    >
                        Dive into real interview experiences 🚀<br />
                        Shared by our amazing community ✨
                    </motion.p>
                </motion.div>

                {/* Enhanced Search & Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col md:flex-row gap-4"
                >
                    <div className="relative flex-1 group">
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="relative flex items-center shadow-xl"
                        >
                            <FaSearch className="absolute left-4 text-cyan-400 z-10" />
                            <input
                                type="text"
                                placeholder="Explore companies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-800/60 backdrop-blur-xl border-2 border-cyan-500/40 text-cyan-100 placeholder-cyan-400/60 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300"
                            />
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-50 group-hover:opacity-80 transition-opacity"
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        className="flex gap-2 bg-gray-800/60 backdrop-blur-xl p-1 rounded-2xl border-2 border-cyan-500/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {["Both", "Internship", "Placement","My"].map((type) => (
                            <motion.button
                                key={type}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-3 rounded-xl text-sm font-medium transition-colors ${
                                    selectedType === type
                                        ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
                                        : "text-cyan-300 hover:bg-gray-700/50"
                                }`}
                                onClick={() => setSelectedType(type)}
                            >
                                {type === "Both" ? "🌟 All" : type}
                            </motion.button>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Enhanced Content Section */}
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center py-20"
                    >
                        <motion.div
                            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                            className="text-cyan-400 text-4xl p-4 flex space-x-2"
                        >
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1.5,
                                        delay: i * 0.2
                                    }}
                                    className="w-3 h-3 bg-cyan-400 rounded-full"
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {filteredExperiences.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="col-span-full text-center p-8 rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border-2 border-cyan-500/30"
                                >
                                    <div className="text-6xl mb-4">🔍</div>
                                    <p className="text-cyan-200 text-xl font-light">
                                        {searchQuery || selectedType !== "Both" ? 
                                            `No experiences found${searchQuery ? ` for "${searchQuery}"` : ""}` : 
                                            "Be the first to share your experience! 🎉"
                                        }
                                    </p>
                                </motion.div>
                            ) : (
                                filteredExperiences.map((exp) => (
                                    <motion.div
                                        key={exp._id}
                                        variants={cardVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        className="group relative p-6 rounded-2xl bg-gray-800/60 backdrop-blur-xl border-2 border-cyan-500/30 cursor-pointer transform-gpu overflow-hidden"
                                        onClick={() => navigate(`/interview/${exp._id}`)}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 opacity-0 group-hover:opacity-30 transition-opacity" />
                                        <div className="relative z-10 space-y-4">
                                            {/* Company Header */}
                                            <div className="flex items-center gap-3">
                                                <motion.div
                                                    whileHover={{ rotate: 360 }}
                                                    className="p-2 bg-cyan-500/10 rounded-lg"
                                                >
                                                    <FaBuilding className="text-2xl text-cyan-400" />
                                                </motion.div>
                                                <h2 className="text-xl font-semibold text-cyan-100 tracking-wide">
                                                    {exp.company}
                                                </h2>
                                            </div>

                                            {/* Enhanced Details */}
                                            <div className="space-y-3 pl-2">
                                                <motion.div 
                                                    whileHover={{ x: 5 }}
                                                    className="flex items-center gap-3 text-cyan-300/90"
                                                >
                                                    <FaCalendarAlt className="text-purple-400 flex-shrink-0" />
                                                    <span className="font-medium">{exp.year}</span>
                                                </motion.div>
                                                <motion.div 
                                                    whileHover={{ x: 5 }}
                                                    className="flex items-center gap-3 text-cyan-300/90"
                                                >
                                                    <FaUser className="text-blue-400 flex-shrink-0" />
                                                    <span className="font-medium">{exp.branch}</span>
                                                </motion.div>
                                            </div>

                                            {/* Animated Type Badge */}
                                            <motion.div
                                                initial={{ scale: 0.9 }}
                                                animate={{ scale: 1 }}
                                                whileHover={{ scale: 1.05 }}
                                                className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-400/30 relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-cyan-500/10 animate-pulse" />
                                                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                                    {exp.type} Experience
                                                </span>
                                            </motion.div>

                                            {/* Glowing Footer */}
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="pt-4 border-t border-cyan-500/20"
                                            >
                                                <div className="flex justify-between items-center text-sm">
                                                    <div className="text-cyan-400/90 font-light">
                                                        By {exp.createdBy?.username || "Anonymous"}
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-cyan-500/10 px-3 py-1 rounded-full">
                                                        <FaStar className="text-yellow-400 animate-pulse" />
                                                        <span className="text-yellow-300">
                                                            {exp.rounds?.length || 0} Rounds
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default SharedInterview;