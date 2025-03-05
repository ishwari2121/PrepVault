import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CompanyDetails = () => {
    const { companyName } = useParams();
    const [company, setCompany] = useState(null);
    const [view, setView] = useState(null); // "eligibility" or "recruitment"
    const [selectedYear, setSelectedYear] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/companies/${companyName}`)
            .then(response => setCompany(response.data))
            .catch(error => console.error("Error fetching company details:", error));
    }, [companyName]);

    if (!company) return <p>Loading...</p>;

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold text-blue-600">{company.name}</h1>

            {/* Buttons to choose what to view */}
            <div className="mt-4 flex gap-4">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={() => setView("recruitment")}>
                    View Standard Recruitment Process
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-md"
                    onClick={() => setView("eligibility")}>
                    View all past Eligibility Criterias
                </button>
            </div>

            {/* Show recruitment process */}
                        {view === "recruitment" && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                    <h2 className="text-2xl font-semibold">Recruitment Process</h2>
                    <p className="mt-2 text-lg">
                        {company.recruitmentProcess.split("\n").map((line, index) => (
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
            )}

            {/* Show eligibility criteria with year selection */}
            {view === "eligibility" && (
                <div className="mt-6 p-4 bg-gray-200 rounded-md">
                    <h2 className="text-2xl font-semibold">Eligibility Criteria</h2>

                    {/* Dropdown for year selection */}
                    <select
                        className="mt-2 p-2 border rounded"
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="">Select Year</option>
                        {company.eligibilityCriteria.map((criteria, index) => (
                            <option key={index} value={criteria.year}>
                                {criteria.year}
                            </option>
                        ))}
                    </select>

                    {/* Show eligibility details for the selected year */}
                    {selectedYear && (
                        <div className="mt-4 p-4 bg-white rounded-md">
                            {company.eligibilityCriteria
                                .filter((criteria) => criteria.year === Number(selectedYear))
                                .map((criteria, index) => (
                                    <div key={index}>
                                        <p><strong>Year:</strong> {criteria.year}</p>
                                                <p><strong>Degree:</strong> {criteria.degree}</p>
                                                <p><strong>Eligibility:</strong> {criteria.eligibility}</p>
                                                <p><strong>CGPA:</strong> {criteria.cgpa}</p>
                                                <p><strong>Skills Required:</strong> {criteria.skillsRequired.join(", ")}</p>
                                                <p><strong>Experience:</strong> {criteria.experience}</p>
                                                <p><strong>Role:</strong> {criteria.role}</p>
                                                <p><strong>CTC:</strong> {criteria.CTC}</p>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CompanyDetails;
