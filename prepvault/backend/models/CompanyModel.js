import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },

    recruitmentProcess: {
      type: Object,
      default: {
        CompanyDetails: "",
        round1: "",
        round2: "",
        round3: "",
        round4: "",
        round5: "",
        sampleQuestions: [],
        ExtraRequirements: "",
      },
    },

    eligibilityCriteria: [
      {
        year: { type: Number, required: true },
        degree: { type: String, required: true },
        eligibility: { type: String, required: true },
        cgpa: { type: String, required: true },
        skillsRequired: { type: [String], default: [] },
        experience: { type: String, required: true },
        role: { type: String, required: true },
        CTC: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Company", CompanySchema);
