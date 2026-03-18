const usuariosSvc = require('../services/usuarios.service');

const usuariosController = {

  async getAll(_req, res) {
    try {
      const data = await usuariosSvc.getAll();
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await usuariosSvc.getById(req.params.id);
      if (!data) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async update(req, res) {
    try {
      const data = await usuariosSvc.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await usuariosSvc.eliminar(req.params.id);
      res.json({ ok: true, message: 'Usuario eliminado' });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
};

module.exports = { usuariosController };
