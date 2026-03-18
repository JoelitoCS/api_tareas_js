const tareasSvc = require('../services/tareas.service');

const tareasController = {

  async getAll(_req, res) {
    try {
      const data = await tareasSvc.getAll();
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await tareasSvc.getById(req.params.id);
      if (!data) return res.status(404).json({ ok: false, error: 'Tarea no encontrada' });
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async getByModulo(req, res) {
    try {
      const data = await tareasSvc.getByModulo(req.params.moduloId);
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async getByEstudiante(req, res) {
    try {
      const data = await tareasSvc.getByEstudiante(req.params.estudianteId);
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async getByModuloAndEstudiante(req, res) {
    try {
      const { moduloId, estudianteId } = req.params;
      const data = await tareasSvc.getByModuloAndEstudiante(moduloId, estudianteId);
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async create(req, res) {
    try {
      const data = await tareasSvc.create(req.body);
      res.status(201).json({ ok: true, data });
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message });
    }
  },

  async update(req, res) {
    try {
      const data = await tareasSvc.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ ok: false, error: 'Tarea no encontrada' });
      res.json({ ok: true, data });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await tareasSvc.eliminar(req.params.id);
      res.json({ ok: true, message: 'Tarea eliminada' });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
};

module.exports = { tareasController };
