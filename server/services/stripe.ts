import Stripe from "stripe";

// For development without Stripe credentials
const mockStripe = {
  paymentIntents: {
    create: async (data: any) => ({
      id: "mock_payment_intent_" + Math.random().toString(36).substring(2, 15),
      client_secret: "mock_secret_" + Math.random().toString(36).substring(2, 15),
      amount: data.amount,
      currency: data.currency,
      status: "requires_payment_method"
    }),
    retrieve: async (id: string) => ({
      id,
      status: "succeeded",
      amount: 1000,
      currency: "usd"
    })
  }
};

// Use real Stripe if key is available, otherwise use mock
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" })
  : mockStripe as any;

export async function createPaymentIntent(amount: number) {
  return await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: "usd",
    payment_method_types: ["card"],
  });
}

export async function retrievePaymentIntent(id: string) {
  return await stripe.paymentIntents.retrieve(id);
}
