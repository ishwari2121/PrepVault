import express from "express";
import SuggestedCompany from "../models/SuggestedCompany.js";
const router = express.Router();
import { authMiddleware } from "../middleware/middleware.js";


router.post("/suggest-company", authMiddleware,async (req, res) => {
  try {
    const { company  } = req.body;
    const { username } = req.user;
    
    const existing = await SuggestedCompany.findOne({ company });    
    if (existing) {
      return res.status(400).json({ message: "Thank You But Already Suggested" });
    }
    const newSuggestion = new SuggestedCompany({ username, company });
    await newSuggestion.save();

    res.status(201).json({ message: "Company suggestion saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
