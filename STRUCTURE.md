# CalcuLux - Estructura Detallada de Carpetas

Este documento es una referencia detallada de cómo organizar el proyecto desde el principio.

---

## 📁 Árbol Completo

```
calculux/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── esios_proxy.py
│   │   └── schemas/
│   │       ├── __init__.py
│   │       └── pvpc.py
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_esios_proxy.py
│   ├── .env.example
│   ├── .gitignore
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApplianceCard.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── FormInput.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── PVPCStatus.tsx
│   │   ├── context/
│   │   │   ├── AppliancesContext.tsx
│   │   │   ├── ConfigContext.tsx
│   │   │   └── PVPCContext.tsx
│   │   ├── hooks/
│   │   │   ├── useStorage.ts
│   │   │   ├── useCalculations.ts
│   │   │   ├── usePVPCFetch.ts
│   │   │   └── useNormalization.ts
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── AppliancesPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── OnboardingPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── utils/
│   │   │   ├── storage.ts
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── constants.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── capacitor.config.ts
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
│
├── .gitignore (raíz)
├── package.json (raíz - opcional para scripts compartidos)
└── README.md (raíz)
```

---

## 📄 Descripción de Archivos Críticos

### Backend

#### `backend/app/main.py`

Punto de entrada de la API FastAPI. Define:

- Instancia de FastAPI
- CORS (permitir requests desde Vercel/Netlify)
- Middleware (logging, manejo de errores)
- Rutas (/api/pvpc/today)
- Startup/shutdown events

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.services.esios_proxy import router as esios_router

app = FastAPI(title="CalcuLux API", version="1.0.0")

# CORS para frontend en desarrollo y producción
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(esios_router, prefix="/api")
```

#### `backend/app/core/config.py`

Variables de entorno y configuración centralizada:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ESIOS_TOKEN: str  # Token API e-sios
    FRONTEND_URL: str = "https://calculux.vercel.app"
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"

settings = Settings()
```

#### `backend/app/services/esios_proxy.py`

Contiene la lógica de conexión con e-sios:

```python
from fastapi import APIRouter, HTTPException
from datetime import datetime
import httpx

router = APIRouter()

ESIOS_API_URL = "https://api.esios.ree.es"
ESIOS_INDICATOR_1001 = 1001  # PVPC Peninsular

@router.get("/pvpc/today")
async def get_pvpc_today() -> dict:
    """Devuelve precio PVPC medio del día actual con fallback a caché."""
    # Lógica aquí...
    pass
```

#### `backend/app/schemas/pvpc.py`

Modelos de response (sin Pydantic, usando type hints nativos):

```python
from typing import TypedDict

class PVPCResponse(TypedDict):
    price_eur_per_kwh: float
    timestamp: str
    is_cached: bool
    cache_age_hours: float

# Ejemplo de uso:
# @app.get("/api/pvpc/today")
# async def get_pvpc_today() -> dict:
#     return {
#         "price_eur_per_kwh": 0.142,
#         "timestamp": "2025-01-15T20:05:00Z",
#         "is_cached": False,
#         "cache_age_hours": 0.5
#     }
```

#### `backend/requirements.txt`

```
fastapi==0.104.1
uvicorn==0.24.0
httpx==0.25.0
python-dotenv==1.0.0
pytest==7.4.0
```

**Nota:** Sin Pydantic en el MVP para evitar problemas de compilación Rust en Windows. FastAPI sigue siendo autodocumentado con type hints nativos de Python.

---

### Frontend

#### `frontend/src/main.tsx`

Punto de entrada React:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### `frontend/src/App.tsx`

Componente raíz (routing, providers):

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppliancesProvider } from './context/AppliancesContext'
import { ConfigProvider } from './context/ConfigContext'
import { PVPCProvider } from './context/PVPCContext'

import HomePage from './pages/HomePage'
import AppliancesPage from './pages/AppliancesPage'
import SettingsPage from './pages/SettingsPage'
import OnboardingPage from './pages/OnboardingPage'

function App() {
  return (
    <ConfigProvider>
      <PVPCProvider>
        <AppliancesProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/appliances" element={<AppliancesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
            </Routes>
          </Router>
        </AppliancesProvider>
      </PVPCProvider>
    </ConfigProvider>
  )
}

export default App
```

#### `frontend/src/utils/constants.ts`

Constantes fiscales (versionadas, fáciles de actualizar):

```typescript
export const TAX_CONSTANTS = {
  IEE_RATE: 0.0511269632,
  IVA_RATE: 0.21,
  SOCIAL_BONUS_RATES: {
    NONE: 1.0,
    VULNERABLE: 0.575,
    SEVERE: 0.425,
  },
} as const

export const STORAGE_KEYS = {
  APPLIANCES_V1: 'appliances_v1',
  CONFIG_V1: 'config_v1',
  PVPC_CACHE_V1: 'pvpc_cache_v1',
  STORAGE_VERSION: 'storage_version',
} as const

export const STORAGE_VERSION = 1
```

#### `frontend/src/hooks/useCalculations.ts`

Motor de cálculo determinístico:

```typescript
import { TAX_CONSTANTS } from '../utils/constants'

export function useCalculations() {
  function calculateMonthlyCost(
    powerW: number,
    hoursPerDay: number,
    pvpcEuroPerKwh: number,
    bonusRate: number = 1.0
  ) {
    const energyKwh = (powerW * hoursPerDay * 30) / 1000
    const baseCost = energyKwh * pvpcEuroPerKwh
    const withIEE = baseCost * (1 + TAX_CONSTANTS.IEE_RATE)
    const withTaxes = withIEE * (1 + TAX_CONSTANTS.IVA_RATE) * bonusRate

    return { energyKwh, baseCost, withTaxes }
  }

  return { calculateMonthlyCost }
}
```

#### `frontend/src/hooks/usePVPCFetch.ts`

Obtener PVPC con fallback:

```typescript
import { useEffect } from 'react'
import { useContext } from 'react'
import { PVPCContext } from '../context/PVPCContext'

export function usePVPCFetch() {
  const { setPVPC, setLoading, setError } = useContext(PVPCContext)

  useEffect(() => {
    async function fetchPVPC() {
      setLoading(true)
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/pvpc/today`
        )
        if (!response.ok) throw new Error('Backend unavailable')
        const data = await response.json()
        setPVPC(data)
      } catch (err) {
        // Cargar desde caché local
        const cached = await AsyncStorage.getItem('pvpc_cache_v1')
        if (cached) {
          setPVPC(JSON.parse(cached))
          setError('Usando precio del día anterior')
        } else {
          setError('No hay datos PVPC disponibles')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchPVPC()
  }, [])
}
```

#### `frontend/src/utils/storage.ts`

Abstracción de persistencia local:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEYS, STORAGE_VERSION } from './constants'

export async function migrateStorageIfNeeded() {
  const currentVersion = await AsyncStorage.getItem(STORAGE_KEYS.STORAGE_VERSION)
  
  if (!currentVersion) {
    await AsyncStorage.setItem(
      STORAGE_KEYS.STORAGE_VERSION,
      String(STORAGE_VERSION)
    )
    return
  }

  const version = parseInt(currentVersion)
  if (version < STORAGE_VERSION) {
    // Ejecutar migraciones necesarias
    console.log(`Migrando de v${version} a v${STORAGE_VERSION}`)
    // ... lógica de migración ...
    await AsyncStorage.setItem(
      STORAGE_KEYS.STORAGE_VERSION,
      String(STORAGE_VERSION)
    )
  }
}

export async function saveAppliances(appliances: any[]) {
  await AsyncStorage.setItem(
    STORAGE_KEYS.APPLIANCES_V1,
    JSON.stringify(appliances)
  )
}

export async function loadAppliances() {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.APPLIANCES_V1)
  return data ? JSON.parse(data) : []
}
```

#### `frontend/vite.config.ts`

Configuración del build:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Desactivar sourcemaps en prod
  }
})
```

#### `frontend/tailwind.config.js`

Configuración TailwindCSS:

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // Blue
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      }
    }
  },
  plugins: [],
}
```

#### `frontend/capacitor.config.ts`

Configuración de Capacitor (para Android):

```typescript
import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'es.calculux.app',
  appName: 'CalcuLux',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
    }
  }
}

export default config
```

#### `frontend/public/manifest.json`

PWA manifest:

```json
{
  "name": "CalcuLux - Calculadora de Electricidad",
  "short_name": "CalcuLux",
  "description": "Calcula el coste real de tus electrodomésticos en la factura de luz",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/favicon.ico",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 🚀 Inicialización del Proyecto (Paso a Paso)

### 1. Crear repo en GitHub

```bash
git clone https://github.com/tu-usuario/calculux.git
cd calculux
```

### 2. Inicializar backend

```bash
mkdir backend
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Crear estructura
mkdir -p app/{core,services,schemas} tests

# Crear archivos
touch app/__init__.py app/main.py
touch app/core/__init__.py app/core/config.py
touch app/services/__init__.py app/services/esios_proxy.py
touch app/schemas/__init__.py app/schemas/pvpc.py
touch tests/__init__.py tests/test_esios_proxy.py
touch .env.example requirements.txt Dockerfile README.md

cd ..
```

### 3. Inicializar frontend

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend

# Instalar dependencias
npm install
npm install -D tailwindcss postcss autoprefixer
npm install react-router-dom zustand  # Zustand en lugar de Context API (opcional)
npm install @react-native-async-storage/async-storage @capacitor/core @capacitor/android

# Inicializar Tailwind
npx tailwindcss init -p

# Crear estructura
mkdir -p src/{components,context,hooks,pages,services,utils}

# Crear archivos base
touch src/App.tsx src/main.tsx src/index.css
touch src/utils/{constants,storage,formatters,validators}.ts
touch src/hooks/{useCalculations,usePVPCFetch,useStorage,useNormalization}.ts
touch src/context/{AppliancesContext,ConfigContext,PVPCContext}.tsx
touch src/pages/{HomePage,AppliancesPage,SettingsPage,OnboardingPage}.tsx
touch src/components/{ApplianceCard,Button,FormInput,Modal,PVPCStatus}.tsx
touch src/services/api.ts
touch .env.example capacitor.config.ts

cd ..
```

### 4. Inicializar root

```bash
echo "node_modules/" > .gitignore
echo "dist/" >> .gitignore
echo ".env" >> .gitignore
echo ".DS_Store" >> .gitignore
echo "build/" >> .gitignore
echo "*.apk" >> .gitignore

git add .
git commit -m "Initial project structure"
git push
```

---

## ✅ Checklist de Setup

- [ ] GitHub repo creado (privado)
- [ ] Backend con estructura FastAPI
- [ ] Frontend con Vite + React + TypeScript
- [ ] Capacitor configurado
- [ ] TailwindCSS listo
- [ ] `.env.example` en ambos directorios
- [ ] `.gitignore` global
- [ ] README en cada directorio
- [ ] Primer commit en main

¡Listo para empezar a codificar!