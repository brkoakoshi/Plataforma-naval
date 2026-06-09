<template>
  <aside class="app-sidebar" :class="{ 'is-collapsed': !isOpen }"
         @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div class="sidebar-panel" :class="{ 'panel-expanded': isOpen, 'panel-hover': isHoverOpen && !isOpen }">
      <SidebarContent :is-open="isOpen || isHoverOpen" :is-pinned="isOpen" @toggle="toggle" />
    </div>
  </aside>
</template>

<script>
import { ref, onMounted } from 'vue';
import SidebarContent from '@/components/SidebarContent.vue';
import { useFleetStore } from '@/stores/fleet';

export default {
  name: 'AppSidebar',
  components: { SidebarContent },
  setup() {
    const isOpen = ref(true);
    const isHoverOpen = ref(false);
    const fleetStore = useFleetStore();

    const toggle = () => {
      isOpen.value = !isOpen.value;
      if (!isOpen.value) isHoverOpen.value = false;
    };
    const onMouseEnter = () => { if (!isOpen.value) isHoverOpen.value = true; };
    const onMouseLeave = () => { isHoverOpen.value = false; };

    onMounted(() => { if (!fleetStore.buques.length) fleetStore.fetchFleet(); });

    return { isOpen, isHoverOpen, toggle, onMouseEnter, onMouseLeave };
  },
};
</script>

<style scoped>
.app-sidebar {
  width: var(--sidebar-expanded); flex-shrink: 0; height: 100vh; position: relative;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.app-sidebar.is-collapsed { width: var(--sidebar-collapsed); }
.sidebar-panel {
  position: fixed; top: 0; left: 0; height: 100vh; width: var(--sidebar-collapsed);
  background: var(--sidebar-bg); border-right: 1px solid rgba(255,255,255,0.06);
  overflow: hidden; display: flex; flex-direction: column; z-index: 200;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s;
}
.sidebar-panel.panel-expanded { width: var(--sidebar-expanded); }
.sidebar-panel.panel-hover { width: var(--sidebar-expanded); box-shadow: 4px 0 32px rgba(0,0,0,0.55); z-index: 300; }
</style>
