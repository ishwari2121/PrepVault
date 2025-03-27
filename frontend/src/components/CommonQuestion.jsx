import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const CommonQuestion = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [totalCompanies, setTotalCompanies] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const questionsContainerRef = useRef(null);
  
  const initialCategory = searchParams.get('category') || '';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Restore selected question from sessionStorage
  useEffect(() => {
    const savedQuestion = sessionStorage.getItem('selectedQuestionId');
    if (savedQuestion) {
      setSelectedQuestionId(savedQuestion);
    }
  }, []);

  // Save scroll position and selected question
  const saveNavigationState = (questionId) => {
    const scrollPosition = questionsContainerRef.current?.scrollTop;
    sessionStorage.setItem('questionsScrollPos', scrollPosition);
    sessionStorage.setItem('selectedQuestionId', questionId);
  };

  // Restore scroll position
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('questionsScrollPos');
    if (savedPosition && questionsContainerRef.current) {
      questionsContainerRef.current.scrollTop = parseInt(savedPosition, 10);
      sessionStorage.removeItem('questionsScrollPos');
    }
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/commonQuestions");
        setQuestions(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching interview questions:", error);
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
  };

  const handleQuestionClick = (questionId) => {
    setSelectedQuestionId(questionId);
    saveNavigationState(questionId);
  };

  const filteredQuestions = questions
    .filter((q) => selectedCategory && q.type.toLowerCase() === selectedCategory)
    .reverse();

  const fadeInVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="h-[90vh] bg-gradient-to-br from-gray-50 to-gray-100 p-6 w-full">
      <div className="flex h-full gap-6">
        {/* Sidebar */}
        <motion.div
          className="w-64 bg-white rounded-xl shadow-lg p-6 flex-shrink-0 sticky top-6 h-[calc(90vh-3rem)] overflow-y-auto"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Interview Prep</h2>

          <div className="space-y-3 mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Categories</h3>
            {['Technical', 'Coding', 'HR', 'Behavioral'].map((category) => (
              <div
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  selectedCategory === category.toLowerCase()
                    ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">
                  {category === 'Technical' && '💻'}
                  {category === 'Coding' && '👨‍💻'}
                  {category === 'HR' && '👔'}
                  {category === 'Behavioral' && '🧠'}
                </span>
                {category}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Top Companies</h3>
            {totalCompanies.map((company) => (
              <div
                key={company?._id}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                {company.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Questions Section */}
        <motion.div
          ref={questionsContainerRef}
          className="flex-1 bg-white rounded-xl shadow-lg p-6 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {selectedCategory ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Questions
              </h2>
              <div className="space-y-4">
                {filteredQuestions.length ? (
                  filteredQuestions.map((question) => (
                    <NavLink 
                      to={`/answer/${question?._id}`} 
                      key={question._id}
                      onClick={() => handleQuestionClick(question._id)}
                    >
                      <motion.div
                        className={`p-4 rounded-lg transition-colors ${
                          selectedQuestionId === question._id
                            ? 'bg-blue-100 border-l-4 border-blue-500'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <h3 className="font-medium text-gray-800 mb-2">{question.question}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-4">
                            {question.answers?.length || 0} answers
                          </span>
                          <span className="flex items-center mr-4">
                            ▲ {question.answers?.reduce((sum, ans) => sum + ans.upvotes, 0) || 0}
                          </span>
                        </div>
                      </motion.div>
                    </NavLink>
                  ))
                ) : (
                  <motion.div
                    className="p-4 bg-yellow-100 rounded-lg border-l-4 border-yellow-500"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInVariants}
                  >
                    <p className="text-yellow-800">
                      No questions available for this category yet. Please check back later or try another category.
                    </p>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center h-full"
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Started!</h2>
              <p className="text-gray-600 text-center max-w-md">
                Select a category from the left to view interview questions. 
                Choose from technical, coding, HR, or behavioral categories 
                to explore relevant questions and answers.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CommonQuestion;