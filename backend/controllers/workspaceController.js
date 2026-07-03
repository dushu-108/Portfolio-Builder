import { Workspace } from "../models/workspace.js";
import { PDFParse } from "pdf-parse";
import { initializeVectorStore } from "../AI/create_db.js";
import { generateInitialPortfolio, updatePortfolioWithChat } from "../AI/main.js";

export const getWorkspaces = async (req, res) => {
    try {
        const id = req.user.id || req.user._id;
        const workspaces = await Workspace.find({ userId: id });
        return res.status(200).json(workspaces);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch workspaces" });
    }
};

export const createWorkspace = async (req, res) => {
    try {
        const id = req.user.id || req.user._id;
        const { projectTitle, lockedTemplateId, resumeFormat } = req.body;

        if (!projectTitle || !lockedTemplateId) {
            return res.status(400).json({ message: "Project title and template ID are required." });
        }

        let parsedText = '';
        if (req.file) {
            try {
                const parser = new PDFParse({ data: req.file.buffer });
                const parsedPdf = await parser.getText();
                parsedText = parsedPdf.text;
            } catch (err) {
                console.error("PDF Parsing Error:", err);
                return res.status(400).json({ message: "Failed to parse PDF file." });
            }
        } else {
            parsedText = req.body.description || `A new developer showcase workspace for ${projectTitle}.`;
        }

        const newWorkspace = new Workspace({
            userId: id,
            projectTitle,
            lockedTemplateId,
            resumeFormat: resumeFormat || 'Monochrome',
            cachedResumeContext: parsedText,
            messages: [
                {
                    role: 'system',
                    text: `Hello! I've successfully initialized your "${projectTitle}" workspace. Ready to help you compile code or make style adjustments.`
                }
            ]
        });

        await newWorkspace.save();
        await initializeVectorStore(parsedText, id, newWorkspace._id);
        const initializedWorkspace = await generateInitialPortfolio(newWorkspace._id);

        return res.status(201).json(initializedWorkspace);
    } catch (error) {
        console.error("Workspace Creation Error:", error);
        return res.status(500).json({ message: "Failed to create workspace" });
    }
};

export const getWorkspace = async (req, res) => {
    try {
        const id = req.params.workspaceId;
        const workspace = await Workspace.findOne({_id: id, userId: req.user.id || req.user._id});

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        return res.status(200).json(workspace);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch workspace" });
    }
};

export const deleteWorkspace = async (req, res) => {
    try {
        const id = req.params.workspaceId;
        const userId = req.user.id || req.user._id;
        const workspace = await Workspace.findOneAndDelete({ _id: id, userId });

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found or unauthorized" });
        }
        return res.status(200).json({ message: "Workspace deleted successfully" });
    } catch (error) {
        console.error("Workspace Deletion Error:", error);
        return res.status(500).json({ message: "Failed to delete workspace" });
    }
};

export const chatInWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: "Message text is required" });
        }

        const updatedWorkspace = await updatePortfolioWithChat(workspaceId, text);
        return res.status(200).json(updatedWorkspace);
    } catch (error) {
        console.error("Workspace Chat Error:", error);
        return res.status(500).json({ message: "Failed to process chat message" });
    }
};