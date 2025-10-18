import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: "https://maestro-api-dev.secil.biz",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "YOUR_SECRET_TOKEN", 
  },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  } else {
    
    config.headers.Authorization = "YOUR_SECRET_TOKEN";
  }
  return config;
});

export default api;
