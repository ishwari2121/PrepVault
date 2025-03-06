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
        const newCriteria = req.body.eligibilityCriteria;

        // Validate input
        if (!Array.isArray(newCriteria) || newCriteria.length === 0) {
            return res.status(400).json({ error: "Invalid or missing eligibility criteria" });
        }

        // Find the company by name
        const company = await Company.findOne({ name: companyName });

        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }

        // Validate each eligibility object
        for (let criteria of newCriteria) {
            const { year, degree, eligibility, cgpa, skillsRequired, experience, role, CTC } = criteria;
            
            if (!year || !degree || !eligibility || cgpa === undefined || !experience || !role || !CTC) {
                return res.status(400).json({ error: "Missing required fields in eligibility criteria" });
            }

            if (typeof cgpa !== "number" || cgpa < 0 || cgpa > 10) {
                return res.status(400).json({ error: "Invalid CGPA value. It should be between 0 and 10." });
            }
        }

        // Append new eligibility criteria
        company.eligibilityCriteria.push(...newCriteria);

        // Save updated company data
        await company.save();

        res.status(200).json({ message: "Eligibility criteria added successfully", company });
    } catch (error) {
        console.error("Error adding eligibility criteria:", error);
        res.status(500).json({ error: "Failed to add eligibility criteria" });
    }
});





export default router;
