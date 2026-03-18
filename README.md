# API Tareas Módulos — Express + Supabase (JavaScript)

API REST completa para la gestión de módulos, tareas y estudiantes de ciclos formativos.
Equivalente backend del proyecto frontend `tareas_modulos` que usaba localStorage.
**Sin TypeScript — JavaScript puro con Node.js.**

---

## 🚀 Configuración inicial

### 1. Instalar dependencias
```bash
npm install
```

### 2. Crear las tablas en Supabase
1. Ve a [supabase.com](https://supabase.com) y crea un proyecto gratuito
2. Ve a **SQL Editor → New Query**
3. Pega el contenido de `schema.sql` y ejecútalo
4. Crea las 4 tablas: `usuarios`, `modulos`, `modulos_estudiantes`, `tareas`

### 3. Obtener las credenciales
En tu proyecto de Supabase ve a **Settings → API**:
- `Project URL` → `SUPABASE_URL`
- `service_role` key (secret) → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Crear el archivo `.env`
```bash
cp .env.example .env
```
Rellena los valores:
```env
SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=una_clave_secreta_muy_larga_y_segura
JWT_EXPIRES_IN=7d
PORT=3000
```

### 5. Poblar la base de datos
```bash
npm run seed
```
Inserta de una sola vez:
- **18 módulos** (DAW×7, DAM×5, ASIR×3, SMR×3)
- **5 usuarios** (1 admin + 4 estudiantes demo, uno por ciclo)
- **Asignaciones automáticas** de módulos a cada estudiante
- **~50 tareas demo** repartidas entre todos los ciclos

Para borrar todo y empezar desde cero:
```bash
npm run seed:reset
```

### 6. Arrancar
```bash
# Desarrollo con hot reload
npm run dev

# Producción
npm start
```

---

## 👤 Usuarios del seed

| Email | Contraseña | Rol | Ciclo |
|-------|-----------|-----|-------|
| admin@admin.com | admin123 | administrador | DAW |
| maria@demo.com | 123456 | estudiante | DAW |
| carlos@demo.com | 123456 | estudiante | DAM |
| ana@demo.com | 123456 | estudiante | ASIR |
| pedro@demo.com | 123456 | estudiante | SMR |

---

## 📡 Endpoints

Base URL: `http://localhost:3000/api`

### Auth
| Método | Ruta | Auth |
|--------|------|------|
| POST | `/auth/register` | ❌ |
| POST | `/auth/login` | ❌ |
| GET | `/auth/me` | ✅ token |

**Login:**
```json
{ "email": "maria@demo.com", "password": "123456" }
```
**Respuesta:**
```json
{
  "ok": true,
  "data": {
    "token": "eyJhbGci...",
    "usuario": { "id": "...", "nombre": "María García", "rol": "estudiante" }
  }
}
```
> Usa el token: `Authorization: Bearer <token>`

### Usuarios (admin)
| Método | Ruta |
|--------|------|
| GET | `/usuarios` |
| GET | `/usuarios/:id` |
| PUT | `/usuarios/:id` |
| DELETE | `/usuarios/:id` |

### Módulos
| Método | Ruta | Notas |
|--------|------|-------|
| GET | `/modulos` | Admite `?ciclo=DAW` |
| GET | `/modulos/:id` | |
| POST | `/modulos` | Solo admin |
| PUT | `/modulos/:id` | Solo admin |
| DELETE | `/modulos/:id` | Solo admin |

### Módulos-Estudiantes
| Método | Ruta |
|--------|------|
| GET | `/modulos-estudiantes/estudiante/:estudianteId` |
| GET | `/modulos-estudiantes/modulo/:moduloId` |
| GET | `/modulos-estudiantes/:id` |
| POST | `/modulos-estudiantes` |
| PUT | `/modulos-estudiantes/:id` |
| DELETE | `/modulos-estudiantes/:id` |

**Actualizar notas:**
```json
{
  "estado": "aprobado",
  "nota_trimestre1": 7.5,
  "nota_trimestre2": 8.0,
  "nota_ordinaria": 8.2
}
```

### Tareas
| Método | Ruta |
|--------|------|
| GET | `/tareas/modulo/:moduloId/estudiante/:estudianteId` |
| GET | `/tareas/modulo/:moduloId` |
| GET | `/tareas/estudiante/:estudianteId` |
| GET | `/tareas/:id` |
| POST | `/tareas` |
| PUT | `/tareas/:id` |
| DELETE | `/tareas/:id` |

**Crear tarea:**
```json
{
  "modulo_id": "uuid",
  "estudiante_id": "uuid",
  "titulo": "Proyecto final",
  "descripcion": "...",
  "fecha_vencimiento": "2026-06-15T23:59:00.000Z",
  "estado": "pendiente"
}
```

---

## 🗂️ Estructura del proyecto

```
api_tareas/
├── schema.sql               ← Ejecutar en Supabase SQL Editor
├── .env.example             ← Copiar a .env y rellenar
├── package.json
└── src/
    ├── index.js             ← Entrada principal Express
    ├── db/
    │   └── supabase.js      ← Cliente Supabase
    ├── middleware/
    │   ├── auth.js          ← JWT + verificación de rol
    │   └── errorHandler.js
    ├── services/            ← Lógica + acceso a Supabase
    │   ├── auth.service.js
    │   ├── usuarios.service.js
    │   ├── modulos.service.js
    │   ├── modulosEstudiantes.service.js
    │   └── tareas.service.js
    ├── controllers/         ← Manejadores HTTP
    │   ├── auth.controller.js
    │   ├── usuarios.controller.js
    │   ├── modulos.controller.js
    │   ├── modulosEstudiantes.controller.js
    │   └── tareas.controller.js
    ├── routes/              ← Rutas Express
    │   ├── auth.routes.js
    │   ├── usuarios.routes.js
    │   ├── modulos.routes.js
    │   ├── modulosEstudiantes.routes.js
    │   └── tareas.routes.js
    └── seed/
        └── seed.js          ← Poblar la BD de una vez
```

---

## 🔄 Equivalencia con el proyecto original

| localStorage | Supabase |
|-------------|---------|
| `usuarios` | tabla `usuarios` |
| `modulos` | tabla `modulos` |
| `modulosEstudiantes` | tabla `modulos_estudiantes` |
| `tareas` | tabla `tareas` |
| `sessionUser` | JWT en header `Authorization` |
| `inicializarModulosEstudiante()` | Se llama automáticamente al hacer register |
| `inicializarTareasMock()` | `npm run seed` |
