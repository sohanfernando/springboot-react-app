// Safe localStorage utilities to prevent JSON parsing errors

export const safeGetItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === 'undefined' || item === 'null') {
      return defaultValue;
    }
    return item;
  } catch (error) {
    console.warn(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const safeGetJSON = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === 'undefined' || item === 'null') {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.warn(`Error parsing ${key} from localStorage:`, error);
    // Clear the corrupted item
    localStorage.removeItem(key);
    return defaultValue;
  }
};

export const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
    return false;
  }
};

export const safeSetJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting JSON ${key} in localStorage:`, error);
    return false;
  }
};

export const safeRemoveItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

export const safeClearAll = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// Clear all auth-related data
export const clearAuthData = () => {
  const authKeys = ['user', 'token', 'cart', 'wishlist'];
  authKeys.forEach(key => safeRemoveItem(key));
};

// Validate localStorage data integrity
export const validateLocalStorageData = () => {
  const keysToValidate = ['user', 'cart', 'wishlist'];
  let hasCorruption = false;

  keysToValidate.forEach(key => {
    const item = localStorage.getItem(key);
    if (item && item !== 'undefined' && item !== 'null') {
      try {
        JSON.parse(item);
      } catch (error) {
        console.warn(`Corrupted data found for ${key}, removing...`);
        localStorage.removeItem(key);
        hasCorruption = true;
      }
    }
  });

  return !hasCorruption;
};