<template>
  <div class="sidebar-inner">

    <!-- Header: logo -->
    <div class="sidebar-header">
      <div class="logo-wrap">
        <div v-if="isOpen" class="logo-expanded-inner">
          <FlameLogo :width="26" :height="42" />
          <div class="logo-text-block">
            <span class="logo-iner-text">INER</span>
            <span class="logo-subtitle">IA + drones · buques</span>
          </div>
        </div>
        <div v-else class="logo-collapsed"><FlameLogo :width="22" :height="36" /></div>
      </div>
      <button v-if="isOpen" class="collapse-btn" :class="{ 'collapse-btn--pinned': isPinned }"
              @click="$emit('toggle')" :title="isPinned ? 'Desfijar sidebar' : 'Fijar sidebar'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="17" x2="12" y2="22" />
          <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
        </svg>
      </button>
    </div>

    <div class="sidebar-scroll">

      <!-- Naviera (empresa) -->
      <template v-if="isOpen">
        <div class="section-label">Naviera</div>
        <div class="empresa-selector">
          <div class="empresa-badge" :style="{ background: empresa.color }">{{ empresa.codigo }}</div>
          <span class="empresa-name">{{ empresa.nombre }}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="empresa-chevron"><polyline points="6 9 12 15 18 9" /></svg>
        </div>
      </template>
      <div v-else class="empresa-badge-solo" :style="{ background: empresa.color }">{{ empresa.codigo }}</div>

      <!-- Home -->
      <router-link to="/dashboard" class="nav-item" active-class="nav-item--active" :title="!isOpen ? 'Home' : ''">
        <span class="nav-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg></span>
        <span class="nav-label" v-show="isOpen">Home</span>
      </router-link>

      <!-- Flota (por astillero) -->
      <div class="nav-group">
        <button class="nav-group-btn" @click="flotaOpen = !flotaOpen" :title="!isOpen ? 'Flota' : ''">
          <span class="nav-icon-wrap"><ShipIcon :size="20" /></span>
          <span class="nav-label" v-show="isOpen">Flota</span>
          <span v-if="isOpen && selectedAstillero" class="country-badge-inline">{{ selectedAstillero }}</span>
          <svg v-show="isOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-chevron" :class="{ rotated: flotaOpen }"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
        <transition name="slide-down">
          <div v-if="isOpen && flotaOpen" class="nav-sub-list">
            <!-- Una flota por astillero. Click = filtrar esa flota. -->
            <div v-for="a in astilleros" :key="a.codigo" class="nav-sub-item astillero-item"
                 :class="{ 'country-item--active': selectedAstillero === a.codigo }" @click="selectAstillero(a)">
              <span class="nav-icon-wrap astillero-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18" /><path d="M5 21V8l7-4 7 4v13" /><path d="M9 21v-6h6v6" /></svg></span>
              <span class="astillero-name">{{ a.nombre }}</span>
              <span class="country-code">{{ a.codigo }}</span>
            </div>
          </div>
        </transition>
      </div>

      <!-- Inspecciones -->
      <router-link to="/inspecciones" class="nav-item" active-class="nav-item--active" :title="!isOpen ? 'Inspecciones' : ''">
        <span class="nav-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg></span>
        <span class="nav-label" v-show="isOpen">Inspecciones</span>
      </router-link>

      <!-- Histórico -->
      <div class="nav-group">
        <button class="nav-group-btn" @click="historicoOpen = !historicoOpen" :title="!isOpen ? 'Histórico' : ''">
          <span class="nav-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></span>
          <span class="nav-label" v-show="isOpen">Histórico</span>
          <svg v-show="isOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-chevron" :class="{ rotated: historicoOpen }"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
        <transition name="slide-down">
          <div v-if="isOpen && historicoOpen" class="nav-sub-list">
            <router-link to="/inspecciones" class="nav-sub-item">Histórico de hallazgos</router-link>
            <router-link to="/comparativo" class="nav-sub-item">Comparativo</router-link>
            <router-link to="/mantenciones" class="nav-sub-item">Mantenciones</router-link>
          </div>
        </transition>
      </div>

      <!-- Reportes -->
      <router-link to="/reporte" class="nav-item" active-class="nav-item--active" :title="!isOpen ? 'Reportes' : ''">
        <span class="nav-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg></span>
        <span class="nav-label" v-show="isOpen">Reportes</span>
      </router-link>

      <!-- Data Center -->
      <router-link to="/data-center" class="nav-item" active-class="nav-item--active" :title="!isOpen ? 'Data Center' : ''">
        <span class="nav-icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg></span>
        <span class="nav-label" v-show="isOpen">Data Center</span>
      </router-link>
    </div>

    <!-- Footer usuario -->
    <div class="user-footer">
      <div class="user-avatar" :title="userName">{{ userInitials }}</div>
      <div class="user-info" v-show="isOpen">
        <span class="user-name">{{ userName }}</span>
        <span class="user-role">{{ userRole }}</span>
      </div>
      <button class="logout-btn" @click="logout" v-show="isOpen" title="Cerrar sesión">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
      </button>
    </div>

  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useFiltersStore } from '@/stores/filters';
import { EMPRESA, ASTILLEROS } from '@/data/mock';
import FlameLogo from '@/components/FlameLogo.vue';
import ShipIcon from '@/components/ShipIcon.vue';

export default {
  name: 'SidebarContent',
  components: { FlameLogo, ShipIcon },
  props: {
    isOpen: { type: Boolean, required: true },
    isPinned: { type: Boolean, default: false },
  },
  emits: ['toggle'],
  setup() {
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();
    const filtersStore = useFiltersStore();

    const flotaOpen = ref(true);
    const historicoOpen = ref(false);

    // Filtro de astillero: selecciona/deselecciona y asegura estar en el dashboard
    // (donde el mapa reacciona volando al astillero y filtrando su flota).
    const selectedAstillero = computed(() => filtersStore.selectedAstillero);
    const selectAstillero = (a) => {
      const next = filtersStore.selectedAstillero === a.codigo ? null : a.codigo;
      filtersStore.setSelectedAstillero(next);
      const onDashboard = route.name === 'Dashboard' || route.name === 'DashboardAlt';
      if (!onDashboard) router.push('/dashboard');
    };

    const userName = computed(() => authStore.user?.nombre || 'Inspector INER');
    const userRole = computed(() => authStore.roleLabel || 'superadmin');
    const userInitials = computed(() =>
      userName.value.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2));
    const logout = () => authStore.logout();

    return {
      empresa: EMPRESA, astilleros: ASTILLEROS,
      flotaOpen, historicoOpen,
      selectedAstillero, selectAstillero,
      userName, userRole, userInitials, logout,
    };
  },
};
</script>

<style scoped>
.sidebar-inner { display: flex; flex-direction: column; height: 100%; width: 100%; overflow: hidden; }

.sidebar-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 10px 0 12px; height: 68px; flex-shrink: 0;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.logo-wrap { display: flex; align-items: center; overflow: hidden; flex: 1; min-width: 0; }
.logo-expanded-inner { display: flex; align-items: center; gap: 8px; }
.logo-text-block { display: flex; flex-direction: column; gap: 1px; }
.logo-iner-text { font-size: 1.25rem; font-weight: 800; color: #fff; letter-spacing: 0.06em; line-height: 1; }
.logo-subtitle { font-size: 0.46rem; font-weight: 600; color: rgba(255,255,255,0.55); letter-spacing: 0.07em; text-transform: uppercase; }
.logo-collapsed { width: 36px; display: flex; align-items: center; justify-content: center; margin: 0 auto; }

.collapse-btn {
  flex-shrink: 0; width: 26px; height: 26px; background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08); border-radius: 7px; cursor: pointer;
  color: rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.collapse-btn:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); }
.collapse-btn--pinned { background: rgba(13,148,136,0.18); border-color: rgba(13,148,136,0.4); color: #0d9488; }
.collapse-btn svg { width: 13px; height: 13px; }

.sidebar-scroll { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 10px 0 6px; }
.sidebar-scroll::-webkit-scrollbar { width: 0; }

.section-label { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.28); padding: 10px 18px 4px; }

.empresa-selector { display: flex; align-items: center; gap: 9px; margin: 0 10px 2px; padding: 7px 10px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; cursor: pointer; }
.empresa-selector:hover { background: rgba(255,255,255,0.11); }
.empresa-badge { width: 26px; height: 26px; border-radius: 7px; color: #fff; font-size: 0.62rem; font-weight: 800; display: grid; place-items: center; }
.empresa-badge-solo { width: 36px; height: 36px; border-radius: 9px; color: #fff; font-size: 0.68rem; font-weight: 800; display: grid; place-items: center; margin: 4px auto 8px; }
.empresa-name { flex: 1; font-size: 0.82rem; font-weight: 700; color: #fff; white-space: nowrap; }
.empresa-chevron { width: 14px; height: 14px; color: rgba(255,255,255,0.35); }

.nav-item, .nav-group-btn {
  display: flex; align-items: center; gap: 12px; padding: 14px 18px; min-height: 52px;
  text-decoration: none; color: rgba(255,255,255,0.6); font-size: 0.97rem; font-weight: 500;
  cursor: pointer; border-left: 3px solid transparent; transition: background 0.15s, color 0.15s;
  white-space: nowrap; background: none; border-top: none; border-right: none; border-bottom: none; width: 100%; text-align: left;
}
.nav-item:hover, .nav-group-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.92); }
.nav-item--active { background: rgba(255,167,0,0.1); color: var(--c-yellow); border-left-color: var(--c-yellow); }
.nav-icon-wrap { width: 22px; height: 22px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.nav-icon-wrap svg { width: 20px; height: 20px; }
.nav-chevron { width: 14px; height: 14px; margin-left: auto; transition: transform 0.22s; }
.nav-chevron.rotated { transform: rotate(180deg); }

.nav-sub-list { overflow: hidden; }
.nav-sub-item {
  display: flex; align-items: center; gap: 8px; padding: 10px 18px 10px 52px;
  font-size: 0.86rem; color: rgba(255,255,255,0.48); text-decoration: none; cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.nav-sub-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.85); }
.nav-sub-item.router-link-active { color: var(--c-yellow); background: rgba(255,167,0,0.08); }
.country-item { cursor: pointer; }
.country-name { flex: 1; }
.country-code { font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.22); letter-spacing: 0.06em; }
.country-item--active { color: var(--c-yellow); background: rgba(255,167,0,0.08); }
.country-item--active .country-code { color: var(--c-yellow); }
.country-badge-inline { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.06em; color: var(--c-yellow); background: rgba(255,167,0,0.15); border-radius: 4px; padding: 1px 5px; margin-left: auto; }

.ship-item { padding-left: 40px; }
.ship-item--nested { padding-left: 58px; font-size: 0.82rem; }
.ship-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.ship-name { flex: 1; overflow: hidden; text-overflow: ellipsis; }
.ship-item--active { background: rgba(255,167,0,0.1); color: var(--c-yellow); border-left: 2px solid var(--c-yellow); }

/* Cabecera de astillero dentro de Flota */
.astillero-item { cursor: pointer; padding-left: 30px; font-weight: 600; color: rgba(255,255,255,0.62); }
.astillero-item .astillero-ico { width: 18px; height: 18px; }
.astillero-item .astillero-ico svg { width: 16px; height: 16px; }
.astillero-name { flex: 1; }
.astillero-item.country-item--active { color: var(--c-yellow); background: rgba(255,167,0,0.08); }
.astillero-item.country-item--active .country-code { color: var(--c-yellow); }

.slide-down-enter-active { transition: max-height 0.25s ease, opacity 0.2s; max-height: 600px; }
.slide-down-leave-active { transition: max-height 0.22s ease, opacity 0.18s; }
.slide-down-enter-from, .slide-down-leave-to { max-height: 0; opacity: 0; }
.slide-down-enter-to, .slide-down-leave-from { max-height: 600px; opacity: 1; }

.user-footer { border-top: 1px solid rgba(255,255,255,0.07); padding: 12px 14px; display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.user-avatar { width: 34px; height: 34px; border-radius: 9px; background: var(--c-yellow); color: #1a1a00; font-weight: 800; font-size: 0.72rem; display: grid; place-items: center; }
.user-info { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.user-name { font-size: 0.8rem; font-weight: 700; color: #fff; white-space: nowrap; }
.user-role { font-size: 0.65rem; color: rgba(255,255,255,0.32); }
.logout-btn { width: 28px; height: 28px; border: none; background: none; cursor: pointer; color: rgba(255,255,255,0.28); border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.logout-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }
.logout-btn svg { width: 15px; height: 15px; }
</style>
