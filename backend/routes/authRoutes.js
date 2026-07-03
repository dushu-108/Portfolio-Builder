import { Router } from 'express';
import { register, login, logout, refresh, googleLogin, uploadProfilePicture, changePassword } from '../controllers/authControllers.js';
import authMiddleware from '../middleware.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post('/google/callback', googleLogin);

router.post('/profile-picture', authMiddleware, upload.single('avatar'), uploadProfilePicture);
router.post('/change-password', authMiddleware, changePassword);

export default router;