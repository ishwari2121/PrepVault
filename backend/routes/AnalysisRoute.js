import express from 'express';
import Analysis from '../models/ResumeAnalysisSchema.js';
import upload from '../middleware/upload.js';
import { authMiddleware } from "../middleware/middleware.js";

const router = express.Router();

// Create new analysis
router.post('/create', upload.single('pdf'), async (req, res) => {
  try {
    const { username, jobDescription, response } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const newAnalysis = new Analysis({
      username,
      jobDescription,
      response,
      pdf: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      }
    });

    await newAnalysis.save();
    res.status(201).json({
      message: 'Analysis saved successfully',
      id: newAnalysis._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user history
router.get('/user-history', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const history = await Analysis.find({ username: user.username })
      .select('jobDescription pdf response createdAt')
      .sort({ createdAt: -1 })

    res.json(history.map(item => ({
      _id: item._id,
      jobDescription: item.jobDescription,
      response: item.response,
      createdAt: item.createdAt,
      pdf: {
        filename: item.pdf.filename,
        contentType: item.pdf.contentType
      }
    })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Preview PDF
router.get('/preview/:id', async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    
    if (!analysis?.pdf?.data) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    res.set({
      'Content-Type': analysis.pdf.contentType,
      'Content-Disposition': `inline; filename="${analysis.pdf.filename}"`
    });

    res.send(analysis.pdf.data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Download PDF
router.get('/download/:id', async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    
    if (!analysis?.pdf?.data) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    res.set({
      'Content-Type': analysis.pdf.contentType,
      'Content-Disposition': `attachment; filename="${analysis.pdf.filename}"`
    });

    res.send(analysis.pdf.data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;