import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaBuilding, FaUser, FaCalendarAlt, FaStar, FaSearch, FaBriefcase, FaGraduationCap } from "react-icons/fa";

const SharedInterview = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("Both");
    const navigate = useNavigate();

    // Filter experiences based on search query and selected type
    const filteredExperiences = experiences.filter(exp => {
        const matchesSearch = exp.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === "Both" || exp.type === selectedType;
        return matchesSearch && matchesType;
    });

    // Floating stars animation setup
    const floatingStars = [...Array(15)].map((_, i) => ({
        id: i,
        size: Math.random() * 0.5 + 0.5,
        position: { x: Math.random() * 100, y: Math.random() * 100 },
        delay: Math.random() * 2,
        duration: Math.random() * 10 + 10,
        opacity: Math.random() * 0.3 + 0.1
    }));

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/interviewExp/all-experiences");
                setExperiences(response.data);
            } catch (error) {
                console.error("Error fetching interview experiences:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    // Animation variants
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

    const cardVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
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
            scale: 1.02,
            boxShadow: "0 25px 50px rgba(34, 211, 238, 0.15)",
            transition: { type: "spring", stiffness: 300 }
        },
        tap: { scale: 0.98 }
    };

    // Type filter variants
    const typeFilterVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { type: "spring", stiffness: 300, damping: 20 }
        },
        hover: { scale: 1.02 },
        tap: { scale: 0.98 }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-[#0a1120] to-[#1a2a4a] relative overflow-hidden">
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
                            y: [0, -80, 0],
                            x: [0, Math.random() * 60 - 30, 0],
                            rotate: [0, 180, 360],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: star.duration,
                            delay: star.delay,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <FaStar />
                        <motion.div
                            className="absolute inset-0 bg-yellow-400 rounded-full blur-[2px]"
                            animate={{ opacity: [0, 0.3, 0] }}
                            transition={{
                                duration: star.duration,
                                repeat: Infinity
                            }}
                        />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto relative z-10"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center mb-10"
                >
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent mb-4"
                    >
                        Shared Experiences
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-lg text-cyan-100 max-w-2xl mx-auto"
                    >
                        Discover valuable interview experiences shared by our community members
                    </motion.p>

                    {/* Search and Filter Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4"
                    >
                        {/* Search Bar */}
                        <div className="relative group flex-1">
                            <motion.div
                                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
                                animate={{
                                    opacity: [0, 0.3, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity
                                }}
                            />
                            <div className="relative flex items-center">
                                <FaSearch className="absolute left-5 text-cyan-400 text-lg z-10" />
                                <input
                                    type="text"
                                    placeholder="Search by company name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[#0f172a]/80 backdrop-blur-lg border border-cyan-500/30 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 text-cyan-100 placeholder-cyan-400/60 transition-all duration-300"
                                />
                                <motion.div
                                    className="absolute right-5"
                                    animate={{
                                        scale: searchQuery ? 1.2 : 1,
                                        rotate: searchQuery ? 10 : 0
                                    }}
                                    transition={{
                                        type: "tween",
                                        duration: 0.3,
                                        repeat: searchQuery ? Infinity : 0,
                                        repeatType: "mirror"
                                    }}
                                >
                                    <FaSearch className="text-cyan-400/60" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Type Filter Dropdown */}
                        <motion.div
                            className="relative group"
                            variants={typeFilterVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <div className="relative">
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full md:w-48 pl-12 pr-6 py-4 rounded-2xl bg-[#0f172a]/80 backdrop-blur-lg border border-purple-500/30 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 text-cyan-100 appearance-none transition-all duration-300 cursor-pointer"
                                >
                                    <option value="Both">Both Types</option>
                                    <option value="Placement">Placement</option>
                                    <option value="Internship">Internship</option>
                                </select>
                                <div className="absolute left-5 top-1/2 -translate-y-1/2">
                                    {selectedType === "Placement" ? (
                                        <FaBriefcase className="text-purple-400 text-lg" />
                                    ) : selectedType === "Internship" ? (
                                        <FaGraduationCap className="text-blue-400 text-lg" />
                                    ) : (
                                        <div className="flex gap-1">
                                            <FaBriefcase className="text-purple-400 text-sm" />
                                            <FaGraduationCap className="text-blue-400 text-sm" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400/60">
                                    ▼
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                    >
                        <div className="inline-block">
                            <motion.div
                                animate={{ 
                                    rotate: 360,
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{ 
                                    duration: 1.2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="text-4xl text-cyan-400"
                            >
                                <FaStar />
                            </motion.div>
                            <p className="mt-4 text-cyan-200">Loading Experiences...</p>
                        </div>
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
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full text-center p-6 rounded-xl bg-[#0f172a]/50 backdrop-blur-lg"
                                >
                                    <p className="text-cyan-200">
                                        {searchQuery || selectedType !== "Both" ? 
                                            `No results found${searchQuery ? ` for "${searchQuery}"` : ""}${selectedType !== "Both" ? ` in ${selectedType}` : ""}` : 
                                            "No interview experiences available yet. Be the first to share!"
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
                                        className="group relative p-6 rounded-2xl bg-[#0f172a]/80 backdrop-blur-lg border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 cursor-pointer"
                                        onClick={() => navigate(`/interview/${exp._id}`)}
                                    >
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="relative z-10">
                                            {/* Company Header */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <FaBuilding className="text-cyan-400 text-xl" />
                                                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                                                    {exp?.company || "Unknown Company"}
                                                </h2>
                                            </div>

                                            {/* Details Grid */}
                                            <div className="grid grid-cols-2 gap-3 text-cyan-100">
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="text-purple-400" />
                                                    <span>{exp.year}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaUser className="text-blue-400" />
                                                    <span>{exp.branch}</span>
                                                </div>
                                            </div>

                                            {/* Type Badge */}
                                            <motion.div
                                                initial={{ scale: 0.9 }}
                                                animate={{ scale: 1 }}
                                                className="inline-block mt-4 px-3 py-1 rounded-full text-sm font-medium"
                                                style={{
                                                    background: exp.type === "Internship" 
                                                        ? "linear-gradient(45deg, #9333ea80, #4f46e580)"
                                                        : "linear-gradient(45deg, #22d3ee80, #3b82f680)",
                                                    backdropFilter: 'blur(4px)'
                                                }}
                                            >
                                                {exp.type}
                                            </motion.div>

                                            {/* Author & Stats */}
                                            <div className="mt-4 pt-4 border-t border-cyan-500/20">
                                                <div className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-2 text-cyan-300">
                                                        <FaUser className="opacity-70" />
                                                        <span>{exp.createdBy?.username || "Anonymous"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-yellow-400">
                                                        <FaStar className="text-sm" />
                                                        <span>{exp.rounds?.length || 0} Rounds</span>
                                                    </div>
                                                </div>
                                            </div>
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