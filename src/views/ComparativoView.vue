<template>
  <div class="comparativo-root">

    <!-- Header global -->
    <div class="comp-header">
      <div class="comp-header-left">
        <span class="comp-title">Comparativo de Inspecciones</span>
      </div>
      <div class="comp-header-center">
        <div class="hdr-selectors">
          <!-- Buque dropdown -->
          <div class="hdr-drop-root">
            <button class="hdr-drop-btn" @click="showParkDrop = !showParkDrop">
              <span class="hdr-drop-val">{{ selectedPark }}</span>
              <svg class="hdr-drop-chevron" :class="{ open: showParkDrop }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="11" height="11"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div v-if="showParkDrop" class="hdr-drop-overlay" @click="showParkDrop = false"></div>
            <div v-if="showParkDrop" class="hdr-drop-menu">
              <button v-for="p in availableParks" :key="p"
                class="hdr-drop-item" :class="{ active: selectedPark === p }"
                @click="selectedPark = p; showParkDrop = false">{{ p }}</button>
            </div>
          </div>

          <span class="hdr-sel-sep">·</span>

          <!-- Sección dropdown -->
          <div class="hdr-drop-root">
            <button class="hdr-drop-btn" @click="showTurbineDrop = !showTurbineDrop">
              <span class="hdr-drop-val">{{ selectedTurbine }}</span>
              <svg class="hdr-drop-chevron" :class="{ open: showTurbineDrop }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="11" height="11"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div v-if="showTurbineDrop" class="hdr-drop-overlay" @click="showTurbineDrop = false"></div>
            <div v-if="showTurbineDrop" class="hdr-drop-menu hdr-drop-menu--sm">
              <button v-for="t in availableTurbines" :key="t"
                class="hdr-drop-item" :class="{ active: selectedTurbine === t }"
                @click="selectedTurbine = t; showTurbineDrop = false">{{ t }}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="comp-header-right"></div>
    </div>

    <!-- Main: dos paneles + divisor -->
    <div class="comp-body">

      <!-- Panel izquierdo -->
      <div class="comp-panel">
        <div class="ctrl-bar">
          <div class="ctrl-field">
            <span class="ctrl-label">Inspección</span>
            <div class="select-wrap">
              <select class="ctrl-select" :value="yearLeft" @change="yearLeft = Number($event.target.value)">
                <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
          </div>
          <div class="ctrl-divider"></div>
          <div class="ctrl-field">
            <span class="ctrl-label">Zona</span>
            <div class="select-wrap">
              <select class="ctrl-select" v-model="zonaLeft">
                <option v-for="z in zonas" :key="z">{{ z }}</option>
              </select>
            </div>
          </div>
          <div class="ctrl-divider"></div>
          <div class="ctrl-field">
            <span class="ctrl-label">Casco IMO</span>
            <span class="ctrl-fixed">9412305</span>
          </div>
          <div class="ctrl-divider"></div>
          <div class="ctrl-field">
            <span class="ctrl-label">Vista</span>
            <div class="select-wrap">
              <select class="ctrl-select" v-model="vistaLeft">
                <option v-for="v in vistas" :key="v">{{ v }}</option>
              </select>
            </div>
          </div>
          <div class="ctrl-divider"></div>
          <div class="ctrl-field">
            <span class="ctrl-label">Cuaderna</span>
            <span class="ctrl-fixed">C-128</span>
          </div>
        </div>

        <div class="img-area">
          <div class="badge-original">{{ selectedTurbine }}</div>

          <div v-if="imgLeft" class="comp-img-bg">
            <img :src="imgLeft" alt="Inspección" class="comp-img-photo" :style="{ imageRendering: smoothLeft ? 'auto' : 'pixelated' }" />
          </div>
          <div v-else class="no-img-overlay">
            <svg v-if="loadingLeft" class="no-img-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32" opacity="0.4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span class="no-img-txt">{{ loadingLeft ? 'Cargando imágenes…' : `Sin imágenes para ${yearLeft} · ${zonaLeft} · ${vistaLeft}` }}</span>
          </div>

          <div class="tool-bar">
            <div class="tool-bar-left">
              <label class="smooth-toggle">
                <input type="checkbox" v-model="smoothLeft" />
                <span class="toggle-track" :class="{ active: smoothLeft }"><span class="toggle-thumb"></span></span>
                <span class="toggle-label">Suavizado de imagen</span>
              </label>
              <button class="tool-btn tool-btn--icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </button>
            </div>
            <div class="tool-bar-right">
              <button class="tool-btn" @click="zoomLeft = Math.max(10, zoomLeft - 10)">−</button>
              <span class="zoom-value">{{ zoomLeft }}%</span>
              <button class="tool-btn" @click="zoomLeft = Math.min(400, zoomLeft + 10)">+</button>
              <button class="tool-btn tool-btn--label">FIT</button>
              <button class="tool-btn tool-btn--label">1:1</button>
              <button class="tool-btn tool-btn--icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Divisor central -->
      <div class="comp-divider"></div>

      <!-- Panel derecho -->
      <div class="comp-panel">
        <div class="ctrl-bar">
          <div class="ctrl-field">
            <span class="ctrl-label">Inspección</span>
            <div class="select-wrap">
              <select class="ctrl-select" v-model="yearRight">
                <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
          </div>
          <div class="ctrl-divider"></div>
          <div class="ctrl-field">
            <span class="ctrl-label">Zona</span>
            <div class="select-wrap">
              <select class="ctrl-select" v-model="zonaRight">
                <option v-for="z in zonas" :key="z">{{ z }}</option>
              </select>
            </div>
          </div>
          <div class="ctrl-divider"></div>
          <div class="ctrl-field">
            <span class="ctrl-label">Casco IMO</span>
            <span class="ctrl-fixed">9412305</span>
          </div>
          <div class="ctrl-divider"></div>
          <div class="ctrl-field">
            <span class="ctrl-label">Vista</span>
            <div class="select-wrap">
              <select class="ctrl-select" v-model="vistaRight">
                <option v-for="v in vistas" :key="v">{{ v }}</option>
              </select>
            </div>
          </div>
          <div class="ctrl-divider"></div>
          <div class="ctrl-field">
            <span class="ctrl-label">Cuaderna</span>
            <span class="ctrl-fixed">C-128</span>
          </div>
        </div>

        <div class="img-area">
          <div v-if="imgRight" class="comp-img-bg">
            <img :src="imgRight" alt="Inspección" class="comp-img-photo" :style="{ imageRendering: smoothRight ? 'auto' : 'pixelated' }" />
          </div>
          <div v-else class="no-img-overlay">
            <svg v-if="loadingRight" class="no-img-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32" opacity="0.4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span class="no-img-txt">{{ loadingRight ? 'Cargando imágenes…' : `Sin imágenes para ${yearRight} · ${zonaRight} · ${vistaRight}` }}</span>
          </div>

          <!-- Cruz de navegación (proa ↔ popa) -->
          <div class="nav-cross">
            <div class="nav-cross-cell" style="grid-column:2;grid-row:1">
              <span class="nav-lbl nav-lbl--left">Proa</span>
              <button class="nav-cross-btn" @click="pos = 100">
                <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="16" height="16"><polyline points="4 10 9 5 14 10"/><polyline points="4 14 9 9 14 14"/></svg>
              </button>
            </div>
            <button class="nav-cross-btn" style="grid-column:2;grid-row:2" @click="pos = Math.min(100, pos + 8)">
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="16" height="16"><polyline points="4 12 9 7 14 12"/></svg>
            </button>
            <button class="nav-cross-btn" style="grid-column:1;grid-row:3" @click="pos = Math.max(0, pos - 8)">
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="16" height="16"><polyline points="11 4 6 9 11 14"/></svg>
            </button>
            <button class="nav-cross-btn" style="grid-column:3;grid-row:3" @click="pos = Math.min(100, pos + 8)">
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="16" height="16"><polyline points="7 4 12 9 7 14"/></svg>
            </button>
            <button class="nav-cross-btn" style="grid-column:2;grid-row:4" @click="pos = Math.max(0, pos - 8)">
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="16" height="16"><polyline points="4 6 9 11 14 6"/></svg>
            </button>
            <div class="nav-cross-cell" style="grid-column:2;grid-row:5">
              <span class="nav-lbl nav-lbl--left">Popa</span>
              <button class="nav-cross-btn" @click="pos = 0">
                <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="16" height="16"><polyline points="4 4 9 9 14 4"/><polyline points="4 8 9 13 14 8"/></svg>
              </button>
            </div>
          </div>

          <!-- Minimap: silueta del buque + marcador de posición -->
          <div class="minimap">
            <svg class="minimap-svg" viewBox="0 0 180 74" xmlns="http://www.w3.org/2000/svg">
              <!-- casco (perfil lateral, proa a la derecha) -->
              <path d="M8 26 H140 Q166 26 174 42 Q166 56 140 56 H22 Q8 56 8 44 Z"
                    fill="#1e3244" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
              <!-- superestructura (popa) -->
              <rect x="30" y="13" width="40" height="15" rx="2" fill="#28507a" stroke="rgba(255,255,255,0.2)" stroke-width="1.2"/>
              <!-- línea de flotación -->
              <line x1="8" y1="49" x2="174" y2="49" stroke="rgba(0,229,204,0.4)" stroke-width="1" stroke-dasharray="3 3"/>
              <!-- marcador de posición longitudinal (cuaderna) -->
              <line :x1="posX" y1="10" :x2="posX" y2="58" stroke="#22c55e" stroke-width="1.5" opacity="0.5"/>
              <circle :cx="posX" cy="41" r="4" fill="#22c55e" stroke="#fff" stroke-width="1.4"/>
              <!-- etiquetas proa / popa -->
              <text x="12" y="70" font-size="6.5" font-family="system-ui,sans-serif" font-weight="600" fill="rgba(255,255,255,0.5)">POPA</text>
              <text x="158" y="70" font-size="6.5" font-family="system-ui,sans-serif" font-weight="600" fill="rgba(255,255,255,0.5)">PROA</text>
            </svg>
            <span class="minimap-label">{{ vistaRight }} · posición {{ pos }}%</span>
          </div>

          <div class="tool-bar">
            <div class="tool-bar-left">
              <label class="smooth-toggle">
                <input type="checkbox" v-model="smoothRight" />
                <span class="toggle-track" :class="{ active: smoothRight }"><span class="toggle-thumb"></span></span>
                <span class="toggle-label">Suavizado de imagen</span>
              </label>
              <button class="tool-btn tool-btn--icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </button>
            </div>
            <div class="tool-bar-right">
              <button class="tool-btn" @click="zoomRight = Math.max(10, zoomRight - 10)">−</button>
              <span class="zoom-value">{{ zoomRight }}%</span>
              <button class="tool-btn" @click="zoomRight = Math.min(400, zoomRight + 10)">+</button>
              <button class="tool-btn tool-btn--label">FIT</button>
              <button class="tool-btn tool-btn--label">1:1</button>
              <button class="tool-btn tool-btn--icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { BUQUES } from '@/data/mock';
import danoAno1 from '@/assets/images/valparaiso/dano-ano-1.svg';
import danoAno2 from '@/assets/images/valparaiso/dano-ano-2.svg';
// Imágenes agregadas manualmente en la raíz del proyecto
import danoPng1 from '../../daño año1.png';
import danoPng2 from '../../daño año2.png';

const showParkDrop = ref(false);
const showTurbineDrop = ref(false);

const availableParks = computed(() => BUQUES.map((b) => b.nombre));
const availableTurbines = ['Casco (estribor)', 'Casco (babor)', 'Tanques de lastre', 'Bodegas de carga', 'Cubierta principal', 'Hélice y timón'];

const selectedPark = ref(BUQUES[0]?.nombre || 'Valparaíso');
const selectedTurbine = ref(availableTurbines[0]);

const zonas = ['Proa', 'Centro', 'Popa'];
const vistas = ['Babor', 'Estribor', 'Cubierta', 'Fondo'];

const years = [2021, 2022, 2023, 2024, 2025, 2026];
const yearLeft = ref(2025);
const yearRight = ref(2026);
const zonaLeft = ref('Centro');
const zonaRight = ref('Centro');
const vistaLeft = ref('Estribor');
const vistaRight = ref('Estribor');

const zoomLeft = ref(30);
const zoomRight = ref(30);
const smoothLeft = ref(true);
const smoothRight = ref(true);

// Posición longitudinal del marcador en el minimap (0 = popa, 100 = proa)
const pos = ref(50);
const posX = computed(() => 14 + (pos.value / 100) * 152);

const loadingLeft = ref(false);
const loadingRight = ref(false);

// Mockup sin backend de imágenes: para Valparaíso mostramos dos fotos de ejemplo.
const imgLeft = computed(() => {
  if (selectedPark.value !== 'Valparaíso') return null;
  return danoPng1 || danoAno1;
});

const imgRight = computed(() => {
  if (selectedPark.value !== 'Valparaíso') return null;
  return danoPng2 || danoAno2;
});
</script>

<style scoped>
.comparativo-root { display: flex; flex-direction: column; height: 100vh; overflow: hidden; background: #2a3f4a; color: #fff; font-family: inherit; }

.comp-header { display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; height: 52px; flex-shrink: 0; background: #f0f2f4; border-bottom: 1px solid #d0d5db; padding: 0 20px; }
.comp-header-left { display: flex; align-items: center; }
.comp-title { font-size: 1.1rem; font-weight: 700; color: #1a2a34; letter-spacing: 0.01em; }
.comp-header-center { display: flex; justify-content: center; }
.hdr-selectors { display: flex; align-items: center; gap: 8px; }
.hdr-sel-sep { font-size: 0.9rem; color: #c5cdd4; font-weight: 300; line-height: 1; }
.hdr-drop-root { position: relative; }
.hdr-drop-btn { display: flex; align-items: center; gap: 6px; padding: 5px 10px; background: #f1f5f8; border: 1px solid #d8e0e6; border-radius: 7px; cursor: pointer; transition: background 0.12s, border-color 0.12s; white-space: nowrap; }
.hdr-drop-btn:hover { background: #e4eaef; border-color: #b8c8d4; }
.hdr-drop-val { font-size: 0.82rem; font-weight: 600; color: #1a2a34; max-width: 220px; overflow: hidden; text-overflow: ellipsis; }
.hdr-drop-chevron { color: #7a9aaa; transition: transform 0.18s; flex-shrink: 0; }
.hdr-drop-chevron.open { transform: rotate(180deg); }
.hdr-drop-overlay { position: fixed; inset: 0; z-index: 90; }
.hdr-drop-menu { position: absolute; top: calc(100% + 6px); left: 0; z-index: 100; background: #fff; border: 1px solid #d8e0e6; border-radius: 9px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); padding: 4px; min-width: 200px; max-height: 260px; overflow-y: auto; }
.hdr-drop-menu--sm { min-width: 160px; }
.hdr-drop-item { width: 100%; text-align: left; padding: 7px 10px; background: none; border: none; border-radius: 6px; font-size: 0.8rem; color: #2d3f4a; cursor: pointer; transition: background 0.1s; white-space: nowrap; }
.hdr-drop-item:hover { background: #f1f5f8; }
.hdr-drop-item.active { background: #e6f4f1; color: #044245; font-weight: 700; }
.comp-header-right { display: flex; justify-content: flex-end; }

.comp-body { display: flex; flex: 1; overflow: hidden; position: relative; }
.comp-panel { width: 50%; display: flex; flex-direction: column; overflow: hidden; }

.ctrl-bar { display: flex; align-items: center; height: 48px; flex-shrink: 0; background: #ffffff; border-bottom: 1px solid #d8dee4; padding: 0 12px; overflow-x: auto; }
.ctrl-bar::-webkit-scrollbar { height: 0; }
.ctrl-field { display: flex; flex-direction: column; justify-content: center; padding: 0 10px; min-width: 0; flex-shrink: 0; }
.ctrl-label { font-size: 0.6rem; font-weight: 700; color: #8a9aa6; text-transform: uppercase; letter-spacing: 0.07em; line-height: 1; margin-bottom: 2px; }
.ctrl-select { border: none; outline: none; background: transparent; font-size: 0.82rem; font-weight: 600; color: #1a2a34; cursor: pointer; padding: 0; -webkit-appearance: none; appearance: none; }
.ctrl-fixed { font-size: 0.82rem; font-weight: 600; color: #1a2a34; }
.ctrl-divider { width: 1px; height: 32px; background: #d8dee4; flex-shrink: 0; }

.img-area { flex: 1; position: relative; background: #1a3040; overflow: hidden; }
.comp-img-bg { position: absolute; inset: 0; z-index: 0; }
.comp-img-photo { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; opacity: 0.92; }
.no-img-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: rgba(255,255,255,0.45); }
.no-img-txt { font-size: 0.78rem; font-weight: 500; text-align: center; max-width: 240px; line-height: 1.5; color: rgba(255,255,255,0.4); }
@keyframes spin { to { transform: rotate(360deg); } }
.no-img-spin { animation: spin 1s linear infinite; opacity: 0.6; }

.badge-original { position: absolute; top: 12px; left: 12px; z-index: 10; background: rgba(0,0,0,0.52); color: #fff; font-size: 0.72rem; font-weight: 600; padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.18); backdrop-filter: blur(4px); }

.nav-cross { display: grid; grid-template-columns: 40px 40px 40px; grid-template-rows: 40px 40px 40px 40px 40px; gap: 6px; position: absolute; right: 20px; top: 50%; transform: translateY(-50%); z-index: 20; }
.nav-cross-cell { position: relative; display: flex; align-items: center; justify-content: center; }
.nav-cross-btn { width: 36px; height: 36px; border-radius: 9px; background: rgba(20,35,45,0.82); border: 1px solid rgba(255,255,255,0.1); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s, border-color 0.15s; padding: 0; backdrop-filter: blur(6px); }
.nav-cross-btn:hover { background: rgba(40,70,90,0.92); border-color: rgba(255,255,255,0.22); }
.nav-lbl { position: absolute; white-space: nowrap; font-size: 0.68rem; font-weight: 600; color: #e2e8f0; background: rgba(15,28,38,0.88); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 3px 8px; pointer-events: none; opacity: 0; transition: opacity 0.15s; backdrop-filter: blur(4px); }
.nav-lbl--left { right: calc(100% + 8px); }
.nav-cross-cell:hover .nav-lbl { opacity: 1; }

.minimap { position: absolute; bottom: 52px; left: 16px; z-index: 10; width: 160px; background: rgba(0,0,0,0.62); border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); padding: 6px; backdrop-filter: blur(4px); }
.minimap-svg { width: 100%; height: auto; display: block; }
.minimap-label { display: block; font-size: 0.58rem; color: #00e5cc; text-align: center; margin-top: 3px; letter-spacing: 0.06em; text-transform: uppercase; }

.tool-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 40px; background: rgba(10,18,22,0.82); border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; padding: 0 10px; z-index: 10; backdrop-filter: blur(4px); }
.tool-bar-left { display: flex; align-items: center; gap: 10px; }
.tool-bar-right { display: flex; align-items: center; gap: 4px; }
.smooth-toggle { display: flex; align-items: center; gap: 7px; cursor: pointer; user-select: none; }
.smooth-toggle input { display: none; }
.toggle-track { width: 30px; height: 16px; border-radius: 8px; background: rgba(255,255,255,0.15); position: relative; transition: background 0.2s; flex-shrink: 0; }
.toggle-track.active { background: #22c55e; }
.toggle-thumb { position: absolute; width: 12px; height: 12px; border-radius: 50%; background: #fff; top: 2px; left: 2px; transition: transform 0.2s; }
.toggle-track.active .toggle-thumb { transform: translateX(14px); }
.toggle-label { font-size: 0.68rem; color: rgba(255,255,255,0.6); white-space: nowrap; }
.tool-btn { height: 26px; min-width: 26px; padding: 0 6px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 4px; color: #fff; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
.tool-btn:hover { background: rgba(255,255,255,0.16); }
.tool-btn--icon { padding: 0 5px; }
.tool-btn--icon svg { width: 13px; height: 13px; }
.tool-btn--label { font-size: 0.7rem; padding: 0 7px; }
.zoom-value { font-size: 0.78rem; font-weight: 600; color: #fff; min-width: 36px; text-align: center; }

.comp-divider { width: 2px; background: #7a9aaa; position: relative; flex-shrink: 0; z-index: 20; }

.select-wrap { position: relative; display: inline-flex; align-items: center; }
.select-wrap::after { content: '▾'; position: absolute; right: 0; pointer-events: none; font-size: 0.7rem; color: #8a9aa6; line-height: 1; }
.select-wrap .ctrl-select { padding-right: 14px; }
</style>
