import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("Authorization Header:", req.header("Authorization"));
  console.log("Headers received in backend:", req.headers);

  const token = req.header("Authorization")?.split(" ")[1];
  console.log("Extracted Token:", token);

  if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded User:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
