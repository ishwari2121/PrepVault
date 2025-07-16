import React, { useState, useEffect, useRef,useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiFileText, FiLoader, FiAlertCircle, FiX, FiDownload, FiClock, FiPrinter, FiSearch } from 'react-icons/fi';
import { FaMagic, FaRegLightbulb, FaCheck, FaStar } from 'react-icons/fa';
import { RiBubbleChartFill } from 'react-icons/ri';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import HistoryItem from '../components/HistoryItem';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

// Animation variants
const floatingVariants = {
  float: {
    y: [0, -15, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const blobVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: (i) => ({
    scale: 1,
    opacity: 0.08,
    transition: {
      delay: i * 0.15,
      duration: 1.8,
      type: "spring",
      damping: 6
    }
  })
};

const particleVariants = {
  initial: { scale: 0, opacity: 1 },
  explode: (i) => ({
    scale: [1, 2],
    opacity: [1, 0],
    x: [-100 + i * 10, 100 - i * 10],
    y: [-50 + i * 5, 100 - i * 5],
    transition: { 
      duration: 1.5 + i * 0.1,
      ease: "easeOut"
    }
  })
};

const resultVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      type: "spring",
      stiffness: 100
    }
  }
};

function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext); 
  const [error, setError] = useState('');
  const [showParticles, setShowParticles] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('analyze');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const printRef = useRef();
  const navigate = useNavigate();

  function formatAnalysis(rawText) {
    if (!rawText) return '';
    
    let formatted = rawText
      .replace(/^# (.*$)/gm, '\n# $1\n')
      .replace(/^### (.*$)/gm, '\n### $1\n')
      .replace(/^\*\*([^*]+)\*\*/gm, '**$1**\n')
      .replace(/^\* -/gm, '*')
      .replace(/(✓|✔|✅)/g, '✅')
      .replace(/(✘|❌|⚠)/g, '❌')
      .replace(/▶/g, '➡️')
      .replace(/\n{3,}/g, '\n\n');

    formatted = formatted.replace(/(### [^\n]+)/g, '\n\n$1\n\n');
    return formatted;
  }


  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
      setError('');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setResume(file);
        setError('');
      } else {
        setError('Only PDF files are allowed');
      }
    }
  };

  const removeFile = () => {
    setResume(null);
  };

  const analyzeResume = async () => {
    if (!resume) {
      setError('Please upload a resume file');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jobDescription', jobDescription);
    
    try {
      const response = await axios.post('http://localhost:5000/analyze', formData,{
        withCredentials: true,
    });
      const responseData = response.data.response;
      
      setShowParticles(true);
      setTimeout(async () => {
        const formattedAnalysis = formatAnalysis(responseData);
        setAnalysis(formattedAnalysis);
        setShowParticles(false);
        const dbFormData = new FormData();
        dbFormData.append("username", user.username);
        dbFormData.append("jobDescription", jobDescription);
        dbFormData.append("response", formattedAnalysis);
        dbFormData.append("pdf", resume);

        await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/resume/create`, dbFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        fetchHistory();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/resume/user-history`,
        {
          withCredentials: true,
        }
      );
      setHistory(response.data);
    } catch (err) {
      console.error("Error fetching history", err);
    }
  };

  const handleShowHistory = async () => {
    if (!showHistory) {
      await fetchHistory();
    }
    setShowHistory(!showHistory);
    setActiveTab(showHistory ? 'analyze' : 'history');
  };

  const downloadPDF = (id, filename) => {
    window.open(`${import.meta.env.VITE_APP_BACKEND_URL}/resume/download/${id}`, '_blank');
  };

  const printAnalysis = () => {
    setShowPrintModal(true);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume Analysis Report</title>
          <meta charset="utf-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            body {
              font-family: 'Inter', sans-serif;
              line-height: 1.6;
              color: #1a202c;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
            }
            
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #3182ce;
            }
            
            h1 {
              color: #2b6cb0;
              font-size: 28px;
              margin-bottom: 10px;
              font-weight: 700;
            }
            
            h2 {
              font-size: 22px;
              color: #2c5282;
              margin: 30px 0 15px;
              padding-bottom: 5px;
              border-bottom: 1px solid #bee3f8;
              font-weight: 600;
            }
            
            h3 {
              font-size: 18px;
              margin: 25px 0 15px;
              color: #3182ce;
              font-weight: 600;
            }
            
            ul, ol {
              padding-left: 24px;
              margin: 15px 0;
            }
            
            li {
              margin-bottom: 8px;
              position: relative;
              padding-left: 28px;
            }
            
            li:before {
              position: absolute;
              left: 0;
            }
            
            li:has(> :first-child:contains("✅")):before,
            li:contains("✅"):before {
              content: "✅";
              color: #38a169;
            }
            
            li:has(> :first-child:contains("❌")):before,
            li:contains("❌"):before {
              content: "❌";
              color: #e53e3e;
            }
            
            li:has(> :first-child:contains("➡️")):before,
            li:contains("➡️"):before {
              content: "➡️";
              color: #3182ce;
            }
            
            li:not(:has(> :first-child:contains("✅")):not(:has(> :first-child:contains("❌")):not(:has(> :first-child:contains("➡️")):not(:contains("✅")):not(:contains("❌")):not(:contains("➡️")):before {
              content: "•";
              color: #4a5568;
            }
            
            .score {
              font-size: 24px;
              font-weight: bold;
              color: #2b6cb0;
              margin: 15px 0;
            }
            
            strong {
              color: #2b6cb0;
              font-weight: 600;
            }
            
            .meta-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              color: #718096;
              font-size: 14px;
            }
            
            p {
              margin: 12px 0;
            }
            
            .analysis-content {
              white-space: pre-wrap;
            }
            
            @media print {
              body {
                font-size: 12pt;
                padding: 20px;
              }
              
              h1 {
                font-size: 24pt;
              }
              
              h2 {
                font-size: 18pt;
                page-break-after: avoid;
              }
              
              h3 {
                font-size: 14pt;
              }
              
              ul, ol {
                page-break-inside: avoid;
              }
              
              .header {
                margin-bottom: 30px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Resume Analysis Report</h1>
            <div class="meta-info">
              <div>Generated: ${new Date().toLocaleDateString()}</div>
              <div>Filename: ${resume?.name || 'N/A'}</div>
            </div>
          </div>
          <div class="analysis-content">${analysis.replace(/\n/g, '<br>')}</div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
    };
  };

  const MarkdownRenderers = {
    h1: ({node, ...props}) => (
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-cyan-400 mb-6 pb-4 border-b border-cyan-500/30"
      >
        {props.children}
      </motion.h1>
    ),
    h2: ({node, ...props}) => (
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-bold text-cyan-300 mt-8 mb-4 pb-2 border-b border-cyan-500/20"
      >
        {props.children}
      </motion.h2>
    ),
    h3: ({node, ...props}) => (
      <motion.h3 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold text-cyan-200 mt-6 mb-3 p-3 bg-cyan-900/20 rounded-lg"
      >
        {props.children}
      </motion.h3>
    ),
    ul: ({node, ...props}) => (
      <motion.ul 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="space-y-3 my-4 pl-6"
      >
        {props.children}
      </motion.ul>
    ),
    li: ({node, ...props}) => {
      const content = React.Children.toArray(props.children);
      const hasCheck = content.some(child => 
        typeof child === 'string' && (child.includes('✅') || child.includes('✓'))
      );
      const hasCross = content.some(child => 
        typeof child === 'string' && (child.includes('❌') || child.includes('✘'))
      );
      const hasArrow = content.some(child => 
        typeof child === 'string' && child.includes('➡️')
      );
      
      return (
        <motion.li
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`relative pl-8 ${hasCheck ? 'text-green-300' : hasCross ? 'text-red-300' : hasArrow ? 'text-blue-300' : 'text-gray-300'}`}
        >
          <span className="absolute left-0 top-0.5">
            {hasCheck ? '✅' : hasCross ? '❌' : hasArrow ? '➡️' : '•'}
          </span>
          <div className="pl-2">
            {content.map((child, i) => 
              typeof child === 'string' 
                ? child.replace(/✅|✓|❌|✘|➡️/g, '')
                : child
            )}
          </div>
        </motion.li>
      );
    },
    p: ({node, ...props}) => (
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="my-4 text-gray-300 leading-relaxed"
      >
        {props.children}
      </motion.p>
    ),
    strong: ({node, ...props}) => (
      <motion.strong 
        whileHover={{ scale: 1.05 }}
        className="text-cyan-300 font-semibold"
      >
        {props.children}
      </motion.strong>
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8 overflow-hidden relative">
      {/* Background elements */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        initial="initial"
        animate="animate"
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            variants={blobVariants}
            custom={i}
            className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </motion.div>

      {/* Floating shapes */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={floatingVariants}
            animate="float"
            className="absolute opacity-10"
            style={{
              left: `${10 + i * 15}%`,
              top: `${Math.random() * 100}%`,
              width: `${50 + i * 10}px`,
              height: `${50 + i * 10}px`,
              background: `linear-gradient(45deg, #06b6d4${i * 10}%, #8b5cf6${100 - i * 10}%)`,
              borderRadius: i % 2 === 0 ? '50%' : '30%'
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-center mb-12 relative overflow-hidden"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-8 -left-8 text-cyan-400/20"
            >
              <RiBubbleChartFill size={120} />
            </motion.div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4 relative">
              AI Resume Analyzer
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-6"
              >
                <FaStar className="text-yellow-400/60 text-xl" />
              </motion.div>
            </h1>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-cyan-100/80 font-light flex items-center justify-center gap-2"
          >
            <span className="h-px w-16 bg-cyan-400/30" />
            Transform Your Resume with AI-Powered Insights
            <span className="h-px w-16 bg-cyan-400/30" />
          </motion.p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800/60 rounded-full p-1 inline-flex relative overflow-hidden">
            <motion.div
              animate={{
                background: [
                  'linear-gradient(90deg, #06b6d4 0%, #8b5cf6 50%, #06b6d4 100%)',
                  'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 50%, #8b5cf6 100%)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 opacity-30 blur-xl"
            />
            <button
              onClick={() => setActiveTab('analyze')}
              className={`relative px-6 py-2 rounded-full transition-colors cursor-pointer ${
                activeTab === 'analyze' ? 'bg-cyan-600 text-white' : 'text-cyan-300 hover:text-white'
              }`}
            >
              Analyze
            </button>
            <button
              onClick={() => {
                setActiveTab('history');
                fetchHistory();
              }}
              className={`relative px-6 py-2 rounded-full transition-colors cursor-pointer ${
                activeTab === 'history' ? 'bg-cyan-600 text-white' : 'text-cyan-300 hover:text-white'
              }`}
            >
              History
            </button>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'analyze' ? (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Upload Card */}
              <motion.div 
                className="md:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/30 shadow-2xl h-full relative overflow-hidden"
                >
                  <motion.div
                    animate={{ x: [-100, 100, -100] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
                  />
                  <label className="block font-medium text-cyan-100 mb-4 flex items-center gap-2">
                    <span className="bg-cyan-500/10 px-3 py-1 rounded-full text-sm">Step 1</span>
                    Upload Resume
                  </label>
                  <motion.div
                    className={`relative aspect-square border-3 border-dashed rounded-2xl flex items-center justify-center cursor-pointer group overflow-hidden transition-colors ${
                      dragActive ? 'border-cyan-400 bg-cyan-900/20' : 'border-cyan-400/30'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label 
                      htmlFor="resume-upload"
                      className="absolute inset-0 w-full h-full cursor-pointer z-10"
                    />
                    {resume ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center p-4 text-cyan-300 w-full h-full flex flex-col items-center justify-center relative"
                      >
                        <button 
                          onClick={removeFile}
                          className="absolute top-2 right-2 p-1 rounded-full bg-gray-700/50 hover:bg-gray-600 transition-colors"
                        >
                          <FiX className="text-sm" />
                        </button>
                        <FiFileText className="text-4xl mb-3 mx-auto" />
                        <p className="font-medium truncate px-4 w-full">{resume.name}</p>
                        <motion.div 
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="text-green-400 mt-2 flex items-center gap-1"
                        >
                          <FaCheck className="text-sm" />
                          Uploaded
                        </motion.div>
                      </motion.div>
                    ) : (
                      <div className="text-center p-4">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <FiUpload className="text-4xl text-cyan-400 mb-4 mx-auto" />
                        </motion.div>
                        <p className="text-cyan-200 mb-1">Drag & Drop</p>
                        <p className="text-sm text-cyan-400/60">or click to browse</p>
                        <p className="text-xs mt-4 text-cyan-500/60">PDF files only</p>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Job Description Card */}
              <motion.div 
                className="md:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/30 shadow-2xl h-full relative"
                >
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-20 pointer-events-none" />
                  <label className="block font-medium text-cyan-100 mb-4 flex items-center gap-2">
                    <span className="bg-cyan-500/10 px-3 py-1 rounded-full text-sm">Step 2</span>
                    Job Description
                  </label>
                  <div className="rounded-xl bg-gray-900/20 relative">
                    <div className="absolute inset-0.5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
                    <textarea
                      className="w-full h-64 p-4 bg-transparent text-cyan-100 placeholder-cyan-400/60 focus:outline-none resize-none relative z-10"
                      placeholder="🚀 Paste the job description here to get a tailored analysis!
Our AI will evaluate how well your resume aligns with the role, identify key strengths, potential weaknesses, and suggest actionable improvements to boost your chances in perticular company."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-3 bg-red-900/50 border border-red-400/30 rounded-lg text-red-200">
                    <FiAlertCircle className="flex-shrink-0" />
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analyze Button */}
            <motion.div 
              className="text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  background: [
                    'linear-gradient(45deg, #06b6d4, #8b5cf6)',
                    'linear-gradient(135deg, #8b5cf6, #06b6d4)'
                  ]
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ 
                  scale: { type: 'spring', stiffness: 300 },
                  background: { duration: 2, repeat: Infinity }
                }}
                onClick={analyzeResume}
                disabled={loading}
                className="relative overflow-hidden px-12 py-4 rounded-full text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 cursor-pointer"
              >
                <div className="absolute inset-0 bg-noise opacity-10" />
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FaMagic className="inline-block mr-3 " />
                      Generate Magic Insights
                    </>
                  )}
                </div>
              </motion.button>
            </motion.div>

            {/* Particle Animation */}
            <AnimatePresence>
              {showParticles && (
                <div className="absolute inset-0 pointer-events-none z-20">
                  {[...Array(40)].map((_, i) => (
                    <motion.div
                      key={i}
                      variants={particleVariants}
                      custom={i}
                      initial="initial"
                      animate="explode"
                      exit={{ opacity: 0 }}
                      className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`
                      }}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Results Section */}
            <AnimatePresence>
              {analysis && (
                <motion.div
                  variants={resultVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border-2 border-cyan-500/30 shadow-2xl mb-12 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-10" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={{ rotate: [0, 20, -20, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <FaRegLightbulb className="text-3xl text-cyan-400" />
                        </motion.div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                          Expert Analysis
                        </h2>
                      </div>
                      <button
                        onClick={printAnalysis}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
                      >
                        <FiPrinter /> Print
                      </button>
                    </div>
                    <div ref={printRef} className="analysis-content">
                      <Markdown 
                        rehypePlugins={[rehypeHighlight]}
                        components={MarkdownRenderers}
                        className="prose prose-invert max-w-none"
                      >
                        {analysis}
                      </Markdown>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* History Tab */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/60 border border-cyan-500/30 rounded-xl p-6 mb-10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-noise opacity-5" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-cyan-300">
                  <FiClock className="inline mr-2" />
                  Analysis History
                </h2>
                <div className="flex items-center gap-4">
                {/* Search Bar for History */}
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search history..."
                      className="pl-10 pr-4 py-2 bg-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <button
                    onClick={() => fetchHistory()}
                    className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-2 cursor-pointer"
                  >
                    Refresh
                  </button>
                </div>
              </div>
              
              {history.filter(item => 
                item.pdf?.filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.jobDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.response?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">
                    {searchQuery ? 'No matching results found' : 'No analysis history yet'}
                  </p>
                  <button
                    onClick={() => setActiveTab('analyze')}
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Analyze your first resume
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {history
                    .filter(item => 
                      item.pdf?.filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.jobDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.response?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((item) => (
                      <HistoryItem 
                        key={item._id} 
                        item={item} 
                        onDelete={() => fetchHistory()} 
                      />
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Print Modal */}
        <AnimatePresence>
          {showPrintModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
              onClick={() => setShowPrintModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border-2 border-cyan-500/30 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                  <h3 className="text-xl font-bold text-cyan-400">Print Preview</h3>
                  <button
                    onClick={() => setShowPrintModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <div className="overflow-y-auto p-6 bg-gray-900 flex-1">
                  <div className="prose prose-invert max-w-none">
                    <Markdown rehypePlugins={[rehypeHighlight]} components={MarkdownRenderers}>
                      {analysis}
                    </Markdown>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
                  <button
                    onClick={() => setShowPrintModal(false)}
                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition-colors flex items-center gap-2"
                  >
                    <FiPrinter /> Print Report
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;