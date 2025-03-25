import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SharedInterview = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/interviewExp/all-experiences");
                setExperiences(response.data);
            } catch (error) {
                console.error("Error fetching interview experiences:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Shared Interview Experiences</h1>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : experiences.length === 0 ? (
                <p className="text-center text-gray-500">No interview experiences available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {experiences.map((exp) => (
                        <div 
                            key={exp._id} 
                            className="p-5 border rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition bg-white"
                            onClick={() => navigate(`/interview/${exp._id}`)}
                        >
                            {/* Company Name */}
                            <h2 className="text-xl font-bold text-blue-600">{exp.company}</h2>
                            
                            {/* Year & Branch */}
                            <p className="text-gray-700">{exp.year} • {exp.branch}</p>

                            {/* Placement/Internship */}
                            <p className="text-gray-500 font-medium">
                                {exp.type === "Internship" ? "Internship" : "Placement"}
                            </p>

                            {/* Shared By */}
                            <p className="text-sm text-gray-500 mt-2">
                                Shared by: <strong>{exp.createdBy?.username || "Anonymous"}</strong>
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SharedInterview;
