require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const authRoutes               = require('./routes/auth.routes');
const usuariosRoutes           = require('./routes/usuarios.routes');
const modulosRoutes            = require('./routes/modulos.routes');
const modulosEstudiantesRoutes = require('./routes/modulosEstudiantes.routes');
const tareasRoutes             = require('./routes/tareas.routes');
const { errorHandler }         = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT ?? 3000;

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,        // añade tu dominio de producción en Railway como variable de entorno
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permite peticiones sin origin (curl, Postman, apps móviles)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS bloqueado para el origen: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Responde a los preflights OPTIONS de forma explícita
app.options('*', cors());

// ─── Middlewares globales ─────────────────────────────────────────────────────
app.use(express.json());
app.use(morgan('dev'));

// ─── Rutas ────────────────────────────────────────────────────────────────────
app.use('/api/auth',                authRoutes);
app.use('/api/usuarios',            usuariosRoutes);
app.use('/api/modulos',             modulosRoutes);
app.use('/api/modulos-estudiantes', modulosEstudiantesRoutes);
app.use('/api/tareas',              tareasRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'API funcionando', timestamp: new Date().toISOString() });
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ ok: false, error: 'Ruta no encontrada' });
});

// ─── Error handler global ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Arranque ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  API corriendo en http://localhost:${PORT}`);
  console.log(`📋  Health: http://localhost:${PORT}/health`);
  console.log(`\nEndpoints principales:`);
  console.log(`  POST  /api/auth/register`);
  console.log(`  POST  /api/auth/login`);
  console.log(`  GET   /api/modulos?ciclo=DAW`);
  console.log(`  GET   /api/modulos-estudiantes/estudiante/:id`);
  console.log(`  GET   /api/tareas/modulo/:mId/estudiante/:eId`);
  console.log(`\n📦  Seed: npm run seed\n`);
});

module.exports = app;
