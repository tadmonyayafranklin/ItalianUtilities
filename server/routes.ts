import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { calculateCodiceFiscale } from "./data/codiceFiscale";

export async function registerRoutes(app: Express): Promise<Server> {
  // Codice Fiscale Generator
  app.post("/api/codice-fiscale", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        name: z.string().min(1),
        surname: z.string().min(1),
        birthdate: z.string().min(1),
        gender: z.enum(["M", "F"]),
        birthplace: z.string().min(1),
      });

      const data = schema.parse(req.body);

      // Format the birthdate
      const birthdate = new Date(data.birthdate);
      if (isNaN(birthdate.getTime())) {
        throw new Error("Invalid birthdate");
      }

      // Calculate the fiscal code
      const fiscalCode = await calculateCodiceFiscale(
        data.name,
        data.surname,
        data.birthdate,
        data.gender,
        data.birthplace
      );

      res.status(200).json({
        fiscalCode,
        name: data.name,
        surname: data.surname,
        birthdate: data.birthdate,
        birthplace: data.birthplace,
      });
    } catch (error) {
      console.error("Error in codice-fiscale endpoint:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ message });
    }
  });

  // City Code lookup for Codice Fiscale
  app.get("/api/city-code/:city", async (req: Request, res: Response) => {
    try {
      const city = req.params.city.trim();
      if (!city) {
        return res.status(400).json({ message: "City name is required" });
      }

      const cityCode = await storage.getCityCodeByName(city);
      if (!cityCode) {
        return res.status(404).json({ message: "City not found" });
      }

      res.status(200).json(cityCode);
    } catch (error) {
      console.error("Error in city-code endpoint:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message });
    }
  });

  // Postal Code Search
  app.get("/api/postal-codes", async (req: Request, res: Response) => {
    try {
      const postalCodes = await storage.getAllPostalCodes();
      res.status(200).json(postalCodes);
    } catch (error) {
      console.error("Error in postal-codes endpoint:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message });
    }
  });

  // Cities Info
  app.get("/api/cities", async (req: Request, res: Response) => {
    try {
      const region = req.query.region as string | undefined;
      const letter = req.query.letter as string | undefined;

      const cities = await storage.getCities(region, letter);
      res.status(200).json(cities);
    } catch (error) {
      console.error("Error in cities endpoint:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message });
    }
  });

  // Get all regions
  app.get("/api/regions", async (req: Request, res: Response) => {
    try {
      const regions = await storage.getAllRegions();
      res.status(200).json(regions);
    } catch (error) {
      console.error("Error in regions endpoint:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
