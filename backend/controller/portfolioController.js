import Portfolio from '../models/portfolio.js';
import fs from 'fs';
import path from 'path';
import { generateContent } from '../utils/geminiAI.js';

const generateMarkdown = (portfolio) => {
    const projectsSection = portfolio.projects.map(project => `
### ${project.title}
${project.description}
${project.link ? `\n[View Project](${project.link})` : ''}`).join('\n\n');

    return `# ${portfolio.title}

## About Me
${portfolio.about}

## Skills
${portfolio.skills.map(skill => `- ${skill}`).join('\n')}

## Projects
${projectsSection}`;
};

import fs from 'fs';
import path from 'path';
import { generateContent } from '../utils/geminiAI.js';

export const getPortfolio = async (req, res) => {
    try {
        const userId = req.user._id;
        let portfolio = await Portfolio.findOne({ userId });
        
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

        // Path where the generated HTML should be
        const outputDir = path.join(process.cwd(), 'generated-portfolios', userId.toString());
        const indexPath = path.join(outputDir, 'index.html');
        let fileExists = fs.existsSync(indexPath);

        // If file doesn't exist, generate it now (wait for completion)
        if (!fileExists) {
            let aiContent = '';
            try {
                aiContent = await generateContent(portfolio);
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }
                fs.writeFileSync(indexPath, aiContent);
            } catch (err) {
                console.error('Error generating portfolio HTML:', err);
                return res.status(500).json({ message: "Failed to generate portfolio", error: err.message });
            }
        }

        // Generate markdown for preview
        const markdown = generateMarkdown(portfolio);
        const portfolioPath = `/generated-portfolios/${userId.toString()}/index.html`;

        return res.status(200).json({ 
            portfolio,
            markdown,
            portfolioSitePath: portfolioPath
        });
    } catch (error) {
        console.log("Error fetching portfolio:", error.message);
        return res.status(500).json({ message: "Error fetching portfolio" });
    }
};

export const savePortfolio = async (req, res) => {
    try {
        const userId = req.user._id;
        const portfolioData = req.body;
        
        console.log('Received portfolio data:', portfolioData); // Debug log

        let portfolio = await Portfolio.findOne({ userId });
        
        if (portfolio) {
            portfolio = await Portfolio.findOneAndUpdate(
                { userId },
                { ...portfolioData },
                { new: true }
            );
        } else {
            portfolio = await Portfolio.create({
                userId,
                ...portfolioData
            });
        }
        
        // Generate AI content using Gemini
        let aiContent = '';
        try {
            console.log('Generating AI content for portfolio:', portfolio); // Debug log
            aiContent = await generateContent(portfolio);
            
            if (!aiContent) {
                throw new Error('Failed to generate AI content');
            }
        } catch (err) {
            console.error('Gemini AI content generation failed:', err);
            console.error('Error details:', err.stack); // Add stack trace
            return res.status(500).json({ 
                message: "Failed to generate portfolio content",
                error: err.message 
            });
        }

        // Save the generated website
        const outputDir = path.join(process.cwd(), 'generated-portfolios', userId.toString());
        
        // Create output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const indexPath = path.join(outputDir, 'index.html');
        fs.writeFileSync(indexPath, aiContent);

        // Generate markdown for preview
        const markdown = generateMarkdown(portfolio);

        // Format the path for the frontend
        const portfolioPath = `/generated-portfolios/${userId.toString()}/index.html`;

        console.log('Generated portfolio path:', portfolioPath); // Debug log

        return res.status(200).json({ 
            portfolio,
            markdown,
            portfolioSitePath: portfolioPath
        });
    } catch (error) {
        console.error('Error in savePortfolio:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({ 
            message: "Error saving portfolio",
            error: error.message
        });
    }
};

export const deletePortfolio = async (req, res) => {
    try {
        const userId = req.user._id;
        const portfolio = await Portfolio.findOneAndDelete({ userId });
        
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }
        
        // Delete the generated portfolio site
        const outputDir = path.join(process.cwd(), 'generated-portfolios', userId.toString());
        if (fs.existsSync(outputDir)) {
            fs.rmSync(outputDir, { recursive: true, force: true });
        }
        
        return res.status(200).json({ message: "Portfolio deleted successfully" });
    } catch (error) {
        console.log("Error deleting portfolio:", error.message);
        return res.status(500).json({ message: "Error deleting portfolio" });
    }
};
