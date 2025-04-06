import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  pdf: {
    data: {
      type: Buffer,
      required: true
    },
    contentType: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    }
  },
  jobDescription: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;