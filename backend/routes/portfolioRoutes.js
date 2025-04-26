import express from "express";
import { 
    savePortfolio, 
    getPortfolio, 
    deletePortfolio
} from "../controller/portfolioController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.use(protect);

// Portfolio CRUD routes
router.get("/", getPortfolio);
router.post("/save", savePortfolio);
router.delete("/delete", deletePortfolio);

export default router;
