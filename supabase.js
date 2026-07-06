/* =========================================================================
   SUPABASE CONNECTION
   This file creates ONE Supabase client and makes it available to
   script.js as `supabaseClient`. It must be loaded BEFORE script.js
   (see index.html — the <script> order matters).
   ========================================================================= */

const supabaseUrl = "https://mtlofcymyrtvaeiwhgnl.supabase.co";

// This is your "publishable" (anon) key. It is SAFE to expose in
// front-end code — it only lets people do what your Row Level Security
// (RLS) policies in supabase_schema.sql allow (e.g. "only touch your own rows").
// Never put your secret/service_role key in front-end code.
const supabaseKey = "sb_publishable_2O6wK99MVGr7O2TrqUs1lg_6CmiesU6";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

console.log("✅ Supabase Connected");
