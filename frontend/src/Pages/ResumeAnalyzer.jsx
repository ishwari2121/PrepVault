import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiFileText, FiLoader, FiAlertCircle, FiX } from 'react-icons/fi';
import { FaRobot, FaRegLightbulb, FaMagic, FaCheck } from 'react-icons/fa';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showParticles, setShowParticles] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  function formatAnalysis(rawText) {
    if (!rawText) return '';
    
    return rawText
      .replace(/([^\n])\n([^\n])/g, '$1  \n$2')
      .replace(/\n{2,}/g, '\n\n')
      .replace(/(Resume Score|Good Points|Bad Points|Improvement Suggestions):/gi, '### $1')
      .replace(/(✔|✓|✅)/g, '- $1 ')
      .replace(/(❌|✘|⚠)/g, '- $1 ');
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
      setResume(e.dataTransfer.files[0]);
      setError('');
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
      const response = await axios.post('http://localhost:5000/analyze', formData);
      setShowParticles(true);
      setTimeout(() => {
        setAnalysis(formatAnalysis(response.data.response));
        setShowParticles(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume. Please try again.');
    }
    setLoading(false);
  };

  const particleVariants = {
    initial: { scale: 0, opacity: 1 },
    explode: {
      scale: [1, 2],
      opacity: [1, 0],
      x: [-100, 100, -50, 50, 0],
      y: [-50, 100, -100, 50, 0],
      transition: { duration: 1.5, ease: "easeOut" }
    }
  };

  const resultVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1 }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative overflow-hidden"
        >


          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'linear-gradient(45deg, #00f2ff, #4d00ff)',
                'linear-gradient(135deg, #4d00ff, #00f2ff)'
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            style={{ opacity: 0 }} // Make the box transparent
          />
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4 relative z-10">
            <motion.span
              animate={{ textShadow: [
                '0 0 10px rgba(34,211,238,0)',
                '0 0 10px rgba(34,211,238,0.5)',
                '0 0 10px rgba(34,211,238,0)'
              ]}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              AI Resume Analyzer
            </motion.span>
          </h1>
          <p className="text-xl text-cyan-100/80 font-light">
            Transform Your Resume with AI-Powered Insights
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Upload Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="md:col-span-1"
          >
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/30 shadow-2xl h-full">
              <label className="block font-medium text-cyan-100 mb-4">
                Upload Resume
              </label>
              <motion.div
                whileHover={{ scale: 1.02 }}
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
                
                <motion.div
                  animate={{
                    borderColor: ['rgba(34,211,238,0.3)', 'rgba(34,211,238,0.6)', 'rgba(34,211,238,0.3)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 border-2 rounded-2xl"
                />
                
                {resume ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
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
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-400 mt-2 flex items-center gap-1"
                    >
                      <FaCheck className="text-sm" />
                      Uploaded
                    </motion.div>
                  </motion.div>
                ) : (
                  <div className="text-center p-4">
                    <FiUpload className="text-4xl text-cyan-400 mb-4 mx-auto animate-bounce" />
                    <p className="text-cyan-200 mb-1">Drag & Drop</p>
                    <p className="text-sm text-cyan-400/60">or click to browse</p>
                    <p className="text-xs mt-4 text-cyan-500/60">PDF files only</p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Job Description Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border-2 border-cyan-500/30 shadow-2xl h-full">
              <label className="block font-medium text-cyan-100 mb-4">
                Job Description
              </label>
              <motion.div
                animate={{
                  borderColor: ['rgba(34,211,238,0.2)', 'rgba(34,211,238,0.4)', 'rgba(34,211,238,0.2)'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="rounded-xl border-2 bg-gray-900/20"
              >
                <textarea
                  className="w-full h-64 p-4 bg-transparent text-cyan-100 placeholder-cyan-400/60 focus:outline-none resize-none scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent"
                  placeholder="Paste the job description here. For example, briefly describe the role, key responsibilities, and required skills for the position so we can analyze your resume's company fit."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </motion.div>
            </div>
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
        <motion.div className="text-center mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={analyzeResume}
            disabled={loading}
            className={`relative overflow-hidden px-12 py-4 rounded-full text-xl font-bold ${
              loading ? 'bg-gray-700' : 'bg-gradient-to-r from-cyan-500 to-blue-600'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <FiLoader className="animate-spin" />
                Analyzing...
              </div>
            ) : (
              <>
                <FaMagic className="inline-block mr-3" />
                Generate Magic Insights
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 opacity-50"
                />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Particle Animation */}
        <AnimatePresence>
          {showParticles && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  variants={particleVariants}
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
              className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border-2 border-cyan-500/30 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-8">
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

              <motion.div
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <Markdown 
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    h3: ({ node, ...props }) => (
                      <motion.h3 
                        variants={resultVariants}
                        className="text-2xl font-semibold text-cyan-300 mb-4"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <motion.ul 
                        variants={resultVariants}
                        className="space-y-4 pl-6 list-disc text-gray-300"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <motion.li
                        variants={listItemVariants}
                        custom={props.index}
                        className="pl-2"
                        {...props}
                      />
                    )
                  }}
                >
                  {analysis}
                </Markdown>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;