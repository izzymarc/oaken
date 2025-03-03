import { createPaymentIntent } from "../../server/services/stripe";

exports.handler = async function (event: any, context: any) {
  console.log("Payment-create-intent function invoked");

  if (event.httpMethod === "POST") {
    try {
      // Authentication would be needed here
      // For now skipping auth
      // if (!context.clientContext.user) {
      //   return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
      // }

      const body = JSON.parse(event.body);
      const { amount } = body;
      const paymentIntent = await createPaymentIntent(amount);
      return {
        statusCode: 200,
        body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      };
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
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
