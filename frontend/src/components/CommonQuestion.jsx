import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FaCode, FaUsers, FaLightbulb, FaCommentDots,
  FaBars, FaTimes, FaSearch, FaChevronDown
} from 'react-icons/fa';
import TechnicalMcq from '../components/TechnicalQues';
import { useMediaQuery } from '../hooks/useMediaQuery'

const CommonQuestion = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [totalCompanies, setTotalCompanies] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCompaniesOpen, setIsCompaniesOpen] = useState(false);
  const questionsContainerRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 800px)');
  
  const initialCategory = searchParams.get('category') || '';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const filteredCompanies = totalCompanies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const savedQuestion = sessionStorage.getItem('selectedQuestionId');
    if (savedQuestion) {
      setSelectedQuestionId(savedQuestion);
    }
  }, []);

  const saveNavigationState = (questionId) => {
    const scrollPosition = questionsContainerRef.current?.scrollTop;
    sessionStorage.setItem('questionsScrollPos', scrollPosition);
    sessionStorage.setItem('selectedQuestionId', questionId);
  };

  useEffect(() => {
    if (questionsLoaded && questionsContainerRef.current) {
      const savedPosition = sessionStorage.getItem('questionsScrollPos');
      if (savedPosition) {
        questionsContainerRef.current.scrollTop = parseInt(savedPosition, 10);
        sessionStorage.removeItem('questionsScrollPos');
      }
    }
  }, [questionsLoaded]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/commonQuestions");
        setQuestions(response.data?.data || []);
        setQuestionsLoaded(true);
      } catch (error) {
        console.error("Error fetching interview questions:", error);
        setQuestionsLoaded(true);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/companies");
        const sortedCompanies = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setTotalCompanies(sortedCompanies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  const handleCategoryClick = (category) => {
    const lowerCategory = category.toLowerCase();
    setSelectedCategory(lowerCategory);
    setSearchParams({ category: lowerCategory });
    setSelectedQuestionId(null);
    sessionStorage.removeItem('selectedQuestionId');
    
    if (questionsContainerRef.current) {
      questionsContainerRef.current.scrollTop = 0;
    }
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleQuestionClick = (questionId) => {
    setSelectedQuestionId(questionId);
    saveNavigationState(questionId);
  };

  const filteredQuestions = questions
    .filter((q) => selectedCategory && q.type.toLowerCase() === selectedCategory)
    .reverse();

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const scaleTap = {
    tap: { scale: 0.98 }
  };

  return (
    <div className="h-[90vh] bg-gradient-to-br from-gray-900 to-gray-800 p-6 w-full">
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700">
          <motion.button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 border border-cyan-400/30 rounded-lg hover:bg-cyan-400/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSidebarOpen ? (
              <FaTimes className="w-6 h-6 text-cyan-400" />
            ) : (
              <FaBars className="w-6 h-6 text-cyan-400" />
            )}
          </motion.button>
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Interview Prep
          </h2>
        </div>
      )}

      <div className="flex h-full gap-6">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <motion.div
            className="w-64 bg-gray-800/80 rounded-xl p-5 flex-shrink-0 sticky top-6 h-[calc(90vh-3rem)] overflow-y-auto border border-gray-700 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-cyan-400 mb-8 border-b border-cyan-400/20 pb-4">
              Interview Prep
            </h2>

            <div className="space-y-2 mb-8">
              <h3 className="text-sm font-semibold text-cyan-300/80 uppercase tracking-wider mb-4">
                Categories
              </h3>
              {['Technical', 'Coding', 'HR', 'Aptitude'].map((category) => {
                const isActive = selectedCategory === category.toLowerCase();
                return (
                  <motion.div
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`group relative flex items-center px-4 py-3 rounded-lg cursor-pointer ${
                      isActive 
                        ? 'bg-cyan-500/10 border border-cyan-400/30'
                        : 'hover:bg-gray-700/30 border border-transparent'
                    }`}
                    whileTap={scaleTap}
                    variants={slideUp}
                  >
                    <span className={`mr-3 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}>
                      {category === 'Technical' && <FaCode />} {/* Revert to original icon */}
                      {category === 'Coding' && <FaCode />}
                      {category === 'HR' && <FaUsers />}
                      {category === 'Aptitude' && <FaLightbulb />}
                    </span>
                    <span className={`${isActive ? 'text-cyan-100' : 'text-gray-300'} font-medium`}>
                      {category}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-cyan-300/80 uppercase tracking-wider mb-4">
                Top Companies
              </h3>
              <div className="mb-4 relative">
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              {filteredCompanies.map((company) => (
                <motion.div
                  key={company?._id}
                  className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-700/20 rounded-lg cursor-pointer"
                  variants={slideUp}
                  whileTap={scaleTap}
                >
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3" />
                  <span className="truncate hover:text-cyan-100 transition-colors">
                    {company.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobile && isSidebarOpen && (
            <motion.div
              className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-sm"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="h-full overflow-y-auto p-4 w-80">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-cyan-400">Menu</h2>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded-lg"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-2 mb-8">
                  <h3 className="text-sm font-semibold text-cyan-300 uppercase mb-4 flex items-center">
                    <FaCommentDots className="mr-2" />
                    Categories
                  </h3>
                  {['Technical', 'Coding', 'HR', 'Aptitude'].map((category) => {
                    const isActive = selectedCategory === category.toLowerCase();
                    return (
                      <motion.div
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`group relative flex items-center px-4 py-3 rounded-lg cursor-pointer ${
                          isActive 
                            ? 'bg-cyan-500/10 border border-cyan-400/30'
                            : 'hover:bg-gray-700/30 border border-transparent'
                        }`}
                        whileTap={scaleTap}
                        variants={slideUp}
                      >
                        <span className={`mr-3 text-sm ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}>
                          {category === 'Technical' && <FaCommentDots className="w-5 h-5" />}
                          {category === 'Coding' && <FaCode className="w-5 h-5" />}
                          {category === 'HR' && <FaUsers className="w-5 h-5" />}
                          {category === 'Aptitude' && <FaLightbulb className="w-5 h-5" />}
                        </span>
                        <span className={`${isActive ? 'text-cyan-100' : 'text-gray-300'} text-base font-medium`}>
                          {category}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => setIsCompaniesOpen(!isCompaniesOpen)}
                    className="w-full flex justify-between items-center p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/30 transition-colors"
                  >
                    <span className="text-cyan-300 font-semibold flex items-center">
                      <FaUsers className="mr-2" />
                      Top Companies
                    </span>
                    <FaChevronDown className={`transition-transform ${isCompaniesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isCompaniesOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="mb-4 relative">
                          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search companies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          />
                        </div>

                        {filteredCompanies.map((company) => (
                          <motion.div
                            key={company?._id}
                            className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700/20 rounded-lg cursor-pointer group transition-colors"
                            variants={slideUp}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 transition-all group-hover:w-3 group-hover:h-3" />
                            <span className="truncate group-hover:text-cyan-100 transition-colors">
                              {company.name}
                            </span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Questions Section */}
        <motion.div
          ref={questionsContainerRef}
          className="flex-1 bg-gray-800/80 rounded-xl p-6 overflow-y-auto border border-gray-700 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {selectedCategory ? (
            <>
              <motion.h2 
                className="text-2xl font-bold text-cyan-400 mb-8"
                variants={slideUp}
              >
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Questions
              </motion.h2>
              <AnimatePresence>
                {selectedCategory === 'technical' ? (
                  <TechnicalMcq />
                ) : filteredQuestions.length ? (
                  <div className="grid gap-4">
                    {filteredQuestions.map((question) => (
                      <NavLink 
                        to={`/answer/${question?._id}`} 
                        key={question._id}
                        onClick={() => handleQuestionClick(question._id)}
                      >
                        <motion.div
                          className={`group relative p-5 rounded-xl transition-all ${
                            selectedQuestionId === question._id
                              ? 'bg-cyan-500/10 border border-cyan-400/30'
                              : 'bg-gray-700/20 hover:bg-gray-700/30 border border-transparent'
                          }`}
                          variants={slideUp}
                          whileTap={scaleTap}
                          whileHover={{ y: -2 }}
                        >
                          <h3 className="font-medium text-cyan-100 mb-3">{question.question}</h3>
                          <div className="flex items-center text-sm text-cyan-400/80">
                            <div className="flex items-center mr-6">
                              <FaCommentDots className="mr-2" />
                              {question.answers?.length || 0} answers
                            </div>
                            <div className="flex items-center">
                              <span className="mr-1">▲</span>
                              {question.answers?.reduce((sum, ans) => sum + ans.upvotes, 0) || 0}
                            </div>
                          </div>
                        </motion.div>
                      </NavLink>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    className="p-5 bg-amber-500/10 rounded-xl border border-amber-400/30"
                    variants={fadeIn}
                  >
                    <p className="text-amber-300 flex items-center gap-3">
                      <FaLightbulb className="text-xl" />
                      No questions available for this category yet.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center h-full text-center"
              variants={fadeIn}
            >
              <div className="mb-8 p-6 bg-cyan-400/10 rounded-full">
                <FaCommentDots className="text-6xl text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold text-cyan-400 mb-4">
                Start Your Preparation
              </h2>
              <p className="text-cyan-300/90 text-lg max-w-xl">
                Select a category to explore curated interview questions. 
                Prepare for technical challenges, coding problems, HR discussions, 
                or behavioral scenarios.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CommonQuestion;