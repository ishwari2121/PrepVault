import express from "express";
import Company from "../models/CompanyModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const companies = await Company.find();
        
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch companies" });
    }
});

router.get("/:companyName", async (req, res) => {
    try {
        const company = await Company.findOne({ name: req.params.companyName });
        if (!company) return res.status(404).json({ message: "Company not found" });

        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch company details" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name, eligibilityCriteria = [], recruitmentProcess = "" } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Company name is required" });
        }

        const existingCompany = await Company.findOne({ name });
        if (existingCompany) {
            return res.status(400).json({ error: "Company already exists" });
        }

        const newCompany = new Company({ name, recruitmentProcess, eligibilityCriteria });
        await newCompany.save();

        res.status(201).json({ message: "Company added successfully", company: newCompany });
    } catch (error) {
        console.error("Error adding company:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


router.post("/:companyName/recruitment", async (req, res) => {
    try {
        const { companyName } = req.params;
        const { recruitmentProcess } = req.body; // Receive new recruitment process from request body

        const company = await Company.findOne({ name: companyName });
        if (!company) return res.status(404).json({ message: "Company not found" });

        company.recruitmentProcess = recruitmentProcess; // Update recruitment process
        await company.save();

        res.status(200).json({ message: "Recruitment process updated successfully", company });
    } catch (error) {
        res.status(500).json({ error: "Failed to update recruitment process" });
    }
});


// Add new eligibility criteria to an existing company
router.post("/:companyName/eligibility", async (req, res) => {
    try {
        const { companyName } = req.params;
        const newEligibility = req.body; // Receive eligibility details from request body

        const company = await Company.findOne({ name: companyName });
        if (!company) return res.status(404).json({ message: "Company not found" });

        company.eligibilityCriteria.push(newEligibility); // Add new eligibility criteria
        await company.save();

        res.status(201).json({ message: "Eligibility criteria added successfully", company });
    } catch (error) {
        res.status(500).json({ error: "Failed to add eligibility criteria" });
    }
});





export default router;
