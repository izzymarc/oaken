import { storage } from "../../server/storage";

exports.handler = async function (event: any, context: any) {
  const userId = parseInt(event.pathParameters.userId);
  console.log(`Messages-userid function invoked for userId: ${userId}`);

  if (event.httpMethod === "GET") {
    try {
      // Authentication would be needed here
      // For now skipping auth
      // if (!context.clientContext.user) {
      //   return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
      // }

      const messages = await storage.getMessages(userId);
      return {
        statusCode: 200,
        body: JSON.stringify(messages),
      };
    } catch (error: any) {
      console.error(`Error fetching messages for userId ${userId}:`, error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Failed to fetch messages for userId ${userId}` }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }
};
