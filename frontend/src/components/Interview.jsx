import { useState,useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const InterviewExperienceForm = () => {
    const { user } = useContext(AuthContext); 
    const [formData, setFormData] = useState({
        companyName: "",
        position: "",
        answers: {
            q1: "",
            q2: "",
            q3: ""
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("answers.")) {
            const answerKey = name.split(".")[1];
            setFormData((prevData) => ({
                ...prevData,
                answers: {
                    ...prevData.answers,
                    [answerKey]: value
                }
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        console.log(user);
        console.log("Axios Authorization Header:", axios.defaults.headers.common['Authorization']);
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/interviewExp/submit-experience", 
            formData, 
            {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user"))?.token}` }
            });
    
            alert(response.data.message);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to submit experience.";
            alert(errorMessage);
        }
    }

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-2xl">
            <h1 className="text-2xl font-bold mb-4">Submit Your Interview Experience</h1>
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                    Company Name
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </label>

                <label className="block mb-2">
                    Position
                    <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </label>

                <label className="block mb-2">
                    How many rounds were there?
                    <input
                        type="text"
                        name="answers.q1"
                        value={formData.answers.q1}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </label>

                <label className="block mb-2">
                    Give experience of all rounds
                    <textarea
                        name="answers.q2"
                        value={formData.answers.q2}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </label>

                <label className="block mb-4">
                    Did you get selected or not?
                    <select
                        name="answers.q3"
                        value={formData.answers.q3}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </label>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default InterviewExperienceForm;
