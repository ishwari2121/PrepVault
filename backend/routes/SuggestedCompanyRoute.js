import express from "express";
import SuggestedCompany from "../models/SuggestedCompany.js";
const router = express.Router();

router.post("/suggest-company", async (req, res) => {
  try {
    const { username, company } = req.body;

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
