import axios from 'axios';
import "dotenv/config"

export const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});