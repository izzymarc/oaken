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