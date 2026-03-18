const { Router } = require('express');
const { tareasController } = require('../controllers/tareas.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = Router();

router.use(authMiddleware);

// GET    /api/tareas                                            → solo admin
router.get('/', adminOnly, tareasController.getAll);

// GET    /api/tareas/modulo/:moduloId/estudiante/:estudianteId → tareas de módulo+estudiante
router.get('/modulo/:moduloId/estudiante/:estudianteId', tareasController.getByModuloAndEstudiante);

// GET    /api/tareas/modulo/:moduloId                          → tareas de un módulo
router.get('/modulo/:moduloId', tareasController.getByModulo);

// GET    /api/tareas/estudiante/:estudianteId                  → tareas de un estudiante
router.get('/estudiante/:estudianteId', tareasController.getByEstudiante);

// GET    /api/tareas/:id
router.get('/:id', tareasController.getById);

// POST   /api/tareas                                           → crear tarea
router.post('/', tareasController.create);

// PUT    /api/tareas/:id                                       → actualizar tarea
router.put('/:id', tareasController.update);

// DELETE /api/tareas/:id → cualquier usuario autenticado puede borrar sus propias tareas
router.delete('/:id', tareasController.delete);

module.exports = router;
