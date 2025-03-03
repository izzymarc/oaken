import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertJobSchema, insertMessageSchema } from "@shared/schema";
import { createPaymentIntent, retrievePaymentIntent } from "./services/stripe";
import { setupWebSocket } from "./websocket";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Jobs
  app.get("/api/jobs", async (_req, res) => {
    const jobs = await storage.getJobs();
    res.json(jobs);
  });

  app.post("/api/jobs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const result = insertJobSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    const job = await storage.createJob(result.data);
    res.status(201).json(job);
  });

  app.patch("/api/jobs/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const jobId = parseInt(req.params.id);
    const job = await storage.updateJob(jobId, req.body);
    res.json(job);
  });

  // Messages
  app.get("/api/messages/:userId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const messages = await storage.getMessages(parseInt(req.params.userId));
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const result = insertMessageSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    const message = await storage.createMessage(result.data);
    res.status(201).json(message);
  });

  // Payment Routes
  app.post("/api/payment/create-intent", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const { amount } = req.body;
      const paymentIntent = await createPaymentIntent(amount);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/payment/verify/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const { id } = req.params;
      const paymentIntent = await retrievePaymentIntent(id);
      res.json({ status: paymentIntent.status });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  setupWebSocket(httpServer);
  return httpServer;
}