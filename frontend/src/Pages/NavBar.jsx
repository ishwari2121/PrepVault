import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBuilding, FaBookOpen, FaRobot } from 'react-icons/fa';
// import '../assets/css_files/Navbar.css'
const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-[5%] py-4 shadow-lg backdrop-blur-sm">
            <div className="logo-container animate-fadeInLeft">
                <NavLink to="/">
                    <h2 className="bg-gradient-to-r from-[#e11d48] to-[#6366f1] bg-clip-text text-2xl font-bold text-transparent shadow-md transition-all duration-500 hover:bg-gradient-to-l hover:scale-105 max-md:text-xl">
                        PrepVault
                    </h2>
                </NavLink>
            </div>

            <div className="nav-links ml-8 flex gap-10 max-md:ml-4 max-md:gap-6">
                <NavLink 
                    to="/companies" 
                    className="group relative flex items-center gap-2 rounded-lg px-4 py-3 text-[#f8fafc] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 aria-[current=page]:bg-indigo-500/10 aria-[current=page]:text-indigo-400"
                    data-tooltip="Explore company-specific questions"
                >
                    <FaBuilding className="h-5 w-5 text-indigo-500 transition-transform duration-300 group-hover:scale-110 group-hover:text-indigo-400" />
                    <span className="max-md:hidden relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all after:duration-300 group-hover:after:w-full">
                        Companies
                    </span>
                </NavLink>

                <NavLink 
                    to="/stories" 
                    className="group relative flex items-center gap-2 rounded-lg px-4 py-3 text-[#f8fafc] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 aria-[current=page]:bg-indigo-500/10 aria-[current=page]:text-indigo-400"
                    data-tooltip="Read interview experiences from professionals"
                >
                    <FaBookOpen className="h-5 w-5 text-indigo-500 transition-transform duration-300 group-hover:scale-110 group-hover:text-indigo-400" />
                    <span className="max-md:hidden relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all after:duration-300 group-hover:after:w-full">
                        Stories
                    </span>
                </NavLink>

                <NavLink 
                    to="/LLM" 
                    className="group relative flex items-center gap-2 rounded-lg px-4 py-3 text-[#f8fafc] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 aria-[current=page]:bg-indigo-500/10 aria-[current=page]:text-indigo-400"
                    data-tooltip="AI-powered interview preparation assistant"
                >
                    <FaRobot className="h-5 w-5 text-indigo-500 transition-transform duration-300 group-hover:scale-110 group-hover:text-indigo-400" />
                    <span className="max-md:hidden relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all after:duration-300 group-hover:after:w-full">
                        LLM Assistant
                    </span>
                </NavLink>
            </div>

            <div className="auth-buttons flex gap-5 animate-fadeInRight">
                <button 
                    onClick={() => navigate("/login")}
                    className="relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-8 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
                >
                    <span className="relative z-10">Sign In</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
                </button>
                <button 
                    onClick={() => navigate("/signup")}
                    className="relative overflow-hidden rounded-lg border-2 border-indigo-500 px-8 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-indigo-500/10 hover:shadow-indigo-500/30 active:scale-95"
                >
                    <span className="relative z-10">Sign Up</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

