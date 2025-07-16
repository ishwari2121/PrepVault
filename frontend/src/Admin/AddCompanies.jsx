import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminCompanyDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingCriteria, setIsAddingCriteria] = useState(false);
  const [isAddingProcess, setIsAddingProcess] = useState(false);
  const [newCriteria, setNewCriteria] = useState({
    year: new Date().getFullYear(),
    degree: 'B.Tech',
    eligibility: 'Open',
    cgpa: '7.0',
    skillsRequired: [],
    experience: 'Fresher',
    role: 'Software Engineer',
    CTC: '6 LPA'
  });
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    recruitmentProcess: {
      CompanyDetails: '',
      round1: '',
      round2: '',
      round3: '',
      round4: '',
      round5: '',
      sampleQuestions: [],
      ExtraRequirements: ''
    },
    eligibilityCriteria: []
  });
  const [newQuestion, setNewQuestion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch all companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('${import.meta.env.VITE_API_BASE_URL}/companies');
        setCompanies(response.data);
        setIsLoading(false);
      } catch (error) {
        setErrorMessage('Failed to fetch companies');
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle recruitment process input changes
  const handleProcessChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      recruitmentProcess: {
        ...formData.recruitmentProcess,
        [name]: value
      }
    });
  };

  // Handle criteria input changes
  const handleCriteriaChange = (e) => {
    const { name, value } = e.target;
    setNewCriteria({
      ...newCriteria,
      [name]: value
    });
  };

  // Add new company
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('${import.meta.env.VITE_API_BASE_URL}/companies', formData);
      setCompanies([...companies, response.data.company]);
      setFormData({
        name: '',
        recruitmentProcess: {
          CompanyDetails: '',
          round1: '',
          round2: '',
          round3: '',
          round4: '',
          round5: '',
          sampleQuestions: [],
          ExtraRequirements: ''
        },
        eligibilityCriteria: []
      });
      setSuccessMessage('Company added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Failed to add company');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Update company
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/companies/${selectedCompany.name}/recruitment`,
        { recruitmentProcess: formData.recruitmentProcess }
      );
      const updatedCompanies = companies.map(company =>
        company.name === selectedCompany.name ? response.data.company : company
      );
      setCompanies(updatedCompanies);
      setSelectedCompany(response.data.company);
      setSuccessMessage('Company updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setIsEditing(false);
    } catch (error) {
      setErrorMessage('Failed to update company');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Add eligibility criteria
  const addEligibilityCriteria = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/companies/${selectedCompany.name}/eligibility`,
        { eligibilityCriteria: [newCriteria] }
      );
      const updatedCompanies = companies.map(company =>
        company.name === selectedCompany.name ? response.data.company : company
      );
      setCompanies(updatedCompanies);
      setSelectedCompany(response.data.company);
      setNewCriteria({
        year: new Date().getFullYear(),
        degree: 'B.Tech',
        eligibility: 'Open',
        cgpa: '7.0',
        skillsRequired: [],
        experience: 'Fresher',
        role: 'Software Engineer',
        CTC: '6 LPA'
      });
      setSuccessMessage('Eligibility criteria added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setIsAddingCriteria(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Failed to add criteria');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Add skill to criteria
  const addSkill = () => {
    if (newSkill.trim() && !newCriteria.skillsRequired.includes(newSkill.trim())) {
      setNewCriteria({
        ...newCriteria,
        skillsRequired: [...newCriteria.skillsRequired, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  // Remove skill from criteria
  const removeSkill = (skill) => {
    setNewCriteria({
      ...newCriteria,
      skillsRequired: newCriteria.skillsRequired.filter(s => s !== skill)
    });
  };

  // Add sample question
  const addQuestion = () => {
    if (newQuestion.trim()) {
      setFormData({
        ...formData,
        recruitmentProcess: {
          ...formData.recruitmentProcess,
          sampleQuestions: [...formData.recruitmentProcess.sampleQuestions, newQuestion.trim()]
        }
      });
      setNewQuestion('');
    }
  };

  // Remove sample question
  const removeQuestion = (question) => {
    setFormData({
      ...formData,
      recruitmentProcess: {
        ...formData.recruitmentProcess,
        sampleQuestions: formData.recruitmentProcess.sampleQuestions.filter(q => q !== question)
      }
    });
  };

  // Filter companies based on search
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Select a company to view/edit
  const selectCompany = async (companyName) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/companies/${companyName}`);
      setSelectedCompany(response.data);
      setFormData({
        name: response.data.name,
        recruitmentProcess: response.data.recruitmentProcess,
        eligibilityCriteria: response.data.eligibilityCriteria
      });
    } catch (error) {
      setErrorMessage('Failed to fetch company details');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Company Management</h1>
        <p className="text-gray-600">Admin dashboard for managing company recruitment data</p>
      </motion.div>

      {/* Success/Error Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg"
        >
          {successMessage}
        </motion.div>
      )}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg"
        >
          {errorMessage}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Company List */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-4 bg-blue-700 text-white">
            <h2 className="text-xl font-semibold">Companies</h2>
            <div className="mt-2 relative">
              <input
                type="text"
                placeholder="Search companies..."
                className="w-full p-2 rounded-md text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute right-3 top-3 h-4 w-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="h-[500px] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No companies found</div>
            ) : (
              <ul>
                {filteredCompanies.map((company, index) => (
                  <motion.li
                    key={company._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 border-b cursor-pointer hover:bg-blue-50 transition-colors ${selectedCompany?.name === company.name ? 'bg-blue-100' : ''}`}
                    onClick={() => selectCompany(company.name)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{company.name}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {company.eligibilityCriteria.length} criteria
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-4 border-t">
            <button
              onClick={() => {
                setSelectedCompany(null);
                setIsEditing(false);
                setIsAddingCriteria(false);
                setIsAddingProcess(false);
                setFormData({
                  name: '',
                  recruitmentProcess: {
                    CompanyDetails: '',
                    round1: '',
                    round2: '',
                    round3: '',
                    round4: '',
                    round5: '',
                    sampleQuestions: [],
                    ExtraRequirements: ''
                  },
                  eligibilityCriteria: []
                });
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Add New Company
            </button>
          </div>
        </motion.div>

        {/* Right Column - Company Details/Form */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedCompany && !isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Add New Company</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="name">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="companyDetails">
                    Company Details
                  </label>
                  <textarea
                    id="companyDetails"
                    name="CompanyDetails"
                    value={formData.recruitmentProcess.CompanyDetails}
                    onChange={handleProcessChange}
                    rows="3"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {[1, 2, 3, 4, 5].map((round) => (
                    <div key={round}>
                      <label className="block text-gray-700 mb-2" htmlFor={`round${round}`}>
                        Round {round} Details
                      </label>
                      <textarea
                        id={`round${round}`}
                        name={`round${round}`}
                        value={formData.recruitmentProcess[`round${round}`]}
                        onChange={handleProcessChange}
                        rows="2"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Sample Questions</label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="flex-1 p-2 border rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add a sample question"
                    />
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.recruitmentProcess.sampleQuestions.map((question, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span>{question}</span>
                        <button
                          type="button"
                          onClick={() => removeQuestion(question)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="extraRequirements">
                    Extra Requirements
                  </label>
                  <textarea
                    id="extraRequirements"
                    name="ExtraRequirements"
                    value={formData.recruitmentProcess.ExtraRequirements}
                    onChange={handleProcessChange}
                    rows="2"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                >
                  Add Company
                </button>
              </form>
            </motion.div>
          ) : (
            <>
              {/* Company Details View */}
              {!isEditing && !isAddingCriteria && !isAddingProcess && selectedCompany && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-blue-800">{selectedCompany.name}</h2>
                      <p className="text-gray-600">Recruitment Information</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 border-b pb-1">Company Details</h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {selectedCompany.recruitmentProcess.CompanyDetails || 'No details provided'}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 border-b pb-1">Recruitment Process</h3>
                    {[1, 2, 3, 4, 5].map((round) => (
                      selectedCompany.recruitmentProcess[`round${round}`] && (
                        <div key={round} className="mb-3">
                          <h4 className="font-medium text-gray-700">Round {round}</h4>
                          <p className="text-gray-600 whitespace-pre-line">
                            {selectedCompany.recruitmentProcess[`round${round}`]}
                          </p>
                        </div>
                      )
                    ))}
                    <button
                      onClick={() => setIsAddingProcess(true)}
                      className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      Update Process
                    </button>
                  </div>

                  {selectedCompany.recruitmentProcess.sampleQuestions.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-800 border-b pb-1">Sample Questions</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedCompany.recruitmentProcess.sampleQuestions.map((question, index) => (
                          <li key={index} className="text-gray-700">{question}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedCompany.recruitmentProcess.ExtraRequirements && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-800 border-b pb-1">Extra Requirements</h3>
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedCompany.recruitmentProcess.ExtraRequirements}
                      </p>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">Eligibility Criteria</h3>
                      <button
                        onClick={() => setIsAddingCriteria(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Add Criteria
                      </button>
                    </div>
                    {selectedCompany.eligibilityCriteria.length === 0 ? (
                      <p className="text-gray-500">No eligibility criteria added yet</p>
                    ) : (
                      <div className="space-y-4">
                        {selectedCompany.eligibilityCriteria.map((criteria, index) => (
                          <div key={index} className="border rounded-lg p-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium">Year: <span className="font-normal">{criteria.year}</span></p>
                                <p className="font-medium">Degree: <span className="font-normal">{criteria.degree}</span></p>
                                <p className="font-medium">Eligibility: <span className="font-normal">{criteria.eligibility}</span></p>
                              </div>
                              <div>
                                <p className="font-medium">CGPA: <span className="font-normal">{criteria.cgpa}</span></p>
                                <p className="font-medium">Experience: <span className="font-normal">{criteria.experience}</span></p>
                                <p className="font-medium">Role: <span className="font-normal">{criteria.role}</span></p>
                                <p className="font-medium">CTC: <span className="font-normal">{criteria.CTC}</span></p>
                              </div>
                            </div>
                            {criteria.skillsRequired.length > 0 && (
                              <div className="mt-3">
                                <p className="font-medium">Skills Required:</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {criteria.skillsRequired.map((skill, i) => (
                                    <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Edit Company Form */}
              {isEditing && selectedCompany && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-800">Edit {selectedCompany.name}</h2>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2" htmlFor="companyDetails">
                        Company Details
                      </label>
                      <textarea
                        id="companyDetails"
                        name="CompanyDetails"
                        value={formData.recruitmentProcess.CompanyDetails}
                        onChange={handleProcessChange}
                        rows="3"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {[1, 2, 3, 4, 5].map((round) => (
                        <div key={round}>
                          <label className="block text-gray-700 mb-2" htmlFor={`round${round}`}>
                            Round {round} Details
                          </label>
                          <textarea
                            id={`round${round}`}
                            name={`round${round}`}
                            value={formData.recruitmentProcess[`round${round}`]}
                            onChange={handleProcessChange}
                            rows="2"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Sample Questions</label>
                      <div className="flex mb-2">
                        <input
                          type="text"
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          className="flex-1 p-2 border rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add a sample question"
                        />
                        <button
                          type="button"
                          onClick={addQuestion}
                          className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {formData.recruitmentProcess.sampleQuestions.map((question, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span>{question}</span>
                            <button
                              type="button"
                              onClick={() => removeQuestion(question)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2" htmlFor="extraRequirements">
                        Extra Requirements
                      </label>
                      <textarea
                        id="extraRequirements"
                        name="ExtraRequirements"
                        value={formData.recruitmentProcess.ExtraRequirements}
                        onChange={handleProcessChange}
                        rows="2"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Add Eligibility Criteria Form */}
              {isAddingCriteria && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-800">Add Eligibility Criteria</h2>
                    <button
                      onClick={() => setIsAddingCriteria(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={addEligibilityCriteria}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 mb-2" htmlFor="year">
                          Year
                        </label>
                        <input
                          type="number"
                          id="year"
                          name="year"
                          value={newCriteria.year}
                          onChange={handleCriteriaChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2" htmlFor="degree">
                          Degree
                        </label>
                        <textarea
                            id="degree"
                            name="degree"
                            value={newCriteria.degree}
                            onChange={handleCriteriaChange}
                            placeholder="Enter eligible degrees (e.g., B.Tech, M.Tech, MCA)"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={3}
                            required
                        ></textarea>

                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2" htmlFor="eligibility">
                          Eligibility
                        </label>
                        <input
                            type="text"
                            id="eligibility"
                            name="eligibility"
                            value={newCriteria.eligibility}
                            onChange={handleCriteriaChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            placeholder="Enter eligibility"
                        />

                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2" htmlFor="cgpa">
                          CGPA Required
                        </label>
                        <input
                          type="text"
                          id="cgpa"
                          name="cgpa"
                          value={newCriteria.cgpa}
                          onChange={handleCriteriaChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2" htmlFor="experience">
                          Experience
                        </label>
                        <input
                          type="text"
                          id="experience"
                          name="experience"
                          value={newCriteria.experience}
                          onChange={handleCriteriaChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2" htmlFor="role">
                          Role
                        </label>
                        <input
                          type="text"
                          id="role"
                          name="role"
                          value={newCriteria.role}
                          onChange={handleCriteriaChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2" htmlFor="CTC">
                          CTC
                        </label>
                        <input
                          type="text"
                          id="CTC"
                          name="CTC"
                          value={newCriteria.CTC}
                          onChange={handleCriteriaChange}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Skills Required</label>
                      <div className="flex mb-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          className="flex-1 p-2 border rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add a skill"
                        />
                        <button
                          type="button"
                          onClick={addSkill}
                          className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {newCriteria.skillsRequired.map((skill, index) => (
                          <span
                            key={index}
                            className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                      >
                        Add Criteria
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingCriteria(false)}
                        className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Update Recruitment Process Form */}
              {isAddingProcess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-800">Update Recruitment Process</h2>
                    <button
                      onClick={() => setIsAddingProcess(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2" htmlFor="companyDetails">
                        Company Details
                      </label>
                      <textarea
                        id="companyDetails"
                        name="CompanyDetails"
                        value={formData.recruitmentProcess.CompanyDetails}
                        onChange={handleProcessChange}
                        rows="3"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {[1, 2, 3, 4, 5].map((round) => (
                        <div key={round}>
                          <label className="block text-gray-700 mb-2" htmlFor={`round${round}`}>
                            Round {round} Details
                          </label>
                          <textarea
                            id={`round${round}`}
                            name={`round${round}`}
                            value={formData.recruitmentProcess[`round${round}`]}
                            onChange={handleProcessChange}
                            rows="2"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Sample Questions</label>
                      <div className="flex mb-2">
                        <input
                          type="text"
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          className="flex-1 p-2 border rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add a sample question"
                        />
                        <button
                          type="button"
                          onClick={addQuestion}
                          className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {formData.recruitmentProcess.sampleQuestions.map((question, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span>{question}</span>
                            <button
                              type="button"
                              onClick={() => removeQuestion(question)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2" htmlFor="extraRequirements">
                        Extra Requirements
                      </label>
                      <textarea
                        id="extraRequirements"
                        name="ExtraRequirements"
                        value={formData.recruitmentProcess.ExtraRequirements}
                        onChange={handleProcessChange}
                        rows="2"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                      >
                        Update Process
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingProcess(false)}
                        className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCompanyDashboard;