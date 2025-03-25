import mongoose from "mongoose";

const InterviewExperienceSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true,
        min: 2010,
        max: 2028,
    },
    branch: {
        type: String,
        enum: ["CE", "IT", "EnTC", "AIDS", "ECE"],
        required: true,
    },
    company: {
        type: String,
        enum: ["Pubmatic", "Bloomberg", "Barclays", "HSBC", "NICE"],
        required: true,
    },
    totalRounds: {
        type: Number,
        required: true,
        min: 1,
    },
    rounds: [
        {
            roundNumber: { type: Number, required: true },
            experience: { type: String, required: true },
        },
    ],
    additionalTips: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,  // Automatically stores the current date
    },
    day: {
        type: String,
        default: () => {
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            return days[new Date().getDay()];  // Automatically gets current day
        },
    },
    type: {
        type: String,
        required: true,
        enum: ["Internship", "Placement"],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

export default mongoose.model("InterviewExperience", InterviewExperienceSchema);
