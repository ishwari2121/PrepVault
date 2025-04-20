import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBuilding, FaBookOpen, FaRobot, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [companies, setCompanies] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const searchRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const {user, setUser, logout} = useContext(AuthContext);

    useEffect(() => {
        axios.get("http://localhost:5000/api/companies")
            .then(response => setCompanies(response.data))
            .catch(error => console.error("Error fetching companies:", error));
    }, []);

    // Filter companies based on the searchQuery
    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsMobileMenuOpen(false);
        }
    };

    const handleCompanyClick = (companyName) => {
        setSearchQuery(companyName);
        setShowDropdown(false);
        navigate(`/company/${companyName}`);
        setIsMobileMenuOpen(false);
    };

    // Handle click outside the search bar to hide the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
                !event.target.classList.contains('hamburger-button')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-[5%] py-4 shadow-lg backdrop-blur-sm relative">
            <div className="flex items-center justify-between w-full md:w-auto">
                <div className="logo-container animate-fadeInLeft">
                    <NavLink to="/">
                        <h2 className="bg-gradient-to-r from-[#e11d48] to-[#6366f1] bg-clip-text text-2xl font-bold text-transparent shadow-md transition-all duration-500 hover:bg-gradient-to-l hover:scale-105 max-md:text-xl">
                            PrepVault
                        </h2>
                    </NavLink>
                </div>

                {/* Mobile menu button - shows below 768px */}
                <button 
                    className="hamburger-button lg:hidden text-white focus:outline-none ml-4"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <FaTimes className="h-6 w-6" />
                    ) : (
                        <FaBars className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile menu - shows below 768px */}
            <div 
                ref={mobileMenuRef}
                className={`absolute top-full left-0 w-full bg-gradient-to-br from-[#0f172a] to-[#1e293b] shadow-lg lg:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}
            >
                <div className="flex flex-col items-center py-4 px-4 space-y-4">
                    <NavLink 
                        to="/companies" 
                        className="transition-all duration-300 relative flex items-center gap-2 rounded-lg px-4 py-3 text-[#f8fafc] hover:-translate-y-0.5 hover:bg-white/10 aria-[current=page]:bg-indigo-500/10 aria-[current=page]:text-indigo-400"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <FaBuilding className="h-5 w-5 text-indigo-500 transition-transform duration-300 hover:scale-110 hover:text-indigo-400" />
                        <span>Companies</span>
                    </NavLink>

                    <NavLink 
                        to="/stories" 
                        className="transition-all duration-300 relative flex items-center gap-2 rounded-lg px-4 py-3 text-[#f8fafc] hover:-translate-y-0.5 hover:bg-white/10 aria-[current=page]:bg-indigo-500/10 aria-[current=page]:text-indigo-400"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <FaBookOpen className="h-5 w-5 text-indigo-500 transition-transform duration-300 hover:scale-110 hover:text-indigo-400" />
                        <span>Stories</span>
                    </NavLink>

                    <NavLink 
                        to="/resumeAnalyzer" 
                        className="transition-all duration-300 relative flex items-center gap-2 rounded-lg px-4 py-3 text-[#f8fafc] hover:-translate-y-0.5 hover:bg-white/10 aria-[current=page]:bg-indigo-500/10 aria-[current=page]:text-indigo-400"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <FaRobot className="h-5 w-5 text-indigo-500 transition-transform duration-300 hover:scale-110 hover:text-indigo-400" />
                        <span>Resume Analyzer</span>
                    </NavLink>

                    <div className="relative w-full max-w-md px-4" ref={searchRef}>
                        <form onSubmit={handleSearch} className="relative group transition-all duration-300">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaSearch className="h-5 w-5 text-gray-400 transition-colors group-hover:text-indigo-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by companies..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                className="w-full h-10 rounded-full bg-white/10 pl-10 pr-4 py-2 text-white placeholder-gray-300 
                                           transition-all duration-300 focus:outline-none 
                                           focus:ring-2 focus:ring-indigo-500"
                            />
                        </form>
                        {showDropdown && searchQuery && filteredCompanies.length > 0 && (
                            <ul className="absolute top-full mt-2 w-full max-h-60 overflow-auto rounded-md bg-gray-800 py-2 shadow-lg">
                                {filteredCompanies.map((company) => (
                                    <li 
                                        key={company.id}
                                        onMouseDown={() => handleCompanyClick(company.name)}
                                        className="cursor-pointer px-4 py-2 text-white hover:bg-indigo-500/20"
                                    >
                                        {company.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop menu - shows above 768px */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-10 relative">
                <div className="nav-links flex gap-4 xl:gap-8">
                    <NavLink 
                        to="/companies" 
                        className="transition-all duration-300 relative flex items-center gap-2 rounded-lg px-3 py-2 xl:px-4 xl:py-3 text-[#f8fafc] hover:-translate-y-0.5 hover:bg-white/10 aria-[current=page]:bg-indigo-500/10 aria-[current=page]:text-indigo-400"
                    >
                        <FaBuilding className="h-5 w-5 text-indigo-500 transition-transform duration-300 hover:scale-110 hover:text-indigo-400" />
                        <span className="relative text-sm xl:text-base after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full">
                            Companies
                        </span>
                    </NavLink>

                    <NavLink 
                        to="/stories" 
                        className="transition-all duration-300 relative flex items-center gap-2 rounded-lg px-3 py-2 xl:px-4 xl:py-3 text-[#f8fafc] hover:-translate-y-0.5 hover:bg-white/10 aria-[current=page]:bg-indigo-500/10 aria-[current=page]:text-indigo-400"
                    >
                        <FaBookOpen className="h-5 w-5 text-indigo-500 transition-transform duration-300 hover:scale-110 hover:text-indigo-400" />
                        <span className="relative text-sm xl:text-base after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full">
                            Stories
                        </span>
                    </NavLink>

                    <NavLink 
                        to="/resumeAnalyzer" 
                        className="transition-all duration-300 relative flex items-center gap-2 rounded-lg px-3 py-2 xl:px-4 xl:py-3 text-[#f8fafc] hover:-translate-y-0.5 hover:bg-white/10 aria-[current=page]:bg-indigo-500/10 aria-[current=page]:text-indigo-400"
                    >
                        <FaRobot className="h-5 w-5 text-indigo-500 transition-transform duration-300 hover:scale-110 hover:text-indigo-400" />
                        <span className="relative text-sm xl:text-base after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all after:duration-300 hover:after:w-full">
                            Resume Analyzer
                        </span>
                    </NavLink>
                </div>

                <div className="relative z-60" ref={searchRef}>
                    <form onSubmit={handleSearch} className="relative group transition-all duration-300">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FaSearch className="h-5 w-5 text-gray-400 transition-colors group-hover:text-indigo-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by company name"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowDropdown(true);
                            }}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            className="w-10 h-10 rounded-full bg-white/10 pl-10 pr-4 py-2 text-white placeholder-gray-300 
                                       transition-all duration-300 group-hover:w-64 xl:group-hover:w-80 2xl:group-hover:w-96 focus:w-64 xl:focus:w-80 2xl:focus:w-96 focus:outline-none 
                                       focus:ring-2 focus:ring-indigo-500"
                        />
                    </form>
                    {showDropdown && searchQuery && filteredCompanies.length > 0 && (
                        <ul className="absolute top-full mt-2 w-full max-h-60 overflow-auto rounded-md bg-gray-800 py-2 shadow-lg">
                            {filteredCompanies.map((company) => (
                                <li 
                                    key={company.id}
                                    onMouseDown={() => handleCompanyClick(company.name)}
                                    className="cursor-pointer px-4 py-2 text-white hover:bg-indigo-500/20"
                                >
                                    {company.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Auth buttons - always visible */}
            <div className="auth-buttons flex gap-3 sm:gap-4 md:gap-5 animate-fadeInRight ml-4">
                {user ? (
                    <>
                        <button 
                            onClick={() => {
                                navigate("/profile");
                                setIsMobileMenuOpen(false);
                            }}
                            className="relative overflow-hidden rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-md"
                        >
                            <span className="text-xs sm:text-sm md:text-base">Profile</span>
                        </button>
                        <button 
                            onClick={() => {
                                setUser(null);
                                logout();
                                setIsMobileMenuOpen(false);
                            }}
                            className="relative overflow-hidden rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 active:scale-95"
                        >
                            <span className="text-xs sm:text-sm md:text-base">Sign Out</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            onClick={() => {
                                navigate("/signin");
                                setIsMobileMenuOpen(false);
                            }}
                            className="relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
                        >
                            <span className="text-xs sm:text-sm md:text-base">Sign In</span>
                        </button>
                        <button 
                            onClick={() => {
                                navigate("/signup");
                                setIsMobileMenuOpen(false);
                            }}
                            className="relative overflow-hidden rounded-lg border-2 border-indigo-500 px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-indigo-500/10 hover:shadow-indigo-500/30 active:scale-95"
                        >
                            <span className="text-xs sm:text-sm md:text-base">Sign Up</span>
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;