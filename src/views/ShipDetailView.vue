<template>
  <div class="page" v-if="buque">
    <div class="breadcrumb">
      <span class="link" @click="$router.push('/dashboard')">Home</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
      <span class="link" @click="$router.push('/flota')">Flota</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
      <span class="current">{{ buque.nombre }}</span>
    </div>

    <h1 class="page-title">
      {{ buque.nombre }}
      <span class="badge" :class="buque.estadoClass" style="vertical-align:middle">{{ buque.estado }}</span>
    </h1>
    <p class="page-sub">{{ buque.tipo }} · Bandera {{ buque.bandera }} · Astillero: {{ buque.puerto }}</p>

    <div class="kpi-grid">
      <div class="kpi-card"><div><div class="kpi-num">{{ buque.hallazgos }}</div><div class="kpi-lbl">Hallazgos totales</div></div></div>
      <div class="kpi-card"><div><div class="kpi-num">{{ buque.inspeccionadas }}/{{ buque.secciones }}</div><div class="kpi-lbl">Secciones inspeccionadas</div></div></div>
      <div class="kpi-card"><div><div class="kpi-num">{{ buque.operatividad }}%</div><div class="kpi-lbl">Operatividad</div></div></div>
      <div class="kpi-card"><div><div class="kpi-num" style="font-size:1.1rem">{{ buque.ultimaInsp }}</div><div class="kpi-lbl">Última inspección</div></div></div>
    </div>

    <div class="dash-cols">
      <!-- Estado por sección -->
      <div class="card">
        <div class="card-hd"><span class="card-title">Estado por sección</span><span class="card-sub">índice de integridad</span></div>
        <div class="section-list">
          <div v-for="s in buque.health" :key="s.nombre" class="section-item">
            <span class="sev-pill" :style="{ background: sevColor(s.sev) }">{{ s.sev }}</span>
            <div class="section-bar-wrap">
              <span class="section-name">{{ s.nombre }}</span>
              <div class="section-bar-track"><div class="section-bar-fill" :style="{ width: s.pct + '%', background: barColor(s.pct) }" /></div>
            </div>
            <span class="section-pct">{{ s.pct }}%</span>
          </div>
        </div>
      </div>

      <!-- Hallazgos -->
      <div class="card">
        <div class="card-hd"><span class="card-title">Hallazgos recientes</span><span class="card-sub">{{ buque.nombre }}</span></div>
        <div class="finding-grid">
          <div v-for="h in hallazgosBuque" :key="h.id" class="finding-card">
            <div class="finding-thumb" :style="{ background: 'linear-gradient(135deg,' + sevColor(h.sev) + '22,' + sevColor(h.sev) + '55)' }">
              <span class="tag badge" :style="{ background: sevColor(h.sev), color: '#fff' }">Sev {{ h.sev }}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" width="40" height="40" opacity="0.8"><path d="M3 7l9-4 9 4v10l-9 4-9-4z" /><path d="M3 7l9 4 9-4M12 11v10" /></svg>
            </div>
            <div class="finding-info">
              <div class="finding-t">{{ h.tipo }}</div>
              <div class="finding-m">{{ h.seccion }}</div>
            </div>
          </div>
          <div v-if="!hallazgosBuque.length" class="empty">Sin hallazgos registrados en el detalle de muestra.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, watch } from 'vue';
import { useFleetStore } from '@/stores/fleet';

export default {
  name: 'ShipDetailView',
  props: { id: { type: String, required: true } },
  setup(props) {
    const fleetStore = useFleetStore();
    onMounted(async () => {
      if (!fleetStore.buques.length) await fleetStore.fetchFleet();
      fleetStore.selectBuque(props.id);
    });
    watch(() => props.id, (id) => fleetStore.selectBuque(id));

    const buque = computed(() => fleetStore.buques.find((b) => b.id === props.id) || fleetStore.selectedBuque);
    const hallazgosBuque = computed(() => fleetStore.hallazgos.filter((h) => buque.value && h.buque === buque.value.nombre));

    const sevColor = fleetStore.sevColor;
    const barColor = (pct) => (pct > 80 ? '#15803d' : pct > 65 ? '#b45309' : '#b91c1c');

    return { buque, hallazgosBuque, sevColor, barColor };
  },
};
</script>

<style scoped>
.section-list { display: flex; flex-direction: column; gap: 10px; }
.section-item { display: flex; align-items: center; gap: 14px; padding: 12px 14px; border: 1px solid #e7eded; border-radius: 12px; }
.section-bar-wrap { flex: 1; }
.section-name { font-size: 0.9rem; font-weight: 700; color: var(--c-green); }
.section-bar-track { height: 8px; background: #eef2f2; border-radius: 5px; overflow: hidden; margin-top: 6px; }
.section-bar-fill { height: 100%; border-radius: 5px; }
.section-pct { font-weight: 800; color: var(--c-green); min-width: 42px; text-align: right; }

.finding-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; }
.finding-card { border: 1px solid #e7eded; border-radius: 12px; overflow: hidden; background: #fff; }
.finding-thumb { height: 110px; position: relative; display: grid; place-items: center; }
.finding-thumb .tag { position: absolute; top: 8px; left: 8px; }
.finding-info { padding: 10px 12px; }
.finding-t { font-size: 0.84rem; font-weight: 700; color: var(--c-green); }
.finding-m { font-size: 0.72rem; color: var(--c-gray); margin-top: 2px; }
.empty { color: var(--c-gray); font-size: 0.85rem; padding: 8px; }
</style>
