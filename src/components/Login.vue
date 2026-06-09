<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="brand">
        <FlameLogo :width="54" :height="86" class="brand-flame" />
        <div class="brand-name">INER</div>
        <div class="brand-sub">Inspección de Buques · IA + Drones</div>
      </div>

      <form @submit.prevent="handleLogin" novalidate>
        <div class="field">
          <input v-model="credentials.email" type="email" autocomplete="username"
                 placeholder="Correo electrónico" :disabled="loading" />
        </div>

        <div class="field">
          <input v-model="credentials.password" :type="showPassword ? 'text' : 'password'"
                 autocomplete="current-password" placeholder="Contraseña" :disabled="loading" />
          <button type="button" class="eye-btn" @click="showPassword = !showPassword" tabindex="-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

        <transition name="fade"><p v-if="error" class="error-msg">{{ error }}</p></transition>

        <div class="forgot"><a href="#" @click.prevent>¿Olvidaste tu contraseña?</a></div>

        <button type="submit" class="btn-login" :disabled="loading">
          <span v-if="loading" class="spinner" /><span v-else>Ingresar</span>
        </button>
        <p class="hint">Mockup — cualquier credencial entra</p>
      </form>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import FlameLogo from '@/components/FlameLogo.vue';

export default {
  name: 'LoginComponent',
  components: { FlameLogo },
  data() {
    return {
      credentials: { email: 'inspector@iner.cl', password: 'demo' },
      showPassword: false,
      loading: false,
      error: '',
    };
  },
  setup() {
    return { authStore: useAuthStore() };
  },
  methods: {
    async handleLogin() {
      if (!this.credentials.email || !this.credentials.password) {
        this.error = 'Completa todos los campos.';
        return;
      }
      this.loading = true;
      this.error = '';
      const result = await this.authStore.login(this.credentials);
      if (!result.success) this.error = result.error || 'Credenciales incorrectas.';
      this.loading = false;
    },
  },
  mounted() {
    if (this.authStore.isAuthenticated) this.$router.push('/dashboard');
  },
};
</script>

<style scoped>
.login-wrapper {
  position: relative; z-index: 2;
  display: flex; justify-content: center; align-items: center;
  width: 100%; min-height: 100dvh; padding: 2rem 1rem;
}
.login-card {
  width: 100%; max-width: 380px;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 20px; padding: 2.75rem 2.5rem 2.5rem;
  box-shadow: 0 8px 40px rgba(0,0,0,0.2);
}
.brand { text-align: center; margin-bottom: 1.6rem; }
.brand-flame { margin: 0 auto 0.5rem; }
.brand-name { font-size: 1.6rem; font-weight: 800; color: #fff; letter-spacing: 0.08em; }
.brand-sub { font-size: 0.62rem; font-weight: 700; color: var(--c-yellow); letter-spacing: 0.18em; text-transform: uppercase; margin-top: 2px; }

.field { position: relative; margin-bottom: 1rem; }
.field input {
  width: 100%; padding: 0.85rem 1rem;
  background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
  border-radius: 10px; font-size: 0.92rem; color: #fff; outline: none;
  transition: border-color 0.2s, background 0.2s;
}
.field input::placeholder { color: rgba(255,255,255,0.5); }
.field input:focus { border-color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.22); }
.eye-btn {
  position: absolute; right: 0.85rem; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.45); padding: 0; display: flex;
}
.eye-btn:hover { color: #fff; }
.eye-btn svg { width: 17px; height: 17px; }
.forgot { text-align: right; margin-bottom: 1rem; }
.forgot a { font-size: 0.78rem; color: rgba(255,255,255,0.55); text-decoration: none; }
.forgot a:hover { color: #fff; }
.error-msg { font-size: 0.8rem; color: #ff8080; margin: 0 0 1rem; text-align: center; }
.hint { font-size: 0.7rem; color: rgba(255,255,255,0.55); text-align: center; margin: 0.5rem 0 0; }
.btn-login {
  width: 100%; margin-top: 0.5rem; padding: 0.9rem;
  background: var(--c-yellow); color: var(--c-green-dark);
  border: none; border-radius: 10px; font-weight: 800; font-size: 0.88rem;
  letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer;
  transition: background 0.2s, transform 0.15s; min-height: 48px;
  display: flex; align-items: center; justify-content: center;
}
.btn-login:hover:not(:disabled) { background: var(--c-yellow-hover); transform: translateY(-1px); }
.btn-login:active:not(:disabled) { transform: scale(0.98); }
.btn-login:disabled { opacity: 0.55; cursor: not-allowed; }
.spinner {
  width: 18px; height: 18px; border: 2.5px solid rgba(2,43,45,0.3);
  border-top-color: #022b2d; border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
