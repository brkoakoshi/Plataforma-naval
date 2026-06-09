# Plataforma INER · Buques

Mockup **frontend** (datos hardcodeados) de una plataforma de inspección de **buques**
—casco, tanques de lastre, cubierta, bodegas— mediante drones y ROV submarinos.

Replica la **misma arquitectura de frontend que `Plataforma-Iner-Wind`** (Vue 3 +
Vue Router + Pinia, capa `services/api`, stores, componentes SFC) pero adaptada al
dominio naval. No hay backend: `services/api.js` resuelve datos de `src/data/mock.js`.

## Requisitos

- Node.js 18+ (probado con v24)

## Cómo ejecutarlo (localhost:3000)

```bash
cd Plataforma-buques
npm install
npm run dev
```

Se abre solo en **http://localhost:3000**. En el login, cualquier credencial entra.

## Estructura (espejo de Iner-Wind)

```
src/
  main.js                 # createApp + pinia + router + apexcharts
  App.vue                 # shell: <Sidebar> + <router-view>
  router/index.js         # rutas + guards de auth
  services/api.js         # capa de datos (mock, misma forma que producción)
  data/mock.js            # datos hardcodeados (buques, inspecciones, hallazgos)
  stores/
    auth.js               # login/logout (Pinia)
    fleet.js              # flota, buque seleccionado, KPIs
  components/
    Sidebar.vue           # wrapper colapsable
    SidebarContent.vue    # navegación
    Login.vue, FlameLogo.vue, ShipIcon.vue
  views/
    LoginView.vue
    PortfolioDashboardView.vue   # dashboard de flota (KPIs, mapa, charts)
    FleetView.vue                # grilla de buques
    ShipDetailView.vue           # detalle: integridad por sección + hallazgos
    InspectionsView.vue
    ReportesView.vue
    DataCenterView.vue
  assets/global.css       # variables INER + clases compartidas
```

## Mapeo de dominio (eólico → naval)

| Iner-Wind            | Buques                                            |
| -------------------- | ------------------------------------------------- |
| Empresa              | Naviera                                           |
| Parque eólico        | Buque (granelero, portacontenedores, tanker…)     |
| Aerogenerador / pala | Sección (casco, tanques de lastre, cubierta…)     |
| Hallazgo en pala     | Corrosión, fisura, pitting, deformación…          |
| Parques en mapa      | Puertos (Valparaíso, Callao, Montevideo…)         |

> El mapa de puertos es esquemático (CSS) y las imágenes de hallazgos son
> placeholders: es un mockup visual, no datos reales.
