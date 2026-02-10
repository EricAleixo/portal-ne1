import axios from 'axios';
import "dotenv/config";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});