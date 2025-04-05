import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.get('/all-users',async (req,res)=>{
    try
    {
        const all_user = await User.find();
        console.log(all_user);
        res.status(200).json(all_user);
    }
    catch(err)
    {
      res.status(500).json({message:false,error : err.message});
    }
})

router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
    
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });
    
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "72000" });
    
        res.status(200).json({
          message: "Login successful",
          token,
          user: { id: user._id,username: user.username, email: user.email } 
        });
      } catch (err) {
        res.status(500).json({ message: "Server error" });
      }
});

export default router;