const modulosSvc = require('../services/modulos.service');

const modulosController = {

  async getAll(req, res) {
    try {
      const ciclo = req.query.ciclo;
      const data = await modulosSvc.getAll(ciclo);
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await modulosSvc.getById(req.params.id);
      if (!data) return res.status(404).json({ ok: false, error: 'Módulo no encontrado' });
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = await modulosSvc.create(req.body);
      res.status(201).json({ ok: true, data });
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message });
    }
  },

  async update(req, res) {
    try {
      const data = await modulosSvc.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ ok: false, error: 'Módulo no encontrado' });
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await modulosSvc.eliminar(req.params.id);
      res.json({ ok: true, message: 'Módulo eliminado' });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
};

module.exports = { modulosController };
