import axios from 'axios';
import "dotenv/config";

export const api = axios.create({
  baseURL: "http://3.229.142.168:3000/api",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});