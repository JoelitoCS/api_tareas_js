const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../db/supabase');

/**
 * Genera un JWT firmado con los datos esenciales del usuario.
 * @param {{ id: string, email: string, rol: string, nombre: string }} usuario
 * @returns {string} token JWT
 */
function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol, nombre: usuario.nombre },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' }
  );
}

/**
 * Asigna todos los módulos del ciclo del estudiante en modulos_estudiantes.
 * Solo inserta los que no existan todavía (evita duplicados).
 */
async function inicializarModulosEstudiante(estudianteId, cicloFormativo) {
  // Obtener todos los módulos del ciclo
  const { data: modulos } = await supabase
    .from('modulos')
    .select('id')
    .eq('ciclo_formativo', cicloFormativo);

  if (!modulos || modulos.length === 0) return;

  // Obtener los que ya tiene asignados
  const { data: existentes } = await supabase
    .from('modulos_estudiantes')
    .select('modulo_id')
    .eq('estudiante_id', estudianteId);

  const idsExistentes = new Set((existentes ?? []).map((e) => e.modulo_id));

  const nuevos = modulos
    .filter((m) => !idsExistentes.has(m.id))
    .map((m) => ({
      modulo_id: m.id,
      estudiante_id: estudianteId,
      estado: 'cursando',
    }));

  if (nuevos.length > 0) {
    await supabase.from('modulos_estudiantes').insert(nuevos);
  }
}

/**
 * Registra un nuevo usuario.
 * Si es estudiante, le asigna automáticamente los módulos de su ciclo.
 */
async function register(dto) {
  // Comprobar si el email ya existe
  const { data: existe } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', dto.email)
    .maybeSingle();

  if (existe) throw new Error('El email ya está registrado');

  const password_hash = await bcrypt.hash(dto.password, 10);

  const { data, error } = await supabase
    .from('usuarios')
    .insert({
      nombre: dto.nombre,
      email: dto.email,
      password_hash,
      ciclo_formativo: dto.ciclo_formativo,
      rol: dto.rol ?? 'estudiante',
    })
    .select('id, nombre, email, ciclo_formativo, rol, created_at')
    .single();

  if (error) throw new Error(error.message);

  // Si es estudiante, inicializar sus módulos automáticamente
  if (data.rol === 'estudiante') {
    await inicializarModulosEstudiante(data.id, data.ciclo_formativo);
  }

  const token = generarToken(data);
  return { token, usuario: data };
}

/**
 * Login: verifica email y contraseña, devuelve JWT + datos del usuario.
 */
async function login(dto) {
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', dto.email)
    .maybeSingle();

  if (error || !usuario) throw new Error('El usuario no existe');

  const coincide = await bcrypt.compare(dto.password, usuario.password_hash);
  if (!coincide) throw new Error('Contraseña incorrecta');

  const token = generarToken(usuario);

  // Eliminar password_hash de la respuesta
  const { password_hash, ...usuarioSinPassword } = usuario;
  return { token, usuario: usuarioSinPassword };
}

module.exports = { register, login, inicializarModulosEstudiante };
