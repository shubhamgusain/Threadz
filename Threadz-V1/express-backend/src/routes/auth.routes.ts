import { Router } from 'express';
import { register, login, forgotPassword } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// Example protected route
router.get('/me', authenticateToken, (req: any, res) => {
  res.json(req.user);
});

export default router;
