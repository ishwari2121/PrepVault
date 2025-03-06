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
        <div className="flex gap-4 mb-8">
          <button
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              view === "recruitment"
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-700 hover:bg-gray-600"
            } text-white font-semibold`}
            onClick={() => setView("recruitment")}
          >
            View Recruitment Process
          </button>
          <button
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              view === "eligibility"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-700 hover:bg-gray-600"
            } text-white font-semibold`}
            onClick={() => setView("eligibility")}
          >
            View Eligibility Criteria
          </button>
        </div>

        {/* Recruitment Process */}
        {view === "recruitment" && company.recruitmentProcess && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h2 className="text-2xl font-semibold">Recruitment Process</h2>

            {Object.entries(company.recruitmentProcess).map(([key, value]) =>
              value && key !== "sampleQuestions" ? (
                <div key={key} className="mt-3">
                  <h3 className="text-xl font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </h3>
                  <p className="mt-1 text-lg">
                    {value.split("\n").map((line, index) => (
                      <span key={index}>
                        {line.includes("http") ? (
                          <a
                            href={line}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            {line}
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

        {/* Eligibility Criteria */}
        {view === "eligibility" && (
          <div className="mt-6 p-6 bg-white/5 backdrop-blur-sm rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-100 mb-6">
              Eligibility Criteria
            </h2>

            {/* Year Selection */}
            <div className="relative mb-8">
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
            </div>

            {/* Eligibility Details */}
            {selectedYear && (
              <div className="grid gap-6 md:grid-cols-2">
                {company.eligibilityCriteria
                  .filter((criteria) => criteria.year === Number(selectedYear))
                  .map((criteria, index) => (
                    <div
                      key={index}
                      className="p-6 bg-gradient-to-br from-gray-800/70 to-indigo-900/20 rounded-2xl border border-indigo-500/20 shadow-xl"
                    >
                      <h3 className="text-xl font-bold">{criteria.year} Batch Requirements</h3>

                      <p><strong>Degree:</strong> {criteria.degree}</p>
                      <p><strong>Eligibility:</strong> {criteria.eligibility}</p>
                      <p><strong>CGPA:</strong> {criteria.cgpa}</p>
                      <p><strong>Experience:</strong> {criteria.experience}</p>
                      <p><strong>Role:</strong> {criteria.role}</p>
                      <p><strong>CTC:</strong> {criteria.CTC}</p>

                      <h4 className="text-lg font-semibold mt-3">Skills Required:</h4>
                      <ul className="list-disc pl-5">
                        {criteria.skillsRequired.map((skill, i) => (
                          <li key={i}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CompanyDetails;
