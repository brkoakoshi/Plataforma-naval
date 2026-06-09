<template>
  <div class="page">
    <div class="breadcrumb">
      <span class="link" @click="$router.push('/dashboard')">Home</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
      <span class="current">Flota</span>
    </div>
    <h1 class="page-title">Flota</h1>
    <p class="page-sub">{{ buques.length }} flotas bajo programa de inspección.</p>

    <div class="ship-grid">
      <div v-for="b in buques" :key="b.id" class="ship-card" @click="$router.push(`/buque/${b.id}`)">
        <div class="ship-hero">
          <ShipIcon :size="40" class="hero-icon" />
          <span class="flag">{{ b.bandera }}</span>
        </div>
        <div class="ship-body">
          <div class="ship-h">{{ b.nombre }}</div>
          <div class="ship-meta">{{ b.tipo }} · Astillero {{ b.puerto }}</div>
          <span class="badge" :class="b.estadoClass">{{ b.estado }}</span>
          <div class="ship-stats">
            <div class="ship-stat"><div class="n">{{ b.hallazgos }}</div><div class="l">Hallazgos</div></div>
            <div class="ship-stat"><div class="n">{{ b.inspeccionadas }}/{{ b.secciones }}</div><div class="l">Secciones</div></div>
            <div class="ship-stat"><div class="n">{{ b.operatividad }}%</div><div class="l">Operativ.</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useFleetStore } from '@/stores/fleet';
import ShipIcon from '@/components/ShipIcon.vue';

export default {
  name: 'FleetView',
  components: { ShipIcon },
  setup() {
    const fleetStore = useFleetStore();
    onMounted(() => { if (!fleetStore.buques.length) fleetStore.fetchFleet(); });
    return { buques: computed(() => fleetStore.getAllBuques) };
  },
};
</script>

<style scoped>
.ship-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.ship-card { background: #fff; border-radius: 14px; border: 1px solid #e7eded; box-shadow: 0 2px 10px rgba(4,66,69,0.06); overflow: hidden; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; }
.ship-card:hover { transform: translateY(-3px); box-shadow: 0 8px 22px rgba(4,66,69,0.12); }
.ship-hero { height: 120px; background: linear-gradient(135deg, #04494d, #0a6a6e); position: relative; display: flex; align-items: flex-end; padding: 12px 14px; }
.hero-icon { position: absolute; right: 14px; top: 16px; color: #bfe3e4; opacity: 0.55; }
.ship-hero .flag { font-size: 0.66rem; font-weight: 700; color: var(--c-green-dark); background: var(--c-yellow); padding: 2px 8px; border-radius: 20px; }
.ship-body { padding: 14px 16px; }
.ship-h { font-size: 1.05rem; font-weight: 800; color: var(--c-green); margin-bottom: 2px; }
.ship-meta { font-size: 0.78rem; color: var(--c-gray); margin-bottom: 12px; }
.ship-stats { display: flex; gap: 16px; margin-top: 12px; }
.ship-stat .n { font-size: 1.1rem; font-weight: 800; color: var(--c-green); }
.ship-stat .l { font-size: 0.68rem; color: var(--c-gray-light); }
</style>
