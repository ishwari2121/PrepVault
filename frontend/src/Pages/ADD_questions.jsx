import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuestionForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    language: '',
    type: '',
    question: '',
    options: ['', '', '', ''],
    correctOption: '',
    defaultExplanation: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.language) newErrors.language = 'Language is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.question || formData.question.length < 10) newErrors.question = 'Question must be at least 10 characters';
    if (formData.options.some(opt => !opt.trim())) newErrors.options = 'All options must be filled';
    if (formData.correctOption === '') newErrors.correctOption = 'Please select the correct option';
    if (!formData.defaultExplanation) newErrors.defaultExplanation = 'Explanation is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await axios.post('http://localhost:5000/api/MCQ', formData);
      setMessage('Question added successfully!');
      setMessageType('success');
      setFormData({
        language: '',
        type: '',
        question: '',
        options: ['', '', '', ''],
        correctOption: '',
        defaultExplanation: ''
      });
    } catch (error) {
      setMessage('Failed to add question');
      setMessageType('error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-center mb-6">Add New Question</h1>
      {message && (
        <div className={`p-4 rounded mb-4 ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Language</label>
          <select name="language" value={formData.language} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select Language</option>
            <option value="C++">C++</option>
            <option value="Java">Java</option>
          </select>
          {errors.language && <p className="text-red-500 text-sm">{errors.language}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Question</label>
          <textarea name="question" value={formData.question} onChange={handleChange} className="w-full p-2 border rounded" rows="3"></textarea>
          {errors.question && <p className="text-red-500 text-sm">{errors.question}</p>}
        </div>

        {formData.options.map((option, index) => (
          <div key={index} className="mb-4">
            <label className="block text-sm font-semibold mb-1">Option {index + 1}</label>
            <input type="text" value={option} onChange={(e) => handleOptionChange(index, e.target.value)} className="w-full p-2 border rounded" />
          </div>
        ))}
        {errors.options && <p className="text-red-500 text-sm">{errors.options}</p>}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Correct Option</label>
          <select name="correctOption" value={formData.correctOption} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select Correct Option</option>
            {formData.options.map((_, index) => (
              <option key={index} value={index}>Option {index + 1}</option>
            ))}
          </select>
          {errors.correctOption && <p className="text-red-500 text-sm">{errors.correctOption}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Default Explanation</label>
          <textarea name="defaultExplanation" value={formData.defaultExplanation} onChange={handleChange} className="w-full p-2 border rounded" rows="3"></textarea>
          {errors.defaultExplanation && <p className="text-red-500 text-sm">{errors.defaultExplanation}</p>}
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => navigate('/admin/questions')} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Question</button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
