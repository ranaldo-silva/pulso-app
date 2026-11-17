import { Platform } from 'react-native';
import type { User, Channel } from '../types';

// IP da máquina local na rede Wi-Fi para funcionar tanto no emulador quanto no celular físico
const HOST = Platform.OS === 'web' ? 'localhost' : '192.168.15.6';

export const API_BASE_URL = `http://${HOST}:8080`;
export const WS_BASE_URL = `ws://${HOST}:8080/ws/signaling`;

let authToken: string | null = null;

export function setApiAuthToken(token: string | null) {
  authToken = token;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const json = await response.json();

    if (!response.ok) {
      return { error: json.message || 'Erro na requisição' };
    }

    return { data: json };
  } catch (err: any) {
    return { error: err.message || 'Falha na conexão com o servidor' };
  }
}

export const api = {
  // Auth
  login: (login: string, password: string) =>
    apiRequest<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiRequest<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  // Users
  getUsers: () => apiRequest<User[]>('/api/users'),

  updateStatus: (status: string) =>
    apiRequest<User>('/api/users/me/status', {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Channels
  getChannels: () => apiRequest<Channel[]>('/api/channels'),

  createChannel: (name: string, description: string, icon?: string) =>
    apiRequest<Channel>('/api/channels', {
      method: 'POST',
      body: JSON.stringify({ name, description, icon }),
    }),
};
