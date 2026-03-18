const { supabase } = require('../db/supabase');

async function getAll(ciclo) {
  let query = supabase
    .from('modulos')
    .select('*')
    .order('ciclo_formativo')
    .order('curso')
    .order('nombre');

  if (ciclo) query = query.eq('ciclo_formativo', ciclo);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

async function getById(id) {
  const { data, error } = await supabase
    .from('modulos')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

async function create(dto) {
  const { data, error } = await supabase
    .from('modulos')
    .insert(dto)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function update(id, dto) {
  const { data, error } = await supabase
    .from('modulos')
    .update(dto)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

async function eliminar(id) {
  const { error } = await supabase.from('modulos').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

module.exports = { getAll, getById, create, update, eliminar };
