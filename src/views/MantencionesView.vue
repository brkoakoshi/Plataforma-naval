<template>
  <div class="mant-view">

    <!-- ═══ SIDEBAR ═══ -->
    <aside class="summary-col">
      <div class="side-section">
        <div class="side-label">Naviera</div>
        <div class="park-name">{{ fleet.nombre }}</div>
        <div class="park-sub">{{ fleet.ubicacion }}</div>
        <div class="park-sub" style="margin-top:2px;">{{ buques.length }} flotas · {{ buques.length }} astilleros</div>
      </div>

      <div class="side-divider"></div>

      <div class="side-section">
        <div class="side-label">Estado de mantención</div>
        <div class="stat-rows">
          <div v-for="s in statusSummary" :key="s.label" class="stat-row"
               :class="{ 'stat-row--active': activeFilter === s.filter }"
               @click="activeFilter = activeFilter === s.filter ? 'all' : s.filter">
            <span class="stat-dot" :style="{ background: s.color }"></span>
            <span class="stat-name">{{ s.label }}</span>
            <span class="stat-num" :style="{ color: s.color }">{{ s.value }}</span>
          </div>
        </div>
      </div>

      <div class="side-divider"></div>

      <div class="side-section">
        <div class="side-label">Severidad</div>
        <div class="stat-rows">
          <div v-for="c in catSummary" :key="c.label" class="stat-row"
               :class="{ 'stat-row--active': activeCat === c.value }"
               @click="activeCat = activeCat === c.value ? 'all' : c.value">
            <span class="stat-dot" :style="{ background: c.color }"></span>
            <span class="stat-name">{{ c.label }}</span>
            <div class="stat-bar"><div class="stat-bar-fill" :style="{ width: barWidth(c.count, buques.length), background: c.color }"></div></div>
            <span class="stat-num" style="color:#6b7280">{{ c.count }}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- ═══ PRINCIPAL ═══ -->
    <main class="main-col">
      <div class="main-header">
        <div class="header-left">
          <h1 class="main-title">Mantenciones</h1>
          <span class="result-badge">{{ filteredBuques.length }} flotas</span>
        </div>
        <div class="header-right">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-ico"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input v-model="search" class="search-input" placeholder="Buscar flota..." />
          </div>
          <div class="filter-tabs">
            <button v-for="f in filters" :key="f.value" class="filter-tab"
                    :class="{ 'filter-tab--active': activeFilter === f.value }"
                    @click="activeFilter = f.value">{{ f.label }}</button>
          </div>
        </div>
      </div>

      <div class="table-wrap">
        <table class="mant-table">
          <thead>
            <tr>
              <th class="col-torre">Flota</th>
              <th class="col-estado">Estado</th>
              <th class="col-cat">Severidad</th>
              <th class="col-tec">Técnico</th>
              <th class="col-date">Última mantención</th>
              <th class="col-date">Próxima acción</th>
              <th class="col-reg">Reg.</th>
              <th class="col-arrow"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t, idx) in filteredBuques" :key="t.id"
                :class="idx % 2 === 0 ? 'row-even' : 'row-odd'" class="table-row"
                @click="goToBuque(t)">
              <td class="td-torre">{{ t.nombre }}</td>
              <td><span class="pill" :class="`pill--${t.color}`">{{ t.status }}</span></td>
              <td><span class="cat-badge" :class="`cat--${estadoClass(t.estado)}`">{{ t.estado }}</span></td>
              <td class="td-tec">{{ t.tecnico }}</td>
              <td class="td-date">{{ t.lastDate }}</td>
              <td class="td-date">{{ t.nextDate }}</td>
              <td class="td-reg">{{ t.registros }}</td>
              <td class="td-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="arrow-ico"><polyline points="9 18 15 12 9 6"/></svg></td>
            </tr>
            <tr v-if="filteredBuques.length === 0" class="empty-row">
              <td colspan="8"><div class="empty-state">No se encontraron buques con el filtro aplicado.</div></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="table-footer">
        <div class="foot-pills">
          <span class="foot-pill foot-pill--green">{{ statsCount('Completada') }} completadas</span>
          <span class="foot-pill foot-pill--amber">{{ statsCount('Programada') }} programadas</span>
          <span class="foot-pill foot-pill--red">{{ statsCount('Pendiente') }} pendientes</span>
        </div>
        <span class="foot-total">{{ buques.length }} flotas en total</span>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';

const FLEET = { nombre: 'Naviera INER', ubicacion: 'Valparaíso, Chile' };

// Estado de mantención por flota (hardcodeado).
const MANT_BUQUES = [
  { id: 'VAP', nombre: 'Valparaíso',  estado: 'Sev5', status: 'Pendiente',  color: 'red',   lastDate: '15 abr. 2026', nextDate: 'jun. 2026',    tecnico: 'Carlos Muñoz',   registros: 14 },
  { id: 'SAI', nombre: 'San Antonio', estado: 'Sev4', status: 'Programada', color: 'amber', lastDate: '20 may. 2026', nextDate: '20 ago. 2026', tecnico: 'Claudia Torres', registros: 12 },
];

export default defineComponent({
  name: 'MantencionesView',
  setup() {
    const router = useRouter();
    const search = ref('');
    const activeFilter = ref('all');
    const activeCat = ref('all');

    const statsCount = (status) => MANT_BUQUES.filter((t) => t.status === status).length;
    const catCount = (sev) => MANT_BUQUES.filter((t) => t.estado === sev).length;

    const statusSummary = [
      { label: 'Completadas', filter: 'Completada', value: statsCount('Completada'), color: '#16a34a' },
      { label: 'Programadas', filter: 'Programada', value: statsCount('Programada'), color: '#d97706' },
      { label: 'Pendientes',  filter: 'Pendiente',  value: statsCount('Pendiente'),  color: '#dc2626' },
    ];
    const catSummary = [
      { label: 'Sev 5', value: 'Sev5', count: catCount('Sev5'), color: '#dc2626' },
      { label: 'Sev 4', value: 'Sev4', count: catCount('Sev4'), color: '#ea580c' },
      { label: 'Sev 3', value: 'Sev3', count: catCount('Sev3'), color: '#f97316' },
      { label: 'Sev 2', value: 'Sev2', count: catCount('Sev2'), color: '#84cc16' },
      { label: 'Sev 1', value: 'Sev1', count: catCount('Sev1'), color: '#16a34a' },
    ];
    const filters = [
      { value: 'all',        label: 'Todas' },
      { value: 'Completada', label: 'Completadas' },
      { value: 'Programada', label: 'Programadas' },
      { value: 'Pendiente',  label: 'Pendientes' },
    ];

    const barWidth = (val, total) => (total === 0 ? '0%' : `${Math.round((val / total) * 100)}%`);
    const estadoClass = (estado) => estado.toLowerCase();

    const filteredBuques = computed(() => {
      let list = MANT_BUQUES;
      if (search.value.trim()) {
        const q = search.value.toLowerCase();
        list = list.filter((t) => t.nombre.toLowerCase().includes(q));
      }
      if (activeFilter.value !== 'all') list = list.filter((t) => t.status === activeFilter.value);
      if (activeCat.value !== 'all') list = list.filter((t) => t.estado === activeCat.value);
      return list;
    });

    const goToBuque = (t) => { router.push(`/mantenciones/${t.id}`); };

    return {
      fleet: FLEET, buques: MANT_BUQUES,
      search, activeFilter, activeCat,
      filters, statusSummary, catSummary,
      filteredBuques, statsCount, barWidth, estadoClass, goToBuque,
    };
  },
});
</script>

<style scoped>
* { box-sizing: border-box; }
.mant-view { display: flex; height: 100vh; background: #f5f0e8; overflow: hidden; font-family: inherit; }

.summary-col { width: 210px; flex-shrink: 0; background: #ede8de; display: flex; flex-direction: column; padding: 18px 0; overflow-y: auto; border-right: 1px solid #d8d2c6; }
.summary-col::-webkit-scrollbar { width: 0; }
.side-section { padding: 0 16px; }
.side-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em; color: #9ca3af; margin-bottom: 8px; }
.side-divider { border: none; border-top: 1px solid #ccc8be; margin: 14px 16px; }
.park-name { font-size: 13px; font-weight: 700; color: #1f2937; line-height: 1.35; margin-bottom: 4px; }
.park-sub { font-size: 11px; color: #9ca3af; line-height: 1.4; }
.stat-rows { display: flex; flex-direction: column; gap: 2px; }
.stat-row { display: flex; align-items: center; gap: 7px; padding: 5px 7px; border-radius: 6px; cursor: pointer; transition: background 0.12s; }
.stat-row:hover { background: rgba(0,0,0,0.05); }
.stat-row--active { background: rgba(0,0,0,0.08); }
.stat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.stat-name { font-size: 12px; color: #374151; flex: 1; }
.stat-num { font-size: 12px; font-weight: 700; flex-shrink: 0; }
.stat-bar { width: 36px; height: 4px; background: #ccc8be; border-radius: 2px; overflow: hidden; flex-shrink: 0; }
.stat-bar-fill { height: 100%; border-radius: 2px; transition: width 0.3s; }

.main-col { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.main-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 20px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.07); flex-shrink: 0; }
.header-left { display: flex; align-items: center; gap: 10px; }
.header-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.main-title { font-size: 16px; font-weight: 700; color: #111827; margin: 0; }
.result-badge { font-size: 11px; font-weight: 600; color: #9ca3af; background: #f3f4f6; padding: 2px 8px; border-radius: 10px; }
.search-box { display: flex; align-items: center; gap: 6px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 5px 10px; transition: border-color 0.15s; }
.search-box:focus-within { border-color: #044245; }
.search-ico { width: 13px; height: 13px; color: #9ca3af; flex-shrink: 0; }
.search-input { background: none; border: none; outline: none; color: #374151; font-size: 12px; width: 120px; }
.search-input::placeholder { color: #d1d5db; }
.filter-tabs { display: flex; gap: 4px; }
.filter-tab { padding: 4px 11px; border-radius: 5px; background: transparent; border: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.12s; }
.filter-tab:hover { border-color: #9ca3af; color: #374151; }
.filter-tab--active { background: #044245; border-color: #044245; color: #fff; }

.table-wrap { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.mant-table { width: 100%; height: 100%; border-collapse: collapse; font-size: 13px; table-layout: fixed; }
.col-torre { width: 160px; }
.col-estado { width: 110px; }
.col-cat { width: 90px; }
.col-tec { width: 140px; }
.col-date { width: 145px; }
.col-reg { width: 50px; text-align: center; }
.col-arrow { width: 36px; }
.mant-table thead tr { background: #f5f0e8; }
.mant-table th { padding: 8px 14px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; text-align: left; border-bottom: 1px solid #ddd8ce; white-space: nowrap; }
.mant-table th.col-reg { text-align: center; }
.mant-table tbody { height: 100%; }
.mant-table td { padding: 0 14px; border-bottom: 1px solid #ede8de; vertical-align: middle; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.table-row { height: 1%; cursor: pointer; transition: background 0.1s; }
.row-even { background: #fff; }
.row-odd { background: #faf7f2; }
.table-row:hover { background: #f0ebe0 !important; }
.td-torre { font-weight: 700; color: #111827; font-size: 14px; }
.td-date { font-size: 12px; color: #6b7280; }
.td-tec { font-size: 12px; color: #374151; }
.td-reg { text-align: center; font-weight: 700; color: #374151; }
.td-arrow { text-align: right; }
.arrow-ico { width: 14px; height: 14px; color: #d1d5db; display: block; margin-left: auto; }
.table-row:hover .arrow-ico { color: #9ca3af; }

.pill { display: inline-flex; align-items: center; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
.pill--green { background: #dcfce7; color: #15803d; }
.pill--amber { background: #fef3c7; color: #b45309; }
.pill--red { background: #fee2e2; color: #dc2626; }
.cat-badge { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px; }
.cat--sev5 { background: #fee2e2; color: #dc2626; }
.cat--sev4 { background: #ffedd5; color: #ea580c; }
.cat--sev3 { background: #fff7ed; color: #f97316; }
.cat--sev2 { background: #f7fee7; color: #65a30d; }
.cat--sev1 { background: #f0fdf4; color: #16a34a; }
.empty-row td { text-align: center; }
.empty-state { padding: 40px; font-size: 13px; color: #9ca3af; }

.table-footer { flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: #ede8de; border-top: 1px solid #d8d2c6; }
.foot-pills { display: flex; gap: 6px; }
.foot-pill { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 9px; border-radius: 10px; }
.foot-pill--green { background: #dcfce7; color: #15803d; }
.foot-pill--amber { background: #fef3c7; color: #b45309; }
.foot-pill--red { background: #fee2e2; color: #dc2626; }
.foot-total { font-size: 11px; color: #6b7280; }

@media (max-width: 860px) { .summary-col { display: none; } }
</style>
