// --- Tipos de Autenticação ---
export interface Credentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  token: string;
  username: string; 
}

export interface UsuarioCreateDTO {
  email: string;
  username: string;
  password: string;
}

// --- Tipos de Localização  ---
export interface LocalizacaoResponse {
  idLocalizacao: number;
  nome: string;
  latitude: number;
  longitude: number;
  dataUltimaAtualizacao: string;
  status: 'ATIVA' | 'INATIVA' | 'PENDENTE' | 'REMOVIDA' | 'BLOQUEADA';
  idUsuario: number;
}

// Para criação e atualização (LocalizacaoRequest no backend)
export interface LocalizacaoPayload {
  nome: string; 
  latitude: number; 
  longitude: number; 
  status: 'ATIVA' | 'INATIVA' | 'PENDENTE' | 'REMOVIDA' | 'BLOQUEADA';
}