import mongoose from "mongoose";

const InterviewExperienceSchema = new mongoose.Schema(
    {
        companyName: { 
            type: String, 
            required: true 
        },
        position: { 
            type: String, 
            required: true 
        },
        answers: { 
            type: Map, 
            of: String, // Key will be the question ID, value will be the answer
            required: true
        },
        createdBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User"
        }
    },
    { timestamps: true }
);

export default mongoose.model("InterviewExperience", InterviewExperienceSchema);
