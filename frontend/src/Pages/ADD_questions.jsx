import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './que.css';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';

const QuestionForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    language: '',
    type: '',
    question: '',
    options: ['', '', '', ''],
    correctOption: '',
    defaultExplanation: ''
  });
  
  const [languageTypes, setLanguageTypes] = useState({
    'C++': ['OOP', 'References', 'Objects', 'Functions'],
    'Java': [
      'Declarations and Language Fundamental',
      'Operator and Assignment',
      'Flow Control',
      'Exceptions',
      'Object',
      'Collection',
      'Inner Classes',
      'Threads',
      'Garbage Collection',
      'Assertion'
    ]
  });
  
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const validate = () => {
    const newErrors = {};
    
    if (!formData.language) newErrors.language = 'Language is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.question || formData.question.length < 10) newErrors.question = 'Question must be at least 10 characters';
    
    const optionsError = formData.options.some(opt => !opt.trim()) ? 
      'All options must be filled' : null;
    if (optionsError) newErrors.options = optionsError;
    
    if (formData.correctOption === '' || formData.correctOption === null) {
      newErrors.correctOption = 'Please select the correct option';
    }
    
    if (!formData.defaultExplanation) newErrors.defaultExplanation = 'Explanation is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      const response = await axios.post('http://localhost:5000/api/MCQ', formData);
      setSnackbar({
        open: true,
        message: 'Question added successfully!',
        severity: 'success'
      });
      
      // Reset form after successful submission
      setFormData({
        language: '',
        type: '',
        question: '',
        options: ['', '', '', ''],
        correctOption: '',
        defaultExplanation: ''
      });
      
    } catch (error) {
      console.error('Error adding question:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to add question',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Question
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Language Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.language}>
                <InputLabel>Language</InputLabel>
                <Select
                  name="language"
                  value={formData.language}
                  label="Language"
                  onChange={handleChange}
                >
                  <MenuItem value="C++">C++</MenuItem>
                  <MenuItem value="Java">Java</MenuItem>
                </Select>
                {errors.language && <FormHelperText>{errors.language}</FormHelperText>}
              </FormControl>
            </Grid>
            
            {/* Type Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Type"
                  onChange={handleChange}
                  disabled={!formData.language}
                >
                  {formData.language && languageTypes[formData.language].map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
                {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
              </FormControl>
            </Grid>
            
            {/* Question Text */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Question"
                name="question"
                value={formData.question}
                onChange={handleChange}
                multiline
                rows={3}
                error={!!errors.question}
                helperText={errors.question}
              />
            </Grid>
            
            {/* Options */}
            {[0, 1, 2, 3].map(index => (
              <Grid item xs={12} md={6} key={index}>
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={formData.options[index]}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  error={!!errors.options}
                />
                {index === 0 && errors.options && (
                  <FormHelperText error>{errors.options}</FormHelperText>
                )}
              </Grid>
            ))}
            
            {/* Correct Option */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.correctOption}>
                <InputLabel>Correct Option</InputLabel>
                <Select
                  name="correctOption"
                  value={formData.correctOption}
                  label="Correct Option"
                  onChange={handleChange}
                >
                  <MenuItem value={0}>Option 1</MenuItem>
                  <MenuItem value={1}>Option 2</MenuItem>
                  <MenuItem value={2}>Option 3</MenuItem>
                  <MenuItem value={3}>Option 4</MenuItem>
                </Select>
                {errors.correctOption && <FormHelperText>{errors.correctOption}</FormHelperText>}
              </FormControl>
            </Grid>
            
            {/* Default Explanation */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Default Explanation"
                name="defaultExplanation"
                value={formData.defaultExplanation}
                onChange={handleChange}
                multiline
                rows={4}
                error={!!errors.defaultExplanation}
                helperText={errors.defaultExplanation}
              />
            </Grid>
            
            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/admin/questions')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Add Question
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QuestionForm;