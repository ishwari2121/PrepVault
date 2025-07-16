import React, { useState, useEffect } from 'react';
import { useSpring, animated } from "@react-spring/web";
import axios from 'axios';

const AdminPanel = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    language: 'C++',
    type: 'OOP',
    question: '',
    options: ['', '', '', ''],
    correctOption: 0,
    defaultExplanation: ''
  });
  const [newExplanation, setNewExplanation] = useState({
    username: '',
    explanation: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Animation props
  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 } });
  const slideIn = useSpring({ 
    transform: 'translateY(0)', 
    from: { transform: 'translateY(50px)' } 
  });

  // Fetch all questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/MCQ`);
        const reversedData = [...response.data].reverse(); // Create a reversed copy
        setQuestions(reversedData);
        setFilteredQuestions(reversedData);
      } catch (error) {
        showNotification('Failed to fetch questions', 'error');
      }
    };
    fetchQuestions();
  }, []);
  

  // Filter questions based on search and filters
  useEffect(() => {
    let result = questions;
    
    if (searchTerm) {
      result = result.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterLanguage !== 'all') {
      result = result.filter(q => q.language === filterLanguage);
    }
    
    if (filterType !== 'all') {
      result = result.filter(q => q.type === filterType);
    }
    
    setFilteredQuestions(result);
  }, [searchTerm, filterLanguage, filterType, questions]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleExplanationChange = (e) => {
    const { name, value } = e.target;
    setNewExplanation(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      language: 'C++',
      type: 'OOP',
      question: '',
      options: ['', '', '', ''],
      correctOption: 0,
      defaultExplanation: ''
    });
    setSelectedQuestion(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.patch(`${import.meta.env.VITE_APP_BACKEND_URL}/MCQ/${selectedQuestion._id}`, formData);
        showNotification('Question updated successfully!', 'success');
      } else {
        await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/MCQ`, formData);
        showNotification('Question added successfully!', 'success');
      }
  
      // Refresh and reverse the questions list
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/MCQ`);
      const reversedData = [...response.data].reverse();
      setQuestions(reversedData);
      setFilteredQuestions(reversedData); // Also update filtered if needed
      resetForm();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error saving question', 'error');
    }
  };
  

  const handleEdit = (question) => {
    setSelectedQuestion(question);
    setIsEditing(true);
    setFormData({
      language: question.language,
      type: question.type,
      question: question.question,
      options: [...question.options],
      correctOption: question.correctOption,
      defaultExplanation: question.defaultExplanation
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_APP_BACKEND_URL}/MCQ/${id}`);
        showNotification('Question deleted successfully!', 'success');
  
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/MCQ`);
        const reversedData = [...response.data].reverse();
        setQuestions(reversedData);
        setFilteredQuestions(reversedData); // if you're using filtered list too
      } catch (error) {
        showNotification('Error deleting question', 'error');
      }
    }
  };
  

  const addExplanation = async () => {
    if (!selectedQuestion) return;
    
    try {
      await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/MCQ/${selectedQuestion._id}/explanations`, newExplanation);
      showNotification('Explanation added successfully!', 'success');
      
      // Refresh the selected question
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/MCQ/id/${selectedQuestion._id}`);
      setSelectedQuestion(response.data);
      setNewExplanation({ username: '', explanation: '' });
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error adding explanation', 'error');
    }
  };

  const deleteExplanation = async (questionId, explanationId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_APP_BACKEND_URL}/MCQ/${questionId}/explanations/${explanationId}`);
      showNotification('Explanation deleted successfully!', 'success');
      
      // Refresh the selected question
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/MCQ/id/${questionId}`);
      setSelectedQuestion(response.data);
    } catch (error) {
      showNotification('Error deleting explanation', 'error');
    }
  };

  const languageTypes = {
    'C++': ['OOP', 'References', 'Objects', 'Functions','Pointers'],
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

  return (
    <animated.div style={fadeIn} className="max-w-7xl mx-auto p-5 font-sans">
      {notification.show && (
        <animated.div 
          style={slideIn}
          className={`fixed top-5 right-5 p-4 rounded-md text-white font-semibold z-50 shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {notification.message}
        </animated.div>
      )}

      <h1 className="text-3xl text-center text-gray-800 font-bold mb-8">MCQ Questions Admin Panel</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <animated.div style={slideIn} className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-2xl text-gray-700 font-semibold mb-6 pb-2 border-b border-gray-200">
            {isEditing ? 'Edit Question' : 'Add New Question'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Language:</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="C++">C++</option>
                <option value="Java">Java</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Type:</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {languageTypes[formData.language].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Question:</label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                required
                minLength="10"
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-600">Options:</label>
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center gap-4">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={formData.correctOption === index}
                      onChange={() => setFormData(prev => ({ ...prev, correctOption: index }))}
                      className="mr-2"
                    />
                    Correct
                  </label>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Default Explanation:</label>
              <textarea
                name="defaultExplanation"
                value={formData.defaultExplanation}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
              >
                {isEditing ? 'Update Question' : 'Add Question'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </animated.div>

        {/* Questions List Section */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Languages</option>
              <option value="C++">C++</option>
              <option value="Java">Java</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={filterLanguage === 'all'}
            >
              <option value="all">All Types</option>
              {filterLanguage !== 'all' && 
                languageTypes[filterLanguage].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))
              }
            </select>
          </div>

          <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No questions found</div>
            ) : (
              filteredQuestions.map((q) => (
                <animated.div 
                  key={q._id} 
                  className={`p-5 bg-white rounded-lg shadow-sm border-l-4 ${
                    selectedQuestion?._id === q._id 
                      ? 'border-green-500 bg-gray-50' 
                      : 'border-blue-500'
                  } cursor-pointer transition-all hover:shadow-md`}
                  onClick={() => setSelectedQuestion(q)}
                  style={fadeIn}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                        {q.language}
                      </span>
                      <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                        {q.type}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(q);
                        }}
                        className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(q._id);
                        }}
                        className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{q.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((opt, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded ${
                          q.correctOption === idx 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </animated.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Selected Question Details */}
      {selectedQuestion && (
        <animated.div style={slideIn} className="mt-8 bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-2xl text-gray-700 font-semibold mb-6 pb-2 border-b border-gray-200">
            Question Details
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-800">{selectedQuestion.question}</h3>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                  {selectedQuestion.language}
                </span>
                <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                  {selectedQuestion.type}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">Correct Answer:</h4>
              <p className="p-3 bg-gray-50 rounded text-gray-700">
                {selectedQuestion.options[selectedQuestion.correctOption]}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">Default Explanation:</h4>
              <p className="p-3 bg-gray-50 rounded text-gray-700">
                {selectedQuestion.defaultExplanation}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-3">
                User Explanations ({selectedQuestion.userExplanations.length})
              </h4>
              {selectedQuestion.userExplanations.length === 0 ? (
                <p className="text-gray-500">No user explanations yet</p>
              ) : (
                <div className="space-y-4">
                  {selectedQuestion.userExplanations.map((exp, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="font-medium text-blue-600">{exp.username}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">
                            {new Date(exp.createdAt).toLocaleString()}
                          </span>
                          <button 
                            onClick={() => deleteExplanation(selectedQuestion._id, exp._id)}
                            className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700">{exp.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4">
              <h4 className="text-lg font-medium text-gray-700 mb-3">Add New Explanation</h4>
              <div className="space-y-4">
                <input
                  type="text"
                  name="username"
                  value={newExplanation.username}
                  onChange={handleExplanationChange}
                  placeholder="Your name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  name="explanation"
                  value={newExplanation.explanation}
                  onChange={handleExplanationChange}
                  placeholder="Your explanation"
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                />
                <button 
                  type="button" 
                  onClick={addExplanation}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  disabled={!newExplanation.username || !newExplanation.explanation}
                >
                  Add Explanation
                </button>
              </div>
            </div>
          </div>
        </animated.div>
      )}
    </animated.div>
  );
};

export default AdminPanel;