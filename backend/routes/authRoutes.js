import { Router } from 'express';
import { register, login, logout, refresh, googleLogin } from '../controllers/authControllers.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post('/google/callback', googleLogin);

export default router;