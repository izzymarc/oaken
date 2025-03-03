import { storage } from "../../server/storage";

exports.handler = async function (event: any, context: any) {
  const jobId = parseInt(event.pathParameters.id);
  console.log(`Jobs-id function invoked for ID: ${jobId}`);

  if (event.httpMethod === "PATCH") {
    try {
      // Authentication would be needed here as well
      // For now skipping auth

      const body = JSON.parse(event.body);
      const job = await storage.updateJob(jobId, body);
      return {
        statusCode: 200,
        body: JSON.stringify(job),
      };
    } catch (error: any) {
      console.error(`Error updating job with ID ${jobId}:`, error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Failed to update job with ID ${jobId}` }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }
};
