import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import comroutes from "./routes/Companyroutes.js";
import interview from "./routes/InterviewExpRoutes.js";
import connect from "./routes/CommonQuestionRoute.js";
import MCQRoute from "./routes/MCQRoute.js";
import AnalysisRoute from './routes/AnalysisRoute.js';
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import pdf from "pdf-parse";
import AptitudeRoutes from "./routes/AptitudeRoutes.js";
import VoteHistoryRoute from "./routes/VoteHistoryRoute.js"
import SuggestedCompanyRoute from "./routes/SuggestedCompanyRoute.js";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middleware/middleware.js";
dotenv.config();

const upload = multer({ dest: "uploads/" });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const app = express();
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true               // allow cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
    message: err.message
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/companies", comroutes);
app.use("/api/interviewExp", interview);
app.use("/api/commonQuestions", connect);
app.use("/api/MCQ", MCQRoute);
app.use("/api/resume",AnalysisRoute);
app.use('/api/aptitude',AptitudeRoutes)
app.use("/api/vote/",VoteHistoryRoute);
app.use("/api/suggetion",SuggestedCompanyRoute);


app.post("/analyze", upload.single("resume"), authMiddleware,async (req, res) => {
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
        I will give you a resume and a job description. Compare the resume with the job description and provide the following information:

        Resume: ${resumeText}
        Job description: ${jobDescription}

        **Note:** Generate an extensive, detailed response with at least 60 lines of output. Your analysis should cover all key aspects in detail, including multiple points under each section, ensuring that every field is addressed comprehensively.

        AI System Instruction: Senior Resume Analyzer  
        Role & Responsibilities:  
        You are an expert Resume Analyzer with deep experience in HR tech, recruitment automation, and AI-driven assessment tools. Your role is to compare resumes against job descriptions and provide a structured, insightful review focusing on:

        ✅ **Score Evaluation** – Assigning a single number score (out of 10) based on the match.  
        ✅ **Strengths Analysis** – Highlighting all strong points in the resume that align with the job description.  
        ✅ **Weaknesses Detection** – Identifying all gaps, missing skills, and issues in the resume.  
        ✅ **Improvement Suggestions** – Providing multiple actionable steps to enhance the resume for a better match.  
        ✅ **Structured Output** – Delivering a clear, detailed, and structured response with distinct sections and bullet points.

        Guidelines for Analysis:
        1️⃣ **Match Evaluation:**
        - Thoroughly analyze how well the resume aligns with the key skills, experience, and qualifications in the job description.
        - Score the resume out of 10 based on relevance and quality.

        2️⃣ **Strengths:**
        - Identify and list all strong points such as relevant projects, skills, or work experience that match the job description.
        - Provide detailed explanations for each strength.
        - Use bullet points and symbols (e.g., ✓) where applicable.

        3️⃣ **Weaknesses:**
        - Identify and list any gaps, such as missing technical skills, vague descriptions, or lack of quantifiable achievements.
        - Provide detailed explanations for each weakness.
        - Use bullet points and symbols (e.g., ✕) where applicable.

        4️⃣ **Improvement Suggestions:**
        - Recommend multiple specific changes (e.g., restructuring content, adding missing skills, quantifying achievements).
        - Provide detailed, actionable suggestions for improvement.
        - Use bullet points and symbols (e.g., ➤) where applicable.

        Expected Output Format:
        Ensure the final output is extensive and clearly structured. Your response should include at least 60 lines of detailed analysis, organized into the following sections:

        📌 **Resume Score:** [X/10]

        ### **Key Strengths**
        - ✓ [Bullet point with a detailed explanation of a positive aspect]
        - ✓ [Bullet point with a detailed explanation of another strength]
        - ... (continue listing all strengths with detailed insights)

        ### **Areas for Improvement**
        - ✕ [Bullet point with a detailed explanation of a weakness]
        - ✕ [Bullet point with a detailed explanation of another weakness]
        - ... (continue listing all areas that need improvement with detailed insights)

        ### **Recommendations**
        - ➤ [Actionable suggestion with a detailed explanation for improvement]
        - ➤ [Another actionable suggestion with a detailed explanation]
        - ... (continue listing several recommendations to enhance the resume)

        Your analysis should be professional, in-depth, and formatted with clear headings and bullet points to ensure readability. Provide as many detailed key points as possible, ensuring the response is comprehensive and spans at least 30 lines.
        If the uploaded file is not a resume, summarize the content of the PDF in 4 to 6 lines.
        If the uploaded PDF is compressed or scanned, do not proceed—just show a clear message: “Please upload the original PDF resume, not a compressed or scanned version.”
        The uploaded file must strictly be a resume in .pdf format. If not, display: “Only PDF resume files are supported. Please upload your resume in PDF format.”
        If the user enters a question or casual text in the "Job Description" section instead of an actual job description, respond in detail and let them know: “This section is for job descriptions only. If you have questions, please ask them in the appropriate chat area.”
`;


    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({response});
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
