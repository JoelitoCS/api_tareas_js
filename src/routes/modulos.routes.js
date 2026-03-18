const { Router } = require('express');
const { modulosController } = require('../controllers/modulos.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = Router();

router.use(authMiddleware);

// GET    /api/modulos           → admite ?ciclo=DAW para filtrar
router.get('/', modulosController.getAll);

// GET    /api/modulos/:id
router.get('/:id', modulosController.getById);

// POST   /api/modulos           → solo admin
router.post('/', adminOnly, modulosController.create);

// PUT    /api/modulos/:id       → solo admin
router.put('/:id', adminOnly, modulosController.update);

// DELETE /api/modulos/:id       → solo admin
router.delete('/:id', adminOnly, modulosController.delete);

module.exports = router;
