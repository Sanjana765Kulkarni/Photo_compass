import { photos, settings, type Photo, type Settings, type InsertPhoto, type InsertSettings } from "@shared/schema";

export interface IStorage {
  // Photos
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  getPhotos(): Promise<Photo[]>;
  getPhoto(id: number): Promise<Photo | undefined>;
  deletePhoto(id: number): Promise<boolean>;
  
  // Settings
  getSettings(): Promise<Settings | undefined>;
  updateSettings(settings: InsertSettings): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private photos: Map<number, Photo>;
  private settings: Settings | undefined;
  private currentPhotoId: number;

  constructor() {
    this.photos = new Map();
    this.currentPhotoId = 1;
    // Default settings
    this.settings = {
      id: 1,
      userId: null,
      showGrid: true,
      showAIGuidance: true,
      sensitivity: 7,
    };
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const id = this.currentPhotoId++;
    const photo: Photo = {
      ...insertPhoto,
      id,
      userId: null,
      capturedAt: new Date(),
    };
    this.photos.set(id, photo);
    return photo;
  }

  async getPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values()).sort((a, b) => 
      new Date(b.capturedAt!).getTime() - new Date(a.capturedAt!).getTime()
    );
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async deletePhoto(id: number): Promise<boolean> {
    return this.photos.delete(id);
  }

  async getSettings(): Promise<Settings | undefined> {
    return this.settings;
  }

  async updateSettings(newSettings: InsertSettings): Promise<Settings> {
    this.settings = {
      ...this.settings!,
      ...newSettings,
    };
    return this.settings;
  }
}

export const storage = new MemStorage();
