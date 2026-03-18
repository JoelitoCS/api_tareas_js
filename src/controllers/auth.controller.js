const authService = require('../services/auth.service');

const authController = {

  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ ok: true, data: result });
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message });
    }
  },

  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      res.json({ ok: true, data: result });
    } catch (err) {
      res.status(401).json({ ok: false, error: err.message });
    }
  },

  me(req, res) {
    res.json({ ok: true, data: req.usuario });
  },
};

module.exports = { authController };
