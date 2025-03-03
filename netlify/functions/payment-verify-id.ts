import { retrievePaymentIntent } from "../../server/services/stripe";

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

      const paymentIntent = await retrievePaymentIntent(id);
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
