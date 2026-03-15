import crypto from 'crypto';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_12345';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'secret12345';

export const createOrder = (amount: number, receipt: string) => {
  // Mock Razorpay order creation
  return {
    id: `order_${crypto.randomBytes(6).toString('hex')}`,
    amount,
    currency: 'INR',
    receipt,
    status: 'created',
  };
};

export const verifyPaymentSignature = (orderId: string, paymentId: string, signature: string) => {
  const body = `${orderId}|${paymentId}`;
  const verifySignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');
  return verifySignature === signature;
};

export const getPaymentDetails = (paymentId: string) => {
  // Mock fetching payment details
  return {
    id: paymentId,
    status: 'captured', // Mock status
    amount: 1000,
    currency: 'INR',
  };
};

export const processWebhook = (body: string, signature: string) => {
  const verifySignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return verifySignature === signature;
};
