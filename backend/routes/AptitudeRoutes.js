import express from 'express';
import AptitudeQuestion from '../models/AptitudeQuestions.js';
import mongoose from 'mongoose';
const router = express.Router();
const { ObjectId } = mongoose.Types;

// GET all aptitude questions
router.get('/', async (req, res) => {
    try {
      const { type } = req.query;
      const query = type ? { type } : {};
  
      const questions = await AptitudeQuestion.find(query).sort({ created_at: -1 });
  
      res.json({
        success: true,
        count: questions.length,
        data: questions
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  
// GET single aptitude question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await AptitudeQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }
    res.json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create new aptitude question
router.post('/', async (req, res) => {
  try {
    const { type, question, options, correctOption, default_explanation } = req.body;
    
    if (!type || !question || !options || !correctOption || !default_explanation) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    if (options.length !== 4) {
      return res.status(400).json({ success: false, error: 'Exactly 4 options required' });
    }
    
    if (correctOption < 0 || correctOption > 3) {
      return res.status(400).json({ success: false, error: 'Correct option must be between 0-3' });
    }
    
    const newQuestion = new AptitudeQuestion({
      type,
      question,
      options,
      correctOption,
      default_explanation
    });
    
    const savedQuestion = await newQuestion.save();
    res.status(201).json({ success: true, data: savedQuestion });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update aptitude question
router.put('/:id', async (req, res) => {
  try {
    const { type, question, options, correctOption, default_explanation } = req.body;
    
    const updates = {};
    if (type) updates.type = type;
    if (question) updates.question = question;
    if (options) {
      if (options.length !== 4) {
        return res.status(400).json({ success: false, error: 'Exactly 4 options required' });
      }
      updates.options = options;
    }
    if (correctOption !== undefined) {
      if (correctOption < 0 || correctOption > 3) {
        return res.status(400).json({ success: false, error: 'Correct option must be between 0-3' });
      }
      updates.correctOption = correctOption;
    }
    if (default_explanation) updates.default_explanation = default_explanation;
    
    const updatedQuestion = await AptitudeQuestion.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!updatedQuestion) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }
    
    res.json({ success: true, data: updatedQuestion });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE aptitude question
router.delete('/:id', async (req, res) => {
  try {
    const deletedQuestion = await AptitudeQuestion.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add user explanation to a question
router.post('/:id/explanations', async (req, res) => {
  try {
    const { username, explanation } = req.body;
    
    if (!username || !explanation) {
      return res.status(400).json({ success: false, error: 'Username and explanation required' });
    }
    
    const updatedQuestion = await AptitudeQuestion.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          users_explanation: {
            username,
            explanation
          }
        }
      },
      { new: true }
    );
    
    if (!updatedQuestion) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }
    
    res.status(201).json({ success: true, data: updatedQuestion });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all explanations for a question
router.get('/:id/explanations', async (req, res) => {
  try {
    const question = await AptitudeQuestion.findById(req.params.id).select('users_explanation');
    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }
    res.json({ success: true, data: question.users_explanation });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE a specific user explanation from a question
router.delete('/:questionId/explanations/:explanationId', async (req, res) => {
    try {
      const { questionId, explanationId } = req.params;
  
      // Validate ObjectId format
      if (!ObjectId.isValid(questionId)) {
        return res.status(400).json({ success: false, error: 'Invalid question ID format' });
      }
      if (!ObjectId.isValid(explanationId)) {
        return res.status(400).json({ success: false, error: 'Invalid explanation ID format' });
      }
  
      const updatedQuestion = await AptitudeQuestion.findByIdAndUpdate(
        questionId,
        {
          $pull: {
            users_explanation: { _id: explanationId }
          }
        },
        { new: true }
      );
  
      if (!updatedQuestion) {
        return res.status(404).json({ success: false, error: 'Question not found' });
      }
  
      // Check if the explanation was actually removed
      const explanationExists = updatedQuestion.users_explanation.some(
        exp => exp._id.toString() === explanationId
      );
  
      if (explanationExists) {
        return res.status(404).json({ 
          success: false, 
          error: 'Explanation not found or already deleted' 
        });
      }
  
      res.json({ 
        success: true, 
        message: 'Explanation deleted successfully',
        data: updatedQuestion 
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

export default router;