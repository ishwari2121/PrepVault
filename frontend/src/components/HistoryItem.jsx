import React, { useState } from 'react';
import { FiDownload, FiFileText, FiX, FiPrinter } from 'react-icons/fi';
import PDFPreview from './PDFPreview';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

const HistoryItem = ({ item }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showResponseOnly, setShowResponseOnly] = useState(false);

  const downloadPDF = async () => {
    window.open(`http://localhost:5000/api/resume/download/${item._id}`, '_blank');
  };

  const printAnalysis = () => {
    setShowPrintModal(true);
  };

  const formatMarkdownForPrint = (markdown) => {
    // Convert markdown to HTML with proper formatting
    return markdown
      .replace(/^### (.*$)/gm, '<h3>$1</h3>') // Headers
      .replace(/^\* (.*$)/gm, '<li>$1</li>') // List items
      .replace(/^▶ (.*$)/gm, '<li class="recommendation">$1</li>') // Recommendations
      .replace(/^✓ (.*$)/gm, '<li class="strength">✓ $1</li>') // Strengths
      .replace(/^X (.*$)/gm, '<li class="improvement">X $1</li>') // Improvements
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\n\n/g, '</div><div>') // Paragraphs
      .replace(/<\/li>\n<li/g, '</li><li'); // Fix list items
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const formattedContent = formatMarkdownForPrint(item.response);
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Resume Analysis Report</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px; 
            }
            h1 { 
              color: #2c3e50; 
              border-bottom: 2px solid #3498db; 
              padding-bottom: 10px; 
              text-align: center;
            }
            h2 { 
              color: #2980b9; 
              margin-top: 20px; 
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            h3 {
              color: #2c3e50;
              margin-top: 15px;
            }
            ul { 
              padding-left: 20px; 
              list-style-type: none;
            }
            li {
              margin-bottom: 8px;
              padding-left: 20px;
              position: relative;
            }
            .strength:before {
              content: "✓";
              position: absolute;
              left: 0;
              color: green;
            }
            .improvement:before {
              content: "X";
              position: absolute;
              left: 0;
              color: red;
            }
            .recommendation:before {
              content: "▶";
              position: absolute;
              left: 0;
              color: #3498db;
            }
            .score { 
              font-size: 1.2em; 
              font-weight: bold; 
              color: #27ae60; 
            }
            .section { 
              margin-bottom: 20px; 
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
            }
            .date {
              color: #7f8c8d;
              text-align: center;
              margin-bottom: 20px;
            }
            @media print {
              body { 
                font-size: 12pt; 
              }
              button { 
                display: none; 
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Resume Analysis Report</h1>
            <p class="date">Generated on ${new Date(item.createdAt).toLocaleDateString()}</p>
          </div>
          <div id="print-content">${formattedContent}</div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 200);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-gray-900/50 p-4 rounded-xl border border-cyan-500/20 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-cyan-400 font-semibold mb-2 truncate">
            {item.pdf?.filename || 'Resume Analysis'}
          </h3>
          <p className="text-gray-300 text-sm line-clamp-2">
            {item.jobDescription}
          </p>
        </div>

        <div className="flex gap-2 ml-4">
          {item.pdf && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              title={showPreview ? 'Hide preview' : 'Preview PDF and Analysis'}
            >
              {showPreview ? <FiX /> : <FiFileText />}
            </button>
          )}
          <button
            onClick={printAnalysis}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            title="Print analysis"
          >
            <FiPrinter />
          </button>
          <button
            onClick={() => setShowResponseOnly(!showResponseOnly)}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            title={showResponseOnly ? 'Hide analysis only' : 'Show only analysis'}
          >
            <FiFileText />
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="mt-4 space-y-4">
          {/* PDF Preview */}
          {item.pdf && <PDFPreview analysisId={item._id} />}

          {/* Full Analysis Markdown Preview */}
          <div className="prose prose-invert max-w-none bg-gray-900 p-4 rounded-lg">
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {item.response}
            </Markdown>
          </div>
        </div>
      )}

      {/* Only response popdown */}
      {showResponseOnly && (
        <div className="mt-2 bg-gray-900 border border-cyan-700/30 p-4 rounded-lg">
          <div className="prose prose-invert max-w-none">
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {item.response}
            </Markdown>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        {item.pdf && (
          <button
            onClick={downloadPDF}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 text-sm"
            title="Download PDF"
          >
            <FiDownload className="text-base" />
            Download
          </button>
        )}
        <span className="text-xs text-gray-400">
          {new Date(item.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      </div>

      {/* Print Modal */}
      {showPrintModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPrintModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
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
                <Markdown rehypePlugins={[rehypeHighlight]}>
                  {item.response}
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
    </div>
  );
};

export default HistoryItem;