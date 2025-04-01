import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.3, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] text-white flex flex-col items-center justify-center text-center p-6"
        >
            <motion.h1
                variants={itemVariants}
                className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4"
            >
                404
            </motion.h1>
            <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold mb-6"
            >
                Oops! Page Not Found
            </motion.h2>

            <motion.p
                variants={itemVariants}
                className="text-lg text-gray-300 max-w-2xl mb-8"
            >
                The page you're looking for doesn't exist or has been moved. Let's get you back on track!
            </motion.p>

            <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
            >
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition"></div>
                <Link
                    to="/"
                    className="relative bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 rounded-lg text-xl font-bold shadow-2xl hover:shadow-cyan-500/40 transition-all"
                >
                    Go Back Home
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
            >
            {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: 0, x: Math.random() * 100 - 50 }}
                        animate={{
                            y: [0, 100, 0],
                            x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="absolute w-4 h-4 bg-cyan-400 rounded-full opacity-20"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
};

export default ErrorPage;