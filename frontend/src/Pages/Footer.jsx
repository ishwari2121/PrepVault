import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const Footer = () => {
    const footerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' },
        },
    };

    const developerButtonVariants = {
        hover: {
            y: -3,
            scale: 1.03,
            boxShadow: "0 10px 25px -5px rgba(34, 211, 238, 0.4)",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        },
        tap: { scale: 0.98 }
    };

    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={footerVariants}
            className="bg-[#0f172a] border-t border-white/10 py-12"
        >
            <div className="container mx-auto px-4">
                {/* Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* About Section */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            About PrepVault
                        </h3>
                        <p className="text-gray-300">
                            Your ultimate resource for mastering interviews. Get insights, share experiences, and connect with a community of aspirants.
                        </p>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li><NavLink to="/" className="text-gray-300 hover:text-cyan-400 transition-colors">Home</NavLink></li>
                            <li><NavLink to="/companies" className="text-gray-300 hover:text-cyan-400 transition-colors">Company Profiles</NavLink></li>
                            <li><NavLink to="/interviewexp" className="text-gray-300 hover:text-cyan-400 transition-colors">Share Interview</NavLink></li>
                            <li><NavLink to="/commonQuestion" className="text-gray-300 hover:text-cyan-400 transition-colors">Question Bank</NavLink></li>
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Contact Us
                        </h3>
                        <ul className="space-y-2">
                            <li className="text-gray-300">Email: PrepVault@gmail.com</li>
                            <li className="text-gray-300">Phone: (+91) 7028727108</li>
                            <li className="text-gray-300">Address: PICT Pune</li>
                        </ul>
                    </motion.div>

                    {/* Developer Section */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Behind the Scenes
                        </h3>
                        <motion.div
                            variants={developerButtonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className="relative group"
                        >
                            <NavLink
                                to="/developer"
                                className="block w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-lg text-white font-medium text-center shadow-lg overflow-hidden"
                            >
                                <span className="relative z-10">Meet the Developers</span>
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </NavLink>
                        </motion.div>
                        <p className="text-gray-400 text-sm mt-2">
                            Learn about the creator behind this platform and their journey.
                        </p>
                    </motion.div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 my-8"></div>

                {/* Copyright */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-gray-300"
                >
                    &copy; {new Date().getFullYear()} PrepVault. All rights reserved.
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;