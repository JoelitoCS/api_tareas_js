const { Router } = require('express');
const { modulosEstudiantesController } = require('../controllers/modulosEstudiantes.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = Router();

router.use(authMiddleware);

// GET  /api/modulos-estudiantes                           → solo admin
router.get('/', adminOnly, modulosEstudiantesController.getAll);

// GET  /api/modulos-estudiantes/estudiante/:estudianteId  → módulos de un estudiante
router.get('/estudiante/:estudianteId', modulosEstudiantesController.getByEstudiante);

// GET  /api/modulos-estudiantes/modulo/:moduloId          → estudiantes de un módulo (admin)
router.get('/modulo/:moduloId', adminOnly, modulosEstudiantesController.getByModulo);

// GET  /api/modulos-estudiantes/:id
router.get('/:id', modulosEstudiantesController.getById);

// POST /api/modulos-estudiantes                           → asignar módulo (admin)
router.post('/', adminOnly, modulosEstudiantesController.create);

// PUT  /api/modulos-estudiantes/:id                       → actualizar estado/notas
router.put('/:id', modulosEstudiantesController.update);

// DELETE /api/modulos-estudiantes/:id                     → solo admin
router.delete('/:id', adminOnly, modulosEstudiantesController.delete);

module.exports = router;
