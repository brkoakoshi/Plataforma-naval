<template>
  <div class="dashboard">

    <!-- Breadcrumb -->
    <div class="dash-top">
      <div class="breadcrumb">
        <span class="breadcrumb-home">Home</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6" /></svg>
        <span class="breadcrumb-current">Control Operativo de Flota</span>
        <template v-if="selectedAstillero">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6" /></svg>
          <span class="breadcrumb-pais">{{ astilleroNombre }}</span>
          <button class="clear-pais" @click="filtersStore.clearPortfolioFilters()" title="Quitar filtro de astillero">✕</button>
        </template>
      </div>
    </div>

    <!-- Bloque principal -->
    <div class="main-block">

      <!-- Mapa de fondo -->
      <div class="map-bg">
        <l-map
          ref="mapRef"
          :zoom="8"
          :center="[-33.32, -71.62]"
          :options="mapOptions"
          style="height:100%;width:100%;"
          @ready="onMapReady"
        >
          <l-tile-layer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            :options="{ maxZoom: 18, subdomains: 'abcd' }"
          />
          <!-- Un pin por astillero, sobre su flota. Click = filtrar esa flota. -->
          <l-marker
            v-for="region in regions"
            :key="region.codigo"
            :lat-lng="region.latLng"
            :icon="createRegionIcon(region)"
            @click="onRegionClick(region)"
          >
            <l-tooltip :options="{ direction: 'top', offset: [0, -84], opacity: 1 }">
              <div class="ship-popup">
                <div class="sp-name">{{ region.flota }}</div>
                <div class="sp-row"><span>Astillero</span><strong>{{ region.nombre }}</strong></div>
                <div class="sp-row"><span>Operatividad</span><strong>{{ region.operatividad }}%</strong></div>
                <div class="sp-row"><span>Hallazgos</span><strong>{{ region.hallazgos }}</strong></div>
                <div class="sp-btn">{{ selectedAstillero === region.codigo ? 'Quitar filtro' : 'Ver flota →' }}</div>
              </div>
            </l-tooltip>
          </l-marker>
          <!-- Marcadores por cada buque visible (cuando se filtra por astillero se muestran) -->
          <l-marker
            v-for="b in displayedShips"
            :key="b.id"
            :lat-lng="[b.lat, b.lng]"
            :icon="createShipIcon(b)"
            @click="onShipClick(b)"
          >
            <l-tooltip :options="{ direction: 'top', offset: [0, -14], opacity: 1 }">
              <div class="ship-popup-tooltip">
                <strong>{{ b.nombre }}</strong>
                <div class="sp-row"><span>Puerto</span><strong>{{ b.puerto }}</strong></div>
                <div class="sp-row"><span>Hallazgos</span><strong>{{ b.hallazgos }}</strong></div>
              </div>
            </l-tooltip>
          </l-marker>
        </l-map>
      </div>

      <!-- Panel izquierdo: KPIs + gráficos -->
      <div class="panel-left">

        <!-- Resumen de Flota -->
        <div class="fleet-card">
          <div class="section-hd"><span class="section-title">Resumen de Flota</span><span class="section-sub">activos</span></div>
          <div class="fleet-row">
            <ShipIcon :size="34" class="fleet-glyph" />
            <div class="fleet-stat"><span class="fleet-num">{{ visibleBuques.length }}</span><span class="fleet-lbl">Flotas en operación</span></div>
          </div>
          <div class="panel-divider" />
          <div class="fleet-row">
            <svg class="fleet-glyph" viewBox="0 0 24 24" fill="none" stroke="#1a2e2e" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
            <div class="fleet-stat"><span class="fleet-num">{{ seccionesInsp }}/{{ seccionesTot }}</span><span class="fleet-lbl">Secciones inspeccionadas</span></div>
          </div>
          <div class="panel-divider" />
          <div class="fleet-op-row">
            <span class="fleet-op-lbl">Operatividad</span>
            <div class="bar-track"><div class="bar-fill" :style="{ width: operatividadPct + '%', background: '#1a2e2e' }" /></div>
            <span class="fleet-op-pct">{{ operatividadPct }}%</span>
          </div>
        </div>

        <div class="panel-divider" />

        <!-- Severidad de Defecto (bar) -->
        <div class="panel-section">
          <div class="section-hd"><span class="section-title">Severidad de Defecto</span><span class="section-sub">por flota</span></div>
          <div class="legend-row">
            <span class="leg-dot" :style="{ background: sevColor(5) }" /><span class="leg-txt">Crítico</span>
            <span class="leg-dot" :style="{ background: sevColor(4) }" /><span class="leg-txt">Alto</span>
            <span class="leg-dot" :style="{ background: sevColor(3) }" /><span class="leg-txt">Medio</span>
          </div>
          <apexchart type="bar" height="200" :options="barOptions" :series="barSeries" />
        </div>

        <div class="panel-divider" />

        <!-- Severidad Total (donut) -->
        <div class="panel-section">
          <div class="section-hd"><span class="section-title">Severidad Total</span><span class="section-sub">distribución</span></div>
          <div class="donut-row">
            <div class="donut-wrap"><apexchart type="donut" height="140" :options="sevDonutOptions" :series="sevDonutSeries" /></div>
            <div class="donut-legend-col">
              <div v-for="(item, i) in sevLegend" :key="i" class="donut-leg-item">
                <span class="donut-leg-dot" :style="{ background: item.color }" />
                <span class="donut-leg-label">{{ item.label }}</span>
                <span class="donut-leg-pct">{{ item.pct }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-divider" />

        <!-- Tipos de Defectos (donut) -->
        <div class="panel-section">
          <div class="section-hd"><span class="section-title">Tipos de Defectos</span><span class="section-sub">por categoría</span></div>
          <div class="donut-row">
            <div class="donut-wrap"><apexchart type="donut" height="140" :options="tiposDonutOptions" :series="tiposDonutSeries" /></div>
            <div class="donut-legend-col">
              <div v-for="(item, i) in tiposLegend" :key="i" class="donut-leg-item">
                <span class="donut-leg-dot" :style="{ background: item.color }" />
                <span class="donut-leg-label">{{ item.label }}</span>
                <span class="donut-leg-pct">{{ item.pct }}%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Panel derecho: lista de buques -->
      <div class="panel-right">
        <div class="parks-hd">
          <span class="parks-title">Lista de Flotas</span>
          <span class="parks-count">{{ shipsList.length }} activos</span>
        </div>
        <div class="parks-list">
          <div v-for="(b, i) in shipsList" :key="i" class="park-row" @click="onShipClick(b)">
            <div class="park-row-top">
              <span class="park-plus" :style="{ color: sevColor(b.maxSev) }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </span>
              <span class="park-row-name">{{ b.nombre }}</span>
              <span class="park-row-count">{{ b.defectos }}</span>
            </div>
            <div class="park-row-bar">
              <div class="bar-track"><div class="bar-fill" :style="{ width: b.pct + '%', background: sevColor(b.maxSev) }" /></div>
              <span class="bar-label">{{ b.pct }}% <span class="defectos-txt">DEFECTOS</span></span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useFleetStore } from '@/stores/fleet';
import { useFiltersStore } from '@/stores/filters';
import {
  SEV_COLOR, SEV_LABEL, TIPOS_HALLAZGO,
  ASTILLEROS, ASTILLERO_NOMBRES, ASTILLERO_CENTERS, ASTILLERO_BOUNDS, astilleroDeBuque,
} from '@/data/mock';
import { LMap, LTileLayer, LMarker, LTooltip } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ShipIcon from '@/components/ShipIcon.vue';

const CATEGORY_COLORS = ['#5B8D99', '#7FAE8D', '#A5C8B4', '#B9BAA1', '#CEC4B0', '#9ab8c2'];

export default {
  name: 'PortfolioDashboardView',
  components: { ShipIcon, LMap, LTileLayer, LMarker, LTooltip },
  setup() {
    const router = useRouter();
    const fleetStore = useFleetStore();
    const filtersStore = useFiltersStore();

    onMounted(() => { if (!fleetStore.buques.length) fleetStore.fetchFleet(); });

    const sevColor = (sev) => SEV_COLOR[sev] || '#94a3b8';

    // ── Filtro por astillero ─────────────────────────────────────
    const selectedAstillero = computed(() => filtersStore.selectedAstillero);
    const astilleroNombre = computed(() => ASTILLERO_NOMBRES[selectedAstillero.value] || '');

    const buques = computed(() => fleetStore.getAllBuques);
    const visibleBuques = computed(() =>
      selectedAstillero.value ? buques.value.filter((b) => astilleroDeBuque(b) === selectedAstillero.value) : buques.value);

    // ── Mapa ─────────────────────────────────────────────────────
    const mapRef = ref(null);
    const mapOptions = {
      zoomControl: true, scrollWheelZoom: true, attributionControl: false,
      minZoom: 2, maxBounds: [[-90, -180], [90, 180]], maxBoundsViscosity: 1.0,
    };

    // Un pin por astillero, ubicado en el centroide de su flota.
    const buquesDe = (cod) => buques.value.filter((b) => astilleroDeBuque(b) === cod);
    const centroid = (list, cod) => {
      if (!list.length) return ASTILLERO_CENTERS[cod];
      const lat = list.reduce((s, b) => s + b.lat, 0) / list.length;
      const lng = list.reduce((s, b) => s + b.lng, 0) / list.length;
      return [lat, lng];
    };
    const regions = computed(() => {
      const list = selectedAstillero.value
        ? ASTILLEROS.filter((a) => a.codigo === selectedAstillero.value)
        : ASTILLEROS;
      return list.map((a) => {
        const fl = buquesDe(a.codigo);
        const op = fl.length ? Math.round(fl.reduce((s, b) => s + b.operatividad, 0) / fl.length) : 0;
        return {
          codigo: a.codigo, nombre: a.nombre, flota: a.flota,
          count: fl.length,
          hallazgos: fl.reduce((s, b) => s + b.hallazgos, 0),
          operatividad: op,
          latLng: centroid(fl, a.codigo),
        };
      });
    });

    const createRegionIcon = (region) => {
      const isPais = !!region.codigo;
      const w = isPais ? 76 : 110;
      const h = isPais ? 92 : 136;
      return L.divIcon({
        className: '',
        html: `<div class="region-teardrop" style="width:${w}px">
          <div class="rg-badge">${region.hallazgos}</div>
          <svg class="rg-shape" viewBox="0 0 110 136" width="${w}" height="${h}"><path d="M55 132 C37 110 8 90 8 54 A47 47 0 0 1 102 54 C102 90 73 110 55 132 Z" fill="#1a2e2e"/></svg>
          <div class="rg-content" style="width:${w}px">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="34" height="34">
              <path d="M3 17l1.5-4.5h15L21 17"/><path d="M3 17c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3-1.5 4.5 0"/><path d="M12 12.5V4h5l-2 4.5"/><line x1="12" y1="4" x2="7" y2="8.5"/>
            </svg>
            <div class="rg-label">${region.nombre.toUpperCase()}</div>
          </div>
        </div>`,
        iconSize: [w, h], iconAnchor: [w / 2, h],
      });
    };

    const createShipIcon = (b) => {
      const color = sevColor(b.maxSev) || '#0d9488';
      // SVG ship marker with circular background and small prow pointer
      const svg = `
        <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="s" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.18" />
            </filter>
          </defs>
          <g filter="url(#s)">
            <circle cx="22" cy="18" r="14" fill="${color}" stroke="#fff" stroke-width="2" />
            <path d="M14 20 L22 10 L30 20 Z" fill="#fff" opacity="0.12" />
            <g transform="translate(12,12) scale(0.9)">
              <path d="M6 2 L10 6 L8 6 L8 10 L4 10 L4 6 L2 6 Z" fill="#fff" />
            </g>
          </g>
        </svg>`;
      return L.divIcon({
        className: 'ship-pin',
        html: `<div class="ship-pin-wrap">${svg}</div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });
    };

    const onShipClick = (b) => { router.push(`/buque/${b.id}`); };

    const OVERVIEW_CENTER = [-33.32, -71.62];
    const OVERVIEW_ZOOM = 8;

    // Aplica el astillero preseleccionado (elegido desde otra vista) al estar listo el mapa.
    const showFleetShips = ref(false);
    const flyToAstillero = (cod, opts = { duration: 1.0 }) => {
      const map = mapRef.value?.leafletObject;
      if (!map) return;
      // ocultar marcadores hasta que termine el movimiento
      showFleetShips.value = false;
      if (!cod) {
        map.flyTo(OVERVIEW_CENTER, OVERVIEW_ZOOM, { duration: opts.duration });
        return;
      }
      const bounds = ASTILLERO_BOUNDS[cod];
      if (bounds) {
        map.flyToBounds(bounds, { padding: [60, 60], duration: opts.duration });
        const onMoveEnd = () => {
          showFleetShips.value = true;
          map.off('moveend', onMoveEnd);
        };
        map.on('moveend', onMoveEnd);
      }
    };

    const onMapReady = (map) => {
      const cod = filtersStore.selectedAstillero;
      if (cod) flyToAstillero(cod, { duration: 0.8 });
    };

    // Click en un pin de astillero: alterna el filtro y vuela, mostrando buques al terminar.
    const onRegionClick = (region) => {
      const map = mapRef.value?.leafletObject;
      if (filtersStore.selectedAstillero === region.codigo) {
        filtersStore.clearPortfolioFilters();
        if (map) flyToAstillero(null, { duration: 0.8 });
      } else {
        filtersStore.setSelectedAstillero(region.codigo);
        if (map) flyToAstillero(region.codigo, { duration: 1.2 });
      }
    };

    // Al cambiar el astillero seleccionado desde cualquier parte, volar y mostrar buques.
    watch(() => filtersStore.selectedAstillero, (cod) => {
      flyToAstillero(cod, { duration: 1.2 });
    });

    // ── Resumen de flota ────────────────────────────────────────
    const displayedShips = computed(() => (showFleetShips.value ? visibleBuques.value : []));
    const seccionesTot = computed(() => visibleBuques.value.reduce((s, b) => s + b.secciones, 0));
    const seccionesInsp = computed(() => visibleBuques.value.reduce((s, b) => s + b.inspeccionadas, 0));
    const operatividadPct = computed(() => {
      if (!visibleBuques.value.length) return 0;
      return Math.round(visibleBuques.value.reduce((s, b) => s + b.operatividad, 0) / visibleBuques.value.length);
    });

    // ── Severidad por buque (bar apilado) ───────────────────────
    const sevCountsOf = (b) => {
      const c = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      (b.health || []).forEach((s) => { c[s.sev] = (c[s.sev] || 0) + 1; });
      return c;
    };
    const barShips = computed(() =>
      visibleBuques.value.map((b) => ({
        abbr: b.nombre,
        full: b.nombre, c: sevCountsOf(b),
      })));
    const barSeries = computed(() => [
      { name: 'Crítico (5)', data: barShips.value.map((s) => s.c[5]) },
      { name: 'Alto (4)', data: barShips.value.map((s) => s.c[4]) },
      { name: 'Medio (3)', data: barShips.value.map((s) => s.c[3]) },
    ]);
    const barOptions = computed(() => ({
      chart: { type: 'bar', stacked: true, toolbar: { show: false }, fontFamily: 'inherit' },
      colors: [SEV_COLOR[5], SEV_COLOR[4], SEV_COLOR[3]],
      plotOptions: { bar: { columnWidth: '55%', borderRadius: 3 } },
      dataLabels: { enabled: false },
      xaxis: {
        categories: barShips.value.map((s) => s.abbr),
        labels: { style: { colors: '#9aacac', fontSize: '10px' } },
        axisBorder: { show: false }, axisTicks: { show: false }, tooltip: { enabled: false },
      },
      yaxis: { labels: { style: { colors: '#9aacac', fontSize: '10px' } } },
      grid: { borderColor: 'rgba(0,0,0,0.05)', strokeDashArray: 4 },
      legend: { show: false },
      tooltip: { theme: 'light', x: { formatter: (v) => barShips.value.find((s) => s.abbr === v)?.full ?? v } },
    }));

    // ── Severidad total (donut) ─────────────────────────────────
    const sevTotals = computed(() => {
      const acc = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, total: 0 };
      visibleBuques.value.forEach((b) => (b.health || []).forEach((s) => { acc[s.sev]++; acc.total++; }));
      return acc;
    });
    const sevDonutSeries = computed(() => { const t = sevTotals.value; return [t[5], t[4], t[3], t[2], t[1]]; });
    const sevLegend = computed(() => {
      const t = sevTotals.value; const total = Math.max(1, t.total);
      return [5, 4, 3, 2, 1].map((lvl) => ({ label: SEV_LABEL[lvl], pct: Math.round((t[lvl] / total) * 100), color: SEV_COLOR[lvl] }));
    });
    const sevDonutOptions = computed(() => ({
      chart: { type: 'donut', toolbar: { show: false }, fontFamily: 'inherit' },
      colors: [SEV_COLOR[5], SEV_COLOR[4], SEV_COLOR[3], SEV_COLOR[2], SEV_COLOR[1]],
      labels: ['Crítico', 'Alto', 'Medio', 'Bajo', 'Leve'],
      dataLabels: { enabled: false }, legend: { show: false }, stroke: { width: 2 },
      plotOptions: { pie: { donut: { size: '68%', labels: { show: true,
        name: { show: false },
        value: { show: false },
        total: { show: true, showAlways: true, label: 'SECCIONES', fontSize: '9px', fontWeight: 600, color: '#9aacac', formatter: () => String(sevTotals.value.total) },
      } } } },
    }));

    // ── Tipos de defecto (donut) ────────────────────────────────
    const visibleNames = computed(() => new Set(visibleBuques.value.map((b) => b.nombre)));
    const tipoCounts = computed(() => {
      const m = {};
      fleetStore.hallazgos.filter((h) => visibleNames.value.has(h.buque)).forEach((h) => { m[h.tipo] = (m[h.tipo] || 0) + 1; });
      return TIPOS_HALLAZGO.filter((t) => m[t]).map((t) => ({ tipo: t, total: m[t] }));
    });
    const tiposDonutSeries = computed(() => tipoCounts.value.map((c) => c.total));
    const tiposLegend = computed(() => {
      const total = tipoCounts.value.reduce((s, c) => s + c.total, 0) || 1;
      return tipoCounts.value.map((c, i) => ({ label: c.tipo, pct: Math.round((c.total / total) * 100), color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }));
    });
    const tiposDonutOptions = computed(() => ({
      chart: { type: 'donut', toolbar: { show: false }, fontFamily: 'inherit' },
      colors: tipoCounts.value.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length]),
      labels: tipoCounts.value.map((c) => c.tipo),
      dataLabels: { enabled: false }, legend: { show: false }, stroke: { width: 2 },
      plotOptions: { pie: { donut: { size: '68%', labels: { show: true,
        name: { show: false }, value: { show: false },
        total: { show: true, showAlways: true, label: 'TIPOS', fontSize: '9px', fontWeight: 600, color: '#9aacac', formatter: () => String(tipoCounts.value.length) },
      } } } },
    }));

    // ── Lista de buques (panel derecho) ─────────────────────────
    const shipsList = computed(() => {
      const weighted = (b) => (b.health || []).reduce((s, x) => s + x.sev, 0);
      const maxW = Math.max(1, ...visibleBuques.value.map(weighted));
      return visibleBuques.value.map((b) => ({
        id: b.id, nombre: b.nombre, maxSev: b.maxSev, defectos: b.hallazgos,
        pct: Math.round((weighted(b) / maxW) * 100),
      }));
    });

    return {
      filtersStore, selectedAstillero, astilleroNombre,
      mapRef, mapOptions, onMapReady, regions, createRegionIcon, onRegionClick,
      onShipClick, createShipIcon,
      showFleetShips, displayedShips,
      visibleBuques, sevColor,
      seccionesTot, seccionesInsp, operatividadPct,
      barSeries, barOptions,
      sevDonutSeries, sevDonutOptions, sevLegend,
      tiposDonutSeries, tiposDonutOptions, tiposLegend,
      shipsList,
    };
  },
};
</script>

<style scoped>
.dashboard { height: 100vh; background: #eef2f2; padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0.875rem; overflow: hidden; }

.dash-top { display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
.breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #6b8080; }
.breadcrumb svg { width: 14px; height: 14px; }
.breadcrumb-current { color: #1a2e2e; font-weight: 600; }
.breadcrumb-pais { color: var(--c-yellow); font-weight: 700; }
.clear-pais { background: rgba(255,167,0,0.15); color: #b45309; border: none; border-radius: 50%; width: 18px; height: 18px; font-size: 0.65rem; cursor: pointer; line-height: 1; }
.clear-pais:hover { background: rgba(255,167,0,0.3); }

.fleet-card { padding: 0.75rem 0; display: flex; flex-direction: column; gap: 6px; }
.fleet-row { display: flex; align-items: center; gap: 12px; padding: 2px 0; }
.fleet-glyph { width: 34px; height: 34px; flex-shrink: 0; color: #1a2e2e; }
.fleet-stat { display: flex; flex-direction: column; gap: 2px; }
.fleet-num { font-size: 1.6rem; font-weight: 800; color: #1a2e2e; line-height: 1; }
.fleet-lbl { font-size: 0.63rem; color: #6b8080; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; line-height: 1.3; }
.fleet-op-row { display: flex; align-items: center; gap: 8px; padding: 2px 0; }
.fleet-op-lbl { font-size: 0.63rem; color: #6b8080; font-weight: 600; white-space: nowrap; }
.fleet-op-pct { font-size: 0.63rem; font-weight: 700; color: #1a2e2e; white-space: nowrap; }

.main-block { position: relative; flex: 1; border-radius: 18px; overflow: hidden; box-shadow: 0 2px 20px rgba(0,0,0,0.08); }
.map-bg { position: absolute; inset: 0; z-index: 0; }

.panel-left, .panel-right { position: absolute; top: 0; bottom: 0; z-index: 10; width: 300px; display: flex; flex-direction: column; overflow: hidden; }
.panel-left { left: 0; background: linear-gradient(to right, rgba(238,242,242,0.96) 72%, rgba(238,242,242,0) 100%); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); padding: 1.25rem 2rem 1.25rem 1.25rem; overflow-y: auto; }
.panel-left::-webkit-scrollbar { width: 0; }
.panel-right { right: 0; width: 280px; background: linear-gradient(to left, rgba(238,242,242,0.96) 72%, rgba(238,242,242,0) 100%); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); padding: 1.25rem 1.25rem 1.25rem 2rem; }

.panel-section { padding: 0.75rem 0; }
.panel-divider { height: 1px; background: rgba(0,0,0,0.06); margin: 0; }
.section-hd { display: flex; align-items: baseline; gap: 8px; margin-bottom: 0.5rem; }
.section-title { font-size: 1.05rem; font-weight: 800; color: #1a2e2e; letter-spacing: -0.01em; }
.section-sub { font-size: 0.75rem; color: #9aacac; }

.legend-row { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; font-size: 0.62rem; color: #7a9090; margin-bottom: 0.25rem; }
.leg-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.leg-txt { margin-right: 4px; }

.donut-row { display: flex; align-items: center; gap: 0.25rem; }
.donut-wrap { flex-shrink: 0; width: 140px; }
/* Ship marker styles */
.ship-pin-wrap { width: 44px; height: 44px; display:flex; align-items:center; justify-content:center; }
.ship-pin { pointer-events: auto; }
.ship-popup-tooltip { font-size: 0.82rem; color: #1a2e2e; }
.ship-pin-wrap svg { display: block; }
.donut-legend-col { display: flex; flex-direction: column; gap: 3px; flex: 1; }
.donut-leg-item { display: flex; align-items: center; gap: 5px; }
.donut-leg-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.donut-leg-label { font-size: 0.63rem; color: #6b8080; flex: 1; }
.donut-leg-pct { font-size: 0.63rem; font-weight: 700; color: #1a2e2e; }

.parks-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem; flex-shrink: 0; }
.parks-title { font-size: 0.78rem; font-weight: 700; color: #1a2e2e; }
.parks-count { font-size: 0.65rem; color: #9aacac; font-weight: 500; }
.parks-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; }
.parks-list::-webkit-scrollbar { width: 0; }
.park-row { cursor: pointer; padding: 0.4rem 0; border-bottom: 1px solid rgba(0,0,0,0.04); }
.park-row:last-child { border-bottom: none; }
.park-row:hover { opacity: 0.85; }
.park-row-top { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
.park-plus { width: 14px; height: 14px; flex-shrink: 0; }
.park-plus svg { width: 14px; height: 14px; }
.park-row-name { flex: 1; font-size: 0.75rem; font-weight: 600; color: #1a2e2e; }
.park-row-count { font-size: 0.78rem; font-weight: 700; color: #1a2e2e; }
.park-row-bar { display: flex; align-items: center; gap: 6px; }
.bar-track { flex: 1; height: 3px; background: rgba(0,0,0,0.08); border-radius: 2px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }
.bar-label { font-size: 0.58rem; color: #9aacac; white-space: nowrap; }
.defectos-txt { font-weight: 700; letter-spacing: 0.04em; }

@media (max-width: 1100px) { .panel-left, .panel-right { width: 220px; } }
@media (max-width: 640px) { .panel-right { display: none; } .panel-left { width: 170px; } }
</style>

<!-- Estilos globales: Leaflet inyecta markers/tooltips fuera del scope -->
<style>
.ship-teardrop { position: relative; width: 60px; cursor: pointer; }
.st-shape { display: block; filter: drop-shadow(0 3px 8px rgba(0,0,0,0.25)); transition: filter 0.15s; }
.ship-teardrop:hover .st-shape { filter: drop-shadow(0 6px 14px rgba(0,0,0,0.4)); }
.st-inner { position: absolute; top: 7px; left: 19px; }
.st-dot { position: absolute; top: -2px; right: 4px; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.25); }

.region-teardrop { position: relative; cursor: pointer; }
.rg-shape { display: block; filter: drop-shadow(0 5px 14px rgba(0,0,0,0.24)); transition: filter 0.15s; }
.region-teardrop:hover .rg-shape { filter: drop-shadow(0 7px 18px rgba(0,0,0,0.34)); }
.rg-content { position: absolute; top: 14px; left: 0; display: flex; flex-direction: column; align-items: center; gap: 3px; }
.rg-content svg { stroke: rgba(255,255,255,0.92); }
.rg-label { font-size: 9px; font-weight: 800; color: rgba(255,255,255,0.92); text-align: center; letter-spacing: 0.07em; }
.rg-badge { position: absolute; top: -6px; right: -6px; width: 26px; height: 26px; border-radius: 50%; background: var(--c-yellow); color: #1a2e2e; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.28); z-index: 1; }

.ship-popup { font-family: var(--font-main); min-width: 200px; padding: 14px 16px; }
.sp-name { font-size: 0.98rem; font-weight: 800; color: #0f2323; margin-bottom: 10px; }
.sp-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: #6b8080; padding: 4px 0; border-top: 1px solid #f0f4f4; gap: 12px; }
.sp-row strong { color: #1a2e2e; font-weight: 700; }
.sp-btn { margin-top: 10px; background: var(--c-yellow); color: var(--c-green-dark); font-size: 0.72rem; font-weight: 800; padding: 6px 12px; border-radius: 20px; text-align: center; }

.leaflet-tooltip { padding: 0 !important; border: none !important; border-radius: 12px !important; box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important; background: #fff !important; }
.leaflet-tooltip::before { display: none !important; }
.leaflet-control-zoom { border: none !important; box-shadow: 0 2px 8px rgba(0,0,0,0.12) !important; }
.leaflet-control-zoom a { border-radius: 6px !important; border: none !important; color: #1a2e2e !important; font-weight: 700 !important; }
</style>
