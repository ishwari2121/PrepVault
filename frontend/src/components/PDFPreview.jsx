import React, { useState, useEffect } from 'react';
import { FiLoader, FiX } from 'react-icons/fi';

const PDFPreview = ({ analysisId }) => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/resume/preview/${analysisId}`);
        
        if (!response.ok) {
          throw new Error('Failed to load PDF');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPDF();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [analysisId]);

  return (
    <div className="relative h-[600px] bg-gray-900 rounded-lg overflow-hidden border border-cyan-500/30">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <FiLoader className="animate-spin text-cyan-400 text-2xl mr-2" />
          <span className="text-cyan-300">Loading PDF...</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/50">
          <span className="text-red-300">{error}</span>
        </div>
      )}

      {pdfUrl && (
        <iframe 
          src={pdfUrl}
          className="w-full h-full"
          title="PDF Preview"
          onLoad={() => setLoading(false)}
        />
      )}
    </div>
  );
};

export default PDFPreview;