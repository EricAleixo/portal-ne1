import axios from 'axios';


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://52.23.184.237:3000', // fallback
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});