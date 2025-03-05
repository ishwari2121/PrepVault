import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    recruitmentProcess: { type: String, default: "" }, 
    eligibilityCriteria: [
        {
            year: { type: Number, required: true },
            degree: { type: String, required: true },
            eligibility: { type: String, required: true },
            cgpa: { type: Number, required: true },
            skillsRequired: [String], 
            experience: { type: String, required: true },
            role: {type: String, required: true},
            CTC: {type: String, required: true}
        }
    ]
}, { timestamps: true });

export default mongoose.model("Company", CompanySchema);
