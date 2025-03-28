import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import comroutes from "./routes/Companyroutes.js";
import interview from "./routes/InterviewExpRoutes.js";
import connect  from "./routes/CommonQuestionRoute.js";
import MCQRoute from './routes/MCQRoute.js'
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/companies", comroutes);
app.use("/api/interviewExp", interview);
app.use("/api/commonQuestions", connect); // Use correctly named import
app.use("/api/MCQ",MCQRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
