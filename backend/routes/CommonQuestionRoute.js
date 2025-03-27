const express = require('express');
const router = express.Router();
const CommonQuestion = require('../models/CommonQuestion');

router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    
    const questions = await CommonQuestion.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      count: questions.length,
      data: questions
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const question = await CommonQuestion.findById(req.params.id)
      .select('-__v');

    if (!question) {
      return res.status(404).json({ 
        message: 'Question not found' 
      });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

router.post('/add-Question', async (req, res) => {
    try {
      const { type, question } = req.body;
      console.log("Received request:", { type, question });
  
      // Check for existing question (case-insensitive)
      const existingQuestion = await CommonQuestion.findOne({ 
        question: { $regex: new RegExp(`^${question}$`, 'i') }
      });
  
      if (existingQuestion) {
        return res.status(400).json({ 
          message: 'Question already exists',
          existingId: existingQuestion._id
        });
      }
  
      const newQuestion = new CommonQuestion({
        type,
        question
      });
  
      const savedQuestion = await newQuestion.save();
      console.log("Saved question:", savedQuestion);
  
      res.status(201).json({
        message: 'Question created successfully',
        data: savedQuestion
      });
  
    } catch (error) {
      console.error("Full error:", error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          message: 'Validation error',
          error: error.message
        });
      }
      res.status(500).json({
        message: 'Server error',
        error: error.message
      });
    }
  });

// POST add answer to a question
router.post('/answers/:id', async (req, res) => {
    try {
        const questionId = req.params.id;
        const { username, answer, code } = req.body; // Added code field
    
        // Validate input
        if (!username || !answer) {
          return res.status(400).json({
            message: 'Missing required fields: username and answer'
          });
        }
    
        const newAnswer = {
          username,
          answer,
          code: code || '', // Handle optional code field
          upvotes: 0,
          downvotes: 0,
          createdAt: new Date()
        };
    
        const updatedQuestion = await CommonQuestion.findByIdAndUpdate(
          questionId,
          { $push: { answers: newAnswer } },
          { new: true, runValidators: true }
        ).select('-__v');
    
        if (!updatedQuestion) {
          return res.status(404).json({ 
            message: 'Question not found' 
          });
        }
    
        res.status(201).json({
          message: 'Answer added successfully',
          question: updatedQuestion
        });
    
      } catch (error) {
        if (error.name === 'CastError') {
          return res.status(400).json({ 
            message: 'Invalid question ID format' 
          });
        }
        res.status(500).json({ 
          message: 'Server error',
          error: error.message 
        });
      }
    });

module.exports = router;