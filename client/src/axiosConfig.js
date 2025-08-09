import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://expensesbackend-563s.onrender.com/api/v1', // backend URL or fallback
  withCredentials: true, // optional, only if you use cookies/sessions
});

export default instance;
