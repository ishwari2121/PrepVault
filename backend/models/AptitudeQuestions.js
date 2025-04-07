import mongoose from 'mongoose';

const userExplanationSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  explanation: {
    type: String,
    required: true,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const aptitudeQuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'Problems on Trains',
      'Time and Distance',
      'Height and Distance',
      'Time and Work',
      'Simple Interest',
      'Compound Interest',
      'Profit and Loss',
      'Partnership',
      'Percentage',
      'Problems on Ages',
      'Calendar',
      'Clock',
      'Average',
      'Area',
      'Volume and Surface Area',
      'Permutation and Combination',
      'Numbers',
      'Problems on Numbers',
      'Problems on H.C.F and L.C.M',
      'Decimal Fraction',
      'Simplification',
      'Square Root and Cube Root',
      'Surds and Indices',
      'Ratio and Proportion',
      'Chain Rule',
      'Pipes and Cistern',
      'Boats and Streams',
      'Alligation or Mixture',
      'Logarithm',
      'Races and Games',
      'Stocks and Shares',
      'Probability',
      'True Discount',
      'Banker\'s Discount',
      'Odd Man Out and Series'
    ],
    default: 'Problems on Trains'
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(options) {
        return options.length === 4;
      },
      message: 'There must be exactly 4 options'
    }
  },
  correctOption: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  default_explanation: {
    type: String,
    required: true,
    trim: true
  },
  users_explanation: [userExplanationSchema],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update the updated_at field before saving
aptitudeQuestionSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const AptitudeQuestion = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);

export default AptitudeQuestion;
