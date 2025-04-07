import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['C++', 'Java']
  },
  type: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        if (this.language === 'C++') {
          return ['OOP', 'References', 'Objects', 'Functions','Pointers'].includes(v);
        }
        return [
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
        ].includes(v);
      },
      message: props => `Invalid type for ${props.language} language`
    }
  },
  question: {
    type: String,
    required: true,
    minlength: 10
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: v => v.length === 4,
      message: 'Exactly 4 options required'
    }
  },
  correctOption: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  defaultExplanation: {
    type: String,
    required: true
  },
  userExplanations: [{
    username: {
      type: String,
      required: true
    },
    explanation: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default  mongoose.model('Question', questionSchema);