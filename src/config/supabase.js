const { createClient } = require('@supabase/supabase-js');

// Usamos a Service Role Key para ignorar RLS (Row Level Security)
// já que o backend é um ambiente seguro.
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;