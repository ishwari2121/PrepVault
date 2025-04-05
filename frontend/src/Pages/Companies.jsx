import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaBuilding, FaChevronRight, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [allInterviews, setAllInterviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCompanies, setFilteredCompanies] = useState([]);

    useEffect(() => {
        async function fetchCompanies() {
            await axios.get("http://localhost:5000/api/companies")
                .then(response => {
                    const sortedCompanies = response.data.sort((a, b) => 
                        a.name.localeCompare(b.name)
                    );
                    setCompanies(sortedCompanies);
                    setFilteredCompanies(sortedCompanies); // Initialize filtered companies
                })
                .catch(error => console.error("Error fetching companies:", error));
        }

        fetchCompanies();
    }, []);

    useEffect(() => {
        async function fetchInterviews() {
            try {
                const interview = await axios.get("http://localhost:5000/api/interviewExp/all-experiences");
                setAllInterviews(interview.data);
            } catch (error) {
                console.error(error.message);
            }
        }
        fetchInterviews();
    }, []);

    // Filter companies based on search term
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredCompanies(companies);
        } else {
            const filtered = companies.filter(company =>
                company.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCompanies(filtered);
        }
    }, [searchTerm, companies]);

    // Animation variants (same as before)
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
        <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-[#0f172a] to-[#1e3a5f]">
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
                    className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6 md:mb-12 text-center"
                >
                    Explore Top Companies
                </motion.h1>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="mb-8 max-w-md mx-auto"
                >
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search companies..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1e293b]/80 border border-white/10 focus:border-cyan-400/50 focus:outline-none text-white placeholder-gray-400 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400" />
                    </div>
                </motion.div>
                
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                >
                    {filteredCompanies.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-gray-400 text-lg text-center p-8 rounded-xl bg-white/5 backdrop-blur-sm col-span-full"
                        >
                            {searchTerm ? 
                                `No companies found matching "${searchTerm}"` : 
                                "No companies available"
                            }
                        </motion.div>
                    ) : (
                        filteredCompanies.map((company) => (
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
                                    className="relative flex items-center justify-between p-4 md:p-6 rounded-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] hover:bg-[#1e293b]/80 transition-all duration-300 shadow-2xl border border-white/5"
                                >
                                    <div className="flex items-center gap-3 md:gap-5">
                                        <motion.div 
                                            className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20"
                                            whileHover={{ rotate: 15 }}
                                        >
                                            <FaBuilding className="h-5 w-5 md:h-7 md:w-7 text-cyan-400" />
                                        </motion.div>
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                                                {company.name}
                                            </h3>
                                            <p className="text-xs md:text-sm text-cyan-100/70 mt-1">
                                                {
                                                    allInterviews.filter(interview => interview.company === company.name).length
                                                } interview experiences
                                            </p>
                                        </div>
                                    </div>
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="p-1 md:p-2 rounded-full bg-cyan-500/10"
                                    >
                                        <FaChevronRight className="h-4 w-4 md:h-5 md:w-5 text-cyan-400" />
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