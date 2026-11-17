import { create } from 'zustand';
import type { User } from '../types';
import { api, setApiAuthToken } from '../services/api';

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorMessage: string | null;

  login: (
    email: string,
    password: string
  ) => Promise<boolean>;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<boolean>;

  logout: () => void;

  updateStatus: (
    status: User['status']
  ) => void;
};

export const useAuthStore = create<AuthState>(
  (set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    errorMessage: null,

    login: async (email, password) => {
      set({ isLoading: true, errorMessage: null });

      const res = await api.login(email.trim(), password);

      if (res.data) {
        setApiAuthToken(res.data.token);
        set({
          user: res.data.user,
          token: res.data.token,
          isAuthenticated: true,
          isLoading: false,
          errorMessage: null,
        });
        return true;
      }

      set({
        isLoading: false,
        errorMessage: res.error || 'Email ou senha incorretos',
      });
      return false;
    },

    register: async (
      name,
      email,
      password
    ) => {
      set({ isLoading: true, errorMessage: null });

      const res = await api.register(name.trim(), email.trim(), password);

      if (res.data) {
        setApiAuthToken(res.data.token);
        set({
          user: res.data.user,
          token: res.data.token,
          isAuthenticated: true,
          isLoading: false,
          errorMessage: null,
        });
        return true;
      }

      set({
        isLoading: false,
        errorMessage: res.error || 'Erro ao criar conta no servidor',
      });
      return false;
    },

    logout: () => {
      setApiAuthToken(null);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        errorMessage: null,
      });
    },

    updateStatus: (status) => {
      api.updateStatus(status).catch(() => {});
      set((state) => ({
        user: state.user
          ? { ...state.user, status }
          : null,
      }));
    },
  })
);
