import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import connectDB from "./db/connection";
import authRoutes from "./routes/authRoutes";
import todoRoutes from "./routes/todoRoutes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create an HTTP server
  const httpServer = createServer(app);
  
  // Connect to MongoDB
  try {
    await connectDB();
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
  
  // Register API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/todos', todoRoutes);

  return httpServer;
}
