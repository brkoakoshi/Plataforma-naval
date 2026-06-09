/* ============================================================
   services/api.js — Capa de datos del mockup.
   Mantiene la MISMA forma que el frontend de Iner-Wind
   (authService, inspectionService, pdfService...) pero en vez
   de pegarle a axios/microservicios, resuelve datos hardcodeados.
   Así las stores y vistas se escriben igual que en producción.
   ============================================================ */
import {
  BUQUES, SHIPS, INSPECCIONES, HALLAZGOS, PAISES, ASTILLEROS, EMPRESA,
} from '@/data/mock';

// Simula latencia de red para que el mockup se sienta "real".
const delay = (data, ms = 250) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

// Usuario demo (no hay backend de auth real).
const DEMO_USER = { id: 1, nombre: 'Inspector INER', email: 'inspector@iner.cl', rol: 'admin' };

export const authService = {
  login: (credentials) =>
    delay({ success: true, token: 'mock-token-buques', user: { ...DEMO_USER, email: credentials.email || DEMO_USER.email } }),
  getProfile: () => delay(DEMO_USER),
};

export const inspectionService = {
  getActivos: () => delay(SHIPS),
  getActivoById: (id) => delay(SHIPS.find((b) => b.id === id) || null),
  getAll: () => delay(INSPECCIONES),
  getHallazgos: () => delay(HALLAZGOS),
};

export const pdfService = {
  // En el mockup no generamos PDF real; devolvemos metadatos del informe.
  getGeneralReports: (assetId) =>
    delay(BUQUES.filter((b) => !assetId || b.id === assetId).map((b) => ({
      buque: b.nombre, tipo: b.tipo, hallazgos: b.hallazgos, fecha: b.ultimaInsp, estado: b.estado, estadoClass: b.estadoClass,
    }))),
};

export const refData = { PAISES, ASTILLEROS, EMPRESA };

export default { authService, inspectionService, pdfService, refData };
