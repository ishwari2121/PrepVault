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
  const [view, setView] = useState(null); // "eligibility" or "recruitment"
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/companies/${companyName}`)
      .then((response) => {
        setCompany(response.data);
        console.log("Company Data:", response.data); // Debugging
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Company Name */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent mb-8">
          {company.name}
        </h1>

        {/* Buttons to choose what to view */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex gap-4 mb-8"
        >
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              view === "recruitment"
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-700 hover:bg-gray-600"
            } text-white font-semibold`}
            onClick={() => setView("recruitment")}
          >
            View Recruitment Process
          </motion.button>
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              view === "eligibility"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-700 hover:bg-gray-600"
            } text-white font-semibold`}
            onClick={() => setView("eligibility")}
          >
            View Eligibility Criteria
          </motion.button>
        </motion.div>

        {/* Recruitment Process */}
        <AnimatePresence>
          {view === "recruitment" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 p-6 bg-white/5 backdrop-blur-sm rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">
                Recruitment Journey
                <span className="ml-2 text-indigo-400">🚀</span>
              </h2>

              <div className="relative">
                <div className="absolute left-6 top-0 h-full w-1 bg-gradient-to-b from-indigo-500/30 to-blue-500/30 rounded-full" />

                <motion.div
                  className="space-y-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {company.recruitmentProcess &&
                    company.recruitmentProcess
                      .split("\n")
                      .filter((line) => line.trim() !== "")
                      .map((line, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="flex items-start gap-6 pl-16 relative group"
                        >
                          <div className="absolute left-6 top-4 w-4 h-4 rounded-full bg-indigo-400 ring-4 ring-indigo-400/20 transition-all group-hover:ring-8 group-hover:bg-indigo-300" />

                          {/* Content Card */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="w-full p-6 bg-gradient-to-br from-gray-800/70 to-indigo-900/20 rounded-xl border border-indigo-500/20 shadow-lg"
                          >
                            <div className="flex items-start gap-4">
                              {/* Icon */}
                              <div className="p-3 bg-indigo-500/10 rounded-lg">
                                {line.includes("http") ? (
                                  <FaLink className="text-xl text-indigo-400" />
                                ) : (
                                  <FaFileAlt className="text-xl text-indigo-400" />
                                )}
                              </div>

 {/* Show recruitment process */}
{view === "recruitment" && company.recruitmentProcess && (
    <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <h2 className="text-2xl font-semibold">Recruitment Process</h2>

        {Object.entries(company.recruitmentProcess).map(([key, value]) =>
            value && key !== "sampleQuestions" ? ( // Exclude sampleQuestions from normal rendering
                <div key={key} className="mt-3">
                    <h3 className="text-xl font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()} {/* Format key names */}
                    </h3>
                    <p className="mt-1 text-lg">
                        {value.split("\n").map((line, index) => (
                            <span key={index}>
                              {/* Content */}
                              <div className="flex-1">
                                {line.includes("http") ? (
                                  <a
                                    href={line}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors"
                                  >
                                    <span className="text-lg font-medium">
                                      Application Link
                                    </span>
                                    <FaExternalLinkAlt className="text-sm" />
                                  </a>
                                ) : (
                                    line
                                )}
                                <br />
                            </span>
                        ))}
                    </p>
                </div>
            ) : null
        )}

        {/* Handle sampleQuestions separately */}
        {company.recruitmentProcess.sampleQuestions?.length > 0 && (
            <div className="mt-3">
                <h3 className="text-xl font-medium">Sample Questions</h3>
                <ul className="list-disc pl-5 text-lg">
                    {company.recruitmentProcess.sampleQuestions.map((question, index) => (
                        <li key={index} className="mt-1">{question}</li>
                    ))}
                </ul>
            </div>
        )}
    </div>
)}

                                  <motion.p
                                    className="text-gray-100 text-lg font-medium"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                  >
                                    {line}
                                  </motion.p>
                                )}

                                {/* Step Number */}
                                <div className="mt-3 text-sm text-indigo-400/80">
                                  Step {index + 1}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Eligibility Criteria */}
        <AnimatePresence>
          {view === "eligibility" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 p-6 bg-white/5 backdrop-blur-sm rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">
                Eligibility Criteria
                <span className="ml-2 text-indigo-400">✨</span>
              </h2>

              {/* Year Selection */}
              <motion.div
                className="relative mb-8"
                whileHover={{ scale: 1.02 }}
              >
                <select
                  className="w-full p-4 bg-gray-800/70 text-gray-100 rounded-xl border-2 border-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-lg appearance-none"
                  onChange={(e) => setSelectedYear(e.target.value)}
                  value={selectedYear || ""}
                >
                  <option value="">Select Academic Year</option>
                  {company.eligibilityCriteria.map((criteria, index) => (
                    <option key={index} value={criteria.year}>
                      {criteria.year} Batch
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400" />
              </motion.div>

              {/* Eligibility Details */}
              {selectedYear && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="grid gap-6 md:grid-cols-2"
                >
                  {company.eligibilityCriteria
                    .filter((criteria) => criteria.year === Number(selectedYear))
                    .map((criteria, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-gradient-to-br from-gray-800/70 to-indigo-900/20 rounded-2xl border border-indigo-500/20 shadow-xl"
                      >
                        <div className="flex flex-col gap-6">
                          {/* Header */}
                          <div className="flex items-center gap-4 pb-4 border-b border-indigo-500/20">
                            <div className="p-3 bg-indigo-500/10 rounded-xl">
                              <FaGraduationCap className="text-2xl text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                              {criteria.year} Batch Requirements
                            </h3>
                          </div>

                          {/* Details Grid */}
                          <div className="grid gap-4">
                            <motion.div
                              className="flex items-center gap-4 p-3 bg-gray-800/40 rounded-lg"
                              whileHover={{ x: 5 }}
                            >
                              <FaBook className="text-indigo-400 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-gray-400">Degree</p>
                                <p className="text-lg font-semibold text-gray-100">
                                  {criteria.degree}
                                </p>
                              </div>
                            </motion.div>

                            <motion.div
                              className="flex items-center gap-4 p-3 bg-gray-800/40 rounded-lg"
                              whileHover={{ x: 5 }}
                            >
                              <FaClipboardCheck className="text-indigo-400 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-gray-400">Eligibility</p>
                                <p className="text-lg font-semibold text-gray-100">
                                  {criteria.eligibility}
                                </p>
                              </div>
                            </motion.div>

                            <motion.div
                              className="flex items-center gap-4 p-3 bg-gray-800/40 rounded-lg"
                              whileHover={{ x: 5 }}
                            >
                              <FaStar className="text-indigo-400 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-gray-400">CGPA</p>
                                <p className="text-lg font-semibold text-gray-100">
                                  {criteria.cgpa}
                                </p>
                              </div>
                            </motion.div>

                            <motion.div
                              className="flex items-center gap-4 p-3 bg-gray-800/40 rounded-lg"
                              whileHover={{ x: 5 }}
                            >
                              <FaUserGraduate className="text-indigo-400 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-gray-400">Experience</p>
                                <p className="text-lg font-semibold text-gray-100">
                                  {criteria.experience}
                                </p>
                              </div>
                            </motion.div>

                            <motion.div
                              className="flex items-center gap-4 p-3 bg-gray-800/40 rounded-lg"
                              whileHover={{ x: 5 }}
                            >
                              <FaBriefcase className="text-indigo-400 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-gray-400">Role</p>
                                <p className="text-lg font-semibold text-gray-100">
                                  {criteria.role}
                                </p>
                              </div>
                            </motion.div>

                            <motion.div
                              className="flex items-center gap-4 p-3 bg-gray-800/40 rounded-lg"
                              whileHover={{ x: 5 }}
                            >
                              <FaMoneyBillAlt className="text-indigo-400 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-gray-400">CTC</p>
                                <p className="text-lg font-semibold text-gray-100">
                                  {criteria.CTC}
                                </p>
                              </div>
                            </motion.div>
                          </div>

                          {/* Skills */}
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-indigo-400 mb-3">
                              Key Skills Required
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {criteria.skillsRequired.map((skill, i) => (
                                <motion.span
                                  key={i}
                                  initial={{ scale: 0.8 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: i * 0.05 }}
                                  className="px-3 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-full text-sm hover:bg-indigo-500/20 transition-colors"
                                >
                                  {skill}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CompanyDetails;