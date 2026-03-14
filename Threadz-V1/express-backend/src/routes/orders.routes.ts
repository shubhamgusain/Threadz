import { Router } from 'express';
import { createOrder, verifyPayment, razorpayWebhook, getMyOrders } from '../controllers/orders.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticateToken, createOrder);
router.post('/verify', verifyPayment);
router.post('/webhook', razorpayWebhook);
router.get('/my-orders', authenticateToken, getMyOrders);

export default router;
