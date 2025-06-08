// src/api/locationService.ts

import api from './axiosConfig';
import { LocalizacaoPayload, LocalizacaoResponse } from './types';

const BASE_URL = '/localizacao';
export const createLocalizacao = async (data: LocalizacaoPayload): Promise<LocalizacaoResponse> => {
  try {
    const response = await api.post<LocalizacaoResponse>(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar localização:', error);
    throw error;
  }
};

export const getAllLocalizacoes = async (): Promise<LocalizacaoResponse[]> => {
  try {
    const response = await api.get<LocalizacaoResponse[]>(`${BASE_URL}/all`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar localizações:', error);
    throw error;
  }
};

export const getLocalizacaoById = async (id: number): Promise<LocalizacaoResponse> => {
  try {
    const response = await api.get<LocalizacaoResponse>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar localização com ID ${id}:`, error);
    throw error;
  }
};

// Para o PUT, seu backend espera LocalizacaoRequest = LocalizacaoPayload
export const updateLocalizacao = async (id: number, data: LocalizacaoPayload): Promise<LocalizacaoResponse> => {
  try {
    const response = await api.put<LocalizacaoResponse>(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar localização com ID ${id}:`, error);
    throw error;
  }
};

export const deleteLocalizacao = async (id: number): Promise<void> => {
  try {
    await api.delete(`${BASE_URL}/${id}`);
    console.log(`Localização com ID ${id} excluída com sucesso.`);
  } catch (error) {
    console.error(`Erro ao excluir localização com ID ${id}:`, error);
    throw error;
  }
};