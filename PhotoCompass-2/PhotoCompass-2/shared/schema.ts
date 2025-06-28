import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  imageData: text("image_data").notNull(), // base64 encoded image
  score: real("score").notNull(),
  analysis: text("analysis").notNull(), // JSON string of analysis data
  capturedAt: timestamp("captured_at").defaultNow(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  showGrid: boolean("show_grid").default(true),
  showAIGuidance: boolean("show_ai_guidance").default(true),
  sensitivity: integer("sensitivity").default(7),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPhotoSchema = createInsertSchema(photos).pick({
  imageData: true,
  score: true,
  analysis: true,
});

export const insertSettingsSchema = createInsertSchema(settings).pick({
  showGrid: true,
  showAIGuidance: true,
  sensitivity: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

export interface AIAnalysis {
  composition: number;
  lighting: number;
  focus: number;
  positives: string[];
  suggestions: string[];
  guidance?: string;
}
