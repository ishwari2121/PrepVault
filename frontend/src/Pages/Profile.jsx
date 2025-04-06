import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        if (user && user.id) {
          const res = await axios.get(`http://localhost:5000/api/interviewExp/user/${user.id}`);
          console.log("Fetched interview experiences:", res.data);
          setExperiences(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Error fetching experiences:", err);
        setExperiences([]); // fallback
      }
    };

    fetchExperiences();
  }, [user]);

  if (!user) return <div className="text-white text-center mt-10">Loading profile...</div>;

  const { username, email } = user;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white p-6">
      <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-md shadow-lg mb-6">
        <h1 className="text-3xl font-bold mb-2 text-cyan-400">👤 Profile</h1>
        <p className="text-xl mb-1">Name: {username}</p>
        <p className="text-lg text-gray-300">Email: {email}</p>
      </div>

      <div className="max-w-2xl w-full bg-white/5 border border-white/10 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold text-cyan-300 mb-4">📝 Interview Experiences</h2>
        {experiences.length > 0 ? (
  experiences.map((exp, idx) => (
    <div key={idx} className="mb-4 bg-white/5 p-4 rounded-md border border-white/10">
      <h3 className="text-xl font-bold text-white">{exp.company} ({exp.type})</h3>
      <p className="text-sm text-gray-400 mb-1">Branch: {exp.branch} | Year: {exp.year}</p>
      <p className="text-sm text-gray-400 mb-1">Total Rounds: {exp.totalRounds}</p>


      <p className="text-xs text-gray-500 mt-2">Submitted on: {new Date(exp.date).toLocaleDateString()}</p>
    </div>
  ))
) : (
  <p className="text-gray-400">No experiences found.</p>
)}

      </div>
    </div>
  );
};

export default Profile;
