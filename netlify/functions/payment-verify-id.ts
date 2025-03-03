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


exports.handler = async function (event: any, context: any) {
  const id = event.pathParameters.id;
  console.log(`Payment-verify-id function invoked for ID: ${id}`);

  if (event.httpMethod === "GET") {
    try {
      // Authentication would be needed here
      // For now skipping auth
      // if (!context.clientContext.user) {
      //   return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
      // }

      const paymentIntent = await stripe.paymentIntents.retrieve(id);
      return {
        statusCode: 200,
        body: JSON.stringify({ status: paymentIntent.status }),
      };
    } catch (error: any) {
      console.error(`Error retrieving payment intent with ID ${id}:`, error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: (error as Error).message }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }
};
