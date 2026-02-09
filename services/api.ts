import axios from 'axios';


export const api = axios.create({
  baseURL: 'http://52.23.184.237:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});