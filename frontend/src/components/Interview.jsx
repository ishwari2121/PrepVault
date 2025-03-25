import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const InterviewExperienceForm = () => {
    const { user } = useContext(AuthContext); 
    const [formData, setFormData] = useState({
        year: 2025,
        branch: "IT",
        company: "Bloomberg",
        type: "Placement", // Default type
        totalRounds: 1,
        rounds: [{ roundNumber: 1, experience: "" }],
        additionalTips: ""
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const years = Array.from({ length: 2028 - 2010 + 1 }, (_, i) => 2010 + i);
    const branches = ["CE", "IT", "EnTC", "AIDS", "ECE"];
    const companies = ["Pubmatic", "Bloomberg", "Barclays", "HSBC", "NICE"];
    const types = ["Placement", "Internship"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleRoundChange = (index, value) => {
        setFormData(prevData => {
            const updatedRounds = [...prevData.rounds];
            updatedRounds[index].experience = value;
            return { ...prevData, rounds: updatedRounds };
        });
    };

    const handleTotalRoundsChange = (e) => {
        let total = parseInt(e.target.value) || 1;
        total = Math.max(1, Math.min(total, 10)); 
        setFormData(prevData => ({
            ...prevData,
            totalRounds: total,
            rounds: Array.from({ length: total }, (_, i) => ({
                roundNumber: i + 1,
                experience: prevData.rounds[i]?.experience || ""
            }))
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = JSON.parse(localStorage.getItem("user"))?.token;
            if (!token) {
                alert("User is not authenticated.");
                return;
            }

            await axios.post(
                "http://localhost:5000/api/interviewExp/submit-experience",
                { ...formData, createdBy: user.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setIsSubmitted(true);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit experience.");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-2xl">
            <h1 className="text-2xl font-bold mb-4">Submit Your Interview Experience</h1>

            {isSubmitted ? (
                <div className="text-green-600 font-bold text-lg p-4 bg-green-100 rounded-lg">
                    ✅ Submitted Successfully!
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2">
                        Select Year
                        <select name="year" value={formData.year} onChange={handleChange} className="w-full p-2 border rounded" required>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </label>

                    <label className="block mb-2">
                        Select Branch
                        <select name="branch" value={formData.branch} onChange={handleChange} className="w-full p-2 border rounded" required>
                            {branches.map((branch) => (
                                <option key={branch} value={branch}>{branch}</option>
                            ))}
                        </select>
                    </label>

                    <label className="block mb-2">
                        Select Company
                        <select name="company" value={formData.company} onChange={handleChange} className="w-full p-2 border rounded" required>
                            {companies.map((company) => (
                                <option key={company} value={company}>{company}</option>
                            ))}
                        </select>
                    </label>

                    {/* Placement or Internship */}
                    <label className="block mb-2">
                        Type (Placement/Internship)
                        <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded" required>
                            {types.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </label>

                    <label className="block mb-2">
                        How many rounds in total?
                        <input type="number" name="totalRounds" value={formData.totalRounds} onChange={handleTotalRoundsChange} className="w-full p-2 border rounded" min="1" max="10" required />
                    </label>

                    {formData.rounds.map((round, index) => (
                        <label key={index} className="block mb-2">
                            Round {round.roundNumber} Experience
                            <textarea value={round.experience} onChange={(e) => handleRoundChange(index, e.target.value)} className="w-full p-2 border rounded" required />
                        </label>
                    ))}

                    <label className="block mb-4">
                        Sample Questions, Links, and Additional Tips
                        <textarea name="additionalTips" value={formData.additionalTips} onChange={handleChange} className="w-full p-2 border rounded" />
                    </label>

                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Submit</button>
                </form>
            )}
        </div>
    );
};

export default InterviewExperienceForm;
