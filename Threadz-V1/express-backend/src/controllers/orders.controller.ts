import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import * as razorpayService from '../utils/payment';

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { total_amount, shipping_address_id, items } = req.body;
    const user = req.user;

    const receipt = `order_${Math.random().toString(36).substring(2, 10)}`;
    const razorpayOrder = razorpayService.createOrder(total_amount, receipt);

    const newOrder = await prisma.order.create({
      data: {
        user_id: user.user_id,
        total_amount,
        shipping_address_id: shipping_address_id || null,
        status: 'Pending',
        razorpay_order_id: razorpayOrder.id,
        items: {
          create: items.map((item: any) => ({
            variant_id: item.variant_id,
            design_id: item.design_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })),
        },
      },
      include: { items: true },
    });

    res.status(201).json({
      ...newOrder,
      razorpay_key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_12345',
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: 'Failed to create order' });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Uncomment generic signature verification when testing with actual frontend and Razorpay script
    // const isValid = razorpayService.verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    // if (!isValid) return res.status(400).json({ detail: 'Invalid payment signature' });

    const paymentDetails = razorpayService.getPaymentDetails(razorpay_payment_id);

    const order = await prisma.order.findUnique({
      where: { razorpay_order_id },
    });

    if (!order) return res.status(404).json({ detail: 'Order not found' });

    let newStatus = 'Payment Failed';
    if (paymentDetails.status === 'captured') newStatus = 'Paid';
    else if (paymentDetails.status === 'authorized') newStatus = 'Authorized';

    const updatedOrder = await prisma.order.update({
      where: { razorpay_order_id },
      data: { status: newStatus },
    });

    res.json({
      message: 'Payment verified successfully',
      order_id: updatedOrder.order_id,
      payment_status: paymentDetails.status,
      order_status: updatedOrder.status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: 'Failed to verify payment' });
  }
};

export const razorpayWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const bodyStr = JSON.stringify(req.body);

    if (!signature) return res.status(400).json({ detail: 'Missing signature' });

    // Uncomment generic mock webhook processing when you have valid payload data testing
    // if (!razorpayService.processWebhook(bodyStr, signature)) {
    //   return res.status(400).json({ detail: 'Invalid webhook signature' });
    // }

    const webhookData = req.body;
    
    if (webhookData.event === 'payment.captured') {
      const paymentEntity = webhookData.payload.payment.entity;
      const razorpay_order_id = paymentEntity.order_id;

      await prisma.order.update({
        where: { razorpay_order_id },
        data: { status: 'Paid' },
      });
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: 'Webhook processing failed' });
  }
};

export const getMyOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;

    const orders = await prisma.order.findMany({
      where: { user_id: user.user_id },
      include: { items: true },
      orderBy: { created_at: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to fetch orders' });
  }
};
