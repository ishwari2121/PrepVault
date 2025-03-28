import mongoose from 'mongoose';
const { Schema } = mongoose;

const commonQuestionSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['technical', 'Aptitude', 'hr', 'coding'],
    default: 'technical'
  },
  question: {
    type: String,
    required: true,
    unique: true
  },
  answers: [{
    username: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    code: {
      type: String,
      default: ''
    },
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
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

export default mongoose.model('CommonQuestion', commonQuestionSchema);