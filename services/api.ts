import axios from 'axios';

console.log('API_URL:', process.env.API_URL); // adicione isso!
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

export const api = axios.create({
  baseURL: process.env.API_URL || 'http://52.23.184.237:3000', // fallback
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});