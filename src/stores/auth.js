import { defineStore } from 'pinia';
import { authService } from '@/services/api';
import router from '@/router';

// Mismo contrato que el auth store de Iner-Wind, pero el login lo resuelve
// el servicio mock (cualquier credencial entra).
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null,
    isAuthenticated: !!localStorage.getItem('auth_token'),
    loading: false,
  }),

  actions: {
    async login(credentials) {
      this.loading = true;
      try {
        const response = await authService.login(credentials);
        if (response.data.success) {
          const { token, user } = response.data;
          this.token = token;
          this.user = user;
          this.isAuthenticated = true;
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user', JSON.stringify(user));
          router.push('/dashboard');
          return { success: true, user };
        }
        return { success: false, error: 'Credenciales incorrectas' };
      } catch (e) {
        return { success: false, error: 'Error de conexión' };
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      router.push('/login');
    },

    initializeFromStorage() {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('user');
      if (token && user) {
        this.token = token;
        this.user = JSON.parse(user);
        this.isAuthenticated = true;
      }
    },
  },

  getters: {
    roleLabel: (state) => {
      const labels = { admin: 'Admin', tecnico: 'Técnico', supervisor: 'Supervisor' };
      return labels[state.user?.rol] || state.user?.rol || 'superadmin';
    },
  },
});
