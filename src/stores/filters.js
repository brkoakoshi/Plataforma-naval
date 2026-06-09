import { defineStore } from 'pinia';

// Estado de filtros del portafolio. El portafolio se agrupa por astillero
// (Valparaíso / San Antonio), cada uno con su flota.
export const useFiltersStore = defineStore('filters', {
  state: () => ({
    selectedAstillero: null, // 'VAP' | 'SAI' | null
  }),

  getters: {
    hasPortfolioFilters: (state) => state.selectedAstillero !== null,
  },

  actions: {
    setSelectedAstillero(codigo) { this.selectedAstillero = codigo || null; },
    clearPortfolioFilters() { this.selectedAstillero = null; },
  },
});
