import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaBuilding, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/companies")
            .then(response => setCompanies(response.data))
            .catch(error => console.error("Error fetching companies:", error));
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { 
                type: "spring", 
                stiffness: 120 
            }
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent mb-8">
                    Featured Companies
                </h1>
                
                <motion.ul 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    {companies.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-gray-400 text-lg text-center p-8 rounded-xl bg-white/5 backdrop-blur-sm"
                        >
                            No companies available
                        </motion.div>
                    ) : (
                        companies.map((company, index) => (
                            <motion.li 
                                key={company._id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                className="group"
                            >
                                <Link 
                                    to={`/company/${company.name}`} 
                                    className="flex items-center justify-between p-6 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 shadow-md hover:shadow-xl"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
                                            <FaBuilding className="h-6 w-6 text-indigo-400" />
                                        </div>
                                        <span className="text-xl font-semibold text-gray-100 group-hover:text-indigo-300 transition-colors">
                                            {company.name}
                                        </span>
                                    </div>
                                    <FaChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                                </Link>
                            </motion.li>
                        ))
                    )}
                </motion.ul>
            </motion.div>
        </div>
    );
};

export default CompanyList;