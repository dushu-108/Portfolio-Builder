import express from "express";
import dotenv from "dotenv";
import connect from "./db/connect.js";
import authRoutes from "./routes/authRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Define allowed origins
const allowedOrigins = [
    process.env.CLIENT_URL || "http://localhost:5173",
    "https://portfolio-builder-cclh.onrender.com"
];

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            console.log('Origin not allowed:', origin);
            return callback(null, false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Create generated-portfolios directory if it doesn't exist
const generatedPortfoliosPath = path.join(__dirname, '..', 'generated-portfolios');
if (!fs.existsSync(generatedPortfoliosPath)) {
    fs.mkdirSync(generatedPortfoliosPath, { recursive: true });
}

// Serve static files from generated-portfolios directory
app.use('/generated-portfolios', (req, res, next) => {
    console.log('Accessing portfolio:', req.url); // Debug log
    express.static(generatedPortfoliosPath)(req, res, next);
});

// API Routes - keeping the /api prefix as in your original code
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
    const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'dist');
    console.log('Frontend build path:', frontendBuildPath);
    
    // Check if the build directory exists
    if (fs.existsSync(frontendBuildPath)) {
        console.log('Build directory found');
        // Serve static files
        app.use(express.static(frontendBuildPath));
        
        // Handle client-side routing - must be after API routes
        app.get('*', (req, res) => {
            const indexPath = path.join(frontendBuildPath, 'index.html');
            console.log('Serving index.html from:', indexPath);
            if (fs.existsSync(indexPath)) {
                res.sendFile(indexPath);
            } else {
                console.error('index.html not found in build directory');
                res.status(404).send('Build files not found');
            }
        });
    } else {
        console.error('Build directory not found at:', frontendBuildPath);
    }
}

const server = app.listen(PORT, () => {
    connect();
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Serving portfolios from:', generatedPortfoliosPath);
});

// Increase server timeout to 5 minutes
server.setTimeout(90000);
