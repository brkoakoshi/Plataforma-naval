<template>
  <div class="page">
    <div class="breadcrumb">
      <span class="link" @click="$router.push('/dashboard')">Home</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
      <span class="current">Inspecciones</span>
    </div>
    <h1 class="page-title">Inspecciones</h1>
    <p class="page-sub">Registro de campañas de inspección por dron y ROV.</p>

    <div class="card" style="padding:0;overflow:hidden">
      <table class="tbl">
        <thead>
          <tr><th>ID</th><th>Flota</th><th>Sección</th><th>Método</th><th>Fecha</th><th>Hallazgos</th><th>Sev.</th><th>Estado</th></tr>
        </thead>
        <tbody>
          <tr v-for="i in inspecciones" :key="i.id">
            <td class="id">{{ i.id }}</td>
            <td>{{ i.buque }}</td>
            <td>{{ i.seccion }}</td>
            <td>{{ i.metodo }}</td>
            <td>{{ i.fecha }}</td>
            <td>{{ i.hallazgos }}</td>
            <td><span class="sev-pill" :style="{ background: sevColor(i.sev) }">{{ i.sev }}</span></td>
            <td><span class="badge" :class="i.estado === 'Cerrada' ? 'ok' : 'info'">{{ i.estado }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useFleetStore } from '@/stores/fleet';

export default {
  name: 'InspectionsView',
  setup() {
    const fleetStore = useFleetStore();
    onMounted(() => { if (!fleetStore.buques.length) fleetStore.fetchFleet(); });
    return { inspecciones: computed(() => fleetStore.inspecciones), sevColor: fleetStore.sevColor };
  },
};
</script>

<style scoped>
.id { font-weight: 700; color: var(--c-green); }
</style>
