// Inlined content of shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  userType: text("user_type").notNull(), // 'vendor' or 'client'
  fullName: text("full_name").notNull(),
  profileImage: text("profile_image"),
  bio: text("bio"),
  services: text("services").array(),
  hourlyRate: integer("hourly_rate"),
  createdAt: timestamp("created_at").defaultNow()
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  budget: integer("budget").notNull(),
  location: text("location").notNull(),
  eventDate: timestamp("event_date").notNull(),
  status: text("status").notNull(), // 'open', 'assigned', 'completed'
  createdAt: timestamp("created_at").defaultNow()
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Updated schema with proper date validation
export const insertJobSchema = createInsertSchema(jobs)
  .pick({
    clientId: true,
    title: true,
    description: true,
    budget: true,
    location: true,
    eventDate: true,
    status: true
  })
  .extend({
    budget: z.coerce.number().min(1, "Budget must be greater than 0"),
    eventDate: z.string().transform((date) => new Date(date))
  });

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  userType: true,
  fullName: true,
  profileImage: true,
  bio: true,
  services: true,
  hourlyRate: true
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  senderId: true,
  receiverId: true,
  content: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type User = typeof users.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Message = typeof messages.$inferSelect;


import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const API_KEY = process.env.OPENWEATHER_API_KEY; // provided by MCP config
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });

import { eq } from "drizzle-orm";
import { users as usersTable, jobs as jobsTable, messages as messagesTable } from "@shared/schema";

export const storage = {
  async getJobs() {
    return await db.select().from(jobsTable).orderBy(jobsTable.createdAt);
  },
  async createJob(job: schema.InsertJob) {
    return (await db.insert(jobsTable).values(job).returning())[0];
  },
  async updateJob(id: number, updates: Partial<schema.Job>) {
    return (
      await db
        .update(jobsTable)
        .set(updates)
        .where(eq(jobsTable.id, id))
        .returning()
    )[0];
  },
  async getMessages(receiverId: number) {
    return await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.receiverId, receiverId))
      .orderBy(messagesTable.createdAt);
  },
  async createMessage(message: schema.InsertMessage) {
    return (await db.insert(messagesTable).values(message).returning())[0];
  },
  async getUser(username: string) {
    return await db.select().from(usersTable).where(eq(usersTable.username, username)))[0];
  },
    async createUser(user: schema.InsertUser) {
      return (await db.insert(usersTable).values(user).returning())[0];
    }
  };

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
