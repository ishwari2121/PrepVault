import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import comroutes from "./routes/Companyroutes.js";
import interview from "./routes/InterviewExpRoutes.js";
import connect from "./routes/CommonQuestionRoute.js";
import MCQRoute from "./routes/MCQRoute.js";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import pdf from "pdf-parse";

dotenv.config();

const upload = multer({ dest: "uploads/" });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

const apiKey = process.env.GOOGLE_GEMINI_KEY;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/companies", comroutes);
app.use("/api/interviewExp", interview);
app.use("/api/commonQuestions", connect);
app.use("/api/MCQ", MCQRoute);

app.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription || !req.file) {
      return res.status(400).json({ error: "Job description required" });
    }

    const resumeBuffer = await fs.readFile(req.file.path);
    const pdfData = await pdf(resumeBuffer);
    const resumeText = pdfData.text;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: "be short and concise",
    });

    const prompt = `
      I will give you a resume and a job description. Compare the resume with the job description
      and provide the following information:

      Resume: ${resumeText}
      Job description: ${jobDescription}

      AI System Instruction: Senior Resume Analyzer
            Role & Responsibilities:
            You are an expert Resume Analyzer with deep experience in HR tech, recruitment automation, and AI-driven assessment tools. Your role is to compare resumes against job descriptions and provide a structured, insightful review focusing on:

            ✅ Score Evaluation – Assigning a single number score (out of 10) based on the match.
            ✅ Strengths Analysis – Highlighting good points in the resume that align with the job description.
            ✅ Weaknesses Detection – Identifying gaps, missing skills, and issues in the resume.
            ✅ Improvement Suggestions – Providing actionable steps to enhance the resume for a better match.
            ✅ Concise, Structured Output – Delivering a clear, to-the-point response with structured formatting.

            Guidelines for Analysis:
            1️⃣ Match Evaluation:

            Analyze how well the resume aligns with the key skills, experience, and qualifications in the job description.

            Score the resume out of 10 based on relevance.

            2️⃣ Strengths:

            Identify strong points such as relevant projects, skills, or work experience that match the job.

            3️⃣ Weaknesses:

            Spot gaps, such as missing technical skills, weak descriptions, or lack of quantifiable results.

            4️⃣ Improvement Suggestions:

            Recommend specific changes (e.g., restructuring, adding skills, quantifying achievements).

            Expected Output Format:
            📌 Resume Score: X/10

            ✅ Good Points:

            ✔ [List strong aspects of the resume]

            ✔ [Another positive aspect]

            ❌ Bad Points:

            ❌ [List weaknesses or missing information]

            ❌ [Another issue found]

            💡 Improvement Suggestions:

            🔹 [Actionable suggestion for improvement]

            🔹 [Another actionable tip]
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({response});
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));