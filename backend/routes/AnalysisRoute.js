import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import ResumeAnalysis from '../models/ResumeAnalysisSchema.js'; // make sure path and .js extension are correct in ESM


const router = express.Router();

// Multer config to store PDF in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST Route - Upload PDF + Job Description
router.post('/analyze', upload.single('pdf'), async (req, res) => {
  try {
    const { username, jobDescription } = req.body;
    const file = req.file;

    if (!file || !jobDescription || !username) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Extract text from PDF
    const pdfData = await pdfParse(file.buffer);
    const extractedText = pdfData.text;

    // Simulated basic analysis (replace this with actual logic later)
    const analysis = `Based on the job description, this resume matches skills like: ${jobDescription.slice(0, 50)}...`;

    // Save to DB
    const newAnalysis = new ResumeAnalysis({
      username,
      jobDescription,
      analysis,
      pdf: file.buffer,
      pdftext: extractedText,
    });

    const saved = await newAnalysis.save();
    res.status(201).json(saved);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while analyzing the resume.' });
  }
});

// GET Route - Fetch all resume analysis or filter by username
router.get('/analyze/:id', async (req, res) => {
    try {
      const { id } = req.params;
        console.log(id);
      // Use id as username
      const analyses = await ResumeAnalysis.find({ username: id }).sort({ createdAt: -1 });
  
      res.status(200).json(analyses);
    } catch (error) {
      console.error('Error fetching analyses:', error);
      res.status(500).json({ error: 'Failed to fetch analyses' });
    }
  });
  
export default router;
