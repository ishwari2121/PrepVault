import { useState } from 'react';
import axios from 'axios';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const analyzeResume = async () => {
    if (!resume || !jobDescription) {
      alert('Please upload a resume and provide a job description.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await axios.post('http://localhost:5000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }); 
      setAnalysis(response.data.response);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setAnalysis('Failed to analyze the resume. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">📄 Resume Analyzer</h1>
        
        <div className="mb-4">
          <label className="block font-semibold mb-2">Upload Resume (PDF):</label>
          <input type="file" accept=".pdf" onChange={handleFileChange} className="w-full p-2 border rounded bg-gray-700 text-white" />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Job Description:</label>
          <textarea
            className="w-full p-2 border rounded bg-gray-700 text-white"
            placeholder="Enter job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
        
        <button 
          onClick={analyzeResume} 
          disabled={loading} 
          className={`w-full p-3 rounded text-white font-bold transition ${loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
        
        {analysis && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Analysis Report:</h2>
            <Markdown 
                    rehypePlugins={[rehypeHighlight]} 
                    components={{
                      pre: ({ node, ...props }) => <pre {...props} className="output" />,
                    }}
                  >
                    {analysis}
                  </Markdown>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;
