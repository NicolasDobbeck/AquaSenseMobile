import api from './axiosConfig';
import { Credentials, TokenResponse, UsuarioCreateDTO } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = async (credentials: Credentials): Promise<TokenResponse> => {
  try {
    const response = await api.post<TokenResponse>('/login', credentials);
    // Armazena o token após o login bem-sucedido
    await AsyncStorage.setItem('userToken', response.data.token);
    await AsyncStorage.setItem('username', response.data.username); // armazena o username
    return response.data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

export const registerUser = async (userData: UsuarioCreateDTO): Promise<any> => {
  try {
    const response = await api.post('/usuarios', userData); // Endpoint para criar usuário
    return response.data;
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('username');
    console.log('Usuário deslogado e token removido.');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('userToken');
};

export const getUsername = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('username');
};