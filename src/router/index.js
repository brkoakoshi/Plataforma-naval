import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true, title: 'Iniciar sesión' },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/PortfolioDashboardView.vue'),
    meta: { requiresAuth: true, title: 'Dashboard' },
  },
  {
    path: '/dashboard',
    name: 'DashboardAlt',
    component: () => import('@/views/PortfolioDashboardView.vue'),
    meta: { requiresAuth: true, title: 'Dashboard' },
  },
  {
    path: '/flota',
    name: 'Fleet',
    component: () => import('@/views/FleetView.vue'),
    meta: { requiresAuth: true, title: 'Flota' },
  },
  {
    path: '/buque/:id',
    name: 'ShipDetail',
    component: () => import('@/views/ShipDetailView.vue'),
    meta: { requiresAuth: true, title: 'Detalle de buque' },
    props: true,
  },
  {
    path: '/inspecciones',
    name: 'Inspections',
    component: () => import('@/views/InspectionsView.vue'),
    meta: { requiresAuth: true, title: 'Inspecciones' },
  },
  {
    path: '/comparativo',
    name: 'Comparativo',
    component: () => import('@/views/ComparativoView.vue'),
    meta: { requiresAuth: true, title: 'Comparativo de inspecciones' },
  },
  {
    path: '/mantenciones',
    name: 'Mantenciones',
    component: () => import('@/views/MantencionesView.vue'),
    meta: { requiresAuth: true, title: 'Mantenciones' },
  },
  {
    path: '/mantenciones/:id',
    name: 'MantencionesBuque',
    component: () => import('@/views/MantencionesBuqueView.vue'),
    meta: { requiresAuth: true, title: 'Mantenciones - Detalle' },
    props: true,
  },
  {
    path: '/reporte',
    name: 'Reportes',
    component: () => import('@/views/ReportesView.vue'),
    meta: { requiresAuth: true, title: 'Reportes' },
  },
  {
    path: '/data-center',
    name: 'DataCenter',
    component: () => import('@/views/DataCenterView.vue'),
    meta: { requiresAuth: true, title: 'Data Center' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) authStore.initializeFromStorage();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) return next('/login');
  if (to.meta.requiresGuest && authStore.isAuthenticated) return next('/dashboard');

  document.title = to.meta.title ? `${to.meta.title} | Plataforma INER · Buques` : 'Plataforma INER · Buques';
  next();
});

export default router;
