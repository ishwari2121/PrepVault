import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <button
        onClick={() => navigate('/addcompany')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow mb-4 transition duration-200"
      >
        Add Company
      </button>

      <button
        onClick={() => navigate('/addmcqs')}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl shadow transition duration-200"
      >
        Add MCQ
      </button>
    </div>
  );
};

export default MainAdmin;
