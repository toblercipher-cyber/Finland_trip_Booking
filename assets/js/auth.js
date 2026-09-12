// Thin wrapper around the Supabase JS client. All real work — password
// hashing, credential checks, Google OAuth token exchange, session issuance —
// happens on Supabase's servers, never in this file. This file only calls
// their API and reacts to the result.

const AUTH_CONFIG = window.FNAB_AUTH_CONFIG || {};
const IS_CONFIGURED =
  Boolean(AUTH_CONFIG.supabaseUrl) &&
  Boolean(AUTH_CONFIG.supabaseAnonKey) &&
  !AUTH_CONFIG.supabaseUrl.includes("YOUR-PROJECT-REF") &&
  !AUTH_CONFIG.supabaseAnonKey.includes("YOUR-ANON-PUBLIC-KEY");

const client = IS_CONFIGURED
  ? window.supabase.createClient(AUTH_CONFIG.supabaseUrl, AUTH_CONFIG.supabaseAnonKey)
  : null;

function configWarning() {
  return "Authentication isn't configured yet — copy assets/js/config.example.js to assets/js/config.js and fill in your Supabase project URL and anon key.";
}

async function signUp(email, password) {
  if (!client) return { error: { message: configWarning() } };
  return client.auth.signUp({ email, password });
}

async function signIn(email, password) {
  if (!client) return { error: { message: configWarning() } };
  return client.auth.signInWithPassword({ email, password });
}

async function signInWithGoogle(redirectPath) {
  if (!client) {
    alert(configWarning());
    return;
  }
  const target = redirectPath || "checkout.html";
  const basePath = window.location.pathname.replace(/[^/]*$/, "");
  return client.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin + basePath + target },
  });
}

async function signOut() {
  if (!client) return;
  await client.auth.signOut();
  window.location.href = "login.html";
}

async function getSession() {
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data.session;
}

// Call at the top of any page that must be signed-in-only. Redirects to
// login.html (preserving where the user was headed) when there's no session.
async function requireAuth() {
  const session = await getSession();
  if (!session) {
    const here = window.location.pathname.split("/").pop();
    window.location.href = `login.html?redirect=${encodeURIComponent(here)}`;
    return null;
  }
  return session;
}

// Injects a login/logout control into the page header so every page shows
// real auth state instead of pretending the user is always signed out.
async function renderAuthNav() {
  const nav = document.querySelector(".header__nav");
  if (!nav) return;

  const slot = document.createElement("span");
  slot.className = "header__nav-auth";
  nav.appendChild(slot);

  if (!client) {
    slot.innerHTML = `<a href="login.html">LOG IN</a>`;
    return;
  }

  const session = await getSession();
  if (session) {
    slot.innerHTML = `<button type="button" class="header__nav-auth-btn" id="nav-logout">LOG OUT</button>`;
    slot.querySelector("#nav-logout").addEventListener("click", signOut);
  } else {
    slot.innerHTML = `<a href="login.html">LOG IN</a>`;
  }
}

window.FNAB_AUTH = { signUp, signIn, signInWithGoogle, signOut, getSession, requireAuth, renderAuthNav, isConfigured: IS_CONFIGURED };
