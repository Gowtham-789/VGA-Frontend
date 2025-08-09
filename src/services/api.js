// src/services/api.js
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://debinar.pythonanywhere.com";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Exponential backoff retry function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withRetry = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries - 1) {
        throw lastError;
      }

      const delayTime = baseDelay * Math.pow(2, attempt);
      console.log(
        `Attempt ${attempt + 1} failed, retrying in ${delayTime}ms...`
      );
      await delay(delayTime);
    }
  }
};

// API service functions
export const checkApiStatus = () => withRetry(() => api.get("/health"));

export const generateStory = (data) =>
  withRetry(() => api.post("/generate", data));

export const generateCharacterImages = (data) =>
  withRetry(() => api.post("/character-image", data));

export const generateBackgroundImages = (data) =>
  withRetry(() => api.post("/background-image", data));

export const generateSceneComposition = (data) =>
  withRetry(() => api.post("/scene", data));

// Helper function to get image URL from file path
export const getImageUrl = (filePath) => {
  if (!filePath) return null;
  const fileName = filePath.split("/").pop() || filePath.split("\\").pop();
  return `${API_BASE_URL}/output/${fileName}`;
};

export default api;