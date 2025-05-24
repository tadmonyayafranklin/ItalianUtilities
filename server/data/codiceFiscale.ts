import { storage } from "../storage";

// Vowels and consonants extraction functions
function getVowels(str: string): string {
  return str.toLowerCase().replace(/[^aeiou]/g, '');
}

function getConsonants(str: string): string {
  return str.toLowerCase().replace(/[^bcdfghjklmnpqrstvwxyz]/g, '');
}

// Surname code calculation (first 3 consonants, then vowels if needed, then X)
function getSurnameCode(surname: string): string {
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

// Name code calculation (if more than 3 consonants, take 1st, 3rd, 4th; otherwise first 3 consonants)
function getNameCode(name: string): string {
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

// Month code letter
function getMonthCode(month: number): string {
  const monthCodes = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
  return monthCodes[month];
}

// Day code calculation (for females add 40)
function getDayCode(day: number, gender: string): string {
  if (gender === 'F') {
    day += 40;
  }
  return day.toString().padStart(2, '0');
}

// Calculate the control character
function getControlChar(partialCode: string): string {
  const oddValues: Record<string, number> = {
    '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
    'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
    'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
    'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23
  };
  
  const evenValues: Record<string, number> = {
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
    const yearCode = date.getFullYear().toString().slice(2, 4);
    
    // Get birth month (next 1 char)
    const monthCode = getMonthCode(date.getMonth());
    
    // Get birth day (next 2 chars)
    const dayCode = getDayCode(date.getDate(), gender);
    
    // Get city code (next 4 chars)
    const cityCodeObj = await storage.getCityCodeByName(birthplace);
    if (!cityCodeObj) {
      throw new Error(`Città non trovata: ${birthplace}`);
    }
    
    // Generate partial code
    const partialCode = surnameCode + nameCode + yearCode + monthCode + dayCode + cityCodeObj.code;
    
    // Calculate control character
    const controlChar = getControlChar(partialCode);
    
    // Return complete code
    return partialCode + controlChar;
  } catch (error) {
    console.error("Error calculating Codice Fiscale:", error);
    throw error;
  }
}
