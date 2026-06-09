<template>
  <div class="pala-view">

    <!-- ═══ SIDEBAR ═══ -->
    <aside class="summary-col">
      <div class="side-section">
        <button class="back-btn" @click="$router.back()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Volver
        </button>
      </div>

      <div class="side-divider"></div>

      <div class="side-section">
        <div class="side-label">Flota</div>
        <div class="turb-name">{{ buqueData.nombre }}</div>
        <div class="turb-sub">{{ buqueData.tipo }}</div>
        <div class="turb-sub">{{ buqueData.id }}</div>
        <div class="turb-badges">
          <span class="estado-badge" :class="`estado--${estadoClass(buqueData.estado)}`">{{ buqueData.estado }}</span>
          <span class="status-pill" :class="`pill--${buqueData.color}`">{{ buqueData.status }}</span>
        </div>
      </div>

      <div class="side-divider"></div>

      <div class="side-section">
        <div class="side-label">Mantención</div>
        <div class="info-rows">
          <div class="info-row"><span class="info-lbl">Última</span><span class="info-val">{{ buqueData.lastDate }}</span></div>
          <div class="info-row"><span class="info-lbl">Próxima</span><span class="info-val info-val--next">{{ buqueData.nextDate }}</span></div>
          <div class="info-row"><span class="info-lbl">Técnico</span><span class="info-val">{{ buqueData.tecnico }}</span></div>
        </div>
      </div>

      <div class="side-divider"></div>

      <div class="side-section">
        <div class="side-label">Distribución por tipo</div>
        <div class="stat-rows">
          <div v-for="s in tipoSummary" :key="s.label" class="stat-row">
            <span class="stat-dot" :style="{ background: s.color }"></span>
            <span class="stat-name">{{ s.label }}</span>
            <div class="stat-bar"><div class="stat-bar-fill" :style="{ width: barWidth(s.value, records.length), background: s.color }"></div></div>
            <span class="stat-num" :style="{ color: s.value === 0 ? '#ccc' : s.color }">{{ s.value }}</span>
          </div>
        </div>
        <div class="total-registros">
          <span class="side-label" style="margin:0">Total registros</span>
          <span class="total-num">{{ records.length }}</span>
        </div>
      </div>
    </aside>

    <!-- ═══ PRINCIPAL ═══ -->
    <main class="main-col">
      <div class="main-header">
        <div class="breadcrumb">
          <router-link to="/mantenciones" class="bc-link">Mantenciones</router-link>
          <span class="bc-sep">/</span>
          <span class="bc-current">{{ buqueData.nombre }}</span>
        </div>
        <div class="header-right">
          <div class="filter-tabs">
            <button v-for="t in typeFilters" :key="t.value" class="filter-tab"
                    :class="{ 'filter-tab--active': activeType === t.value }"
                    @click="activeType = t.value">{{ t.label }}</button>
          </div>
          <span class="result-badge">{{ filteredRecords.length }} registros</span>
        </div>
      </div>

      <div class="table-wrap">
        <div class="thead-wrap">
          <table class="mant-table">
            <thead>
              <tr>
                <th class="col-tipo">Tipo</th>
                <th class="col-ot">Orden de trabajo</th>
                <th class="col-fecha">Fecha</th>
                <th class="col-tec">Técnico</th>
                <th class="col-dur">Duración</th>
                <th class="col-status">Estado</th>
                <th class="col-resumen">Resumen</th>
                <th class="col-action"></th>
              </tr>
            </thead>
          </table>
        </div>

        <div class="tbody-wrap">
          <table class="mant-table">
            <tbody>
              <template v-for="(rec, idx) in filteredRecords" :key="rec.id">
                <tr :class="[idx % 2 === 0 ? 'row-even' : 'row-odd', { 'row--open': selectedRecord?.id === rec.id }]"
                    class="table-row" @click="selectRecord(rec)">
                  <td class="col-tipo"><span class="tipo-badge" :class="`tipo--${typeColor(rec.tipo)}`">{{ rec.tipo }}</span></td>
                  <td class="col-ot td-ot">{{ rec.ot || '—' }}</td>
                  <td class="col-fecha td-date">{{ rec.fecha }}</td>
                  <td class="col-tec td-tec">{{ rec.tecnico }}</td>
                  <td class="col-dur td-dur">{{ rec.duracion }}</td>
                  <td class="col-status"><span class="status-pill" :class="`pill--${rec.statusColor}`">{{ rec.status }}</span></td>
                  <td class="col-resumen td-resumen">{{ rec.resumen }}</td>
                  <td class="col-action td-action">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="expand-ico" :class="{ rotated: selectedRecord?.id === rec.id }"><polyline points="6 9 12 15 18 9"/></svg>
                  </td>
                </tr>

                <tr v-if="selectedRecord?.id === rec.id" class="detail-row">
                  <td colspan="8" class="detail-cell">
                    <div class="detail-panel">
                      <div class="detail-header">
                        <div class="detail-meta">
                          <span class="tipo-badge" :class="`tipo--${typeColor(rec.tipo)}`">{{ rec.tipo }}</span>
                          <span class="detail-ot">{{ rec.ot }}</span>
                          <span class="detail-sep">·</span>
                          <span class="detail-fecha">{{ rec.fecha }}</span>
                          <span class="detail-sep">·</span>
                          <span class="detail-tec">{{ rec.tecnico }}</span>
                        </div>
                      </div>
                      <div class="detail-body">
                        <div class="detail-desc-block">
                          <div class="detail-lbl">Descripción</div>
                          <p class="detail-desc">{{ rec.descripcion }}</p>
                        </div>
                        <div v-if="rec.observaciones" class="detail-obs-block">
                          <div class="detail-lbl">Observaciones</div>
                          <div class="detail-obs">{{ rec.observaciones }}</div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>

              <tr v-if="filteredRecords.length === 0" class="empty-row">
                <td colspan="8"><div class="empty-state">No hay registros de este tipo para este buque.</div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="table-footer">
        <span class="foot-label">Historial — {{ buqueData.nombre }}</span>
        <div class="foot-right">
          <span class="foot-stat">{{ totalHoras }} h totales</span>
          <span class="foot-stat">{{ records.length }} mantenciones registradas</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, defineComponent } from 'vue';

const DEFAULT_RECORDS = () => [
  { id: 1, ot: null, tipo: 'Preventiva', fecha: '20 mar. 2026', tecnico: 'Carlos Muñoz', status: 'Completada', statusColor: 'green', duracion: '8 horas',
    resumen: 'Mantenimiento preventivo semestral.', descripcion: 'Revisión general de sistemas de casco, cubierta y propulsión. Sin observaciones.', observaciones: null },
];

// Historial de mantención por buque (hardcodeado, espejo de SARCO_TURBINAS del wind).
const BUQUE_RECORDS = {
  'VAP': {
    nombre: 'Valparaíso', tipo: 'Flota Valparaíso', id: 'VAP', estado: 'Sev5', status: 'Pendiente', color: 'red',
    lastDate: '15 abr. 2026', nextDate: 'jun. 2026', tecnico: 'Carlos Muñoz',
    records: [
      { id: 1, ot: 'OT-2026-0041', tipo: 'Correctiva', fecha: '14–15 abril 2026', tecnico: 'Carlos Muñoz', status: 'En proceso', statusColor: 'amber', duracion: '16 horas',
        resumen: 'Tratamiento de corrosión severa en tanques de lastre. OT-2026-0041.',
        descripcion: 'Inspección por ROV detectó corrosión generalizada con pérdida de espesor > 25% en mamparos de tanques de lastre nº 3 y 5, además de fisura longitudinal de 38 cm en zona de soldadura del casco a estribor. Se coordina varada en dique seco para arenado, reconstrucción de espesores por soldadura y recubrimiento epóxico. Clase notificada.',
        observaciones: 'CRÍTICO: pérdida de espesor sobre el margen de corrosión admisible por sociedad de clasificación. Restricción operativa de calado hasta reparación. Reparación en dique programada antes del 30/06/2026.' },
      { id: 2, ot: 'OT-2025-0089', tipo: 'Correctiva', fecha: '08 octubre 2025', tecnico: 'Rodrigo Vera', status: 'Completada', statusColor: 'green', duracion: '8 horas',
        resumen: 'Corrosión galvánica en pala de timón. Reemplazo de ánodos de sacrificio.',
        descripcion: 'Inspección de buceo confirmó corrosión galvánica en pala de timón por ánodos de zinc agotados. Se reemplazaron 12 ánodos de sacrificio y se verificó continuidad del sistema de protección catódica.',
        observaciones: null },
      { id: 3, ot: 'OT-2025-0034', tipo: 'Preventiva', fecha: '22 abril 2025', tecnico: 'Carlos Muñoz', status: 'Completada', statusColor: 'green', duracion: '10 horas',
        resumen: 'Inspección periódica de casco y limpieza de obra viva.',
        descripcion: 'Inspección de obra viva por dron submarino, limpieza de bio-incrustación y verificación de recubrimiento antifouling. Espesores dentro de tolerancia salvo zona de tanques (ver OT-2026-0041).',
        observaciones: null },
      { id: 4, ot: 'OT-2024-0112', tipo: 'Preventiva', fecha: '15 septiembre 2024', tecnico: 'Carlos Muñoz', status: 'Completada', statusColor: 'green', duracion: '14 horas',
        resumen: 'Mantenimiento anual de cubierta y escotillas.',
        descripcion: 'Revisión de escotillas de bodega, juntas de estanqueidad y sistemas de cierre. Repintado de cubierta principal. Sin observaciones relevantes.',
        observaciones: null },
    ],
  },
  'SAI': {
    nombre: 'San Antonio', tipo: 'Flota San Antonio', id: 'SAI', estado: 'Sev4', status: 'Programada', color: 'amber',
    lastDate: '20 may. 2026', nextDate: '20 ago. 2026', tecnico: 'Claudia Torres',
    records: [
      { id: 1, ot: 'OT-2026-0021', tipo: 'Correctiva', fecha: '20 mayo 2026', tecnico: 'Claudia Torres', status: 'En proceso', statusColor: 'amber', duracion: '—',
        resumen: 'Deformación por impacto en estructura de rampa de popa.',
        descripcion: 'Abolladura por impacto en estructura de rampa de popa detectada en inspección con dron. Se evalúa enderezado y refuerzo de cartelas. Operación con restricción de carga en rampa.',
        observaciones: 'Pendiente confirmación de astillero. Monitoreo de fisuras incipientes en uniones soldadas.' },
      { id: 2, ot: 'OT-2025-0077', tipo: 'Preventiva', fecha: '20 mayo 2025', tecnico: 'Claudia Torres', status: 'Completada', statusColor: 'green', duracion: '9 horas',
        resumen: 'Inspección anual de casco y cubierta de vehículos.',
        descripcion: 'Inspección general de casco a babor/estribor y cubierta de vehículos. Repintado parcial y limpieza de imbornales.',
        observaciones: null },
    ],
  },
};

export default defineComponent({
  name: 'MantencionesBuqueView',
  props: { id: { type: [String, Number], required: true } },
  setup(props) {
    const selectedRecord = ref(null);
    const activeType = ref('all');

    const typeFilters = [
      { value: 'all',        label: 'Todas' },
      { value: 'Preventiva', label: 'Preventiva' },
      { value: 'Correctiva', label: 'Correctiva' },
    ];

    const buqueData = computed(() => BUQUE_RECORDS[props.id] || {
      nombre: props.id, tipo: 'Buque', id: props.id, estado: 'S/O', status: 'Completada', color: 'green',
      lastDate: '—', nextDate: '—', tecnico: '—', records: DEFAULT_RECORDS(),
    });
    const records = computed(() => buqueData.value.records);
    const filteredRecords = computed(() =>
      activeType.value === 'all' ? records.value : records.value.filter((r) => r.tipo === activeType.value));

    const tipoSummary = computed(() => [
      { label: 'Preventiva', value: records.value.filter((r) => r.tipo === 'Preventiva').length, color: '#2563eb' },
      { label: 'Correctiva', value: records.value.filter((r) => r.tipo === 'Correctiva').length, color: '#dc2626' },
      { label: 'Predictiva', value: records.value.filter((r) => r.tipo === 'Predictiva').length, color: '#7c3aed' },
    ]);
    const totalHoras = computed(() =>
      records.value.reduce((sum, r) => { const h = parseInt(r.duracion); return sum + (isNaN(h) ? 0 : h); }, 0));

    const estadoClass = (estado) => estado.toLowerCase().replace('/', '');
    const typeColor = (tipo) => ({ Preventiva: 'blue', Correctiva: 'red', Predictiva: 'purple' })[tipo] || 'blue';
    const barWidth = (val, total) => (total === 0 ? '0%' : `${Math.round((val / total) * 100)}%`);
    const selectRecord = (rec) => { selectedRecord.value = selectedRecord.value?.id === rec.id ? null : rec; };

    return {
      buqueData, records, filteredRecords, tipoSummary, totalHoras,
      selectedRecord, activeType, typeFilters,
      estadoClass, typeColor, barWidth, selectRecord,
    };
  },
});
</script>

<style scoped>
* { box-sizing: border-box; }
.pala-view { display: flex; height: 100vh; background: #f5f0e8; overflow: hidden; font-family: inherit; }

.summary-col { width: 210px; flex-shrink: 0; background: #ede8de; display: flex; flex-direction: column; padding: 18px 0; overflow-y: auto; border-right: 1px solid #d8d2c6; }
.summary-col::-webkit-scrollbar { width: 0; }
.side-section { padding: 0 16px; }
.side-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em; color: #9ca3af; margin-bottom: 8px; display: block; }
.side-divider { border: none; border-top: 1px solid #ccc8be; margin: 14px 16px; }
.back-btn { display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 7px; background: rgba(0,0,0,0.06); border: none; color: #374151; font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.12s; width: 100%; }
.back-btn:hover { background: rgba(0,0,0,0.1); }
.back-btn svg { width: 13px; height: 13px; }
.turb-name { font-size: 20px; font-weight: 800; color: #111827; line-height: 1; margin-bottom: 4px; }
.turb-sub { font-size: 11px; color: #9ca3af; line-height: 1.4; }
.turb-badges { display: flex; align-items: center; gap: 5px; margin-top: 8px; }
.estado-badge { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px; }
.estado--sev5 { background: #fee2e2; color: #b91c1c; }
.estado--sev4 { background: #ffedd5; color: #c2410c; }
.estado--sev3 { background: #fff7ed; color: #ea580c; }
.estado--sev2 { background: #f7fee7; color: #65a30d; }
.estado--sev1 { background: #f0fdf4; color: #15803d; }
.estado--so { background: #f3f4f6; color: #6b7280; }
.status-pill { display: inline-block; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
.pill--green { background: #dcfce7; color: #16a34a; }
.pill--amber { background: #fef3c7; color: #d97706; }
.pill--red { background: #fee2e2; color: #dc2626; }
.info-rows { display: flex; flex-direction: column; gap: 5px; }
.info-row { display: flex; justify-content: space-between; align-items: center; }
.info-lbl { font-size: 10px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
.info-val { font-size: 12px; color: #374151; font-weight: 500; }
.info-val--next { color: #dc2626; font-weight: 700; }
.stat-rows { display: flex; flex-direction: column; gap: 4px; }
.stat-row { display: flex; align-items: center; gap: 7px; padding: 2px 0; }
.stat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.stat-name { font-size: 12px; color: #374151; flex: 1; }
.stat-bar { width: 36px; height: 4px; background: #ccc8be; border-radius: 2px; overflow: hidden; flex-shrink: 0; }
.stat-bar-fill { height: 100%; border-radius: 2px; transition: width 0.3s; }
.stat-num { font-size: 12px; font-weight: 700; flex-shrink: 0; }
.total-registros { display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid #ccc8be; margin-top: 8px; }
.total-num { font-size: 18px; font-weight: 800; color: #111827; }

.main-col { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.main-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 20px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.07); flex-shrink: 0; }
.breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 13px; }
.bc-link { color: #044245; text-decoration: none; font-weight: 500; }
.bc-link:hover { text-decoration: underline; }
.bc-sep { color: #d1d5db; }
.bc-current { color: #374151; font-weight: 700; }
.header-right { display: flex; align-items: center; gap: 10px; }
.filter-tabs { display: flex; gap: 4px; }
.filter-tab { padding: 4px 11px; border-radius: 5px; background: transparent; border: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.12s; }
.filter-tab:hover { border-color: #9ca3af; color: #374151; }
.filter-tab--active { background: #044245; border-color: #044245; color: #fff; }
.result-badge { font-size: 11px; font-weight: 600; color: #9ca3af; background: #f3f4f6; padding: 2px 8px; border-radius: 10px; }

.table-wrap { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.mant-table { width: 100%; border-collapse: collapse; font-size: 13px; table-layout: fixed; }
.col-tipo { width: 100px; }
.col-ot { width: 130px; }
.col-fecha { width: 150px; }
.col-tec { width: 160px; }
.col-dur { width: 90px; }
.col-status { width: 110px; }
.col-action { width: 60px; }
.thead-wrap { flex-shrink: 0; }
.thead-wrap .mant-table th { padding: 8px 14px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; text-align: left; background: #f5f0e8; border-bottom: 1px solid #ddd8ce; white-space: nowrap; }
.tbody-wrap { flex: 1; overflow-y: auto; }
.tbody-wrap::-webkit-scrollbar { width: 5px; }
.tbody-wrap::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
.tbody-wrap .mant-table td { padding: 13px 14px; border-bottom: 1px solid #ede8de; vertical-align: middle; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.table-row { cursor: pointer; transition: background 0.1s; }
.row-even { background: #fff; }
.row-odd { background: #faf7f2; }
.table-row:hover { background: #f0ebe0 !important; }
.row--open { background: #eee8dc !important; }
.td-ot { font-size: 11px; color: #9ca3af; font-family: monospace; }
.td-date { font-size: 12px; color: #6b7280; }
.td-tec { font-size: 12px; color: #374151; }
.td-dur { font-size: 12px; color: #6b7280; }
.td-resumen { font-size: 12px; color: #6b7280; }
.td-action { text-align: right; }
.tipo-badge { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; white-space: nowrap; }
.tipo--blue { background: #dbeafe; color: #1d4ed8; }
.tipo--red { background: #fee2e2; color: #dc2626; }
.tipo--purple { background: #ede9fe; color: #6d28d9; }
.expand-ico { width: 14px; height: 14px; color: #c0bab2; transition: transform 0.2s; display: block; margin-left: auto; }
.expand-ico.rotated { transform: rotate(180deg); color: #6b7280; }

.detail-row { background: #f5f0e8 !important; }
.detail-cell { padding: 0 !important; border-bottom: 2px solid #d8d2c6 !important; white-space: normal !important; overflow: visible !important; }
.detail-panel { padding: 0 16px 14px 16px; }
.detail-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e8e2d8; gap: 12px; flex-wrap: wrap; }
.detail-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.detail-ot { font-size: 11px; font-family: monospace; color: #6b7280; }
.detail-sep { color: #d1d5db; font-size: 13px; }
.detail-fecha { font-size: 12px; color: #6b7280; }
.detail-tec { font-size: 12px; color: #374151; font-weight: 500; }
.detail-body { display: flex; gap: 20px; padding-top: 12px; }
.detail-desc-block { flex: 1; min-width: 0; }
.detail-obs-block { width: 38%; flex-shrink: 0; }
.detail-lbl { font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #9ca3af; margin-bottom: 5px; }
.detail-desc { font-size: 12px; color: #374151; line-height: 1.65; margin: 0; }
.detail-obs { font-size: 12px; line-height: 1.55; color: #92400e; background: #fffbeb; border-left: 3px solid #d97706; padding: 10px 12px; border-radius: 0 6px 6px 0; }
.empty-row td { text-align: center; }
.empty-state { padding: 40px; font-size: 13px; color: #9ca3af; }

.table-footer { flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: #ede8de; border-top: 1px solid #d8d2c6; }
.foot-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #6b7280; }
.foot-right { display: flex; gap: 20px; }
.foot-stat { font-size: 12px; color: #374151; font-weight: 600; }

@media (max-width: 860px) {
  .summary-col { display: none; }
  .col-ot, .col-tec, .col-dur { display: none; }
  .detail-body { flex-direction: column; }
  .detail-obs-block { width: 100%; }
}
</style>
