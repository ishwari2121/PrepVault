import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  console.log(token);
  
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // console.log("Decoded User:", req.user);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};