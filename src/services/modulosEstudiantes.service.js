const { supabase } = require('../db/supabase');

async function getAll() {
  const { data, error } = await supabase
    .from('modulos_estudiantes')
    .select('*')
    .order('created_at');

  if (error) throw new Error(error.message);
  return data ?? [];
}

async function getById(id) {
  const { data, error } = await supabase
    .from('modulos_estudiantes')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

async function getByEstudiante(estudianteId) {
  const { data, error } = await supabase
    .from('modulos_estudiantes')
    .select(`
      *,
      modulos (id, nombre, curso, ciclo_formativo)
    `)
    .eq('estudiante_id', estudianteId)
    .order('created_at');

  if (error) throw new Error(error.message);
  return data ?? [];
}

async function getByModulo(moduloId) {
  const { data, error } = await supabase
    .from('modulos_estudiantes')
    .select(`
      *,
      usuarios (id, nombre, email, ciclo_formativo)
    `)
    .eq('modulo_id', moduloId);

  if (error) throw new Error(error.message);
  return data ?? [];
}

async function create(dto) {
  const { data, error } = await supabase
    .from('modulos_estudiantes')
    .insert({
      modulo_id: dto.modulo_id,
      estudiante_id: dto.estudiante_id,
      estado: dto.estado ?? 'cursando',
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function update(id, dto) {
  const { data, error } = await supabase
    .from('modulos_estudiantes')
    .update(dto)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

async function eliminar(id) {
  const { error } = await supabase.from('modulos_estudiantes').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

module.exports = { getAll, getById, getByEstudiante, getByModulo, create, update, eliminar };
