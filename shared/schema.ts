import { pgTable, text, serial, integer, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// City Codes Table (for Codice Fiscale calculation)
export const cityCodes = pgTable("city_codes", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  code: text("code").notNull(),
  province: text("province").notNull(),
});

export const insertCityCodeSchema = createInsertSchema(cityCodes).pick({
  city: true,
  code: true,
  province: true,
});

// Cities Table (for City Info)
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  province: text("province").notNull(),
  region: text("region").notNull(),
  population: integer("population").notNull(),
  mayor: text("mayor").notNull(),
  area: integer("area").notNull(), // in square km
  istatCode: text("istat_code").notNull(),
});

export const insertCitySchema = createInsertSchema(cities).pick({
  name: true,
  province: true,
  region: true,
  population: true,
  mayor: true,
  area: true,
  istatCode: true,
});

// Postal Codes Table
export const postalCodes = pgTable("postal_codes", {
  id: serial("id").primaryKey(),
  postalCode: text("postal_code").notNull(),
  cityId: integer("city_id").notNull(),
});

export const insertPostalCodeSchema = createInsertSchema(postalCodes).pick({
  postalCode: true,
  cityId: true,
});

// Users Table (kept from original schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCityCode = z.infer<typeof insertCityCodeSchema>;
export type CityCode = typeof cityCodes.$inferSelect;

export type InsertCity = z.infer<typeof insertCitySchema>;
export type City = typeof cities.$inferSelect;

export type InsertPostalCode = z.infer<typeof insertPostalCodeSchema>;
export type PostalCode = typeof postalCodes.$inferSelect;
