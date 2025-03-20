import express from "express";
import InterviewExperience from "../models/InterviewExp.js"; // Adjust path as needed
import { verifyToken } from '../middleware/middleware.js';
const router = express.Router();

router.post("/submit-experience", verifyToken, async (req, res) => {
    const { companyName, position, answers} = req.body;

    if (!companyName || !position || !answers ) {
        return res.status(400).json({ message: "All fields are required." });
    }
    
    try {
        const newExperience = new InterviewExperience({
            companyName,
            position,
            answers,
            createdBy : req.user.id ,
        });

        await newExperience.save();
        res.status(201).json({ message: "Interview experience submitted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


export default router;
