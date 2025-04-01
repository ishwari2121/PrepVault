import { ATSAnalyzer } from '../utils/atsAnalyzer.js';
import { extractTextFromPDF } from '../utils/atsAnalyzer.js';

export const analyzeResume = async (req, res) => {
    try {
        const { jobDescription, analysisType } = req.body;
        const pdfBuffer = req.file.buffer;

        const pdfText = await extractTextFromPDF(pdfBuffer);
        const analysis = await ATSAnalyzer.analyze(pdfText, jobDescription, analysisType);

        res.json(analysis);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Analysis failed', details: error.message });
    }
};