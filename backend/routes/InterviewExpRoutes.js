import express from "express";
import InterviewExperience from "../models/InterviewExp.js"; // Adjust path as needed
import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();

// ✅ Submit an Interview Experience
router.post("/submit-experience", verifyToken, async (req, res) => {
    console.log("Received Data:", req.body); // Debugging Line
    
    const { year, branch, company, totalRounds, rounds, additionalTips, type } = req.body;

    if (!year || !branch || !company || !totalRounds || !rounds  || !type) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newExperience = new InterviewExperience({
            year,
            branch,
            company,
            totalRounds,
            rounds,
            additionalTips,
            type, // ✅ Added Internship/Placement type
            createdBy: req.user.id, // ✅ Stores the user ID who submitted
        });

        await newExperience.save();
        res.status(201).json({ message: "Interview experience submitted successfully!" });
    } catch (error) {
        console.error("Error saving experience:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Get All Interview Experiences
router.get("/all-experiences", async (req, res) => {
    try {
        const experiences = await InterviewExperience.find()
            .populate("createdBy", "username") // ✅ Fetches the username of the creator
            .sort({ createdAt: -1 }); // ✅ Sort by latest submissions

        res.status(200).json(experiences);
    } catch (error) {
        console.error("Error fetching experiences:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Get a Specific Interview Experience by ID
// ✅ Get all experiences for a specific user by their ID
router.get("/user/:userId", async (req, res) => {
    try {
        const experiences = await InterviewExperience.find({ createdBy: req.params.userId })
            .sort({ createdAt: -1 }) // Optional: newest first
            .populate("createdBy", "username email");

        if (!experiences || experiences.length === 0) {
            return res.status(404).json({ message: "No experiences found for this user." });
        }

        res.status(200).json(experiences);
    } catch (error) {
        console.error("Error fetching user experiences:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});




export default router;