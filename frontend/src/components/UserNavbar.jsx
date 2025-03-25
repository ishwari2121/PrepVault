import React, { useState,useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBuilding, FaBookOpen, FaRobot, FaSearch } from 'react-icons/fa';
import { AuthContext } from '../Context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext); 
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Assuming the user is logged in
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSignOut = () => {
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-[5%] py-4 shadow-lg backdrop-blur-sm relative">
            <div className="logo-container animate-fadeInLeft">
                <NavLink to="/">
                    <h2 className="bg-gradient-to-r from-[#e11d48] to-[#6366f1] bg-clip-text text-2xl font-bold text-transparent shadow-md transition-all duration-500 hover:bg-gradient-to-l hover:scale-105 max-md:text-xl">
                        PrepVault
                    </h2>
                </NavLink>
            </div>

            <div className="flex items-center gap-10 relative">
                <div className="nav-links flex gap-10 max-md:gap-6">
                    <NavLink 
                        to="/companies" 
                        className="transition-all duration-300 relative flex items-center gap-2 rounded-lg px-4 py-3 text-[#f8fafc] hover:-translate-y-0.5 hover:bg-white/10 aria-[current=page]:bg-indigo-500/10 aria-[current=page]:text-indigo-400"
                    >
                        <FaBuilding className="h-5 w-5 text-indigo-500 transition-transform duration-300 hover:scale-110 hover:text-indigo-400" />
                        <span className="max-md:hidden relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full">
                            Companies
                        </span>
                    </NavLink>

                    <NavLink 
                        to="/interviews" 
                        className="transition-all duration-300 relative flex items-center gap-2 rounded-lg px-4 py-3 text-[#f8fafc] hover:-translate-y-0.5 hover:bg-white/10 aria-[current=page]:bg-indigo-500/10 aria-[current=page]:text-indigo-400"
                    >
                        <FaBookOpen className="h-5 w-5 text-indigo-500 transition-transform duration-300 hover:scale-110 hover:text-indigo-400" />
                        <span className="max-md:hidden relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full">
                            Stories
                        </span>
                    </NavLink>

                    <NavLink 
                        to="/LLM" 
                        className="transition-all duration-300 relative flex items-center gap-2 rounded-lg px-4 py-3 text-[#f8fafc] hover:-translate-y-0.5 hover:bg-white/10 aria-[current=page]:bg-indigo-500/10 aria-[current=page]:text-indigo-400"
                    >
                        <FaRobot className="h-5 w-5 text-indigo-500 transition-transform duration-300 hover:scale-110 hover:text-indigo-400" />
                        <span className="max-md:hidden relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full">
                            LLM Assistant
                        </span>
                    </NavLink>
                </div>
                <div className="relative z-60">
                    <form 
                        onSubmit={handleSearch}
                        className="relative group transition-all duration-300"
                    >
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FaSearch className="h-5 w-5 text-gray-400 transition-colors group-hover:text-indigo-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search questions, companies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-10 h-10 rounded-full bg-white/10 pl-10 pr-4 py-2 text-white placeholder-gray-300 
                                       transition-all duration-300 group-hover:w-96 focus:w-96 focus:outline-none 
                                       focus:ring-2 focus:ring-indigo-500"
                        />
                    </form>
                </div>
            </div>
            <div className="auth-buttons flex gap-5 animate-fadeInRight">
            {user ? (
                        <>
                            <button 
                                onClick={() => navigate("/profile")}
                                className="relative overflow-hidden rounded-lg px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-md"
                            >
                                Profile
                            </button>
                            <button 
                                onClick={handleLogout}
                                className="relative overflow-hidden rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 active:scale-95"
                            >
                                Sign Out
                            </button>
                        </>
                            ) : null}
            </div>
        </nav>
    );
};

export default Navbar;