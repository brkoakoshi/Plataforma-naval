<template>
  <div id="app-container">
    <Sidebar v-if="authStore.isAuthenticated" />
    <main class="main-content" :class="{ 'full-width': !authStore.isAuthenticated }">
      <router-view />
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import Sidebar from '@/components/Sidebar.vue';

export default {
  name: 'App',
  components: { Sidebar },
  setup() {
    const authStore = useAuthStore();
    authStore.initializeFromStorage();
    return { authStore };
  },
};
</script>

<style>
#app-container {
  display: flex;
  background: var(--c-green-dark);
}
.main-content {
  flex-grow: 1;
  min-height: 100vh;
  min-width: 0;
  background: #f4f7f7;
}
</style>
