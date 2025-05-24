// Common types used throughout the application

export interface PostalCodeItem {
  postalCode: string;
  city: string;
  province: string;
  region: string;
}

export interface CityInfo {
  id: number;
  name: string;
  province: string;
  region: string;
  population: number;
  mayor: string;
  area: number;
  istatCode: string;
  postalCodes: string[];
}

export interface CodiceFiscaleFormData {
  name: string;
  surname: string;
  birthdate: string;
  gender: 'M' | 'F';
  birthplace: string;
}

export interface CodiceFiscaleResult {
  fiscalCode: string;
  name: string;
  surname: string;
  birthdate: string;
  birthplace: string;
}

export interface CityCode {
  city: string;
  code: string;
  province: string;
}
