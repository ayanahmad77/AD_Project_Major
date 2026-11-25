import axios from "axios";
import * as SecureStore from "expo-secure-store";

// IMPORTANT:
// Android emulator: use http://10.0.2.2:5000/api
// iOS simulator: use http://localhost:5000/api
// Physical phone: use your Mac's LAN IP, e.g. http://192.168.1.5:5000/api
// Replace this URL before testing on a physical phone.
export const API_BASE_URL = "http://10.7.1.1:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("synapse_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
