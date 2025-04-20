import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  console.log("Cookies received:", req.cookies);
  const token = req.cookies?.token; 
  console.log("Token from cookie:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Decoded User:", req.user);
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
