// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api/v1', // ✅ Your backend Render URL
  withCredentials: true, // optional, only if you use cookies/sessions
});

export default instance;
