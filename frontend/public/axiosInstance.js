import axiosInstance from './axiosInstance';

const instance = axios.create({
  baseURL: "https://overclocked.onrender.com", // Use your backend URL from environment variable
  timeout: 10000, // Optional timeout configuration
  headers: {
    'Content-Type': 'application/json', // Example headers if needed
  },
});

export default instance;
