import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  jobDescription:{
    type : String,
    required : true,
  },
  analysis: {
    type: String,
    required: [true, 'Analysis text is required'],
  },
  pdf: {
    type: Buffer,
    required: [true, 'PDF file is required']
  },
  pdftext: {
    type: String,
    required: [true, 'Extracted PDF text is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Removed timestamps and only keep createdAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes and virtual remain the same
AnalysisSchema.index({
  username: 'text',
  analysis: 'text',
  pdftext: 'text',
  jobDescription : 'text',
});

AnalysisSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

export default mongoose.model('ResumeAnalysis', AnalysisSchema);
