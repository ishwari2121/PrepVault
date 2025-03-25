import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const InterviewDetail = () => {
    const { id } = useParams();
    const [experience, setExperience] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/interviewExp/experience/${id}`);
                setExperience(response.data);
            } catch (error) {
                console.error("Error fetching interview experience:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperience();
    }, [id]);

    if (loading) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    if (!experience) {
        return <p className="text-center text-gray-500">Interview experience not found.</p>;
    }

    // Format Date & Time
    const formattedDate = new Date(experience.createdAt).toLocaleDateString();
    const formattedTime = new Date(experience.createdAt).toLocaleTimeString();

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
            {/* Company Name, Branch, Year */}
            <h1 className="text-2xl font-bold mb-2">
                {experience.company} - {experience.branch} ({experience.year})
            </h1>

            {/* Shared By */}
            <p className="text-sm text-gray-500">
                Shared by: <strong>{experience.createdBy?.username || "Anonymous"}</strong>
            </p>

            {/* Date & Time */}
            <p className="text-sm text-gray-500">
                Date: <strong>{formattedDate}</strong> | Time: <strong>{formattedTime}</strong>
            </p>

            {/* Placement/Internship Type */}
            <p className="text-gray-700 font-semibold mt-2">
                Type: {experience.type === "Internship" ? "Internship" : "Placement"}
            </p>

            {/* Total Rounds */}
            <p className="mt-2"><strong>Total Rounds:</strong> {experience.totalRounds}</p>

            {/* Rounds Section */}
            {experience.rounds.map((round) => (
                <div key={round.roundNumber} className="mt-2 p-2 bg-gray-100 rounded">
                    <p><strong>Round {round.roundNumber}:</strong> {round.experience}</p>
                </div>
            ))}

            {/* Additional Tips */}
            {experience.additionalTips && (
                <p className="mt-2"><strong>Tips:</strong> {experience.additionalTips}</p>
            )}
        </div>
    );
};

export default InterviewDetail;
