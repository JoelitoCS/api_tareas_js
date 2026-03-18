const meSvc = require('../services/modulosEstudiantes.service');

const modulosEstudiantesController = {

  async getAll(_req, res) {
    try {
      const data = await meSvc.getAll();
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await meSvc.getById(req.params.id);
      if (!data) return res.status(404).json({ ok: false, error: 'Registro no encontrado' });
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async getByEstudiante(req, res) {
    try {
      const data = await meSvc.getByEstudiante(req.params.estudianteId);
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async getByModulo(req, res) {
    try {
      const data = await meSvc.getByModulo(req.params.moduloId);
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = await meSvc.create(req.body);
      res.status(201).json({ ok: true, data });
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message });
    }
  },

  async update(req, res) {
    try {
      const data = await meSvc.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ ok: false, error: 'Registro no encontrado' });
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await meSvc.eliminar(req.params.id);
      res.json({ ok: true, message: 'Registro eliminado' });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
};

module.exports = { modulosEstudiantesController };
