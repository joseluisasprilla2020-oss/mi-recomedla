import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '');
  const user = ref(null);

  const isAuthenticated = computed(() => !!token.value);

  async function login(email, password) {
    try {
      const url = (import.meta.env.VITE_API_URL || '') + '/api/auth/login';
      const r = await axios.post(url, { email, password });
      token.value = r.data.accessToken;
      localStorage.setItem('token', token.value);
      await fetchUser();
      return true;
    } catch (e) {
      throw new Error(e.response?.data?.message || e.message);
    }
  }

  async function register(name, email, password) {
    try {
      const url = (import.meta.env.VITE_API_URL || '') + '/api/auth/register';
      await axios.post(url, { name, email, password });
      return true;
    } catch (e) {
      throw new Error(e.response?.data?.message || e.message);
    }
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      const url = (import.meta.env.VITE_API_URL || '') + '/api/auth/me';
      const r = await axios.get(url, { headers: { Authorization: `Bearer ${token.value}` } });
      user.value = r.data;
    } catch (e) {
      logout();
    }
  }

  function logout() {
    token.value = '';
    user.value = null;
    localStorage.removeItem('token');
  }

  return { token, user, isAuthenticated, login, register, fetchUser, logout };
});
