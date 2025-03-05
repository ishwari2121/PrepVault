import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa';
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

    const iconVariants = {
        hover: { scale: 1.2, rotate: 10 },
        tap: { scale: 0.9 },
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
                            <li><NavLink to="/interviews" className="text-gray-300 hover:text-cyan-400 transition-colors">Share Interview</NavLink></li>
                            <li><NavLink to="/question-answer" className="text-gray-300 hover:text-cyan-400 transition-colors">Question Bank</NavLink></li>
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
                            <li className="text-gray-300">Address: PICT, PUNE</li>
                        </ul>
                    </motion.div>
                    
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Follow Us
                        </h3>
                        <div className="flex space-x-4">
                            <motion.a
                                href="#"
                                variants={iconVariants}
                                whileHover="hover"
                                whileTap="tap"
                                className="text-gray-300 hover:text-cyan-400 transition-colors"
                            >
                                <FaLinkedin className="h-6 w-6" />
                            </motion.a>
                            <motion.a
                                href="#"
                                variants={iconVariants}
                                whileHover="hover"
                                whileTap="tap"
                                className="text-gray-300 hover:text-cyan-400 transition-colors"
                            >
                                <FaGithub className="h-6 w-6" />
                            </motion.a>
                            <motion.a
                                href="#"
                                variants={iconVariants}
                                whileHover="hover"
                                whileTap="tap"
                                className="text-gray-300 hover:text-cyan-400 transition-colors"
                            >
                                <FaTwitter className="h-6 w-6" />
                            </motion.a>
                            <motion.a
                                href="#"
                                variants={iconVariants}
                                whileHover="hover"
                                whileTap="tap"
                                className="text-gray-300 hover:text-cyan-400 transition-colors"
                            >
                                <FaEnvelope className="h-6 w-6" />
                            </motion.a>
                        </div>
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