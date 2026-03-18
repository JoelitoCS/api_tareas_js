const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Faltan variables de entorno.\n' +
    'Copia .env.example a .env y rellena SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.'
  );
}

// Usamos service_role key para que la API tenga acceso completo sin RLS
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

module.exports = { supabase };
