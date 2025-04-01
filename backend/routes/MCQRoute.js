import express from 'express';
const router = express.Router();
import Question from '../models/MCQ.js';

// Get all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get questions by language
router.get('/:language', async (req, res) => {
  try {
    const questions = await Question.find({ language: req.params.language });
    if (!questions.length) {
      return res.status(404).json({ message: 'No questions found for this language' });
    }
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get questions by language and type
router.get('/:language/:type', async (req, res) => {
  try {
    const questions = await Question.find({
      language: req.params.language,
      type: req.params.type
    });
    
    if (!questions.length) {
      return res.status(404).json({ 
        message: `No ${req.params.language} questions found for type ${req.params.type}`
      });
    }
    
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single question by ID
router.get('/id/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new question
router.post('/', async (req, res) => {
  const { language, type, question, options, correctOption, defaultExplanation } = req.body;
 
  if (options.length !== 4) {
    return res.status(400).json({ message: 'Exactly 4 options required' });
  }

  const newQuestion = new Question({
    language,
    type,
    question,
    options,
    correctOption,
    defaultExplanation
  });

  try {
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add user explanation to a question
router.post('/:id/explanations', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const { username, explanation } = req.body;
    if (!username || !explanation) {
      return res.status(400).json({ message: 'Username and explanation are required' });
    }
  
    question.userExplanations.push({
      username,
      explanation
    });

    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a question
router.patch('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Prevent updating user explanations through this route
    const { userExplanations, ...updateData } = req.body;
    
    Object.keys(updateData).forEach(key => {
      question[key] = updateData[key];
    });

    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a question
router.delete('/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Add this route to your backend (MCQ.js router)
router.delete('/:questionId/explanations/:explanationId', async (req, res) => {
    try {
      const question = await Question.findById(req.params.questionId);
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
  
      const explanationIndex = question.userExplanations.findIndex(
        exp => exp._id.toString() === req.params.explanationId
      );
  
      if (explanationIndex === -1) {
        return res.status(404).json({ message: 'Explanation not found' });
      }
  
      question.userExplanations.splice(explanationIndex, 1);
      await question.save();
  
      res.json({ message: 'Explanation deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
export default router;