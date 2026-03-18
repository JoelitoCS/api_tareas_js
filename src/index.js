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

// ─── Middlewares globales ─────────────────────────────────────────────────────
app.use(cors());
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
