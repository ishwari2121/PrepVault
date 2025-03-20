import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InterviewExperienceForm from "../Components/Interview"; // The form you created

const ProtectedPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) 
        {
            navigate("/login");
        } 
        else 
        {
            setIsAuthenticated(true);
        }
    }, [navigate]);

    return (
        <div>
            {isAuthenticated ? (
                <InterviewExperienceForm />
            ) : (
                <p>Redirecting to login...</p>
            )}
        </div>
    );
};

export default ProtectedPage;
