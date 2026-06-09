<template>
  <div class="page">
    <div class="breadcrumb">
      <span class="link" @click="$router.push('/dashboard')">Home</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
      <span class="current">Reportes</span>
    </div>
    <h1 class="page-title">Reportes</h1>
    <p class="page-sub">Informes técnicos generados a partir de las inspecciones.</p>

    <div class="card">
      <div class="report-card" v-for="r in reportes" :key="r.buque">
        <div class="report-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
        </div>
        <div class="report-body">
          <div class="report-t">Informe de inspección — {{ r.buque }}</div>
          <div class="report-m">{{ r.tipo }} · {{ r.hallazgos }} hallazgos · {{ r.fecha }}</div>
        </div>
        <span class="badge" :class="r.estadoClass">{{ r.estado }}</span>
        <button class="btn-ghost">Previsualizar</button>
        <button class="btn-pill">Descargar PDF</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { pdfService } from '@/services/api';

export default {
  name: 'ReportesView',
  setup() {
    const reportes = ref([]);
    onMounted(async () => {
      const res = await pdfService.getGeneralReports();
      reportes.value = res.data;
    });
    return { reportes };
  },
};
</script>

<style scoped>
.report-card { display: flex; align-items: center; gap: 16px; padding: 16px 18px; border: 1px solid #e7eded; border-radius: 12px; margin-bottom: 12px; background: #fff; }
.report-icon { width: 42px; height: 42px; border-radius: 10px; background: #fee2e2; color: #b91c1c; display: grid; place-items: center; flex-shrink: 0; }
.report-icon svg { width: 22px; height: 22px; }
.report-body { flex: 1; }
.report-t { font-weight: 800; color: var(--c-green); }
.report-m { font-size: 0.8rem; color: var(--c-gray); }
</style>
