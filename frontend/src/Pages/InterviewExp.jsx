import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import InterviewExperienceForm from "../Components/Interview";
import { AuthContext } from "../Context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaArrowRight, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

const ProtectedPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = () => {
        setLoginFromInterview(true);
        navigate("/signin");
    };

    // Enhanced floating stars with trails
    const floatingStars = [...Array(25)].map((_, i) => ({
        id: i,
        size: Math.random() * 0.8 + 0.5,
        position: { x: Math.random() * 100, y: Math.random() * 100 },
        delay: Math.random() * 3,
        duration: Math.random() * 12 + 8,
        opacity: Math.random() * 0.4 + 0.2,
        trail: Math.floor(Math.random() * 3) + 2
    }));

    if (!user) {
        return (
            <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-[#0a1120] to-[#1a2a4a] relative overflow-hidden">
                {/* Animated grid background */}
                <div className="absolute inset-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzA2MTk5IiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvc3ZnPg==')]"></div>
                </div>

                {/* Floating stars with trails */}
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
                            {/* Star trail */}
                            <motion.div
                                className="absolute inset-0"
                                animate={{
                                    opacity: [0.4, 0],
                                    scale: [1, 2]
                                }}
                                transition={{
                                    duration: star.duration / 2,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                }}
                            >
                                {[...Array(star.trail)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className="absolute text-current opacity-50"
                                        style={{
                                            left: `${i * 10}%`,
                                            filter: `blur(${i * 2}px)`
                                        }}
                                    />
                                ))}
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto relative z-10 h-screen flex items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center p-8 rounded-2xl bg-[#0f172a]/90 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 relative overflow-hidden"
                        whileHover={{ 
                            scale: 1.005,
                            boxShadow: "0 0 40px rgba(34, 211, 238, 0.2)"
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {/* Animated border gradient */}
                        <motion.div
                            className="absolute inset-0 rounded-2xl pointer-events-none"
                            animate={{
                                background: [
                                    'conic-gradient(from 0deg, #22d3ee, #3b82f6, #9333ea, #22d3ee)',
                                    'conic-gradient(from 180deg, #22d3ee, #3b82f6, #9333ea, #22d3ee)'
                                ]
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{
                                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude',
                                padding: '2px'
                            }}
                        />

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ 
                                scale: 1,
                                opacity: 1,
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                repeatType: 'reverse'
                            }}
                            className="mb-6 inline-block"
                        >
                            <FaLock className="text-6xl text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]" />
                        </motion.div>

                        <motion.h2
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ 
                                y: 0, 
                                opacity: 1,
                                textShadow: '0 0 20px rgba(34, 211, 238, 0.3)'
                            }}
                            className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4"
                        >
                            Secure Portal
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ 
                                opacity: 1,
                                y: [0, -5, 0],
                                transition: {
                                    duration: 3,
                                    repeat: Infinity
                                }
                            }}
                            className="text-lg text-cyan-100 mb-8 max-w-md mx-auto font-light tracking-wide"
                        >
                            Unlock your ability to share valuable interview insights
                        </motion.p>

                        <div className="flex flex-col gap-4 items-center">
                            <motion.button
                                whileHover={{ 
                                    scale: 1.05,
                                    background: 'linear-gradient(45deg, #22d3ee, #3b82f6)'
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogin}
                                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium flex items-center gap-3 group relative overflow-hidden transition-all duration-300"
                                style={{
                                    boxShadow: '0 4px 24px rgba(34, 211, 238, 0.2)'
                                }}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <motion.div
                                        animate={{
                                            x: [-5, 5, -5],
                                            transition: {
                                                duration: 1.5,
                                                repeat: Infinity
                                            }
                                        }}
                                    >
                                        <FaArrowRight className="text-xl" />
                                    </motion.div>
                                    <span className="text-lg">Continue to Login</span>
                                </span>
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.button>

                            <motion.button
                                whileHover={{ 
                                    scale: 1.05,
                                    background: 'linear-gradient(45deg, #475569, #64748b)'
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(-1)}
                                className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300 rounded-xl font-medium flex items-center gap-3 group relative overflow-hidden transition-all duration-300"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <motion.div
                                        animate={{
                                            x: [5, -5, 5],
                                            transition: {
                                                duration: 1.5,
                                                repeat: Infinity
                                            }
                                        }}
                                    >
                                        <FaArrowLeft className="text-xl" />
                                    </motion.div>
                                    <span className="text-lg">Return Back</span>
                                </span>
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.button>
                        </div>

                        {/* Security badge */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ 
                                opacity: 1,
                                transition: { delay: 0.5 }
                            }}
                            className="mt-8 flex items-center justify-center gap-2 text-sm text-cyan-300/80"
                        >
                            <FaShieldAlt className="text-lg" />
                            <span>256-bit SSL Encryption</span>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    return <InterviewExperienceForm />;
};

export default ProtectedPage;   