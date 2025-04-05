import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate, useNavigate } from 'react-router-dom';

const TechnicalQues = () => {
    const [allMcq, setAllMcq] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [filteredMcqs, setFilteredMcqs] = useState([]);
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
    const navigate = useNavigate();
    const languageSubtypes = {
        'C++': ['OOP', 'Objects', 'Reference', 'Functions'],
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

    const fetchAllMcq = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/MCQ");
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
                const { selectedLanguage: savedLang, selectedType: savedType } = JSON.parse(savedState);
                setSelectedLanguage(savedLang);
                setSelectedType(savedType);
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
            JSON.stringify({ selectedLanguage, selectedType })
        );
    }, [selectedLanguage, selectedType]);

    // Filter MCQs when selections or data changes
    useEffect(() => {
        if (selectedLanguage && selectedType) {
            const filtered = allMcq.filter(mcq => 
                mcq.language === selectedLanguage && 
                mcq.type === selectedType
            );
            setFilteredMcqs(filtered);
        }
    }, [allMcq, selectedLanguage, selectedType]);

    const handleTypeSelect = (type) => {
        setSelectedType(type);
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
        if(!user)
        {
            navigate("/signin/commonQuestion?category=technical")
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
                `http://localhost:5000/api/MCQ/${mcqId}/explanations`,
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
                `http://localhost:5000/api/MCQ/${questionId}/explanations/${explanationId}`
            );
            fetchAllMcq();
        } catch (error) {
            console.error("Error deleting explanation:", error);
        }
    };

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
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
                    {/* Back Button and Heading */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                        <button
                            className="text-gray-400 hover:text-blue-400"
                            onClick={() => {
                                setSelectedType(null);
                                setAnsweredQuestions({});
                                setSelectedOptions({});
                            }}
                        >
                            ← Back to {selectedLanguage} topics
                        </button>
                        <h2 className="text-2xl font-bold text-blue-400">
                            {selectedType} MCQs
                        </h2>
                    </div>

                    {filteredMcqs.length === 0 ? (
                        <div className="text-gray-400 text-center">
                            No MCQs found for this category
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredMcqs.map((mcq) => (
                                <motion.div
                                    key={mcq._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 bg-gray-800 rounded-xl relative"
                                >
                                    <button
                                        onClick={() => handleShareClick(mcq._id)}
                                        className="absolute top-4 right-4 text-blue-400 hover:text-blue-300 transition-colors"
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
                                        {mcq.question}
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
                                                <span className="text-white">{option}</span>
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
                                                        className="w-full p-3 bg-gray-700 text-white rounded mb-4"
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
                                                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 disabled:opacity-50"
                                                            onClick={() => setShowExplanationForm(null)}
                                                            disabled={submissionStatus.loading}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 flex items-center"
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
                                            <p className="text-gray-300">
                                                {mcq.defaultExplanation}
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
                                                                    className="px-2 py-1 text-sm bg-gray-600 rounded hover:bg-gray-500 flex items-center gap-1"
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
                                                                            className="absolute top-2 right-2 text-red-400 hover:text-red-300"
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
                                                                    <p className="text-gray-200 pl-11">
                                                                        {exp.explanation}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                            <button
                                                                onClick={() => toggleUserExplanations(mcq._id)}
                                                                className="text-gray-400 hover:text-gray-300 text-sm mt-2 flex items-center gap-1"
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
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TechnicalQues;
