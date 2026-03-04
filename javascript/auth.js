'use strict';

const Auth = (() => {
  const SESSION_KEY    = 'ldhub_session';
  const PREVIEW_EMAIL  = 'preview@luisdevhub.com';
  const PREVIEW_PASS   = 'preview123';

  function login(email, password) {
    if (email === PREVIEW_EMAIL && password === PREVIEW_PASS) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: 'Preview', email }));
      return { ok: true };
    }
    return { ok: false, error: 'Credenciais inválidas.' };
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = './login.html';
  }

  function getSession() {
    const s = sessionStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  }

  function requireSession() {
    const session = getSession();
    if (!session) { window.location.href = './login.html'; return null; }
    return session;
  }

  return { login, logout, getSession, requireSession };
})();
