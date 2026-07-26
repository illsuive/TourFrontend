import { create } from 'zustand';
import axios from 'axios';
import api from '../services/api.js'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const useAuthStore = create((set) => ({
    // Initialize state from localStorage if running inside the browser window
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isLoading: false,
    error: null,

    // --- SIGNUP PROCESSOR ---
    signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
            const { token, ...userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            set({ user: userData, token, isLoading: false });
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Registration failed';
            set({ error: errorMsg, isLoading: false });
            return { success: false, error: errorMsg };
        }
    },

    // --- LOGIN PROCESSOR ---
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { token, ...userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            set({ user: userData, token, isLoading: false });
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Invalid email or password';
            set({ error: errorMsg, isLoading: false });
            return { success: false, error: errorMsg };
        }
    },

    // --- LOGOUT PROCESSOR ---
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, error: null });
    },

    // --- UTILITY RUNS ---
    clearError: () => set({ error: null }),

    // --- AUTO-VERIFY SESSION HANDSHAKE ---
    checkAuth: async () => {
  // Turn on loading barrier instantly to hold the guard loops back
  set({ isLoading: true });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;

  if (!token || !user) {
    set({ user: null, token: null, isLoading: false });
    return;
  }

  // Pre-load local state values right away so views pass structural rules
  set({ user, token, isLoading: false });

  try {
    const response = await api.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(response.data));
    set({ user: response.data, isLoading: false });
  } catch (error) {
    console.error('Session token check failed:', error);
    // Only drop session if the server explicitly tells us it's dead
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isLoading: false });
    } else {
      // If server is down/timed out, keep using local data as fallback
      set({ isLoading: false });
    }
  }
}
}));