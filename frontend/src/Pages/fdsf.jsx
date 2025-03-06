import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { FaLink, FaGraduationCap, FaStar, FaBriefcase, FaMoneyBillAlt, FaChevronDown } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";

const CompanyDetails = () => {
    const { companyName } = useParams();
    const [company, setCompany] = useState(null);
    const [view, setView] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [isYearOpen, setIsYearOpen] = useState(false);

    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/companies/${companyName}`)
            .then(response => setCompany(response.data))
            .catch(error => console.error("Error:", error));
    }, [companyName]);

    if (!company) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e3a8a]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-blue-200 font-semibold">Loading Magic...</span>
                </motion.div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { 
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { type: "spring", stiffness: 120 }
        }
    };

    return (
        <motion.div 
            className="min-h-screen p-8 bg-gradient-to-br from-[#0f172a] to-[#1e3a8a]"
            style={{ scale }}
        >
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent inline-block">
                        {company.name}
                    </h1>
                    <div className="mt-4 h-1 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 w-1/3 mx-auto rounded-full" />
                </motion.div>

                {/* View Selector */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex justify-center gap-6 mb-16"
                >
                    {['recruitment', 'eligibility'].map((tab) => (
                        <motion.button
                            key={tab}
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 ${
                                view === tab 
                                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/20'
                                    : 'bg-slate-700 hover:bg-slate-600'
                            }`}
                            onClick={() => setView(tab)}
                        >
                            {tab === 'recruitment' ? 'Recruitment Journey' : 'Eligibility Map'}
                        </motion.button>
                    ))}
                </motion.div>

                <AnimatePresence mode="wait">
                    {/* Recruitment Process */}
                    {view === 'recruitment' && (
                        <motion.div
                            key="recruitment"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            className="space-y-8 relative"
                        >
                            <div className="absolute left-8 top-0 h-full w-1 bg-gradient-to-b from-cyan-500/30 to-blue-500/30 rounded-full" />
                            {company.recruitmentProcess.split("\n")
  .filter(line => line.trim() !== "") // Remove empty lines
  .map((line, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start gap-6 pl-16 relative"
    >
                                    <div className="absolute left-8 top-4 w-4 h-4 rounded-full bg-cyan-400 ring-4 ring-cyan-400/30" />
                                    <div className="p-6 bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-xl flex-1">
                                        {line.startsWith('http') ? (
                                            <a
                                                href={line}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-3 group"
                                            >
                                                <FaLink className="text-lg flex-shrink-0" />
                                                <span className="group-hover:underline">{line}</span>
                                            </a>
                                        ) : (
                                            <div className="flex items-center gap-3 text-slate-200">
                                                <FiCheckCircle className="text-cyan-400 text-xl" />
                                                {line}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Eligibility Criteria */}
                    
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default CompanyDetails;