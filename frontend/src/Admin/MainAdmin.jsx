import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MainAdmin = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [entryName, setEntryName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Hard-coded credentials
  const adminCredentials = {
    entryName: 'admin',
    password: 'password123'
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (entryName === adminCredentials.entryName && password === adminCredentials.password) {
      setLoggedIn(true);
    } else {
      setError('Invalid credentials. Redirecting to home...');
      setTimeout(() => navigate('/'), 2000);
    }
  };

  // Define your dashboard buttons as an array for easy expansion.
  const adminButtons = [
    {
      label: 'Add Company',
      onClick: () => navigate('/addcompany'),
      className: 'bg-gradient-to-r from-blue-500 to-blue-700'
    },
    {
      label: 'Add MCQ',
      onClick: () => navigate('/addmcqs'),
      className: 'bg-gradient-to-r from-green-500 to-green-700'
    }
    // Add more buttons here as needed.
  ];

  // Not logged in: show the login form with a modern design and subtle animations.
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Login</h1>
          <form onSubmit={handleLogin} className="flex flex-col">
            <input
              type="text"
              placeholder="Entry Name"
              value={entryName}
              onChange={(e) => setEntryName(e.target.value)}
              className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
            >
              Login
            </button>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  // Logged in: show the dashboard with animated buttons.
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {adminButtons.map((btn, index) => (
          <button
            key={index}
            onClick={btn.onClick}
            className={`${btn.className} text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainAdmin;
