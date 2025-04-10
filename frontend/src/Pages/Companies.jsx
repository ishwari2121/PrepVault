import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaBuilding, FaChevronRight, FaSearch, FaInfoCircle, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [allInterviews, setAllInterviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [suggestedCompany, setSuggestedCompany] = useState("");
    const [suggestionStatus, setSuggestionStatus] = useState({
        loading: false,
        message: "",
        error: false
    });

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const [companiesRes, interviewsRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/companies"),
                    axios.get("http://localhost:5000/api/interviewExp/all-experiences")
                ]);

                const sortedCompanies = companiesRes.data.sort((a, b) => 
                    a.name.localeCompare(b.name)
                );
                setCompanies(sortedCompanies);
                setFilteredCompanies(sortedCompanies);
                setAllInterviews(interviewsRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleSuggestCompany = async () => {
        if (!suggestedCompany.trim()) {
            setSuggestionStatus({
                loading: false,
                message: "Please enter a company name",
                error: true
            });
            return;
        }

        // Check if company already exists in the local state
        const companyExists = companies.some(company => 
            company.name.toLowerCase() === suggestedCompany.trim().toLowerCase()
        );

        if (companyExists) {
            setSuggestionStatus({
                loading: false,
                message: "This company already exists in our database",
                error: true
            });
            return;
        }

        try {
            setSuggestionStatus({
                loading: true,
                message: "",
                error: false
            });

            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                setSuggestionStatus({
                    loading: false,
                    message: "You need to be logged in to suggest a company",
                    error: true
                });
                return;
            }

            const response = await axios.post("http://localhost:5000/api/suggetion/suggest-company", {
                username: user.username,
                company: suggestedCompany.trim()
            });

            setSuggestionStatus({
                loading: false,
                message: response.data.message || "Company suggestion submitted successfully!",
                error: false
            });

            setSuggestedCompany("");
            
            if (!response.data.message.includes("Already Suggested")) {
                setTimeout(() => {
                    setIsModalOpen(false);
                    setSuggestionStatus({
                        loading: false,
                        message: "",
                        error: false
                    });
                }, 2000);
            }
        } catch (error) {
            console.error("Error suggesting company:", error);
            setSuggestionStatus({
                loading: false,
                message: error.response?.data?.message || "Failed to submit suggestion",
                error: true
            });
        }
    };

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
        <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
            {/* Custom Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md rounded-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 shadow-2xl border border-white/10"
                        >
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSuggestionStatus({
                                        loading: false,
                                        message: "",
                                        error: false
                                    });
                                }}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <FaTimes />
                            </button>

                            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                                Suggest a Company
                            </h2>
                            <p className="text-cyan-100/80 mb-6">
                                Help us grow our database by suggesting a company
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="company-name" className="block text-sm font-medium text-cyan-100 mb-1">
                                        Company Name
                                    </label>
                                    <input
                                        id="company-name"
                                        type="text"
                                        placeholder="Enter company name"
                                        className="w-full px-4 py-3 rounded-lg bg-[#1e293b]/80 border border-white/10 focus:border-cyan-400/50 focus:outline-none text-white placeholder-gray-400 transition-all"
                                        value={suggestedCompany}
                                        onChange={(e) => setSuggestedCompany(e.target.value)}
                                        disabled={suggestionStatus.loading}
                                    />
                                </div>

                                {suggestionStatus.message && (
                                    <div className={`p-3 rounded-lg ${suggestionStatus.error ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                        {suggestionStatus.message}
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setSuggestionStatus({
                                                loading: false,
                                                message: "",
                                                error: false
                                            });
                                        }}
                                        className="px-4 py-2 rounded-lg bg-gray-600/50 text-white hover:bg-gray-500/50 transition-colors"
                                        disabled={suggestionStatus.loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSuggestCompany}
                                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center gap-2"
                                        disabled={suggestionStatus.loading}
                                    >
                                        {suggestionStatus.loading ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit Suggestion"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header Section */}
                <div className="relative z-10">
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 md:mb-8 text-center"
                    >
                        Discover Top Companies
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-center text-cyan-100/80 mb-8 max-w-2xl mx-auto"
                    >
                        Explore interview experiences, company insights, and preparation tips
                    </motion.p>
                </div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="mb-8 max-w-2xl mx-auto relative z-10"
                >
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search companies..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#1e293b]/80 border border-white/10 focus:border-cyan-400/50 focus:outline-none text-white placeholder-gray-400 transition-all shadow-lg backdrop-blur-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400" />
                    </div>

                    {/* Alphabetical Sorting Notification */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex items-center justify-center mt-4 text-cyan-300/80 text-sm"
                    >
                        <FaInfoCircle className="mr-2" />
                        <span>Companies are sorted alphabetically for easy navigation</span>
                    </motion.div>
                </motion.div>
                
                {/* Company Cards Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 relative z-10"
                    >
                        {filteredCompanies.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-gray-400 text-lg text-center p-8 rounded-xl bg-white/5 backdrop-blur-sm col-span-full border border-white/10 shadow-lg"
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
                                        scale: 1.02,
                                        boxShadow: "0 10px 30px -10px rgba(8, 145, 178, 0.5)"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative"
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/40 to-blue-600/40 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                                    <Link 
                                        to={`/company/${company.name}`} 
                                        className="relative flex flex-col h-full p-5 rounded-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] hover:bg-[#1e293b]/80 transition-all duration-300 shadow-xl border border-white/10 overflow-hidden"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <motion.div 
                                                className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm"
                                                whileHover={{ rotate: 15 }}
                                            >
                                                <FaBuilding className="h-6 w-6 text-cyan-400" />
                                            </motion.div>
                                            <div>
                                            <h3 className="text-xl font-bold text-blue-400">
                                                {company.name}
                                            </h3>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400">
                                                    {allInterviews.filter(interview => interview.company === company.name).length} 
                                                    {allInterviews.filter(interview => interview.company === company.name).length === 1 ? 
                                                        " experience" : " experiences"}
                                                </span>
                                            </div>
                                            <motion.div
                                                whileHover={{ x: 5 }}
                                                className="text-cyan-400 flex items-center"
                                            >
                                                <span className="text-xs mr-2">Explore</span>
                                                <FaChevronRight className="h-3 w-3" />
                                            </motion.div>
                                        </div>

                                        {/* Animated hover effect */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            <motion.div
                                                initial={{ x: "-100%", opacity: 0 }}
                                                whileHover={{ x: "100%", opacity: 0.1 }}
                                                transition={{ duration: 0.8 }}
                                                className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                                            />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                )}

                {/* Floating CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-12 text-center"
                >
                    <p className="text-cyan-100/70 mb-4">Can't find your company?</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                    >
                        Suggest a Company
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default CompanyList;