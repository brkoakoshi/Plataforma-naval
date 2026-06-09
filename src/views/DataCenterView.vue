<template>
  <div class="dc-view">

    <!-- ═══ PRINT HEADER (solo en PDF) ═══ -->
    <div class="dc-print-header">
      <div class="dc-print-logo">
        <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
          <rect width="40" height="40" rx="8" fill="#1a3a3a"/>
          <path d="M20 8 L20 24 M20 8 L14 18 M20 8 L26 20 M20 8 L11 14" stroke="#e6c97a" stroke-width="2" stroke-linecap="round"/>
          <circle cx="20" cy="24" r="2.5" fill="#e6c97a"/>
        </svg>
        <div class="dc-print-logo-text">
          <span class="dc-print-brand">INER</span>
          <span class="dc-print-sub">IA + DRONES</span>
        </div>
      </div>
      <div class="dc-print-title-block">
        <h1 class="dc-print-title">Data Center — Análisis Integral</h1>
        <p class="dc-print-meta">Generado el {{ TODAY }} · Año base {{ filterYear }} · {{ filterBuque || 'Toda la flota' }}</p>
      </div>
    </div>

    <!-- ═══ HEADER ═══ -->
    <div class="dc-header">
      <div class="dc-breadcrumb">
        <router-link to="/dashboard" class="bc-home">Home</router-link>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><polyline points="9 18 15 12 9 6"/></svg>
        <span class="bc-current">Data Center — Análisis Integral</span>
      </div>
      <div class="dc-controls">
        <div class="dc-filter">
          <label>Flota</label>
          <select v-model="filterBuque">
            <option value="">Todos</option>
            <option v-for="p in BUQUE_NAMES" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
        <div class="dc-filter">
          <label>Año base</label>
          <select v-model="filterYear">
            <option v-for="y in [2023,2024,2025,2026]" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <div class="dc-badge dc-badge--live">
          <span class="dc-badge-dot"></span>
          Datos en vivo · {{ TODAY }}
        </div>
        <div v-if="exportOpen" class="export-overlay" @click="exportOpen = false"></div>
        <div class="dc-export-wrap">
          <button class="btn-export-dc" @click="exportOpen = !exportOpen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="14" height="14"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exportar informe
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="11" height="11"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div v-if="exportOpen" class="export-dropdown">
            <button class="export-option" @click="exportPDF">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Exportar PDF
            </button>
            <button class="export-option" @click="exportCSV">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>
              Exportar CSV (tabla)
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ KPI ROW ═══ -->
    <div class="kpi-row">
      <div v-for="k in kpis" :key="k.label" class="kpi-card">
        <div class="kpi-icon" :style="{ background: k.bg }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" v-html="k.icon"></svg>
        </div>
        <div class="kpi-body">
          <div class="kpi-value">{{ k.value }}</div>
          <div class="kpi-label">{{ k.label }}</div>
          <div class="kpi-trend" :class="'kpi-trend--' + k.trendDir">{{ k.trend }}</div>
        </div>
      </div>
    </div>

    <!-- ═══ MAIN SCROLL ═══ -->
    <div class="dc-scroll">

      <!-- Fila 1: Tendencia + Predictivo -->
      <div class="dc-row dc-row--2col" style="grid-template-columns: 1.4fr 1fr;">
        <div class="chart-card">
          <div class="card-hd">
            <div class="card-hd-left">
              <span class="card-title">Tendencia de Hallazgos Detectados</span>
              <span class="card-sub">Hallazgos por mes · toda la flota</span>
            </div>
            <div class="legend-chips">
              <span class="lc lc--24">2024</span><span class="lc lc--25">2025</span><span class="lc lc--26">2026</span>
            </div>
          </div>
          <apexchart type="area" height="210" :options="trendOptions" :series="trendSeries" />
        </div>

        <div class="chart-card">
          <div class="card-hd">
            <div class="card-hd-left">
              <span class="card-title">Análisis Predictivo</span>
              <span class="card-sub">Hallazgos esperados · próx. 6 meses</span>
            </div>
            <span class="badge-pred">IA Forecast</span>
          </div>
          <apexchart type="line" height="210" :options="predOptions" :series="predSeries" />
        </div>
      </div>

      <!-- Fila 2: Buque + Tipo + Inspecciones -->
      <div class="dc-row dc-row--3col">
        <div class="chart-card">
          <div class="card-hd"><span class="card-title">Hallazgos por Flota</span><span class="card-sub">Acumulado 2026</span></div>
          <apexchart type="bar" height="200" :options="shipBarOptions" :series="shipBarSeries" />
        </div>

        <div class="chart-card">
          <div class="card-hd"><span class="card-title">Tipos de Hallazgo</span><span class="card-sub">Distribución global</span></div>
          <div class="donut-layout">
            <apexchart type="donut" height="170" :options="anomDonutOptions" :series="anomDonutSeries" />
            <div class="donut-leg-col">
              <div v-for="(it, i) in anomLegend" :key="i" class="dl-item">
                <span class="dl-dot" :style="{ background: it.color }"></span>
                <span class="dl-label">{{ it.label }}</span>
                <span class="dl-pct">{{ it.pct }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="card-hd"><span class="card-title">Inspecciones</span><span class="card-sub">Prog. vs Comp. por mes</span></div>
          <apexchart type="bar" height="200" :options="inspOptions" :series="inspSeries" />
        </div>
      </div>

      <!-- Fila 3: Score Riesgo + Degradación severidad -->
      <div class="dc-row dc-row--2col">
        <div class="chart-card">
          <div class="card-hd"><span class="card-title">Score de Riesgo por Flota</span><span class="card-sub">Índice compuesto 0–100</span></div>
          <div class="risk-list">
            <div v-for="r in riskByShip" :key="r.park" class="risk-row">
              <div class="risk-row-left">
                <span class="risk-flag">{{ r.flag }}</span>
                <span class="risk-park">{{ r.park }}</span>
              </div>
              <div class="risk-bar-wrap">
                <div class="risk-bar-track"><div class="risk-bar-fill" :style="{ width: r.risk + '%', background: riskColor(r.risk) }"></div></div>
                <span class="risk-score" :style="{ color: riskColor(r.risk) }">{{ r.risk }}</span>
                <span class="risk-trend" :class="'trend-' + r.trend">{{ r.trend === 'up' ? '▲' : r.trend === 'down' ? '▼' : '–' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="card-hd"><span class="card-title">Evolución de Severidad Promedio</span><span class="card-sub">Por sección · 2023–2026</span></div>
          <apexchart type="line" height="230" :options="sevEvOptions" :series="sevEvSeries" />
        </div>
      </div>

      <!-- Fila 4: Tiempo reparación + Radial operatividad -->
      <div class="dc-row dc-row--2col" style="grid-template-columns: 1fr 1fr;">
        <div class="chart-card">
          <div class="card-hd"><span class="card-title">Tiempo Prom. de Reparación</span><span class="card-sub">Días · por tipo de hallazgo</span></div>
          <apexchart type="bar" height="210" :options="repairTimeOptions" :series="repairTimeSeries" />
        </div>

        <div class="chart-card">
          <div class="card-hd"><span class="card-title">Operatividad por Flota</span><span class="card-sub">% disponibilidad · 2026</span></div>
          <apexchart type="radialBar" height="240" :options="radialOptions" :series="radialSeries" />
        </div>
      </div>

      <!-- Tabla: Buques en Riesgo -->
      <div class="chart-card">
        <div class="card-hd">
          <div class="card-hd-left">
            <span class="card-title">Secciones en Riesgo — Intervención Recomendada</span>
            <span class="card-sub">Ordenados por score de riesgo descendente</span>
          </div>
          <div class="table-legend">
            <span class="tl-dot" style="background:#ef4444"></span><span class="tl-lbl">Crítico (&gt;80)</span>
            <span class="tl-dot" style="background:#f97316"></span><span class="tl-lbl">Alto (60–80)</span>
            <span class="tl-dot" style="background:#eab308"></span><span class="tl-lbl">Medio (40–60)</span>
            <span class="tl-dot" style="background:#22c55e"></span><span class="tl-lbl">Bajo (&lt;40)</span>
          </div>
        </div>
        <div class="risk-table-wrap">
          <table class="risk-table">
            <thead>
              <tr>
                <th>Flota</th><th>Sección</th><th>Astillero</th><th>Risk Score</th>
                <th>Prob. Falla 6m</th><th>Último Hallazgo</th><th>Severidad</th><th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in atRiskShips" :key="t.buque + t.seccion" :class="'row-risk-' + riskLevel(t.riskScore)">
                <td class="td-turbina">{{ t.buque }}</td>
                <td>{{ t.seccion }}</td>
                <td class="td-pais"><span class="pais-badge">{{ t.puerto }}</span></td>
                <td class="td-risk">
                  <div class="inline-risk">
                    <div class="inline-risk-bar" :style="{ width: t.riskScore + '%', background: riskColor(t.riskScore) }"></div>
                    <span :style="{ color: riskColor(t.riskScore) }">{{ t.riskScore }}</span>
                  </div>
                </td>
                <td class="td-prob" :style="{ color: probColor(t.probFalla) }">{{ t.probFalla }}</td>
                <td>{{ t.ultimoHallazgo }}</td>
                <td><span class="sev-badge" :class="'sev-' + t.sev">Sev {{ t.sev }}</span></td>
                <td><span class="accion-badge" :class="'accion-' + t.accionClass">{{ t.accion }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { BUQUES } from '@/data/mock';

const TODAY = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
const BUQUE_NAMES = BUQUES.map((b) => b.nombre);

const KPIS = [
  { label: 'Inspecciones totales', value: '94', trend: '▲ +21 vs 2025', trendDir: 'up', bg: '#e8f5e9',
    icon: '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="12" y2="16"/>' },
  { label: 'Hallazgos detectados', value: '104', trend: '▲ +33 vs 2025', trendDir: 'up', bg: '#fff3e0',
    icon: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
  { label: 'Flotas activas', value: '2 / 2', trend: '100% en operación', trendDir: 'neutral', bg: '#e3f2fd',
    icon: '<path d="M3 17l1.5-4.5h15L21 17"/><path d="M3 17c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3-1.5 4.5 0"/><path d="M12 12.5V4h5l-2 4.5"/>' },
  { label: 'Disponibilidad prom.', value: '88.3%', trend: '▼ -1.2% vs 2025', trendDir: 'down', bg: '#f3e5f5',
    icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
  { label: 'Ahorro estimado', value: 'USD 1.8M', trend: 'Reparaciones preventivas', trendDir: 'neutral', bg: '#e8f5e9',
    icon: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>' },
];

const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const TREND_2024 = [4, 6, 8, 5, 9, 11, 13, 10, 7, 6, 9, 12];
const TREND_2025 = [7, 9, 11, 13, 15, 18, 16, 19, 17, 14, 12, 16];
const TREND_2026 = [12, 15, 19, 17, 21, null, null, null, null, null, null, null];

const PRED_HIST = [12, 15, 19, 17, 21];
const PRED_PRED = [null, null, null, null, 21, 25, 29, 27, 32, 35, 38];
const PRED_LOW  = [null, null, null, null, 19, 21, 24, 23, 28, 30, 32];
const PRED_HIGH = [null, null, null, null, 23, 29, 34, 31, 37, 41, 45];
const PRED_MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov'];

// Riesgo por flota
const RISK_BY_SHIP = [
  { park: 'Valparaíso',  flag: '🇨🇱', risk: 88, trend: 'up'     },
  { park: 'San Antonio', flag: '🇨🇱', risk: 64, trend: 'stable' },
];

// Secciones en riesgo (tabla), agrupadas por flota
const AT_RISK = [
  { buque:'Valparaíso',  seccion:'Tanques de lastre', puerto:'Valparaíso', riskScore:93, probFalla:'74%', ultimoHallazgo:'Corrosión > 25%',     sev:5, accion:'Varada urgente',        accionClass:'critical' },
  { buque:'Valparaíso',  seccion:'Casco (estribor)',  puerto:'Valparaíso', riskScore:88, probFalla:'67%', ultimoHallazgo:'Fisura 38 cm',        sev:5, accion:'Reparación inmediata',  accionClass:'critical' },
  { buque:'San Antonio', seccion:'Rampa de popa',     puerto:'San Antonio',riskScore:76, probFalla:'53%', ultimoHallazgo:'Deformación',         sev:4, accion:'Inspección próxima',    accionClass:'high'     },
  { buque:'Valparaíso',  seccion:'Hélice y timón',    puerto:'Valparaíso', riskScore:70, probFalla:'48%', ultimoHallazgo:'Corrosión galvánica', sev:4, accion:'Monitoreo mensual',     accionClass:'high'     },
  { buque:'Valparaíso',  seccion:'Casco (babor)',     puerto:'Valparaíso', riskScore:62, probFalla:'40%', ultimoHallazgo:'Bio-incrustación',    sev:3, accion:'Limpieza de obra viva', accionClass:'high'     },
  { buque:'San Antonio', seccion:'Tanques de lastre', puerto:'San Antonio',riskScore:55, probFalla:'34%', ultimoHallazgo:'Pitting',             sev:3, accion:'Monitoreo trimestral',  accionClass:'medium'   },
  { buque:'San Antonio', seccion:'Cubierta principal',puerto:'San Antonio',riskScore:39, probFalla:'21%', ultimoHallazgo:'Desprend. pintura',   sev:2, accion:'Revisión semestral',    accionClass:'low'      },
];

const CHART_FONT = { fontFamily: 'system-ui, -apple-system, sans-serif' };
const GRID_OPTS = { borderColor: 'rgba(0,0,0,0.05)', strokeDashArray: 4 };
const AXIS_STYLE = { style: { colors: '#94a3b8', fontSize: '10px' } };

export default defineComponent({
  name: 'DataCenterView',
  setup() {
    const filterBuque = ref('');
    const filterYear = ref(2026);

    const kpis = KPIS;
    const riskByShip = RISK_BY_SHIP;
    const atRiskShips = AT_RISK;

    const trendSeries = [
      { name: '2024', data: TREND_2024 },
      { name: '2025', data: TREND_2025 },
      { name: '2026', data: TREND_2026 },
    ];
    const trendOptions = {
      chart: { type: 'area', toolbar: { show: false }, animations: { enabled: true, speed: 400 }, ...CHART_FONT },
      colors: ['#94a3b8', '#60a5fa', '#22c55e'],
      stroke: { curve: 'smooth', width: [2, 2, 2.5] },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.02 } },
      dataLabels: { enabled: false },
      xaxis: { categories: MONTHS, labels: AXIS_STYLE, axisBorder: { show: false }, axisTicks: { show: false }, tooltip: { enabled: false } },
      yaxis: { labels: { ...AXIS_STYLE, formatter: (v) => (v != null ? v : '') } },
      grid: GRID_OPTS, legend: { show: false },
      tooltip: { shared: true, intersect: false, theme: 'light' },
      annotations: { xaxis: [{ x: 'May', x2: 'Dic', fillColor: 'rgba(100,116,139,0.04)', label: { text: 'Sin datos aún', style: { fontSize: '9px', color: '#94a3b8' } } }] },
    };

    const predSeries = [
      { name: 'Histórico 2026', type: 'line', data: PRED_HIST.concat([null, null, null, null, null, null]) },
      { name: 'Forecast', type: 'line', data: PRED_PRED },
      { name: 'Banda inf.', type: 'area', data: PRED_LOW },
      { name: 'Banda sup.', type: 'area', data: PRED_HIGH },
    ];
    const predOptions = {
      chart: { type: 'line', toolbar: { show: false }, animations: { enabled: true, speed: 400 }, ...CHART_FONT },
      colors: ['#22c55e', '#f97316', '#fde68a', '#fde68a'],
      stroke: { curve: 'smooth', width: [2.5, 2, 0, 0], dashArray: [0, 6, 0, 0] },
      fill: { type: ['solid', 'solid', 'gradient', 'gradient'], gradient: { shadeIntensity: 1, opacityFrom: 0.2, opacityTo: 0.05 } },
      dataLabels: { enabled: false },
      xaxis: { categories: PRED_MONTHS, labels: AXIS_STYLE, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { ...AXIS_STYLE, formatter: (v) => (v != null ? Math.round(v) : '') } },
      grid: GRID_OPTS, legend: { show: false },
      tooltip: { shared: false, intersect: false, theme: 'light' },
      annotations: { xaxis: [{ x: 'May', borderColor: '#94a3b8', borderWidth: 1.5, strokeDashArray: 4, label: { text: 'Hoy', style: { fontSize: '9px', color: '#94a3b8' } } }] },
    };

    // Hallazgos por buque
    const shipBarSeries = [{ name: 'Hallazgos', data: BUQUES.map((b) => b.hallazgos) }];
    const shipBarOptions = {
      chart: { type: 'bar', toolbar: { show: false }, ...CHART_FONT },
      colors: ['#4a8a5e'],
      plotOptions: { bar: { horizontal: true, borderRadius: 4, dataLabels: { position: 'top' } } },
      dataLabels: { enabled: true, formatter: (v) => v, style: { fontSize: '10px', colors: ['#475569'] }, offsetX: 16 },
      xaxis: { categories: BUQUES.map((b) => b.nombre), labels: AXIS_STYLE, axisBorder: { show: false } },
      yaxis: { labels: { style: { colors: '#475569', fontSize: '11px', fontWeight: 600 } } },
      grid: GRID_OPTS, legend: { show: false }, tooltip: { theme: 'light' },
    };

    // Tipos de hallazgo
    const anomColors = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6', '#10b981'];
    const anomLegend = [
      { label: 'Corrosión',     pct: 34, color: '#ef4444' },
      { label: 'Pitting',       pct: 22, color: '#f97316' },
      { label: 'Fisura',        pct: 16, color: '#eab308' },
      { label: 'Bio-incrust.',  pct: 12, color: '#3b82f6' },
      { label: 'Deformación',   pct: 9,  color: '#8b5cf6' },
      { label: 'Pintura',       pct: 7,  color: '#10b981' },
    ];
    const anomDonutSeries = anomLegend.map((a) => a.pct);
    const anomDonutOptions = {
      chart: { type: 'donut', toolbar: { show: false }, ...CHART_FONT },
      colors: anomColors, labels: anomLegend.map((a) => a.label),
      dataLabels: { enabled: false }, legend: { show: false }, stroke: { width: 2 },
      plotOptions: { pie: { donut: { size: '65%', labels: { show: true,
        name: { show: true, fontSize: '9px', fontWeight: 600, color: '#94a3b8', offsetY: 4 },
        value: { show: true, fontSize: '16px', fontWeight: 800, color: '#1e293b', offsetY: 0 },
        total: { show: true, showAlways: true, label: 'TIPOS', fontSize: '9px', fontWeight: 600, color: '#94a3b8', offsetY: 4, formatter: () => '6' },
      } } } },
      tooltip: { y: { formatter: (v) => v + '%' } },
    };

    const inspSeries = [
      { name: 'Programadas', data: [5, 7, 6, 9, 7, 8, 10, 11, 9, 10, 12, 14] },
      { name: 'Completadas', data: [5, 6, 6, 8, 7, 8, 9, 10, 9, 9, 11, 13] },
    ];
    const inspOptions = {
      chart: { type: 'bar', toolbar: { show: false }, ...CHART_FONT },
      colors: ['#cbd5e1', '#4a8a5e'],
      plotOptions: { bar: { columnWidth: '60%', borderRadius: 3, grouped: true } },
      dataLabels: { enabled: false },
      xaxis: { categories: MONTHS, labels: AXIS_STYLE, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: AXIS_STYLE }, grid: GRID_OPTS,
      legend: { position: 'top', fontSize: '10px', markers: { size: 6 }, fontFamily: 'inherit' },
      tooltip: { shared: true, intersect: false, theme: 'light' },
    };

    // Evolución severidad por sección
    const sevEvSeries = [
      { name: 'Casco',           data: [1.6, 2.0, 2.5, 3.1] },
      { name: 'Tanques lastre',  data: [1.3, 1.8, 2.4, 3.0] },
      { name: 'Cubierta',        data: [0.9, 1.0, 1.2, 1.5] },
      { name: 'Hélice/timón',    data: [0.7, 0.9, 1.3, 1.8] },
    ];
    const sevEvOptions = {
      chart: { type: 'line', toolbar: { show: false }, ...CHART_FONT },
      colors: ['#ef4444', '#3b82f6', '#f97316', '#8b5cf6'],
      stroke: { curve: 'smooth', width: 2.5 },
      markers: { size: 4, strokeWidth: 0, hover: { size: 6 } },
      dataLabels: { enabled: false },
      xaxis: { categories: [2023, 2024, 2025, 2026], labels: AXIS_STYLE, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { ...AXIS_STYLE, formatter: (v) => 'Sev ' + v.toFixed(1) }, min: 0, max: 3.5 },
      grid: GRID_OPTS,
      legend: { position: 'top', fontSize: '10px', markers: { size: 6 }, fontFamily: 'inherit' },
      tooltip: { shared: true, theme: 'light', y: { formatter: (v) => 'Sev ' + v.toFixed(2) } },
      annotations: { yaxis: [{ y: 3, borderColor: '#ef4444', borderWidth: 1, strokeDashArray: 4, label: { text: 'Nivel crítico', style: { color: '#ef4444', fontSize: '9px' } } }] },
    };

    const repairTimeSeries = [{ name: 'Días promedio', data: [10, 18, 28, 6, 40, 15] }];
    const repairTimeOptions = {
      chart: { type: 'bar', toolbar: { show: false }, ...CHART_FONT },
      colors: ['#60a5fa'],
      plotOptions: { bar: { horizontal: true, borderRadius: 4, dataLabels: { position: 'top' } } },
      dataLabels: { enabled: true, formatter: (v) => v + ' d', style: { fontSize: '10px', colors: ['#475569'] }, offsetX: 22 },
      xaxis: { categories: ['Pitting', 'Bio-incrust.', 'Fisura', 'Pintura', 'Corrosión', 'Deformación'], labels: AXIS_STYLE, axisBorder: { show: false } },
      yaxis: { labels: { style: { colors: '#475569', fontSize: '10px', fontWeight: 600 } } },
      grid: GRID_OPTS, legend: { show: false }, tooltip: { theme: 'light', y: { formatter: (v) => v + ' días' } },
    };

    const radialSeries = BUQUES.map((b) => b.operatividad);
    const radialOptions = {
      chart: { type: 'radialBar', toolbar: { show: false }, ...CHART_FONT },
      colors: ['#22c55e', '#4ade80', '#86efac', '#60a5fa', '#f97316', '#f87171'],
      plotOptions: { radialBar: { hollow: { size: '20%' }, track: { background: '#f1f5f9', margin: 2 }, dataLabels: { show: false } } },
      labels: BUQUES.map((b) => b.nombre),
      legend: { show: true, position: 'bottom', fontSize: '9px', fontFamily: 'inherit', markers: { size: 5 }, itemMargin: { horizontal: 4, vertical: 0 } },
      tooltip: { y: { formatter: (v) => v + '%' } },
    };

    const exportOpen = ref(false);
    const exportPDF = () => { exportOpen.value = false; setTimeout(() => window.print(), 150); };
    const exportCSV = () => {
      exportOpen.value = false;
      const rows = [
        ['Flota', 'Sección', 'Astillero', 'Risk Score', 'Prob. Falla 6m', 'Último Hallazgo', 'Severidad', 'Acción'],
        ...atRiskShips.map((t) => [t.buque, t.seccion, t.puerto, t.riskScore, t.probFalla, t.ultimoHallazgo, 'Sev ' + t.sev, t.accion]),
      ];
      const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `datacenter-buques-riesgo-${filterYear.value}.csv`;
      a.click(); URL.revokeObjectURL(url);
    };

    const riskColor = (s) => (s >= 80 ? '#ef4444' : s >= 60 ? '#f97316' : s >= 40 ? '#eab308' : '#22c55e');
    const riskLevel = (s) => (s >= 80 ? 'critical' : s >= 60 ? 'high' : s >= 40 ? 'medium' : 'low');
    const probColor = (pct) => { const n = parseInt(pct); return n >= 60 ? '#ef4444' : n >= 40 ? '#f97316' : n >= 25 ? '#eab308' : '#22c55e'; };

    return {
      TODAY, BUQUE_NAMES, filterBuque, filterYear,
      kpis, riskByShip, atRiskShips, anomLegend,
      trendSeries, trendOptions, predSeries, predOptions,
      shipBarSeries, shipBarOptions, anomDonutSeries, anomDonutOptions,
      inspSeries, inspOptions, sevEvSeries, sevEvOptions,
      repairTimeSeries, repairTimeOptions, radialSeries, radialOptions,
      riskColor, riskLevel, probColor, exportOpen, exportPDF, exportCSV,
    };
  },
});
</script>

<!-- Reglas de impresión globales (oculta sidebar) -->
<style>
@media print {
  @page { size: A4 landscape; margin: 12mm 14mm; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .app-sidebar { display: none !important; }
  #app-container { display: block !important; height: auto !important; overflow: visible !important; }
  .main-content { height: auto !important; overflow: visible !important; padding: 0 !important; margin: 0 !important; }
  body, html { height: auto !important; overflow: visible !important; background: #fff !important; }
}
</style>

<style scoped>
.dc-view { height: 100vh; background: #eef2f2; display: flex; flex-direction: column; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; }

.dc-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px 10px; background: #fff; border-bottom: 1px solid #e8eef0; flex-shrink: 0; gap: 12px; }
.dc-breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; }
.bc-home { color: #94a3b8; text-decoration: none; }
.bc-home:hover { color: #475569; }
.bc-current { color: #1e293b; font-weight: 700; }
.dc-controls { display: flex; align-items: center; gap: 12px; }
.export-overlay { position: fixed; inset: 0; z-index: 49; }
.dc-export-wrap { position: relative; z-index: 50; }
.btn-export-dc { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; background: #1a3a3a; color: #fff; border: none; cursor: pointer; font-size: 0.78rem; font-weight: 600; transition: background 0.15s; }
.btn-export-dc:hover { background: #0f2323; }
.export-dropdown { position: absolute; right: 0; top: calc(100% + 6px); background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 6px 20px rgba(0,0,0,0.12); z-index: 50; min-width: 180px; overflow: hidden; }
.export-option { display: flex; align-items: center; gap: 8px; width: 100%; padding: 9px 14px; background: none; border: none; cursor: pointer; font-size: 0.78rem; color: #334155; text-align: left; transition: background 0.12s; }
.export-option:hover { background: #f1f5f9; }
.dc-filter { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: #64748b; }
.dc-filter select { border: 1px solid #e2e8f0; border-radius: 7px; padding: 4px 8px; font-size: 0.78rem; color: #334155; background: #f8fafc; cursor: pointer; outline: none; }
.dc-badge { display: flex; align-items: center; gap: 6px; font-size: 0.72rem; font-weight: 600; padding: 4px 10px; border-radius: 20px; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.dc-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; animation: pulse-dot 2s infinite; }
@keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

.kpi-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; padding: 10px 16px 0; flex-shrink: 0; }
.kpi-card { background: #fff; border-radius: 12px; padding: 12px 14px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; }
.kpi-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.kpi-icon svg { width: 18px; height: 18px; color: #475569; }
.kpi-body { flex: 1; min-width: 0; }
.kpi-value { font-size: 1.25rem; font-weight: 800; color: #1e293b; line-height: 1.1; }
.kpi-label { font-size: 0.7rem; color: #94a3b8; font-weight: 500; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.kpi-trend { font-size: 0.65rem; font-weight: 600; margin-top: 2px; }
.kpi-trend--up { color: #22c55e; }
.kpi-trend--down { color: #ef4444; }
.kpi-trend--neutral { color: #94a3b8; }

.dc-scroll { flex: 1; overflow-y: auto; padding: 10px 16px 16px; display: flex; flex-direction: column; gap: 10px; }
.dc-scroll::-webkit-scrollbar { width: 4px; }
.dc-scroll::-webkit-scrollbar-track { background: transparent; }
.dc-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

.dc-row { display: grid; gap: 10px; }
.dc-row--2col { grid-template-columns: 1fr 1fr; }
.dc-row--3col { grid-template-columns: repeat(3, 1fr); }

.chart-card { background: #fff; border-radius: 14px; padding: 14px 16px 10px; box-shadow: 0 1px 6px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 6px; }
.card-hd { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; flex-shrink: 0; }
.card-hd-left { display: flex; flex-direction: column; gap: 2px; }
.card-title { font-size: 0.82rem; font-weight: 700; color: #1e293b; }
.card-sub { font-size: 0.68rem; color: #94a3b8; }
.badge-pred { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; font-size: 0.62rem; font-weight: 700; padding: 3px 8px; border-radius: 20px; letter-spacing: 0.04em; flex-shrink: 0; }

.legend-chips { display: flex; gap: 6px; align-items: center; }
.lc { font-size: 0.65rem; font-weight: 700; padding: 2px 7px; border-radius: 10px; }
.lc--24 { background: #f1f5f9; color: #94a3b8; }
.lc--25 { background: #eff6ff; color: #60a5fa; }
.lc--26 { background: #f0fdf4; color: #22c55e; }

.donut-layout { display: flex; align-items: center; gap: 8px; }
.donut-leg-col { display: flex; flex-direction: column; gap: 5px; flex: 1; }
.dl-item { display: flex; align-items: center; gap: 6px; font-size: 0.7rem; }
.dl-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dl-label { flex: 1; color: #475569; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dl-pct { font-weight: 700; color: #1e293b; }

.risk-list { display: flex; flex-direction: column; gap: 6px; }
.risk-row { display: flex; align-items: center; gap: 10px; padding: 3px 0; }
.risk-row-left { display: flex; align-items: center; gap: 6px; width: 160px; flex-shrink: 0; }
.risk-flag { font-size: 1rem; flex-shrink: 0; }
.risk-park { font-size: 0.75rem; font-weight: 600; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.risk-bar-wrap { display: flex; align-items: center; gap: 8px; flex: 1; }
.risk-bar-track { flex: 1; height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
.risk-bar-fill { height: 100%; border-radius: 3px; transition: width 0.4s; }
.risk-score { font-size: 0.78rem; font-weight: 800; width: 28px; text-align: right; flex-shrink: 0; }
.risk-trend { font-size: 0.65rem; width: 14px; flex-shrink: 0; }
.trend-up { color: #ef4444; }
.trend-down { color: #22c55e; }
.trend-stable { color: #94a3b8; }

.risk-table-wrap { overflow-x: auto; }
.risk-table { width: 100%; border-collapse: collapse; font-size: 0.78rem; color: #334155; }
.risk-table thead th { background: #f8fafc; padding: 8px 10px; text-align: left; font-size: 0.68rem; font-weight: 700; color: #94a3b8; letter-spacing: 0.06em; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
.risk-table tbody tr { border-bottom: 1px solid #f8fafc; transition: background 0.15s; }
.risk-table tbody tr:hover { background: #f8fafc; }
.risk-table td { padding: 8px 10px; vertical-align: middle; }
.row-risk-critical { border-left: 3px solid #ef4444; }
.row-risk-high { border-left: 3px solid #f97316; }
.row-risk-medium { border-left: 3px solid #eab308; }
.row-risk-low { border-left: 3px solid #22c55e; }
.td-turbina { font-weight: 700; color: #1e293b; }
.pais-badge { display: inline-block; background: #f1f5f9; color: #475569; font-size: 0.65rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.05em; }
.td-risk { min-width: 100px; }
.inline-risk { display: flex; align-items: center; gap: 8px; height: 14px; position: relative; }
.inline-risk-bar { position: absolute; left: 0; top: 0; height: 100%; border-radius: 3px; opacity: 0.18; max-width: 90%; }
.inline-risk span { position: relative; z-index: 1; font-weight: 800; font-size: 0.82rem; }
.td-prob { font-weight: 700; }
.sev-badge { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.04em; }
.sev-5 { background: #fee2e2; color: #dc2626; }
.sev-4 { background: #ffedd5; color: #ea580c; }
.sev-3 { background: #fff7ed; color: #c2410c; }
.sev-2 { background: #f7fee7; color: #65a30d; }
.sev-1 { background: #f0fdf4; color: #16a34a; }
.accion-badge { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 0.68rem; font-weight: 600; white-space: nowrap; }
.accion-critical { background: #fee2e2; color: #dc2626; }
.accion-high { background: #ffedd5; color: #c2410c; }
.accion-medium { background: #fef9c3; color: #a16207; }
.accion-low { background: #f0fdf4; color: #15803d; }
.table-legend { display: flex; align-items: center; gap: 8px; font-size: 0.68rem; color: #64748b; }
.tl-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

.dc-print-header { display: none; }
@media print {
  .dc-print-header { display: flex; align-items: center; gap: 16px; padding: 0 0 10px 0; margin-bottom: 10px; border-bottom: 2px solid #1a3a3a; break-inside: avoid; }
  .dc-print-logo { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .dc-print-logo-text { display: flex; flex-direction: column; line-height: 1.1; }
  .dc-print-brand { font-size: 1.1rem; font-weight: 900; color: #1a3a3a; letter-spacing: 0.06em; }
  .dc-print-sub { font-size: 0.6rem; font-weight: 600; color: #94a3b8; letter-spacing: 0.12em; }
  .dc-print-title-block { flex: 1; }
  .dc-print-title { font-size: 1rem; font-weight: 800; color: #1e293b; margin: 0 0 3px 0; }
  .dc-print-meta { font-size: 0.7rem; color: #94a3b8; margin: 0; }
  .dc-view { height: auto !important; overflow: visible !important; background: #fff !important; padding: 0 !important; }
  .dc-header { display: none !important; }
  .kpi-row { padding: 0 0 10px 0 !important; break-inside: avoid; page-break-inside: avoid; }
  .kpi-card { box-shadow: none !important; border: 1px solid #e2e8f0 !important; break-inside: avoid; }
  .dc-scroll { overflow: visible !important; height: auto !important; padding: 0 !important; gap: 8px !important; }
  .dc-row { break-inside: avoid; page-break-inside: avoid; }
  .chart-card { break-inside: avoid; page-break-inside: avoid; box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
  .risk-table-wrap { overflow: visible !important; }
  .risk-table { font-size: 0.7rem !important; }
  .dc-badge-dot { animation: none !important; }
  .apexcharts-canvas, .apexcharts-canvas svg { overflow: visible !important; }
}
</style>
