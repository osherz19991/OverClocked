import axios from 'axios';

const instance = axios.create({
  baseURL: "https://overclocked.onrender.com", // Use your backend URL from environment variable
  headers: {
    'Content-Type': 'application/json', // Example headers if needed
  },
});

export default instance;
