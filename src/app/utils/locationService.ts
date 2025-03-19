// Cache the country code to avoid multiple API calls
let cachedCountryCode: string | null = null;

/**
 * Detect the user's country code using the ipinfo service
 */
export async function detectUserCountry(): Promise<string> {
    // Return cached country code if available
    if (cachedCountryCode) {
      return cachedCountryCode;
    }
    
    try {
      // Use IPinfo 
      const response = await fetch('https://ipinfo.io/json?token=4ae8703d935657');
      const data = await response.json();
      
      if (data && data.country) {
        console.log('Detected country:', data.country);
        // Cache the country code
        cachedCountryCode = data.country;
        return data.country;
      }
      
      console.log('Country detection failed, defaulting to US');
      // Default to US if detection fails
      return 'US';
    } catch (error) {
      console.error('Error detecting country:', error);
      // Default to US if detection fails
      return 'US';
    }
  }

/**
 * Format currency based on locale and currency code
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  try {
    // Use appropriate locale based on currency
    const locale = currencyCode === 'NGN' ? 'en-NG' : 'en-US';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    const symbol = currencyCode === 'NGN' ? '₦' : '$';
    return `${symbol}${amount}`;
  }
}

/**
 * Check if the user is in Nigeria
 */
export async function isUserInNigeria(): Promise<boolean> {
  const countryCode = await detectUserCountry();
  return countryCode === 'NG';
}

/**
 * Save the country code to local storage for persistence
 */
export function saveCountryCode(countryCode: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_country', countryCode);
    cachedCountryCode = countryCode;
  }
}

/**
 * Get the country code from local storage or detect it
 */
export async function getCountryCode(): Promise<string> {
  // Check if we have a cached value
  if (cachedCountryCode) {
    return cachedCountryCode;
  }
  
  // Check local storage if available
  if (typeof window !== 'undefined') {
    const storedCountry = localStorage.getItem('user_country');
    if (storedCountry) {
      cachedCountryCode = storedCountry;
      return storedCountry;
    }
  }
  
  // Detect country and save it
  const countryCode = await detectUserCountry();
  saveCountryCode(countryCode);
  return countryCode;
}