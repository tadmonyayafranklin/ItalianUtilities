// This file contains utility functions for calculating the Italian Tax Code (Codice Fiscale)

// Converts vowels and consonants
export function getVowels(str: string): string {
  return str.toLowerCase().replace(/[^aeiou]/g, '');
}

export function getConsonants(str: string): string {
  return str.toLowerCase().replace(/[^bcdfghjklmnpqrstvwxyz]/g, '');
}

// Calculate surname code (first 3 consonants, if not enough add vowels, if still not enough add 'x')
export function getSurnameCode(surname: string): string {
  const normalizedSurname = surname.replace(/\s+/g, '').toUpperCase();
  let consonants = getConsonants(normalizedSurname);
  let vowels = getVowels(normalizedSurname);
  
  let code = consonants.slice(0, 3);
  
  if (code.length < 3) {
    code += vowels.slice(0, 3 - code.length);
  }
  
  if (code.length < 3) {
    code += 'X'.repeat(3 - code.length);
  }
  
  return code.toUpperCase();
}

// Calculate name code (first, third and fourth consonant, if not enough add vowels, if still not enough add 'x')
export function getNameCode(name: string): string {
  const normalizedName = name.replace(/\s+/g, '').toUpperCase();
  let consonants = getConsonants(normalizedName);
  let vowels = getVowels(normalizedName);
  
  let code = '';
  if (consonants.length > 3) {
    code = consonants[0] + consonants[2] + consonants[3];
  } else {
    code = consonants.slice(0, 3);
  }
  
  if (code.length < 3) {
    code += vowels.slice(0, 3 - code.length);
  }
  
  if (code.length < 3) {
    code += 'X'.repeat(3 - code.length);
  }
  
  return code.toUpperCase();
}

// Calculate birth year code (last two digits of the year)
export function getYearCode(birthdate: string): string {
  return birthdate.slice(2, 4);
}

// Calculate birth month code (letter corresponding to the month)
export function getMonthCode(month: number): string {
  const monthCodes = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
  return monthCodes[month];
}

// Calculate birth day code (day number, for females add 40)
export function getDayCode(day: number, gender: string): string {
  if (gender === 'F') {
    day += 40;
  }
  return day.toString().padStart(2, '0');
}

// Generate control character
export function getControlChar(partialCode: string): string {
  const oddValues: { [key: string]: number } = {
    '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
    'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
    'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
    'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23
  };
  
  const evenValues: { [key: string]: number } = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
    'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19,
    'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25
  };
  
  let sum = 0;
  
  for (let i = 0; i < partialCode.length; i++) {
    const char = partialCode[i];
    if (i % 2 === 0) {
      sum += oddValues[char] || 0;
    } else {
      sum += evenValues[char] || 0;
    }
  }
  
  const remainder = sum % 26;
  return String.fromCharCode(65 + remainder);
}

// Find city code from the dataset
export async function getCityCode(birthplace: string): Promise<string> {
  try {
    const response = await fetch(`/api/city-code/${encodeURIComponent(birthplace)}`);
    if (!response.ok) {
      throw new Error(`Città non trovata: ${birthplace}`);
    }
    const data = await response.json();
    return data.code;
  } catch (error) {
    console.error("Error fetching city code:", error);
    throw error;
  }
}

// Main function to calculate the Codice Fiscale
export async function calculateCodiceFiscale(
  name: string,
  surname: string,
  birthdate: string,
  gender: string,
  birthplace: string
): Promise<string> {
  try {
    // Get surname code (first 3 chars)
    const surnameCode = getSurnameCode(surname);
    
    // Get name code (next 3 chars)
    const nameCode = getNameCode(name);
    
    // Get birth year (next 2 chars)
    const date = new Date(birthdate);
    const yearCode = getYearCode(date.getFullYear().toString());
    
    // Get birth month (next 1 char)
    const monthCode = getMonthCode(date.getMonth());
    
    // Get birth day (next 2 chars)
    const dayCode = getDayCode(date.getDate(), gender);
    
    // Get city code (next 4 chars)
    const cityCode = await getCityCode(birthplace);
    
    // Generate partial code
    const partialCode = surnameCode + nameCode + yearCode + monthCode + dayCode + cityCode;
    
    // Calculate control character
    const controlChar = getControlChar(partialCode);
    
    // Return complete code
    return partialCode + controlChar;
  } catch (error) {
    console.error("Error calculating Codice Fiscale:", error);
    throw error;
  }
}
