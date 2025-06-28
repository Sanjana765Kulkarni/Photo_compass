import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPhotoSchema, insertSettingsSchema } from "@shared/schema";
import { z } from "zod";

// AI analysis simulation - in production this would call actual AI service
function analyzeImage(imageData: string) {
  // Simulate AI analysis with random but realistic scores
  const composition = Math.random() * 3 + 7; // 7-10
  const lighting = Math.random() * 3 + 6.5; // 6.5-9.5
  const focus = Math.random() * 2 + 8; // 8-10
  
  const overallScore = (composition + lighting + focus) / 3;
  
  const positives = [];
  const suggestions = [];
  
  if (composition >= 8.5) positives.push("Excellent composition following rule of thirds");
  if (lighting >= 8) positives.push("Beautiful lighting enhances the subject");
  if (focus >= 9) positives.push("Perfect focus on the main subject");
  
  if (composition < 7.5) suggestions.push("Try repositioning subject using rule of thirds");
  if (lighting < 7) suggestions.push("Consider adjusting lighting angle");
  if (focus < 8.5) suggestions.push("Ensure main subject is in sharp focus");
  
  return {
    composition: Number(composition.toFixed(1)),
    lighting: Number(lighting.toFixed(1)),
    focus: Number(focus.toFixed(1)),
    positives,
    suggestions,
    guidance: overallScore >= 8.5 ? "Excellent shot!" : 
             overallScore >= 7 ? "Good composition, minor adjustments could improve it" :
             "Try following the suggestions for a better shot"
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all photos
  app.get("/api/photos", async (req, res) => {
    try {
      const photos = await storage.getPhotos();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });

  // Get single photo
  app.get("/api/photos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const photo = await storage.getPhoto(id);
      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }
      res.json(photo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch photo" });
    }
  });

  // Create new photo with AI analysis
  app.post("/api/photos", async (req, res) => {
    try {
      const validatedData = insertPhotoSchema.parse(req.body);
      
      // Perform AI analysis
      const analysis = analyzeImage(validatedData.imageData);
      const score = (analysis.composition + analysis.lighting + analysis.focus) / 3;
      
      const photo = await storage.createPhoto({
        imageData: validatedData.imageData,
        score: Number(score.toFixed(1)),
        analysis: JSON.stringify(analysis),
      });
      
      res.json(photo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid photo data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save photo" });
    }
  });

  // Analyze image for real-time feedback (without saving)
  app.post("/api/analyze", async (req, res) => {
    try {
      const { imageData } = req.body;
      if (!imageData) {
        return res.status(400).json({ message: "Image data required" });
      }
      
      const analysis = analyzeImage(imageData);
      const score = (analysis.composition + analysis.lighting + analysis.focus) / 3;
      
      res.json({
        score: Number(score.toFixed(1)),
        analysis
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze image" });
    }
  });

  // Delete photo
  app.delete("/api/photos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePhoto(id);
      if (!deleted) {
        return res.status(404).json({ message: "Photo not found" });
      }
      res.json({ message: "Photo deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete photo" });
    }
  });

  // Get settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Update settings
  app.put("/api/settings", async (req, res) => {
    try {
      const validatedData = insertSettingsSchema.parse(req.body);
      const settings = await storage.updateSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
