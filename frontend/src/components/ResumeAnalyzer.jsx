import { useState } from 'react';
import axios from 'axios';

const ResumeAnalyzer = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !jobDescription) {
          alert('Please upload a PDF and enter job description');
          return;
        }
      
        setLoading(true);
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('job_description', jobDescription);
      
        try {
          const response = await axios.post(
            'http://localhost:5000/api/analyze', // Directly specify the Node.js server URL
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          setAnalysis(response.data.analysis);
        } catch (error) {
          console.error('Analysis error:', error);
          alert(`Error: ${error.response?.data?.error || error.message}`);
        }
        setLoading(false);
      };

    return (
        <div className="resume-analyzer">
            <h2>AI Resume Analyzer</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Job Description:</label>
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Resume (PDF):</label>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        accept="application/pdf"
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Analyzing...' : 'Start Analysis'}
                </button>
            </form>

            {analysis && (
                <div className="analysis-results">
                    <h3>Analysis Report:</h3>
                    <pre>{analysis}</pre>
                </div>
            )}
        </div>
    );
};

export default ResumeAnalyzer;