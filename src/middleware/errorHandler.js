// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.message);
  res.status(500).json({
    ok: false,
    error: 'Error interno del servidor',
    detail: err.message,
  });
}

module.exports = { errorHandler };
