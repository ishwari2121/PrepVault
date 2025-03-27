import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CommonQuestion = () => {
  const location = useLocation();
  
  // Sample data for questions
  const questions = {
    aptitude: [
      { id: 1, title: 'Calculate the probability of drawing two aces', difficulty: 'Medium' },
      { id: 2, title: 'Solve the time and work problem', difficulty: 'Easy' }
    ],
    technical: [
      { id: 1, title: 'Explain React Virtual DOM', difficulty: 'Medium' },
      { id: 2, title: 'Difference between HTTP/1 and HTTP/2', difficulty: 'Hard' }
    ],
    coding: [
      { id: 1, title: 'Implement debounce function', difficulty: 'Medium' },
      { id: 2, title: 'Binary tree traversal algorithms', difficulty: 'Hard' }
    ],
    hr: [
      { id: 1, title: 'Tell me about yourself', difficulty: 'Easy' },
      { id: 2, title: 'Describe a challenging situation', difficulty: 'Medium' }
    ]
  };

  const currentCategory = location.pathname.substring(1) || 'aptitude';
  const currentQuestions = questions[currentCategory] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Main container with fixed height and overflow hidden */}
      <div className="flex h-[calc(100vh-3rem)]">
        {/* Fixed Left Sidebar */}
        <motion.div 
          className="w-64 bg-white rounded-xl shadow-lg p-6 flex-shrink-0"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Interview Prep</h2>
          
          {/* Navigation Links */}
          <div className="space-y-3 mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Categories</h3>
            {['Aptitude', 'Technical', 'Coding', 'HR'].map((category) => (
              <NavLink 
                key={category}
                to={`/${category.toLowerCase()}`}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <span className="mr-3">
                  {category === 'Aptitude' && '🧮'}
                  {category === 'Technical' && '💻'}
                  {category === 'Coding' && '👨‍💻'}
                  {category === 'HR' && '👔'}
                </span>
                {category}
              </NavLink>
            ))}
          </div>

          {/* Top Companies */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Top Companies</h3>
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'].map((company) => (
              <div 
                key={company}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                {company}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scrollable Content Area */}
        <div className="flex-1 pl-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-8 h-full"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} Questions
                </h1>
                <p className="text-gray-500 mt-2">Practice common interview questions</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                Add Question
              </button>
            </div>

            {/* Questions List */}
            <AnimatePresence mode='wait'>
              <div className="space-y-4">
                {currentQuestions.map((question) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={{ scale: 1.01 }}
                    className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{question.title}</h3>
                        <div className="flex items-center mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            question.difficulty === 'Easy' 
                              ? 'bg-green-100 text-green-800' 
                              : question.difficulty === 'Medium' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {question.difficulty}
                          </span>
                          <span className="ml-3 text-sm text-gray-500">5 answers</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          View Answers
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            {/* Empty State */}
            {currentQuestions.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No questions found</h3>
                <p className="mt-1 text-gray-500">Be the first to add a question for this category</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Add Question
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CommonQuestion;