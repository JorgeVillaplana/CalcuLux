# CalcuLux Backend

API FastAPI mínima que actúa como proxy a e-sios (REE) para obtener precios PVPC.

## Stack

- **FastAPI** (ligero, asíncrono, autodocumentado)
- **Python 3.11+**
- **Sin Pydantic en el MVP** (type hints nativos para evitar fricción en Windows)
- **Caché en memoria** (diccionario Python)

## Setup Local

### Requisitos

- Python 3.11+
- pip

### Instalación

1. Crear entorno virtual:

```bash
python -m venv venv
```

2. Activar entorno:

```bash
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# Windows (CMD):
venv\Scripts\activate.bat

# macOS/Linux:
source venv/bin/activate
```

3. Instalar dependencias:

```bash
pip install -r requirements.txt
```

4. Crear `.env` desde `.env.example`:

```bash
cp .env.example .env
```

5. Obtener token de e-sios:
    - Ve a https://www.esios.ree.es/
    - Regístrate y obtén tu token API
    - Pega el token en `.env` como `ESIOS_TOKEN=tu_token_aqui`

### Ejecutar en desarrollo

```bash
python -m uvicorn app.main:app --reload
```

La API estará en `http://localhost:8000`

Documentación automática (Swagger): `http://localhost:8000/docs`

### Estructura

- `app/main.py` — Punto de entrada de la API
- `app/core/config.py` — Variables de entorno (cargadas desde .env)
- `app/services/esios_proxy.py` — Lógica de conexión a e-sios + caché
- `app/schemas/pvpc.py` — Type hints para respuestas

### Testing

```bash
pytest tests/
```

### Despliegue

En Render.com o Railway.dev:

1. Conectar repo GitHub
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

---

## Decisiones de Diseño

### ¿Por qué sin Pydantic en el MVP?

Pydantic v2.5+ requiere compilar `pydantic-core` (Rust) en Windows, lo que genera problemas de incompatibilidad. Para el MVP:

- ✅ Usamos **type hints nativos de Python** (TypedDict, etc.)
- ✅ FastAPI sigue siendo **autodocumentado** (los type hints generan Swagger)
- ✅ **Sin fricción** de compilación
- ⏳ **Migración futura:** Si escalamos, añadimos Pydantic después del MVP

### Caché en memoria vs. Redis

Para el MVP, un diccionario en Python es suficiente:

```python
# En esios_proxy.py
cache = {
    "price_eur_per_kwh": 0.142,
    "timestamp": "2025-01-15T20:05:00Z",
    "is_cached": False,
    "cache_age_hours": 0.5
}
```

Si escalamos a múltiples instancias, migramos a Redis. El código no cambia.

### Una sola ruta: GET /api/pvpc/today

Simplidad radical:

```python
@app.get("/api/pvpc/today")
async def get_pvpc_today() -> dict:
    """
    Devuelve precio PVPC medio del día actual.
    
    Respuesta:
    {
        "price_eur_per_kwh": 0.142,
        "timestamp": "2025-01-15T20:05:00Z",
        "is_cached": False,
        "cache_age_hours": 0.5
    }
    """
    # Lógica aquí...
```

Si el backend falla (servidor dormido), el frontend usa caché local.

---

## Variables de Entorno (.env.example)

```
ESIOS_TOKEN=your_api_token_here
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=INFO
```

---

## Próximos Pasos

1. Implementar `app/services/esios_proxy.py` (conexión a e-sios)
2. Implementar caché con fallback
3. Tests unitarios en `tests/test_esios_proxy.py`
4. Despliegue en Render/Railway