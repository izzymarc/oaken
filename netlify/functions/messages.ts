import { storage } from "../../server/storage";
import { insertMessageSchema } from "../../shared/schema";

exports.handler = async function (event: any, context: any) {
  console.log("Messages function invoked");

  if (event.httpMethod === "POST") {
    try {
      // Authentication would be needed here
      // For now skipping auth
      // if (!context.clientContext.user) {
      //   return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
      // }

      const body = JSON.parse(event.body);
      const result = insertMessageSchema.safeParse(body);
      if (!result.success) {
        return { statusCode: 400, body: JSON.stringify(result.error) };
      }
      const message = await storage.createMessage(result.data);
      return {
        statusCode: 201,
        body: JSON.stringify(message),
      };
    } catch (error: any) {
      console.error("Error creating message:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to create message" }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }
};
