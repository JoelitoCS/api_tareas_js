const jwt = require('jsonwebtoken');

/**
 * Verifica el JWT del header Authorization.
 * Si es válido, guarda el payload en req.usuario y llama a next().
 * Si no, responde 401.
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, error: 'Token no proporcionado' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch {
    res.status(401).json({ ok: false, error: 'Token inválido o expirado' });
  }
}

/**
 * Verifica que el usuario autenticado sea administrador.
 * Debe usarse siempre DESPUÉS de authMiddleware.
 */
function adminOnly(req, res, next) {
  if (req.usuario?.rol !== 'administrador') {
    return res.status(403).json({ ok: false, error: 'Acceso restringido a administradores' });
  }
  next();
}

module.exports = { authMiddleware, adminOnly };
