// src/api/axiosConfig.ts

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8080';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT nas requisições
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken'); 
    if (token) {
      console.log('Token sendo anexado à requisição de exclusão:', token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;