import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaBuilding, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/companies")
            .then(response => {
                const sortedCompanies = response.data.sort((a, b) => 
                    a.name.localeCompare(b.name)
                );
                setCompanies(sortedCompanies);
            })
            .catch(error => console.error("Error fetching companies:", error));
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

    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-[#0f172a] to-[#1e3a5f]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="max-w-6xl mx-auto"
            >
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-12 text-center"
                >
                    Explore Top Companies
                </motion.h1>
                
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {companies.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-gray-400 text-lg text-center p-8 rounded-xl bg-white/5 backdrop-blur-sm col-span-full"
                        >
                            No companies available
                        </motion.div>
                    ) : (
                        companies.map((company) => (
                            <motion.div 
                                key={company._id}
                                variants={itemVariants}
                                whileHover={{ 
                                    scale: 1.03,
                                    boxShadow: "0 10px 30px -10px rgba(8, 145, 178, 0.3)"
                                }}
                                whileTap={{ scale: 0.97 }}
                                className="group relative"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/40 to-blue-600/40 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                <Link 
                                    to={`/company/${company.name}`} 
                                    className="relative flex items-center justify-between p-6 rounded-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] hover:bg-[#1e293b]/80 transition-all duration-300 shadow-2xl border border-white/5"
                                >
                                    <div className="flex items-center gap-5">
                                        <motion.div 
                                            className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20"
                                            whileHover={{ rotate: 15 }}
                                        >
                                            <FaBuilding className="h-7 w-7 text-cyan-400" />
                                        </motion.div>
                                        <div>
                                            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                                                {company.name}
                                            </h3>
                                            <p className="text-sm text-cyan-100/70 mt-1">
                                                {company.interviewExps?.length || 0} interview experiences
                                            </p>
                                        </div>
                                    </div>
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="p-2 rounded-full bg-cyan-500/10"
                                    >
                                        <FaChevronRight className="h-5 w-5 text-cyan-400" />
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </motion.div>

                {/* Animated background elements */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
                >
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 0, x: Math.random() * 100 - 50 }}
                            animate={{
                                y: [0, 100, 0],
                                x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                            }}
                            transition={{
                                duration: Math.random() * 6 + 6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="absolute w-4 h-4 bg-cyan-400 rounded-full opacity-10"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                            }}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default CompanyList;