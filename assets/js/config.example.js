// Copy this file to config.js (same folder) and fill in your own project's
// values from Supabase → Project Settings → API. config.js is gitignored so
// real values never get committed.
//
// The anon key is NOT a secret — Supabase's security model relies on Row
// Level Security policies, not on hiding this key. It is designed to be
// shipped to the browser. Never put your Supabase "service_role" key here
// or anywhere in client-side code — that one IS secret and stays out of
// this project entirely.
window.FNAB_AUTH_CONFIG = {
  supabaseUrl: "https://YOUR-PROJECT-REF.supabase.co",
  supabaseAnonKey: "YOUR-ANON-PUBLIC-KEY",
};
