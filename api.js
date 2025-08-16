import axios from "axios";

let API_KEY = ""; // Global variable to store the API key

const API_BASE_URL = "https://debinar.pythonanywhere.com";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 360000,
});

// A function to set the Authorization header dynamically
export const setAuthHeader = (key) => {
  API_KEY = key;
  if (API_KEY) {
    api.defaults.headers.common["Authorization"] = `Bearer ${API_KEY}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

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

export const postToMaster = (data) =>
  withRetry(() => api.post("/master", data));

export const deleteAsset = (data) => withRetry(() => api.post("/delete", data));

export const customizeAsset = (data) =>
  withRetry(() =>
    api.post("/customize-asset", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );

export const getProjects = () => withRetry(() => api.get("/projects"));
export const createProject = (data) =>
  withRetry(() => api.post("/projects", data));
export const updateStory = (data) => withRetry(() => api.put("/story", data)); // Added missing export

// Helper function to get image URL from file path
export const getImageUrl = (filePath, type = "character") => {
  if (!filePath) return null;
  const fileName = filePath.split("/").pop() || filePath.split("\\").pop();
  let baseUrl;
  switch (type) {
    case "background":
      baseUrl = "/output/background/";
      break;
    case "scene":
      baseUrl = "/output/scene/";
      break;
    default:
      baseUrl = "/output/character/";
  }
  return `${API_BASE_URL}${baseUrl}${fileName}`;
};

export default api;
