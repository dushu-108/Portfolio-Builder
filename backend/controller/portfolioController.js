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

export const getPortfolio = async (req, res) => {
    try {
        const userId = req.user._id;
        let portfolio = await Portfolio.findOne({ userId });
        
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

        // Generate markdown for preview
        const markdown = generateMarkdown(portfolio);

        return res.status(200).json({ 
            portfolio,
            markdown,
            html: portfolio.html || '',
            status: portfolio.status || 'pending',
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
        
        let portfolio = await Portfolio.findOne({ userId });
        
        if (portfolio) {
            portfolio = await Portfolio.findOneAndUpdate(
                { userId },
                { ...portfolioData, status: 'pending' },
                { new: true }
            );
        } else {
            portfolio = await Portfolio.create({
                userId,
                ...portfolioData,
                status: 'pending',
            });
        }

        // Respond immediately (AI generation in background)
        const markdown = generateMarkdown(portfolio);
        res.status(200).json({ 
            portfolio,
            markdown,
            html: portfolio.html || '',
            status: 'pending',
        });

        // Start AI generation in background
        setImmediate(async () => {
            try {
                const aiContent = await generateContent(portfolio);
                await Portfolio.findOneAndUpdate(
                    { userId },
                    { html: aiContent, status: 'ready' }
                );
            } catch (err) {
                console.error('Background AI generation failed:', err);
                await Portfolio.findOneAndUpdate(
                    { userId },
                    { status: 'error' }
                );
            }
        });
    } catch (error) {
        console.error('Error in savePortfolio:', error);
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
