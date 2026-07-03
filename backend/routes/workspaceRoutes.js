import { Router } from "express";
import multer from "multer";
import { getWorkspaces, createWorkspace, getWorkspace, deleteWorkspace, chatInWorkspace } from "../controllers/workspaceController.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getWorkspaces);
router.post("/", upload.single("resume"), createWorkspace);
router.get("/:workspaceId", getWorkspace);
router.delete("/:workspaceId", deleteWorkspace);
router.post("/:workspaceId/chat", chatInWorkspace);

export default router;