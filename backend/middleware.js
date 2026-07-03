import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message : "Unauthorized"})
    }
    const token = authHeader.split(" ")[1];

    try { 
        const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "your_super_secret_key_change_this_in_production_12345";
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message : "Invalid token"})
    }
}

export default authMiddleware;