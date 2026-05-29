import axios from 'axios';

const api = axios.create({
  // Jika production, dia akan pakai path relatif /api (sesuai config Nginx)
  // Jika development, dia akan tembak ke localhost:5000
  baseURL: import.meta.env.MODE === 'production' 
    ? '/api' 
    : 'http://localhost:5000/api',
  withCredentials: true,
});

export default api;
