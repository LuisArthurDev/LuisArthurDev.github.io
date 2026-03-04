'use strict';

function fillPreview() {
  document.getElementById('login-email').value    = 'preview@luisdevhub.com';
  document.getElementById('login-password').value = 'preview123';
  document.getElementById('login-error').textContent = '';
}

function doLogin(event) {
  event.preventDefault();

  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl  = document.getElementById('login-error');

  if (!email || !password) { errorEl.textContent = 'Preencha todos os campos.'; return; }

  const result = Auth.login(email, password);
  if (result.ok) {
    window.location.href = './dashboard.html';
  } else {
    errorEl.textContent = result.error;
  }
}
