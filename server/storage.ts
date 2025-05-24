import { 
  users, User, InsertUser, 
  cityCodes, CityCode, InsertCityCode,
  cities, City, InsertCity,
  postalCodes, PostalCode, InsertPostalCode
} from "@shared/schema";
import { italianCities } from "./data/cities";

// Interface for data storage operations
export interface IStorage {
  // User operations (kept from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // City code operations for Codice Fiscale
  getCityCodeByName(name: string): Promise<CityCode | undefined>;
  getAllCityCodes(): Promise<CityCode[]>;
  
  // City info operations
  getCities(region?: string, startingLetter?: string): Promise<any[]>;
  getCityById(id: number): Promise<any | undefined>;
  getAllRegions(): Promise<string[]>;
  
  // Postal code operations
  getPostalCodesByCity(cityName: string): Promise<any[]>;
  getPostalCodeById(id: number): Promise<any | undefined>;
  getCitiesByPostalCode(postalCode: string): Promise<any[]>;
  getAllPostalCodes(): Promise<any[]>;
}

interface CityWithPostalCodes extends City {
  postalCodes: string[];
}

interface PostalCodeWithCity {
  postalCode: string;
  city: string;
  province: string;
  region: string;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private userMap = new Map<number, User>();
  private cityCodeMap = new Map<number, CityCode>();
  private cityMap = new Map<number, City>();
  private postalCodeMap = new Map<number, PostalCode>();
  
  private citiesWithPostalCodes: CityWithPostalCodes[] = [];
  private postalCodesWithCity: PostalCodeWithCity[] = [];
  
  private userId = 1;
  private cityCodeId = 1;
  private cityId = 1;
  private postalCodeId = 1;

  constructor() {
    // Initialize with data from the static files
    this.initializeData();
  }

  private async initializeData() {
    // Initialize with sample data
    italianCities.forEach(city => {
      // Add city
      const newCity: City = {
        id: this.cityId++,
        name: city.name,
        province: city.province,
        region: city.region,
        population: city.population,
        mayor: city.mayor,
        area: city.area,
        istatCode: city.istatCode,
      };
      
      this.cityMap.set(newCity.id, newCity);
      
      // Add city code for Codice Fiscale
      const newCityCode: CityCode = {
        id: this.cityCodeId++,
        city: city.name,
        code: city.cityCode,
        province: city.province,
      };
      
      this.cityCodeMap.set(newCityCode.id, newCityCode);
      
      // Add postal codes
      const cityPostalCodes: string[] = [];
      
      city.postalCodes.forEach(code => {
        const newPostalCode: PostalCode = {
          id: this.postalCodeId++,
          postalCode: code,
          cityId: newCity.id,
        };
        
        this.postalCodeMap.set(newPostalCode.id, newPostalCode);
        cityPostalCodes.push(code);
        
        // Add to flattened list for easier lookup
        this.postalCodesWithCity.push({
          postalCode: code,
          city: city.name,
          province: city.province,
          region: city.region,
        });
      });
      
      // Add to cities with postal codes list
      this.citiesWithPostalCodes.push({
        ...newCity,
        postalCodes: cityPostalCodes,
      });
    });
  }

  // User operations (kept from original)
  async getUser(id: number): Promise<User | undefined> {
    return this.userMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.userMap.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.userMap.set(id, user);
    return user;
  }
  
  // City code operations
  async getCityCodeByName(name: string): Promise<CityCode | undefined> {
    const normalizedName = name.trim().toLowerCase();
    return Array.from(this.cityCodeMap.values()).find(
      (cityCode) => cityCode.city.toLowerCase() === normalizedName
    );
  }
  
  async getAllCityCodes(): Promise<CityCode[]> {
    return Array.from(this.cityCodeMap.values());
  }
  
  // City info operations
  async getCities(region?: string, startingLetter?: string): Promise<CityWithPostalCodes[]> {
    let result = this.citiesWithPostalCodes;
    
    if (region) {
      result = result.filter(city => 
        city.region.toLowerCase() === region.toLowerCase()
      );
    }
    
    if (startingLetter) {
      result = result.filter(city => 
        city.name.charAt(0).toUpperCase() === startingLetter.toUpperCase()
      );
    }
    
    return result;
  }
  
  async getCityById(id: number): Promise<CityWithPostalCodes | undefined> {
    return this.citiesWithPostalCodes.find(city => city.id === id);
  }
  
  async getAllRegions(): Promise<string[]> {
    const regions = new Set<string>();
    this.citiesWithPostalCodes.forEach(city => {
      regions.add(city.region);
    });
    return Array.from(regions).sort();
  }
  
  // Postal code operations
  async getPostalCodesByCity(cityName: string): Promise<PostalCodeWithCity[]> {
    const normalizedName = cityName.trim().toLowerCase();
    return this.postalCodesWithCity.filter(
      item => item.city.toLowerCase().includes(normalizedName)
    );
  }
  
  async getPostalCodeById(id: number): Promise<PostalCode | undefined> {
    return this.postalCodeMap.get(id);
  }
  
  async getCitiesByPostalCode(postalCode: string): Promise<PostalCodeWithCity[]> {
    return this.postalCodesWithCity.filter(
      item => item.postalCode.includes(postalCode)
    );
  }
  
  async getAllPostalCodes(): Promise<PostalCodeWithCity[]> {
    return this.postalCodesWithCity;
  }
}

export const storage = new MemStorage();
