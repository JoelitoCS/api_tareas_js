const { supabase } = require('../db/supabase');

async function getAll() {
  const { data, error } = await supabase
    .from('tareas')
    .select('*')
    .order('fecha_creacion', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

async function getById(id) {
  const { data, error } = await supabase
    .from('tareas')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

async function getByModulo(moduloId) {
  const { data, error } = await supabase
    .from('tareas')
    .select('*')
    .eq('modulo_id', moduloId)
    .order('fecha_creacion', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

async function getByEstudiante(estudianteId) {
  const { data, error } = await supabase
    .from('tareas')
    .select('*')
    .eq('estudiante_id', estudianteId)
    .order('fecha_creacion', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

async function getByModuloAndEstudiante(moduloId, estudianteId) {
  const { data, error } = await supabase
    .from('tareas')
    .select('*')
    .eq('modulo_id', moduloId)
    .eq('estudiante_id', estudianteId)
    .order('fecha_creacion', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

async function create(dto) {
  const { data, error } = await supabase
    .from('tareas')
    .insert({
      modulo_id: dto.modulo_id,
      estudiante_id: dto.estudiante_id,
      titulo: dto.titulo,
      descripcion: dto.descripcion ?? '',
      fecha_vencimiento: dto.fecha_vencimiento ?? null,
      estado: dto.estado ?? 'pendiente',
      nota: dto.nota ?? null,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function update(id, dto) {
  const { data, error } = await supabase
    .from('tareas')
    .update(dto)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

async function eliminar(id) {
  const { error } = await supabase.from('tareas').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

module.exports = {
  getAll, getById, getByModulo, getByEstudiante,
  getByModuloAndEstudiante, create, update, eliminar,
};
