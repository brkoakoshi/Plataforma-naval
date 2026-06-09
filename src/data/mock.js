/* ============================================================
   DATOS HARDCODEADOS — Plataforma INER · Buques (mockup)
   Solo 2 flotas/astilleros: Valparaíso y San Antonio.
   Cada entrada de BUQUES representa la flota de ese astillero.
   ============================================================ */

export const SEV_COLOR = { 5: '#991b1b', 4: '#ea580c', 3: '#b45309', 2: '#4d7c0f', 1: '#166534' };
export const SEV_LABEL = { 5: 'Crítico', 4: 'Alto', 3: 'Medio', 2: 'Bajo', 1: 'Leve' };

export const EMPRESA = { nombre: 'Naviera INER', codigo: 'NI', color: '#0d9488' };

// ── Dos astilleros / dos flotas, ambos en Chile ──────────────
export const ASTILLEROS = [
  { codigo: 'VAP', nombre: 'Valparaíso',  flota: 'Flota Valparaíso',  lat: -33.04, lng: -71.63 },
  { codigo: 'SAI', nombre: 'San Antonio', flota: 'Flota San Antonio', lat: -33.59, lng: -71.61 },
];
export const ASTILLERO_NOMBRES = { VAP: 'Valparaíso', SAI: 'San Antonio' };
export const ASTILLERO_FLOTA   = { VAP: 'Flota Valparaíso', SAI: 'Flota San Antonio' };
export const ASTILLERO_CENTERS = { VAP: [-33.04, -71.63], SAI: [-33.59, -71.61] };
export const ASTILLERO_BOUNDS  = {
  VAP: [[-33.13, -71.73], [-32.95, -71.54]],
  SAI: [[-33.67, -71.71], [-33.51, -71.52]],
};

export const PAISES = [{ nombre: 'Chile', codigo: 'CL' }];

export const astilleroDeBuque = (b) => b.astillero;

// ── Flotas (una por astillero) ───────────────────────────────
export const BUQUES = [
  {
    id: 'VAP', nombre: 'Valparaíso', tipo: 'Flota Valparaíso',
    bandera: 'CL', puerto: 'Valparaíso', astillero: 'VAP', flota: 'Flota Valparaíso',
    lat: -33.04, lng: -71.63, maxSev: 5,
    estado: 'Crítico', estadoClass: 'crit',
    secciones: 45, inspeccionadas: 42, hallazgos: 59, ultimaInsp: '04 Jun 2026',
    operatividad: 86,
    health: [
      { nombre: 'Casco (estribor)', pct: 58, sev: 5 },
      { nombre: 'Casco (babor)', pct: 75, sev: 3 },
      { nombre: 'Tanques de lastre', pct: 49, sev: 5 },
      { nombre: 'Bodegas de carga', pct: 86, sev: 2 },
      { nombre: 'Cubierta principal', pct: 90, sev: 1 },
      { nombre: 'Hélice y timón', pct: 75, sev: 3 },
    ],
  },
  {
    id: 'SAI', nombre: 'San Antonio', tipo: 'Flota San Antonio',
    bandera: 'CL', puerto: 'San Antonio', astillero: 'SAI', flota: 'Flota San Antonio',
    lat: -33.59, lng: -71.61, maxSev: 4,
    estado: 'En observación', estadoClass: 'warn',
    secciones: 45, inspeccionadas: 39, hallazgos: 45, ultimaInsp: '01 Jun 2026',
    operatividad: 91,
    health: [
      { nombre: 'Casco (estribor)', pct: 75, sev: 4 },
      { nombre: 'Casco (babor)', pct: 77, sev: 3 },
      { nombre: 'Tanques de lastre', pct: 81, sev: 3 },
      { nombre: 'Rampa de popa', pct: 62, sev: 4 },
      { nombre: 'Cubierta principal', pct: 90, sev: 1 },
      { nombre: 'Hélice y timón', pct: 87, sev: 2 },
    ],
  },
];

// Buques individuales por astillero (ejemplos). Cada entrada representa un buque real
// con coordenadas, inspecciones y salud resumida. Estos son devueltos por el servicio
// `inspectionService.getActivos()` para poblar la lista real de buques en la UI.
export const SHIPS = [
  // Valparaíso
  {
    id: 'VAP-001', nombre: 'MV Valparaíso I', astillero: 'VAP', bandera: 'CL', puerto: 'Valparaíso',
    // posición central en el puerto proporcionada por el usuario
    lat: -33.02204626954378, lng: -71.63160778523427, secciones: 45, inspeccionadas: 42, hallazgos: 12, operatividad: 88, maxSev: 5,
    health: [ { nombre: 'Casco', pct: 60, sev: 5 }, { nombre: 'Cubierta', pct: 85, sev: 2 } ],
  },
  {
    id: 'VAP-002', nombre: 'FV Pacifica', astillero: 'VAP', bandera: 'CL', puerto: 'Valparaíso',
    // ligero offset para evitar solapamiento: norte-este del punto central
    lat: -33.02184626954378, lng: -71.63130778523427, secciones: 40, inspeccionadas: 38, hallazgos: 6, operatividad: 92, maxSev: 3,
    health: [ { nombre: 'Casco', pct: 75, sev: 3 }, { nombre: 'Hélice', pct: 88, sev: 2 } ],
  },
  {
    id: 'VAP-003', nombre: 'Stella Maris', astillero: 'VAP', bandera: 'CL', puerto: 'Valparaíso',
    // ligero offset para evitar solapamiento: sur-oeste del punto central
    lat: -33.02224626954378, lng: -71.63190778523427, secciones: 48, inspeccionadas: 45, hallazgos: 8, operatividad: 90, maxSev: 4,
    health: [ { nombre: 'Tanques', pct: 55, sev: 4 }, { nombre: 'Cubierta', pct: 80, sev: 2 } ],
  },

  // San Antonio
  {
    id: 'SAI-002', nombre: 'CS Andino', astillero: 'SAI', bandera: 'CL', puerto: 'San Antonio',
    lat: -33.5855, lng: -71.6185, secciones: 44, inspeccionadas: 41, hallazgos: 5, operatividad: 93, maxSev: 3,
    health: [ { nombre: 'Hélice', pct: 88, sev: 3 }, { nombre: 'Cubierta', pct: 90, sev: 1 } ],
  },
];

export const INSPECCIONES = [
  { id: 'INS-2041', buque: 'Valparaíso',  seccion: 'Tanques de lastre', fecha: '04 Jun 2026', metodo: 'ROV submarino', hallazgos: 12, sev: 5, estado: 'Cerrada' },
  { id: 'INS-2040', buque: 'Valparaíso',  seccion: 'Casco (estribor)',  fecha: '04 Jun 2026', metodo: 'Dron',          hallazgos: 9,  sev: 5, estado: 'Cerrada' },
  { id: 'INS-2039', buque: 'San Antonio', seccion: 'Cubierta principal',fecha: '01 Jun 2026', metodo: 'Dron',          hallazgos: 1,  sev: 1, estado: 'Cerrada' },
  { id: 'INS-2038', buque: 'Valparaíso',  seccion: 'Bodegas de carga',  fecha: '02 Jun 2026', metodo: 'Dron',          hallazgos: 2,  sev: 2, estado: 'Cerrada' },
  { id: 'INS-2037', buque: 'Valparaíso',  seccion: 'Casco (babor)',     fecha: '30 May 2026', metodo: 'ROV submarino', hallazgos: 5,  sev: 3, estado: 'En proceso' },
  { id: 'INS-2036', buque: 'San Antonio', seccion: 'Tanques de lastre', fecha: '28 May 2026', metodo: 'ROV submarino', hallazgos: 6,  sev: 3, estado: 'Cerrada' },
  { id: 'INS-2035', buque: 'San Antonio', seccion: 'Rampa de popa',     fecha: '20 May 2026', metodo: 'Dron',          hallazgos: 7,  sev: 4, estado: 'En proceso' },
  { id: 'INS-2034', buque: 'San Antonio', seccion: 'Casco (estribor)',  fecha: '20 May 2026', metodo: 'Dron',          hallazgos: 8,  sev: 4, estado: 'Cerrada' },
];

export const TIPOS_HALLAZGO = ['Corrosión', 'Fisura', 'Pitting', 'Deformación', 'Bio-incrustación', 'Desprendimiento de pintura'];

export const HALLAZGOS = [
  { id: 'H-8821', tipo: 'Corrosión',  seccion: 'Tanques de lastre', sev: 5, buque: 'Valparaíso',  desc: 'Corrosión generalizada con pérdida de espesor > 25%' },
  { id: 'H-8820', tipo: 'Fisura',     seccion: 'Casco (estribor)',  sev: 5, buque: 'Valparaíso',  desc: 'Fisura longitudinal de 38 cm en zona de soldadura' },
  { id: 'H-8819', tipo: 'Pitting',    seccion: 'Tanques de lastre', sev: 4, buque: 'Valparaíso',  desc: 'Picaduras profundas en mamparo transversal' },
  { id: 'H-8818', tipo: 'Bio-incrustación', seccion: 'Casco (babor)', sev: 3, buque: 'Valparaíso', desc: 'Acumulación de fouling sobre obra viva' },
  { id: 'H-8817', tipo: 'Deformación', seccion: 'Rampa de popa',    sev: 4, buque: 'San Antonio', desc: 'Abolladura por impacto en estructura de rampa' },
  { id: 'H-8816', tipo: 'Desprendimiento de pintura', seccion: 'Cubierta principal', sev: 2, buque: 'San Antonio', desc: 'Pérdida de recubrimiento epóxico, sin corrosión base' },
  { id: 'H-8815', tipo: 'Corrosión',  seccion: 'Hélice y timón',    sev: 4, buque: 'Valparaíso',  desc: 'Corrosión galvánica en pala de timón' },
  { id: 'H-8814', tipo: 'Pitting',    seccion: 'Tanques de lastre', sev: 3, buque: 'San Antonio', desc: 'Picaduras aisladas dentro de tolerancia clase' },
];
