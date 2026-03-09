// src/config.js
const API_URL = import.meta.env.VITE_API_URL;

// Optional: Add a fallback for development
if (!API_URL) {
  console.warn('⚠️ VITE_API_URL not found in environment variables. Using default: http://localhost:5000/api');
}

export const API_BASE_URL = API_URL || 'http://localhost:5000/api';

export default API_BASE_URL;