const { Router } = require('express');
const { usuariosController } = require('../controllers/usuarios.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = Router();

router.use(authMiddleware);

// GET    /api/usuarios          → solo admin
router.get('/', adminOnly, usuariosController.getAll);

// GET    /api/usuarios/:id
router.get('/:id', usuariosController.getById);

// PUT    /api/usuarios/:id      → solo admin
router.put('/:id', adminOnly, usuariosController.update);

// DELETE /api/usuarios/:id      → solo admin
router.delete('/:id', adminOnly, usuariosController.delete);

module.exports = router;
