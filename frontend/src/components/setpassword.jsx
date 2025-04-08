import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [googleUser, setGoogleUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('googleUser');
    if (userData) {
      setGoogleUser(JSON.parse(userData));
    } else {
      navigate('/'); // If no data, redirect
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        username: googleUser.name,
        email: googleUser.email,
        password,
      });
      localStorage.removeItem('googleUser');
      navigate('/login');
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 shadow-lg border rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center text-green-600">
        Email verified via Google. Please set a password to continue.
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Complete Signup
        </button>
      </form>
    </div>
  );
}
