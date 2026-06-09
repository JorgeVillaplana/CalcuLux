# CalcuLux ⚡

CalcuLux es una solución de software multiplataforma (Web y Android) diseñada para el mercado español que permite calcular con precisión quirúrgica el coste económico real de los electrodomésticos en la factura de la luz.

El proyecto nace bajo una premisa técnica estricta: **coste de infraestructura de 0€, escalabilidad horizontal inmediata, privacidad absoluta del usuario (sin bases de datos centralizadas) y un enfoque minimalista y ultraeficiente.**

---

## 📋 1. Descripción del Proyecto

El mercado eléctrico español actual (con tarifas reguladas PVPC indexadas por horas y tramos fiscales variables) resulta opaco para el ciudadano medio. CalcuLux resuelve esto ofreciendo una herramienta directa donde el usuario parametriza sus electrodomésticos en segundos y obtiene un desglose en euros real, aplicando la legislación, impuestos (IEE, IVA) y descuentos (Bono Social) vigentes en España.

---

## 🎯 2. Alcance del Proyecto

- **Precisión Real Real:** No se realizan estimaciones a ojo. Los cálculos utilizan los datos horarios oficiales de Red Eléctrica de España (REE) y las fórmulas fiscales del BOE.
- **Multiplataforma Nativa:** Accesible desde el navegador web (PWA) y empaquetable como una aplicación Android (`.apk`) ligera sin fricción de compilación.
- **Soberanía de Datos (Offline-First):** El usuario no necesita registrarse, ni usar contraseñas, ni confiar sus hábitos de consumo a un servidor de terceros. Los datos **viven y mueren en su dispositivo**. La app funciona 100% offline excepto para actualizar precios PVPC (con fallback a caché local).
- **Simulación Mensual:** Agregación del coste total de todos los dispositivos registrados para proyectar el impacto real en la factura de la luz (periodos personalizables, por defecto 30 días).

---

## 🚀 3. Premisas Iniciales para el MVP (Producto Mínimo Viable)

Para garantizar un desarrollo ágil y modular, el MVP cumplirá a rajatabla las siguientes directrices funcionales:

### A. Gestión de Inventario Local (CRUD)

- El usuario puede registrar, editar, visualizar y eliminar sus electrodomésticos de forma ilimitada.
- Cada dispositivo contará con un nombre personalizado (ej. _"Nevera Cocina"_, _"PC Gaming"_).

### B. Flexibilidad Absoluta en la Entrada de Datos

El sistema debe digerir cualquier métrica que introduzca el usuario y normalizarla antes del cálculo:

1. **Entrada de Potencia:**
    - Modo Vatios ($W$).
    - Modo Amperios + Voltios ($A \times V$), inicializado por defecto en el estándar español de $230V$ pero completamente editable (para entornos a $12V/24V$).
2. **Entrada de Tiempo de Uso:**
    - Selección de magnitud: **Minutos**, **Horas** o **Días al mes** (para uso esporádico con prorrateo automático).
    - Modo **"Siempre encendido"** (bloqueo automático a 24 horas/día para aparatos de perfil continuo como frigoríficos o routers).

### C. Perfil de Factura Configurable

Permite al usuario editar los parámetros económicos de su contrato en cualquier momento:

- **Tipo de Tarifa:**
    - **PVPC Indexada (Regulada):** Obtiene automáticamente el precio horario de e-sios/REE. Precio medio diario utilizado en el MVP (expansión futura: precios por franja horaria P1/P2/P3).
    - **Tarifa Fija:** El usuario introduce manualmente el precio del kWh (ej: 0.15 €). Útil para contratos con comercializadoras privadas.
- **Bono Social (Multiplicador de descuento directo):**
    - _Sin Bono:_ 100% del coste.
    - _Consumidor Vulnerable:_ Paga el 57,5% del coste regulado (42,5% de descuento).
    - _Consumidor Vulnerable Severo:_ Paga el 42,5% del coste regulado (57,5% de descuento).

### D. Cuadro de Mando y Desglose Total

- Visualización del coste total agregado (€/mes) y consumo energético total (kWh/mes).
- Listado desglosado ordenando los aparatos de mayor a menor impacto económico, mostrando su coste individual por hora, día y mes.
- Indicador visual de último refresco de precios PVPC (con fallback claramente visible si los datos están cacheados).

### E. Onboarding de Primera Experiencia

- Modal de bienvenida (3 pasos) que explica qué hace la app.
- Pregunta inicial sobre tipo de tarifa para configuración rápida.
- Link a documentación sobre cómo encontrar la tarifa actual en la factura eléctrica.

---

## 🛠️ 4. Stack Tecnológico (Filosofía Coste 0€)

Toda la infraestructura y librerías elegidas encajan estrictamente dentro de los planes gratuitos (_Free Tiers_) del mercado:

### Backend (Mínimo Viable)

- **Lenguaje:** `Python 3.11+`
- **Framework:** `FastAPI` (ligero, asíncrono, autodocumentado con Swagger)
- **Validación:** Type hints nativos de Python (sin Pydantic en el MVP para evitar fricción de compilación en Windows)
- **Rol:** **Proxy stateless único** hacia la API de e-sios/REE. Una sola ruta:
    - `GET /api/pvpc/today` → Devuelve el precio medio PVPC del día actual (actualizado a las 20:05h con precios del día siguiente).
- **Cálculos complejos (IEE, IVA, Bono Social):** Viven **en el frontend** (TypeScript). Backend es solo HTTP intermediario.
- **Caché:** Diccionario en memoria del proceso (suficiente para el MVP). Evita llamadas innecesarias a e-sios.
- **Hosting:** Render.com o Railway.dev (Plan gratuito). El servidor puede dormir tras inactividad; el frontend maneja gracefully el fallback a caché local.

### Frontend (Web + Android)

- **Tecnología Principal:** `React 18` + `TypeScript` + `Vite` (build tool extremadamente rápido).
- **Motor de Cálculo:** Lógica fiscal (IEE 5.11269632%, IVA, Bono Social) implementada en TypeScript puro, sin dependencias externas. **Determinístico y offline-first**.
- **UI/UX:** `TailwindCSS` para diseño responsivo y consistente.
- **Almacenamiento Local:** `AsyncStorage` (abstracción sobre localStorage en web, native storage en Android vía Capacitor).
- **Compilación para Android:** `Capacitor` (wrapper nativo ligero) + compilación local con Android Studio (gratuito).
- **PWA (Web):** Capacitor + service workers = app instalable desde navegador sin APK.
- **Hosting Web:** Vercel o Netlify (Plan gratuito). Deploy automático desde GitHub.

### Control de Versiones y Distribución

- **Repositorio:** GitHub (privado gratuito + Releases).
- **APK Distribution:** GitHub Releases + QR code en el sitio web para descargar directamente.

### Diagrama de Arquitectura Revisada

```
┌──────────────────────────────────────────────────────────┐
│           FRONTEND (React + TypeScript + Vite)            │
│                    Web (PWA) + Android (Capacitor)        │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────┐   ┌──────────────────────────┐  │
│  │  Motor de Cálculo    │   │   AsyncStorage           │  │
│  │  (IEE + IVA + Bono)  │   │   (Dispositivos,         │  │
│  │  100% TypeScript     │   │    Config,               │  │
│  │  Determinístico      │   │    PVPC Cache,           │  │
│  │  Offline-First       │   │    Schema v1)            │  │
│  └──────────────────────┘   └──────────────────────────┘  │
│           │                                                │
│           └─────────────────┬────────────────────────────┘ │
└────────────────────────────┬──────────────────────────────┘
                             │ HTTP (solo para PVPC)
                             │ + Fallback local si fail
                             ▼
            ┌──────────────────────────────┐
            │  Backend FastAPI (Minimal)   │
            ├──────────────────────────────┤
            │  GET /api/pvpc/today         │
            │  - Proxy a e-sios            │
            │  - Caché en memoria (Redis)  │
            │  - Fallback: error 503 ok    │
            └──────────────────────────────┘
                             │
                             ▼
            ┌──────────────────────────────┐
            │    API e-sios (REE Spain)    │
            │    Indicador: 1001           │
            │    Token: .env secret        │
            └──────────────────────────────┘
```

---

## 📁 5. Estructura de Carpetas (Monorepo)

```
calculux/
├── backend/                           # Proyecto FastAPI (Proxy Mínimo a e-sios)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # Punto de entrada de la API
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py              # Variables de entorno (token e-sios, CORS, etc)
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── esios_proxy.py         # Cliente del PVPC (indicador 1001) + caché Redis local
│   │   └── schemas/
│   │       ├── __init__.py
│   │       └── pvpc.py                # Response models (type hints, sin Pydantic)
│   ├── tests/                         # Tests unitarios para cálculos de validación
│   │   └── test_esios_proxy.py
│   ├── .env.example                   # Token API e-sios, Puerto, CORS
│   ├── requirements.txt               # fastapi, uvicorn, httpx (sin Pydantic para MVP)
│   ├── Dockerfile                     # Opcional: para despliegue en contenedor
│   └── README.md                      # Setup local + despliegue
│
├── frontend/                          # Proyecto React + Vite + Capacitor (Web + Android)
│   ├── public/                        # Assets estáticos (favicon, manifest.json)
│   │   ├── favicon.ico
│   │   └── manifest.json              # PWA manifest
│   ├── src/
│   │   ├── components/                # UI Reutilizable (Botones, Inputs, Cards)
│   │   │   ├── ApplianceCard.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── FormInput.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── PVPCStatus.tsx         # Indicador de sincronización PVPC
│   │   ├── context/                   # Estado global (Zustand o Context API)
│   │   │   ├── AppliancesContext.tsx  # CRUD + persistencia
│   │   │   ├── ConfigContext.tsx      # Tarifa, Bono Social, etc
│   │   │   └── PVPCContext.tsx        # Precio actual + fecha último refresco
│   │   ├── hooks/
│   │   │   ├── useStorage.ts          # Abstracción AsyncStorage (web + mobile)
│   │   │   ├── useCalculations.ts     # Motor cálculos (IEE, IVA, Bono)
│   │   │   ├── usePVPCFetch.ts        # Obtener PVPC con fallback
│   │   │   └── useNormalization.ts    # Normalizar entrada (W, A, V, minutos, etc)
│   │   ├── pages/                     # Rutas principales
│   │   │   ├── HomePage.tsx           # Cuadro de mando / Coste total
│   │   │   ├── AppliancesPage.tsx     # CRUD electrodomésticos
│   │   │   ├── SettingsPage.tsx       # Configuración tarifa + bono
│   │   │   └── OnboardingPage.tsx     # Modal bienvenida (primera vez)
│   │   ├── services/
│   │   │   └── api.ts                 # Cliente HTTP (fetch + manejo errores)
│   │   ├── utils/
│   │   │   ├── storage.ts             # Capa de abstracción AsyncStorage
│   │   │   ├── formatters.ts          # Formato moneda (€), decimales, etc
│   │   │   ├── validators.ts          # Validaciones de entrada (potencia, tiempo)
│   │   │   └── constants.ts           # Constantes (IEE %, IVA %, Bono %)
│   │   ├── App.tsx                    # Componente raíz (Router + Providers)
│   │   ├── main.tsx                   # Punto de entrada (React 18 + Vite)
│   │   └── index.css                  # Estilos globales (TailwindCSS)
│   ├── capacitor.config.ts            # Configuración de Capacitor (nombre app, etc)
│   ├── vite.config.ts                 # Build settings (dev server, optimize)
│   ├── tailwind.config.js             # Configuración TailwindCSS
│   ├── tsconfig.json
│   ├── package.json                   # react, vite, tailwindcss, capacitor, etc
│   ├── .env.example                   # Backend URL (local o prod)
│   └── README.md                      # Setup local + PWA + APK build
│
├── .gitignore                         # node_modules, .env, dist, build, .DS_Store
├── package.json                       # Root (scripts para monorepo)
└── README.md                          # Este archivo
```

---

## 🔄 6. Decisiones de Diseño Críticas

### 6.1. Frontend: Motor de Cálculo 100% Determinístico (TypeScript)

El corazón de CalcuLux no es el backend, sino las **fórmulas fiscales**. Viven en TypeScript puro:

```typescript
// src/utils/constants.ts
export const TAX_CONSTANTS = {
  IEE_RATE: 0.0511269632,        // Impuesto Especial sobre la Electricidad
  IVA_RATE: 0.21,                 // IVA estándar en España
  SOCIAL_BONUS_RATES: {
    NONE: 1.0,                     // Sin descuento
    VULNERABLE: 0.575,             // 57.5% del coste (42.5% descuento)
    SEVERE: 0.425,                 // 42.5% del coste (57.5% descuento)
  },
};

// src/hooks/useCalculations.ts
export function calculateMonthlyCost(
  powerW: number,
  hoursPerDay: number,
  pvpcEuroPerKwh: number,
  bonusRate: number
): { energyKwh: number; baseCost: number; withTaxes: number } {
  // 1. Energía consumida
  const energyKwh = (powerW * hoursPerDay * 30) / 1000;
  
  // 2. Coste base
  const baseCost = energyKwh * pvpcEuroPerKwh;
  
  // 3. IEE + IVA (cascada)
  const withIEE = baseCost * (1 + IEE_RATE);
  const withTaxes = withIEE * (1 + IVA_RATE) * bonusRate;
  
  return { energyKwh, baseCost, withTaxes };
}
```

**Por qué aquí y no en el backend:**

- ✅ Offline-first: funciona sin internet.
- ✅ Instant feedback al usuario (sin latencia HTTP).
- ✅ Caché del navegador = cálculos reutilizables.
- ✅ Testeable en el frontend sin dependencias externas.

### 6.2. Backend: Proxy Puro a e-sios

El backend **tiene una única responsabilidad**: obtener el precio PVPC de e-sios y cachéarlo.

```python
# backend/app/services/esios_proxy.py

# CONSTANTES
ESIOS_INDICATOR_ID = 1001  # PVPC Peninsular España
ESIOS_API_URL = "https://api.esios.ree.es"

@app.get("/api/pvpc/today")
async def get_pvpc_today(backend_service: BackendService = Depends()) -> dict:
    """
    Devuelve el precio PVPC medio del día actual.
    - Si el caché está válido (< 4h), devuelve caché.
    - Si falla la llamada a e-sios, devuelve caché antiguo + status warning.
    - Si no hay caché, devuelve error 503 (apaga el servidor o falla).
    """
    return await backend_service.get_pvpc_with_fallback()
```

**Notas:**

- El servidor puede dormir tras inactividad (Render plan free). El frontend **maneja gracefully** un error 503.
- El caché es en memoria del proceso, no en base de datos. Suficiente para el MVP.
- Si escalamos, pasamos a Redis externo, pero el código no cambia.

### 6.3. AsyncStorage: Esquema Versionado desde Día 0

Cuando actualices la estructura de datos, los usuarios con versión antigua tendrán datos incompatibles. Necesitamos migración:

```typescript
// src/utils/storage.ts

const STORAGE_VERSION = 1;

export async function migrateStorageIfNeeded() {
  const currentVersion = await AsyncStorage.getItem('storage_version');
  
  if (!currentVersion) {
    // Primera instalación
    await AsyncStorage.setItem('storage_version', String(STORAGE_VERSION));
    return;
  }
  
  if (parseInt(currentVersion) < STORAGE_VERSION) {
    // Ejecutar migraciones necesarias
    console.log(`Migrating from v${currentVersion} to v${STORAGE_VERSION}`);
    // ... lógica de migración ...
    await AsyncStorage.setItem('storage_version', String(STORAGE_VERSION));
  }
}

// Claves de almacenamiento (granulares, con versionado)
export const STORAGE_KEYS = {
  APPLIANCES_V1: 'appliances_v1',
  CONFIG_V1: 'config_v1',
  PVPC_CACHE_V1: 'pvpc_cache_v1',
  STORAGE_VERSION: 'storage_version',
};
```

### 6.4. PVPC Tarifa: Precio Medio vs P1/P2/P3 (MVP Decision)

La tarifa PVPC tiene 3 periodos horarios:

- **P1 (Punta):** 10h-14h y 18h-22h → Precio más alto
- **P2 (Llano):** 8h-10h, 14h-18h, 22h-23h → Precio intermedio
- **P3 (Valle):** 23h-8h → Precio más bajo

El **MVP usa precio medio diario** (más simple, razonablemente preciso). Pero el código incluye comentarios `// TODO: P1/P2/P3 support` para expansión futura sin reescribir cimientos.

### 6.5. Onboarding: Modal de Bienvenida (Primera Vez)

```typescript
// src/pages/OnboardingPage.tsx

export function OnboardingPage() {
  // 1. ¿Qué hace CalcuLux?
  // 2. ¿PVPC o Tarifa Fija?
  // 3. ¿Tienes Bono Social?
  
  // Al terminar, setea flag en storage y redirige a Home
}
```

---

## 🎮 7. Cómo Compilar y Desplegar

### Frontend (Web)

```bash
cd frontend
npm install
npm run dev          # Dev local
npm run build        # PWA estática para Vercel/Netlify
```

### Frontend (Android APK)

```bash
cd frontend
npm run build
npx cap add android
npx cap copy
npx cap open android # Abre Android Studio
# Build APK desde Studio (o gradle CLI)
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Despliegue en Render:

1. Push a GitHub.
2. Conectar repo a Render.
3. Crear servicio "Web Service" → Build command: `pip install -r requirements.txt`, Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

---

## 📝 8. Próximos Pasos (Roadmap MVP)

1. **Semana 1-2:** Setup inicial
    
    - [ ] Monorepo scaffold + GitHub repo
    - [ ] Backend FastAPI mínimo (ruta `/api/pvpc/today`)
    - [ ] Frontend React + Vite boilerplate
2. **Semana 3:** Motor de cálculo
    
    - [ ] Lógica IEE + IVA + Bono Social (TypeScript)
    - [ ] Tests unitarios para fórmulas
3. **Semana 4:** UI/CRUD electrodomésticos
    
    - [ ] Formulario de entrada (Vatios, Amperios, Tiempo)
    - [ ] Normalización y validación
    - [ ] AsyncStorage persistencia
4. **Semana 5:** Dashboard + contexto global
    
    - [ ] Cuadro de mando total €/mes y kWh/mes
    - [ ] Listado ordenado por impacto
    - [ ] PVPC fetch + fallback
5. **Semana 6:** Polish + testing
    
    - [ ] Onboarding modal
    - [ ] PWA manifest + service worker
    - [ ] Capacitor setup para Android
    - [ ] Tests E2E
6. **Semana 7:** Despliegue
    
    - [ ] Backend en Render
    - [ ] Web en Vercel
    - [ ] APK en GitHub Releases

---

**Último consejo:** Cada commit debe ser atómico y auto-suficiente. No dejes "WIPs" en main. El MVP es versión 1.0.0, nada de 0.0.1.

¡Vamos a hacerlo! 🚀