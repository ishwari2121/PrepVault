import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import InterviewExperienceForm from "../Components/Interview";
import { AuthContext } from "../Context/AuthContext";

const ProtectedPage = () => {
    const { user } = useContext(AuthContext); // Get user from context
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="text-center p-6">
                <p className="text-gray-600 text-lg">You need to log in to give your experience.</p>
                <button 
                    onClick={() => navigate("/signin")} 
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Go to Login
                </button>
                <br />
                <button 
                    onClick={() => navigate(-1)}  // 🔥 Allows going back instead of forcing login!
                    className="mt-2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return <InterviewExperienceForm />;
};

export default ProtectedPage;
