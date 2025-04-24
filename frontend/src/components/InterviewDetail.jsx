import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaBuilding, FaUser, FaCalendar, FaClock, FaLayerGroup, FaLightbulb, FaStar } from "react-icons/fa";

const InterviewDetail = () => {
    const { id } = useParams();
    const [experience, setExperience] = useState(null);
    const [loading, setLoading] = useState(true);

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
        const fetchExperience = async () => {
            try {
                const response = await axios.get(`https://prepvault-adkn.onrender.com/api/interviewExp/experience/${id}`);
                setExperience(response.data);
            } catch (error) {
                console.error("Error fetching interview experience:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperience();
    }, [id]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { type: "spring", stiffness: 120, damping: 12 }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1120] to-[#1a2a4a]">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-4xl text-cyan-400"
                >
                    <FaStar />
                </motion.div>
            </div>
        );
    }

    if (!experience) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1120] to-[#1a2a4a]">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center p-8 rounded-2xl bg-[#0f172a]/80 backdrop-blur-lg border border-rose-500/20"
                >
                    <p className="text-xl text-rose-400 flex items-center gap-2">
                        <FaStar className="text-2xl" />
                        Interview experience not found
                    </p>
                </motion.div>
            </div>
        );
    }

    // Format Date & Time
    const formattedDate = new Date(experience.createdAt).toLocaleDateString();
    const formattedTime = new Date(experience.createdAt).toLocaleTimeString();

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
                className="max-w-4xl mx-auto relative z-10"
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="p-6 md:p-8 rounded-2xl bg-[#0f172a]/80 backdrop-blur-lg border border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
                >
                    {/* Header Section */}
                    <motion.div variants={itemVariants}>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                            <FaBuilding className="inline-block mr-3 text-cyan-400" />
                            {experience.company}
                        </h1>
                    </motion.div>

                    {/* Meta Information */}
                    <motion.div 
                        variants={itemVariants}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
                    >
                        <div className="flex items-center gap-3 text-cyan-100">
                            <FaUser className="text-blue-400" />
                            <span>{experience.createdBy?.username || "Anonymous"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-cyan-100">
                            <FaCalendar className="text-purple-400" />
                            <span>{formattedDate}</span>
                            <FaClock className="ml-4 text-purple-400" />
                            <span>{formattedTime}</span>
                        </div>
                        <div className="flex items-center gap-3 text-cyan-100">
                            <FaLayerGroup className="text-green-400" />
                            <span>{experience.branch} • {experience.year}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-400/30">
                                {experience.type}
                            </span>
                        </div>
                    </motion.div>

                    {/* Rounds Section */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                            <FaStar className="text-yellow-400" />
                            Interview Rounds ({experience.totalRounds})
                        </h2>

                        <AnimatePresence>
                            {experience.rounds.map((round) => (
                                <motion.div
                                    key={round.roundNumber}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 rounded-xl bg-[#1e293b]/70 border border-cyan-500/20 hover:border-cyan-400/40 transition-all"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-600/30 text-cyan-200 text-sm border border-cyan-500/30">
                                            {round.roundNumber}
                                        </div>
                                        {/* Updated line with whitespace-pre-wrap */}
                                        <p className="text-cyan-100 flex-1 whitespace-pre-wrap">{round.experience}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Additional Tips */}
                    {experience.additionalTips && (
                        <motion.div 
                            variants={itemVariants}
                            className="mt-8 p-4 rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20"
                        >
                            <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                                <FaLightbulb className="text-yellow-400" />
                                Pro Tips & Resources
                            </h3>
                            <p className="text-cyan-100 whitespace-pre-wrap">{experience.additionalTips}</p>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default InterviewDetail;