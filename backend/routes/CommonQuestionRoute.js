import express from "express";
const router = express.Router();
import CommonQuestion from  "../models/CommonQuestion.js"
import mongoose from 'mongoose';
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
      res.status(201).json({
        message: 'Question created successfully',
        data: savedQuestion
      });
  
    } catch (error) {
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
        const { username, answer, code } = req.body; 
    
        if (!username || !answer) {
          return res.status(400).json({
            message: 'Missing required fields: username and answer'
          });
        }
    
        const newAnswer = {
          username,
          answer,
          code: code || '', 
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

// POST route to update votes for a specific answer
router.post('/:questionId/answers/:answerId/vote', async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const { action } = req.body; // 'upvote' or 'downvote'

    // Validate action
    if (!['upvote', 'downvote'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action. Use "upvote" or "downvote"' });
    }

    // Create update object based on action
    const update = {};
    if (action === "upvote") {
        update.$inc = { "answers.$.upvotes": 1 };
    } else if (action === "downvote") {
        update.$inc = { "answers.$.downvotes": 1 };
    } else {
        return res.status(400).json({ message: "Invalid action" });
    }
    

    const updatedQuestion = await CommonQuestion.findOneAndUpdate(
      { 
        _id: questionId,
        'answers._id': answerId 
      },
      update,
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question or answer not found' });
    }

    // Find the updated answer
    const updatedAnswer = updatedQuestion.answers.find(answer => 
      answer._id.toString() === answerId
    );

    res.status(200).json({
      message: 'Vote updated successfully',
      answer: {
        id: updatedAnswer._id,
        upvotes: updatedAnswer.upvotes,
        downvotes: updatedAnswer.downvotes
      }
    });

  } catch (error) {
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    res.status(500).json({ 
      message: 'Server error while updating vote',
      error: error.message 
    });
  }
});

router.delete('/:questionId/answers/:answerId', async (req, res) => {
  try {

    const { questionId, answerId } = req.params;

    // Validate MongoDB IDs
    if (!mongoose.Types.ObjectId.isValid(questionId) || 
        !mongoose.Types.ObjectId.isValid(answerId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Find the question and verify answer exists
    const question = await CommonQuestion.findById(questionId);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const answerExists = question.answers.some(answer => 
      answer._id.toString() === answerId
    );

    if (!answerExists) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    // Remove the answer using atomic operation
    const updatedQuestion = await CommonQuestion.findByIdAndUpdate(
      questionId,
      { $pull: { answers: { _id: answerId } } },
      { new: true }
    );

    res.status(200).json({
      message: 'Answer deleted successfully',
      updatedQuestion
    });

  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Failed to delete answer' 
    });
  }
});



router.post('/:questionId/answers/:answerId/reduce_vote', async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const { action } = req.body;

    // Validate action
    if (!['upvote', 'downvote'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Use "upvote" or "downvote"' });
    }

    // Determine which field to update
    const updateField = action === 'upvote' 
      ? 'answers.$.upvotes' 
      : 'answers.$.downvotes';

    // Find and update the answer
    const updatedQuestion = await CommonQuestion.findOneAndUpdate(
      {
        _id: questionId,
        'answers._id': answerId
      },
      {
        $inc: { [updateField]: -1 }
      },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question or answer not found' });
    }

    res.json({
      message: 'Vote updated successfully',
      question: updatedQuestion
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message || 'An error occurred while updating the vote'
    });
  }
});

export default router;