import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.VITE_API_GEMINI_API_KEY;

if (!API_KEY) {
    console.error('Missing Gemini API key! Make sure VITE_API_GEMINI_API_KEY is set in your .env file');
}

// Initialize the client with your API key
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateContent = async (portfolioData) => {
    try {
        console.log('Starting content generation with data:', portfolioData); // Debug log

        // Validate input data
        if (!portfolioData) {
            throw new Error('No portfolio data provided');
        }

        // Use gemini-1.0-pro instead of gemini-pro
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Clean up the data to prevent undefined values
        const cleanData = {
            name: portfolioData.name || 'My',
            title: portfolioData.title || `${portfolioData.name || 'My'} Portfolio`,
            about: portfolioData.about || '',
            skills: portfolioData.skills || [],
            projects: (portfolioData.projects || []).map(project => ({
                title: project.title || '',
                description: project.description || '',
                link: project.link || ''
            }))
        };

        console.log('Cleaned portfolio data:', cleanData); // Debug log

        const prompt = {
            contents: [{
                role: 'user',
                parts: [{
                    text: `Create a modern, professional portfolio website using HTML and Tailwind CSS based on the following information:

Name: ${cleanData.name}
Title: ${cleanData.title}
About: ${cleanData.about}

Skills: ${cleanData.skills.join(', ')}

Projects:
${cleanData.projects.map(project => `
- ${project.title}
  Description: ${project.description}
  ${project.link ? `Link: ${project.link}` : ''}`).join('\n')}

Requirements:
1. Use Tailwind CSS for styling
2. Create a responsive design that works on all devices
3. Include smooth animations and transitions
4. Use a modern, professional color scheme
5. Include navigation sections for About, Skills, and Projects
6. Make it visually appealing with proper spacing and typography
7. Include hover effects and interactive elements
8. Ensure the design reflects the person's professional identity
9. Add subtle background patterns or gradients where appropriate
10. Use the person's name in the header/title instead of "undefined"
11. Handle empty sections gracefully (show appropriate messages if no content)
12. Include a navigation menu at the top

Please provide the complete HTML code with embedded Tailwind CSS and any necessary JavaScript.`
                }]
            }]
        };

        console.log('Sending prompt to Gemini...'); // Debug log

        // Set a timeout for Gemini AI call (5 minutes)
const result = await Promise.race([
    model.generateContent(prompt),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini AI timeout after 90 seconds')), 90000))
]);
        if (!result) {
            throw new Error('No response from Gemini AI');
        }

        const response = await result.response;
        if (!response) {
            throw new Error('Empty response from Gemini AI');
        }

        let generatedHtml = response.text();
        if (!generatedHtml) {
            throw new Error('No HTML content generated');
        }

        console.log('Received response from Gemini'); // Debug log

        // Extract HTML content if it's wrapped in code blocks
        if (generatedHtml.includes("```html")) {
            generatedHtml = generatedHtml.split("```html")[1].split("```")[0].trim();
        }

        // Add necessary Tailwind CSS and other resources
        const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cleanData.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        body { 
            font-family: 'Inter', sans-serif;
        }
        .fade-in {
            animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .slide-in {
            animation: slideIn 0.5s ease-out;
        }
        @keyframes slideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    </style>
</head>
<body>
    ${generatedHtml}
    <script>
        // Add smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Add fade-in animation to sections
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('section').forEach((section) => {
            observer.observe(section);
        });
    </script>
</body>
</html>`;

        console.log('Generated final HTML successfully'); // Debug log
        return finalHtml;
    } catch (error) {
        console.error("Error generating content:", error);
        console.error("Error stack:", error.stack);
        throw error;
    }
};