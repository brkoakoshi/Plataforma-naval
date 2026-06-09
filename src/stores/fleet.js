import { defineStore } from 'pinia';
import { inspectionService } from '@/services/api';
import { SEV_COLOR, SEV_LABEL } from '@/data/mock';

// Equivalente naval del "asset store" de Iner-Wind: gestiona la flota
// (buques), el buque seleccionado y los agregados del portafolio.
export const useFleetStore = defineStore('fleet', {
  state: () => ({
    buques: [],
    inspecciones: [],
    hallazgos: [],
    selectedBuqueId: null,
    loading: false,
  }),

  getters: {
    getAllBuques: (state) => state.buques,
    selectedBuque: (state) => state.buques.find((b) => b.id === state.selectedBuqueId) || state.buques[0] || null,

    kpis: (state) => {
      const buques = state.buques;
      if (!buques.length) return { buques: 0, inspecciones: 0, hallazgosCriticos: 0, secciones: 0, inspeccionadas: 0, operatividad: 0 };
      const secciones = buques.reduce((s, b) => s + b.secciones, 0);
      const inspeccionadas = buques.reduce((s, b) => s + b.inspeccionadas, 0);
      const operatividad = Math.round(buques.reduce((s, b) => s + b.operatividad, 0) / buques.length);
      return {
        buques: buques.length,
        inspecciones: state.inspecciones.length,
        hallazgosCriticos: state.hallazgos.filter((h) => h.sev >= 4).length,
        secciones,
        inspeccionadas,
        operatividad,
      };
    },

    sevColor: () => (sev) => SEV_COLOR[sev] || '#94a3b8',
    sevLabel: () => (sev) => SEV_LABEL[sev] || '—',
  },

  actions: {
    async fetchFleet() {
      this.loading = true;
      try {
        const [buques, inspecciones, hallazgos] = await Promise.all([
          inspectionService.getActivos(),
          inspectionService.getAll(),
          inspectionService.getHallazgos(),
        ]);
        this.buques = buques.data;
        this.inspecciones = inspecciones.data;
        this.hallazgos = hallazgos.data;
      } finally {
        this.loading = false;
      }
    },

    selectBuque(id) {
      this.selectedBuqueId = id;
    },
  },
});
