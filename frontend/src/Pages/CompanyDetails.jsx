import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGraduationCap,
  FaStar,
  FaBriefcase,
  FaMoneyBillAlt,
  FaChevronDown,
  FaBook,
  FaClipboardCheck,
  FaUserGraduate,
  FaLink,
  FaFileAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

const CompanyDetails = () => {
    const { companyName } = useParams();
    const [company, setCompany] = useState(null);
    const [view, setView] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 600);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        axios
        .get(`http://localhost:5000/api/companies/${companyName}`)
        .then((response) => {
            setCompany(response.data);
        })
        .catch((error) => console.error("Error fetching company details:", error));
    }, [companyName]);

    if (!company) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-gray-300"
            >
            Loading...
            </motion.div>
        </div>
        );
    }

    const itemVariants = {
        hidden: { opacity: 0, x: -20, y: 20 },
        visible: { 
            opacity: 1, 
            x: 0,
            y: 0,
            transition: { 
                type: "spring",
                stiffness: 120,
                damping: 14
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
        >
            {/* Company Name */}
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent mb-6 sm:mb-8">
            {company.name}
            </h1>

            {/* View Buttons - Stacked on mobile */}
            <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8"
            >
            <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-all duration-300 ${
                view === "recruitment"
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-700 hover:bg-gray-600"
                } text-white font-semibold text-sm sm:text-base`}
                onClick={() => setView("recruitment")}
            >
                View Recruitment Process
            </motion.button>
            <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-all duration-300 ${
                view === "eligibility"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-700 hover:bg-gray-600"
                } text-white font-semibold text-sm sm:text-base`}
                onClick={() => setView("eligibility")}
            >
                View Eligibility Criteria
            </motion.button>
            </motion.div>

            {/* Recruitment Process Section - Mobile Optimized */}
            <AnimatePresence>
                {view === "recruitment" && (
                    <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-br from-gray-900/80 to-indigo-900/20 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-indigo-500/20"
                    >
                    <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 mb-6 sm:mb-8">
                        Recruitment Journey
                        <motion.span 
                        animate={{ rotate: [0, 20, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="ml-2 sm:ml-3 inline-block"
                        >
                        🚀
                        </motion.span>
                    </h2>

                    <div className="relative">
                        {/* Timeline line - hidden on mobile */}
                        {!isMobile && (
                            <motion.div
                            className="absolute left-6 top-0 h-full w-1 bg-gradient-to-b from-indigo-500/30 to-blue-500/30 rounded-full"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            />
                        )}

                        <motion.div
                        className="space-y-6 sm:space-y-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        >
                        {company.recruitmentProcess &&
                            Object.entries(company.recruitmentProcess).map(
                            ([key, value], index) => {
                                if (!value || (Array.isArray(value) && value.length === 0)) return null;

                                return (
                                <motion.div
                                    key={key}
                                    variants={itemVariants}
                                    className={`flex items-start gap-4 ${isMobile ? '' : 'pl-16'} relative group`}
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                                >
                                    {/* Timeline dot - hidden on mobile */}
                                    {!isMobile && (
                                        <motion.div
                                        className="absolute left-6 top-4 w-4 h-4 rounded-full bg-indigo-400 ring-4 ring-indigo-400/20"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                        whileHover={{ scale: 1.2 }}
                                        />
                                    )}

                                    {!isMobile && (
                                        <div className="absolute inset-0 -left-12 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute left-0 top-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl" />
                                        </div>
                                    )}

                                    <motion.div
                                        whileHover={{ 
                                            scale: isMobile ? 1 : 1.03,
                                            boxShadow: isMobile ? "none" : "0 20px 40px -10px rgba(99, 102, 241, 0.15)"
                                        }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className={`w-full p-4 sm:p-6 bg-gradient-to-br from-gray-800/70 to-indigo-900/20 rounded-lg sm:rounded-xl border border-indigo-500/30 shadow-lg sm:shadow-2xl relative overflow-hidden ${
                                            isMobile ? 'ml-0' : ''
                                        }`}
                                    >
                                        {!isMobile && (
                                            <div className="absolute inset-0 rounded-xl border border-transparent [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)]">
                                                <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-blue-500/30 opacity-50"
                                                animate={{
                                                    backgroundPosition: ['0% 0%', '100% 100%']
                                                }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 5,
                                                    ease: "linear"
                                                }}
                                                />
                                            </div>
                                        )}

                                        <div className="flex items-start gap-3 sm:gap-4 relative">
                                            {/* Icon */}
                                            <motion.div 
                                            className={`p-2 sm:p-3 bg-indigo-500/10 rounded-md sm:rounded-lg ${isMobile ? 'backdrop-blur-xs' : 'backdrop-blur-sm'}`}
                                            whileHover={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 0.5 }}
                                            >
                                            {key === "companyDetails" && value.includes("http") ? (
                                                <FaLink className="text-lg sm:text-xl text-indigo-400" />
                                            ) : (
                                                <FaFileAlt className="text-lg sm:text-xl text-indigo-400" />
                                            )}
                                            </motion.div>

                                            {/* Content */}
                                            <div className="flex-1">
                                            <motion.h3
                                                className="text-indigo-400 text-base sm:text-lg font-medium mb-1 sm:mb-2 capitalize"
                                                whileHover={{ x: isMobile ? 0 : 5 }}
                                            >
                                                {key.replace(/([A-Z])/g, " $1")}
                                            </motion.h3>

                                            {key === "sampleQuestions" ? (
                                                <motion.ul 
                                                className="list-disc pl-4 sm:pl-6 space-y-1 sm:space-y-2 text-sm sm:text-base"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                >
                                                {value.map((question, qIndex) => (
                                                    <motion.li 
                                                    key={qIndex} 
                                                    className="text-gray-300"
                                                    whileHover={{ x: isMobile ? 0 : 5 }}
                                                    transition={{ type: "spring" }}
                                                    >
                                                    {question}
                                                    </motion.li>
                                                ))}
                                                </motion.ul>
                                            ) : key === "companyDetails" && value.includes("http") ? (
                                                <motion.a
                                                href={value}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 sm:gap-2 transition-colors group text-sm sm:text-base"
                                                whileHover={{ scale: isMobile ? 1 : 1.05 }}
                                                >
                                                <span className="border-b border-transparent group-hover:border-indigo-400 transition-all">
                                                    Application Link
                                                </span>
                                                <FaExternalLinkAlt className="text-xs sm:text-sm transition-transform group-hover:rotate-45" />
                                                </motion.a>
                                            ) : (
                                                <motion.p 
                                                className="text-gray-300 whitespace-pre-wrap text-sm sm:text-base"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                >
                                                {value}
                                                </motion.p>
                                            )}
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                                );
                            }
                            )}
                        </motion.div>
                    </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Eligibility Criteria Section (unchanged) */}
            <AnimatePresence>
                {view === "eligibility" && (
                    <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 120 }}
                    className="mt-6 p-8 bg-gradient-to-br from-[#0f172a]/90 to-[#1e3a8a]/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-indigo-500/30 relative overflow-hidden"
                    >
                    {/* Floating particles background */}
                    <div className="absolute inset-0 z-0">
                        {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.2 }}
                            transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                            }}
                            className="absolute w-1 h-1 bg-indigo-400 rounded-full"
                            style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            }}
                        />
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        <h2 className="text-3xl font-bold mb-8 text-center">
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Eligibility Matrix
                        </span>
                        <motion.span
                            animate={{ rotate: [0, 30, -30, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="ml-3 inline-block"
                        >
                            🌟
                        </motion.span>
                        </h2>

                        {/* Year Selection */}
                        <motion.div 
                        className="relative mb-12 w-full max-w-md"
                        whileHover={{ scale: 1.02 }}
                        >
                        <motion.select
                            className="w-full p-4 text-lg bg-slate-900/70 text-cyan-100 rounded-2xl border-2 border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-lg appearance-none"
                            onChange={(e) => setSelectedYear(e.target.value)}
                            value={selectedYear || ""}
                            whileFocus={{ borderColor: "#22d3ee" }}
                        >
                            <option value="" className="bg-slate-800">Select Academic Year</option>
                            {company.eligibilityCriteria.map((criteria, index) => (
                            <option 
                                key={index} 
                                value={criteria.year}
                                className="bg-slate-800"
                            >
                                {criteria.year} Batch
                            </option>
                            ))}
                        </motion.select>
                        <motion.div
                            animate={{ y: [0, 3, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                            <FaChevronDown className="text-cyan-400 text-xl" />
                        </motion.div>
                        </motion.div>

                        {/* Centered Eligibility Details */}
                        {selectedYear && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 100 }}
                            className="w-full max-w-4xl mx-auto"
                        >
                            {company.eligibilityCriteria
                            .filter((criteria) => criteria.year === Number(selectedYear))
                            .map((criteria, index) => (
                                <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="group p-8 bg-gradient-to-br from-slate-900/70 to-cyan-900/20 rounded-3xl border border-cyan-400/20 shadow-2xl relative overflow-hidden"
                                >
                                {/* Animated background shimmer */}
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear"
                                    }}
                                    className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
                                />

                                <div className="flex flex-col gap-8 relative">
                                    {/* Header */}
                                    <motion.div 
                                    className="flex flex-col items-center gap-4 pb-6 border-b border-cyan-500/20"
                                    whileHover={{ scale: 1.02 }}
                                    >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                        className="p-4 bg-cyan-500/10 rounded-2xl"
                                    >
                                        <FaGraduationCap className="text-3xl text-cyan-400" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent text-center">
                                        {criteria.year} Requirements
                                    </h3>
                                    </motion.div>

                                    {/* Centered Details Grid */}
                                    <motion.div
                                    className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    >
                                    {[
                                        { icon: <FaBook />, label: "Degree", value: criteria.degree },
                                        { icon: <FaClipboardCheck />, label: "Eligibility", value: criteria.eligibility },
                                        { icon: <FaStar />, label: "CGPA", value: criteria.cgpa },
                                        { icon: <FaUserGraduate />, label: "Experience", value: criteria.experience },
                                        { icon: <FaBriefcase />, label: "Role", value: criteria.role },
                                        { icon: <FaMoneyBillAlt />, label: "CTC", value: criteria.CTC },
                                    ].map((item, i) => (
                                        <motion.div
                                        key={i}
                                        className="flex items-center gap-5 p-4 bg-slate-800/40 rounded-xl hover:bg-slate-800/60 transition-colors cursor-default"
                                        whileHover={{ 
                                            scale: 1.05,
                                            boxShadow: "0 10px 30px -5px rgba(34, 211, 238, 0.2)"
                                        }}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 + 0.4 }}
                                        >
                                        <motion.span 
                                            className="text-cyan-400 text-xl"
                                            whileHover={{ rotate: 360 }}
                                        >
                                            {item.icon}
                                        </motion.span>
                                        <div>
                                            <p className="text-sm text-cyan-300/80">{item.label}</p>
                                            <p className="text-lg font-medium text-cyan-100">
                                            {item.value}
                                            </p>
                                        </div>
                                        </motion.div>
                                    ))}
                                    </motion.div>

                                    {/* Centered Skills Section */}
                                    <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="mt-4 text-center"
                                    >
                                    <h4 className="text-lg font-semibold text-cyan-400 mb-4">
                                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                        Key Skills Matrix
                                        </span>
                                        <motion.span 
                                        className="ml-2 inline-block"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        >
                                        🔮
                                        </motion.span>
                                    </h4>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {criteria.skillsRequired.map((skill, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ 
                                            type: "spring",
                                            delay: i * 0.05 + 0.7
                                            }}
                                            className="px-4 py-2 bg-cyan-500/10 text-cyan-300 rounded-full text-sm hover:bg-cyan-500/20 transition-colors cursor-pointer border border-cyan-500/30 hover:border-cyan-500/50"
                                            whileHover={{ 
                                            scale: 1.1,
                                            background: "linear-gradient(45deg, #06b6d4, #3b82f6)"
                                            }}
                                        >
                                            {skill}
                                        </motion.span>
                                        ))}
                                    </div>
                                    </motion.div>
                                </div>
                                </motion.div>
                            ))}
                        </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>
        </motion.div>
        </div>
    );
};

export default CompanyDetails;