const { supabase } = require('../db/supabase');

async function getAll() {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nombre, email, ciclo_formativo, rol, created_at')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

async function getById(id) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nombre, email, ciclo_formativo, rol, created_at')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

async function update(id, campos) {
  const { data, error } = await supabase
    .from('usuarios')
    .update(campos)
    .eq('id', id)
    .select('id, nombre, email, ciclo_formativo, rol, created_at')
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

async function eliminar(id) {
  const { error } = await supabase.from('usuarios').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

module.exports = { getAll, getById, update, eliminar };
