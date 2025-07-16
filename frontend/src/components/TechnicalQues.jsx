import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TechnicalQues = () => {
    const [allMcq, setAllMcq] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [filteredMcqs, setFilteredMcqs] = useState([]);
    const [displayedMcqs, setDisplayedMcqs] = useState([]);
    const [answeredQuestions, setAnsweredQuestions] = useState({});
    const [showExplanationForm, setShowExplanationForm] = useState(null);
    const [userExplanation, setUserExplanation] = useState('');
    const [user, setUser] = useState("");
    const [selectedOptions, setSelectedOptions] = useState({});
    const [showUserExplanations, setShowUserExplanations] = useState({});
    const [submissionStatus, setSubmissionStatus] = useState({ 
        loading: false, 
        error: null, 
        success: false 
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [manualPageInput, setManualPageInput] = useState('');
    const navigate = useNavigate();

    const languageSubtypes = {
        'C++': ['OOP', 'Objects', 'Reference', 'Functions','Pointers'],
        'Java': [
            'Declarations and Language Fundamental',
            'Operator and Assignment',
            'Flow Control',
            'Exceptions',
            'Object',
            'Collection',
            'Inner Classes',
            'Threads',
            'Garbage Collection',
            'Assertion'
        ]
    };

    const QUESTIONS_PER_PAGE = 5;

    const fetchAllMcq = async () => {
        try {
            const response = await axios.get("${import.meta.env.VITE_API_BASE_URL}/MCQ");
            setAllMcq(response.data);
        } catch (error) {
            console.error("Error fetching MCQs:", error);
        }
    };

    // Load initial state from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const savedState = localStorage.getItem("technicalQuesState");

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser.username);
            axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
        }

        if (savedState) {
            try {
                const { 
                    selectedLanguage: savedLang, 
                    selectedType: savedType,
                    currentPage: savedPage 
                } = JSON.parse(savedState);
                setSelectedLanguage(savedLang);
                setSelectedType(savedType);
                setCurrentPage(savedPage || 1);
            } catch (error) {
                console.error("Error parsing saved state:", error);
            }
        }

        fetchAllMcq();
    }, []);

    // Save state to localStorage
    useEffect(() => {
        localStorage.setItem(
            "technicalQuesState",
            JSON.stringify({ selectedLanguage, selectedType, currentPage })
        );
    }, [selectedLanguage, selectedType, currentPage]);

    // Filter MCQs when selections or data changes
    useEffect(() => {
        if (selectedLanguage && selectedType) {
            let filtered = allMcq.filter(mcq => 
                mcq.language === selectedLanguage && 
                mcq.type === selectedType
            );
            
            // Apply search filter if search term exists
            if (searchTerm) {
                const searchTermLower = searchTerm.toLowerCase().trim();
                filtered = filtered.filter(mcq => {
                    // Search in question
                    if (mcq.question.toLowerCase().includes(searchTermLower)) return true;
                    
                    // Search in options
                    if (mcq.options.some(opt => opt.toLowerCase().includes(searchTermLower))) return true;
                    
                    // Search in default explanation
                    if (mcq.defaultExplanation && mcq.defaultExplanation.toLowerCase().includes(searchTermLower)) return true;
                    
                    return false;
                });
            }
            
            setFilteredMcqs(filtered);
            const newTotalPages = Math.ceil(filtered.length / QUESTIONS_PER_PAGE);
            setTotalPages(newTotalPages);
            
            // Ensure current page doesn't exceed new total pages
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            } else if (newTotalPages === 0) {
                setCurrentPage(1);
            }
        }
    }, [allMcq, selectedLanguage, selectedType, searchTerm]);

    // Update displayed questions when page or filtered questions change
    useEffect(() => {
        const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
        const endIndex = startIndex + QUESTIONS_PER_PAGE;
        setDisplayedMcqs(filteredMcqs.slice(startIndex, endIndex));
    }, [currentPage, filteredMcqs]);

    const handleTypeSelect = (type) => {
        setSelectedType(type);
        setSearchTerm('');
    };

    const handleAnswerSelect = (mcqId, selectedIndex, correctIndex) => {
        setSelectedOptions(prev => ({
            ...prev,
            [mcqId]: selectedIndex
        }));
        
        if (selectedIndex === correctIndex) {
            setAnsweredQuestions(prev => ({
                ...prev,
                [mcqId]: true
            }));
        }
    };

    const handleShareClick = (mcqId) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if(!user) {
            navigate("/signin/commonQuestion?category=technical");
        }
        setShowExplanationForm(prev => prev === mcqId ? null : mcqId);
        setUserExplanation('');
        setSubmissionStatus({ loading: false, error: null, success: false });
    };

    const handleSubmitExplanation = async (mcqId) => {
        if (!userExplanation.trim()) return;
        
        setSubmissionStatus({ loading: true, error: null, success: false });
        
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/MCQ/${mcqId}/explanations`,
                { explanation: userExplanation, username: user }
            );

            await fetchAllMcq();

            setSubmissionStatus({ loading: false, error: null, success: true });
            setTimeout(() => {
                setShowExplanationForm(null);
                setUserExplanation('');
            }, 1500);
        } catch (error) {
            console.error("Error submitting explanation:", error);
            setSubmissionStatus({
                loading: false,
                error: error.response?.data?.message || 'Failed to submit explanation',
                success: false
            });
        }
    };

    const toggleUserExplanations = (mcqId) => {
        setShowUserExplanations(prev => ({
            ...prev,
            [mcqId]: !prev[mcqId]
        }));
    };

    const refreshExplanations = async (mcqId) => {
        await fetchAllMcq();
        setShowUserExplanations(prev => ({ ...prev, [mcqId]: false }));
        setTimeout(() => {
            setShowUserExplanations(prev => ({ ...prev, [mcqId]: true }));
        }, 50);
    };

    const handleDeleteExplanation = async (questionId, explanationId) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_BASE_URL}/MCQ/${questionId}/explanations/${explanationId}`
            );
            fetchAllMcq();
        } catch (error) {
            console.error("Error deleting explanation:", error);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleManualPageSubmit = (e) => {
        e.preventDefault();
        const page = parseInt(manualPageInput);
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            handlePageChange(page);
            setManualPageInput('');
        }
    };

    const highlightSearchTerm = (text) => {
        if (!text) return '';
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.split(regex).map((part, i) => 
            part.toLowerCase() === searchTerm.toLowerCase() ? 
            <span key={i} className="bg-yellow-400 text-black">{part}</span> : 
            part
        );
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pagesToShow = [];
        const maxVisiblePages = 5;
        
        // Always show first page
        pagesToShow.push(1);
        
        // Show current page and surrounding pages
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);
        
        for (let i = startPage; i <= endPage; i++) {
            if (!pagesToShow.includes(i)) {
                pagesToShow.push(i);
            }
        }
        
        // Always show last page
        if (!pagesToShow.includes(totalPages)) {
            pagesToShow.push(totalPages);
        }
        
        // Add ellipsis if there are gaps
        const paginationItems = [];
        let lastPage = 0;
        
        pagesToShow.forEach(page => {
            if (page - lastPage > 1) {
                paginationItems.push(
                    <span key={`ellipsis-${lastPage}`} className="px-2 text-gray-400">...</span>
                );
            }
            paginationItems.push(
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                    {page}
                </button>
            );
            lastPage = page;
        });

        return (
            <div className="flex flex-col sm:flex-row justify-center items-center mt-8 gap-4">
                <nav className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-md bg-gray-800 text-gray-300 disabled:opacity-50 hover:bg-gray-700 flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Prev
                    </button>

                    {paginationItems}

                    <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-md bg-gray-800 text-gray-300 disabled:opacity-50 hover:bg-gray-700 flex items-center gap-1"
                    >
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </nav>

                <form onSubmit={handleManualPageSubmit} className="flex items-center gap-2">
                    <span className="text-gray-300">Go to page:</span>
                    <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={manualPageInput}
                        onChange={(e) => setManualPageInput(e.target.value)}
                        className="w-16 px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="#"
                    />
                    <button
                        type="submit"
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
                    >
                        Go
                    </button>
                </form>
            </div>
        );
    };

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            {/* Heading */}
            <h1 className="text-3xl font-bold text-blue-400 mb-8">Technical Questions</h1>

            {/* Language Selection */}
            <div className="flex flex-wrap gap-4 mb-8">
                {['C++', 'Java'].map((lang) => (
                    <motion.button
                        key={lang}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-2 rounded-lg ${
                            selectedLanguage === lang 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-700 text-gray-300'
                        }`}
                        onClick={() => {
                            setSelectedLanguage(lang);
                            setSelectedType(null);
                            setAnsweredQuestions({});
                            setSelectedOptions({});
                            setSearchTerm('');
                        }}
                    >
                        {lang}
                    </motion.button>
                ))}
            </div>

            {/* Subtype / Topic Selection */}
            {!selectedLanguage ? (
                <div className="text-center text-gray-400 text-xl">
                    Please select a programming language
                </div>
            ) : !selectedType ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    {languageSubtypes[selectedLanguage].map((type) => (
                        <motion.div
                            key={type}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                            onClick={() => handleTypeSelect(type)}
                        >
                            <h3 className="text-blue-400 font-medium">{type}</h3>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div>
                    {/* Back Button, Heading, and Search */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                        <button
                            className="text-gray-400 hover:text-blue-400 cursor-pointer flex items-center gap-1"
                            onClick={() => {
                                setSelectedType(null);
                                setAnsweredQuestions({});
                                setSelectedOptions({});
                                setSearchTerm('');
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to {selectedLanguage} topics
                        </button>
                        <h2 className="text-2xl font-bold text-blue-400">
                            {selectedType} MCQs
                        </h2>
                        
                        {/* Search Input - Only shown when a type is selected */}
                        <div className="ml-auto w-full sm:w-96">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search questions, options or explanations..."
                                    className="w-full pl-10 pr-10 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-2 top-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {displayedMcqs.length === 0 ? (
                        <div className="text-gray-400 text-center py-12">
                            {searchTerm ? (
                                <div className="flex flex-col items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-lg">No questions found matching your search.</p>
                                    <p className="text-sm mt-2">Try different keywords or check spelling</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-lg">No questions found for this category.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {displayedMcqs.map((mcq) => (
                                <motion.div
                                    key={mcq._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 bg-gray-800 rounded-xl relative shadow-lg"
                                >
                                    <button
                                        onClick={() => handleShareClick(mcq._id)}
                                        className="absolute top-4 right-4 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                                        title="Share your explanation"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M20 2H4C2.9 2 2 2.9 2 4V18C2 19.1 2.9 20 4 20H18L22 24V4C22 2.9 21.1 2 20 2ZM20 18L18 16H4V4H20V18Z" />
                                        </svg>
                                    </button>

                                    <h3 className="text-xl font-medium text-white mb-4 pr-8">
                                        {searchTerm ? highlightSearchTerm(mcq.question) : mcq.question}
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                        {mcq.options.map((option, index) => (
                                            <motion.div
                                                key={index}
                                                whileTap={{ scale: 0.95 }}
                                                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                                    answeredQuestions[mcq._id] && index === mcq.correctOption
                                                        ? 'bg-green-500/20 border border-green-500/30'
                                                        : selectedOptions[mcq._id] === index
                                                            ? 'bg-red-500/20 border border-red-500/30'
                                                            : 'bg-gray-700/30 hover:bg-gray-600/40 border border-transparent'
                                                }`}
                                                onClick={() => handleAnswerSelect(mcq._id, index, mcq.correctOption)}
                                            >
                                                <span className="text-blue-400 mr-2">
                                                    Option {index + 1}:
                                                </span>
                                                <span className="text-white">
                                                    {searchTerm ? highlightSearchTerm(option) : option}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {selectedOptions[mcq._id] !== undefined && 
                                        selectedOptions[mcq._id] !== mcq.correctOption && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-red-400 text-sm mb-4"
                                        >
                                            Incorrect answer. Please try again!
                                        </motion.div>
                                    )}

                                    {showExplanationForm === mcq._id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-4 p-4 bg-gray-700/30 rounded-lg"
                                        >
                                            <h3 className="text-blue-400 font-medium mb-4">
                                                Share Your Explanation
                                            </h3>
                                            {submissionStatus.success ? (
                                                <div className="text-green-400 text-center py-2">
                                                    Explanation submitted successfully!
                                                </div>
                                            ) : (
                                                <>
                                                    <textarea
                                                        className="w-full p-3 bg-gray-700 text-white rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        rows="4"
                                                        placeholder="Write your explanation here..."
                                                        value={userExplanation}
                                                        onChange={(e) => setUserExplanation(e.target.value)}
                                                        disabled={submissionStatus.loading}
                                                    />
                                                    
                                                    {submissionStatus.error && (
                                                        <div className="text-red-400 mb-4">
                                                            {submissionStatus.error}
                                                        </div>
                                                    )}

                                                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                                                        <button
                                                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 disabled:opacity-50 transition-colors"
                                                            onClick={() => setShowExplanationForm(null)}
                                                            disabled={submissionStatus.loading}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 flex items-center transition-colors"
                                                            onClick={() => handleSubmitExplanation(mcq._id)}
                                                            disabled={submissionStatus.loading || !userExplanation.trim()}
                                                        >
                                                            {submissionStatus.loading && (
                                                                <svg
                                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <circle
                                                                        className="opacity-25"
                                                                        cx="12"
                                                                        cy="12"
                                                                        r="10"
                                                                        stroke="currentColor"
                                                                        strokeWidth="4"
                                                                    />
                                                                    <path
                                                                        className="opacity-75"
                                                                        fill="currentColor"
                                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                    />
                                                                </svg>
                                                            )}
                                                            {submissionStatus.loading ? 'Submitting...' : 'Submit'}
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </motion.div>
                                    )}

                                    {answeredQuestions[mcq._id] && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-4 bg-gray-700/30 rounded-lg"
                                        >
                                            <h4 className="text-green-400 font-medium mb-2">
                                                Explanation:
                                            </h4>
                                            <p className="text-gray-300 whitespace-pre-line">
                                                {searchTerm ? highlightSearchTerm(mcq.defaultExplanation) : mcq.defaultExplanation}
                                            </p>

                                            {mcq.userExplanations?.length > 0 && (
                                                <div className="mt-6">
                                                    <button
                                                        onClick={() => toggleUserExplanations(mcq._id)}
                                                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                                            showUserExplanations[mcq._id]
                                                                ? 'bg-blue-600/20 text-blue-400'
                                                                : 'bg-gray-600/20 text-gray-300 hover:bg-gray-500/20'
                                                        } transition-colors`}
                                                    >
                                                        <svg 
                                                            xmlns="http://www.w3.org/2000/svg" 
                                                            className="h-5 w-5" 
                                                            viewBox="0 0 20 20" 
                                                            fill="currentColor"
                                                        >
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                        </svg>
                                                        {showUserExplanations[mcq._id] 
                                                            ? "Hide Community Insights" 
                                                            : `View Community Insights (${mcq.userExplanations.length})`}
                                                    </button>
                                                    
                                                    {showUserExplanations[mcq._id] && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            transition={{ duration: 0.3 }}
                                                            className="mt-4 space-y-4"
                                                        >
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                                                <h4 className="text-blue-300 font-medium">Community Explanations</h4>
                                                                <button
                                                                    onClick={() => refreshExplanations(mcq._id)}
                                                                    className="px-2 py-1 text-sm bg-gray-600 rounded hover:bg-gray-500 flex items-center gap-1 transition-colors"
                                                                    title="Refresh explanations"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                    Refresh
                                                                </button>
                                                            </div>

                                                            {mcq.userExplanations?.slice().reverse().map((exp, idx) => (
                                                                <div key={idx} className="p-4 bg-gray-600/20 rounded-lg border-l-4 border-blue-500 relative">
                                                                    {exp.username === user && (
                                                                        <button
                                                                            onClick={() => handleDeleteExplanation(mcq._id, exp._id)}
                                                                            className="absolute top-2 right-2 text-red-400 hover:text-red-300 transition-colors"
                                                                            title="Delete your explanation"
                                                                        >
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                className="h-5 w-5"
                                                                                viewBox="0 0 20 20"
                                                                                fill="currentColor"
                                                                            >
                                                                                <path
                                                                                    fillRule="evenodd"
                                                                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                                    clipRule="evenodd"
                                                                                />
                                                                            </svg>
                                                                        </button>
                                                                    )}
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                                            <span className="text-blue-300 font-medium text-sm">
                                                                                {exp.username.charAt(0).toUpperCase()}
                                                                            </span>
                                                                        </div>
                                                                        <h5 className="text-blue-300 font-medium">
                                                                            {exp.username}
                                                                        </h5>
                                                                    </div>
                                                                    <p className="text-gray-200 pl-11 whitespace-pre-line">
                                                                        {exp.explanation}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                            <button
                                                                onClick={() => toggleUserExplanations(mcq._id)}
                                                                className="text-gray-400 hover:text-gray-300 text-sm mt-2 flex items-center gap-1 transition-colors"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                </svg>
                                                                Collapse
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}

                            {renderPagination()}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TechnicalQues;