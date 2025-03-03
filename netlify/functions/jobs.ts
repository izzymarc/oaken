import { storage } from "../../server/storage";
import { insertJobSchema } from "../../shared/schema";
import { pool } from "../../server/db"; // Import database pool

exports.handler = async function (event: any, context: any) {
  console.log("Jobs function invoked");

  if (event.httpMethod === "GET") {
    try {
      const jobs = await storage.getJobs();
      return {
        statusCode: 200,
        body: JSON.stringify(jobs),
      };
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch jobs" }),
      };
    }
  } else if (event.httpMethod === "POST") {
    try {
      // Authentication would need to be handled differently in Netlify functions
      // For now, skipping authentication for simplicity in this example
      // if (!context.clientContext.user) {
      //   return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
      // }

      const body = JSON.parse(event.body);
      const result = insertJobSchema.safeParse(body);
      if (!result.success) {
        return { statusCode: 400, body: JSON.stringify(result.error) };
      }
      const job = await storage.createJob(result.data);
      return {
        statusCode: 201,
        body: JSON.stringify(job),
      };
    } catch (error: any) {
      console.error("Error creating job:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to create job" }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }
};
