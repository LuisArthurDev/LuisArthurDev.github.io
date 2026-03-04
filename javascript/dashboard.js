'use strict';

const Dashboard = (() => {

  function init() {
    if (!Auth.requireSession()) return;

    document.querySelectorAll('.dash-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        navigateTo(btn.dataset.section);
        closeSidebar();
      });
    });

    document.getElementById('dash-hamburger').addEventListener('click', openSidebar);
    document.getElementById('sidebar-close').addEventListener('click', closeSidebar);
    document.getElementById('dash-overlay').addEventListener('click', closeSidebar);

    const session = Auth.getSession();
    const chip = document.getElementById('dash-user-chip');
    if (session && chip) {
      chip.innerHTML = `
        <div class="user-avatar">P</div>
        <div class="user-info-text">
          <span class="user-name">${session.name}</span>
          <span class="user-role-label">preview@luisdevhub.com</span>
        </div>`;
      chip.addEventListener('click', () => openModal('modal-profile'));
    }

    loadOverview();
    updateUnreadBadge();
    requestNotificationPermission();
    if ('Notification' in window) updateNotifStatus(Notification.permission);
    startMessagePolling();
  }

  // ---------- Navigation ----------

  const TITLES = { overview: 'Visão Geral', messages: 'Mensagens', users: 'Usuários', roles: 'Cargos' };

  function navigateTo(section) {
    document.querySelectorAll('.dash-nav-btn').forEach(b => b.classList.toggle('active', b.dataset.section === section));
    document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`section-${section}`).classList.add('active');
    document.getElementById('dash-page-title').textContent = TITLES[section] || section;

    if (section === 'overview') loadOverview();
    if (section === 'messages') loadMessages();
    if (section === 'users')    loadUsers();
    if (section === 'roles')    loadRoles();
  }

  function openSidebar()  { document.getElementById('dash-sidebar').classList.add('open');    document.getElementById('dash-overlay').classList.add('visible'); }
  function closeSidebar() { document.getElementById('dash-sidebar').classList.remove('open'); document.getElementById('dash-overlay').classList.remove('visible'); }

  // ---------- Overview ----------

  function loadOverview() {
    const messages = DB.getMessages();
    const users    = DB.getUsers();
    const roles    = DB.getRoles();
    const unread   = messages.filter(m => !m.read).length;

    document.getElementById('overview-cards').innerHTML = `
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(14,165,233,.15);color:var(--primaria)"><i class="fa-solid fa-envelope"></i></div>
        <div><p class="stat-label">Mensagens</p><h2 class="stat-value">${messages.length}</h2></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(251,191,36,.15);color:#FBBF24"><i class="fa-solid fa-bell"></i></div>
        <div><p class="stat-label">Não lidas</p><h2 class="stat-value">${unread}</h2></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(37,211,102,.15);color:#25D366"><i class="fa-solid fa-users"></i></div>
        <div><p class="stat-label">Usuários</p><h2 class="stat-value">${users.length + 1}</h2></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(167,139,250,.15);color:#A78BFA"><i class="fa-solid fa-shield-halved"></i></div>
        <div><p class="stat-label">Cargos</p><h2 class="stat-value">${roles.length}</h2></div>
      </div>`;

    const recent = messages.slice(0, 5);
    document.getElementById('recent-messages').innerHTML = recent.length
      ? recent.map(m => msgCard(m, true)).join('')
      : '<p class="empty-state">Nenhuma mensagem ainda.</p>';
  }

  // ---------- Messages ----------

  function loadMessages() {
    const messages = DB.getMessages();
    document.getElementById('messages-list').innerHTML = messages.length
      ? messages.map(m => msgCard(m, false)).join('')
      : '<p class="empty-state">Nenhuma mensagem.</p>';
    updateUnreadBadge();
  }

  function msgCard(m, compact) {
    const date = new Date(m.createdAt).toLocaleString('pt-BR');
    const isExample = m.id.startsWith('msg_ex');
    return `
      <div class="msg-item ${m.read ? 'read' : 'unread'}" id="msg-${m.id}">
        ${isExample ? '<div class="example-msg-notice"><i class="fa-solid fa-rotate-left"></i> Mensagem de exemplo — volta para não lida ao sair</div>' : ''}
        <div class="msg-top">
          <div class="msg-sender">
            <span class="msg-name"><i class="fa-solid fa-user"></i> ${m.name}</span>
            ${m.email ? `<a class="msg-email" href="mailto:${m.email}">${m.email}</a>` : ''}
          </div>
          <div class="msg-top-right">
            ${!m.read ? '<span class="msg-new">Nova</span>' : ''}
            <span class="msg-date">${date}</span>
          </div>
        </div>
        ${m.subject ? `<p class="msg-subject"><i class="fa-solid fa-tag"></i> ${m.subject}</p>` : ''}
        <p class="msg-text">${m.message}</p>
        ${m.readBy ? `<div class="msg-read-by"><i class="fa-solid fa-check-double"></i> Lida por <strong>${m.readBy}</strong> em ${new Date(m.readAt).toLocaleString('pt-BR')}</div>` : ''}
        ${!compact ? `
          <div class="msg-actions">
            ${!m.read ? `<button class="btn-sm btn-outline" onclick="Dashboard.markRead('${m.id}')"><i class="fa-solid fa-check"></i> Marcar lida</button>` : ''}
            <button class="btn-sm btn-danger" onclick="Dashboard.deleteMsg('${m.id}')"><i class="fa-solid fa-trash"></i> Excluir</button>
          </div>` : ''}
      </div>`;
  }

  function markRead(id) {
    const author = (Auth.getSession() || {}).name || 'Preview';
    DB.markRead(id, author);
    loadMessages();
    updateUnreadBadge();
  }

  function deleteMsg(id) {
    if (!confirm('Excluir esta mensagem?')) return;
    DB.deleteMessage(id);
    loadMessages();
  }

  function updateUnreadBadge() {
    const unread = DB.getMessages().filter(m => !m.read).length;
    const badge  = document.getElementById('nav-unread');
    badge.textContent   = unread;
    badge.style.display = unread > 0 ? 'inline-flex' : 'none';
  }

  // ---------- Users ----------

  function loadUsers() {
    const users = DB.getUsers();
    const roles = DB.getRoles();

    document.getElementById('new-role').innerHTML = roles.map(r => `<option value="${r.id}">${r.name}</option>`).join('');

    document.getElementById('users-list').innerHTML = `
      <div class="table-wrapper">
        <table class="dash-table">
          <thead><tr><th>Nome</th><th>E-mail</th><th>Cargo</th><th>Criado em</th><th></th></tr></thead>
          <tbody>
            <tr>
              <td><span class="user-avatar-sm">P</span> Preview</td>
              <td>preview@luisdevhub.com</td>
              <td><span class="role-chip">Preview</span></td>
              <td>—</td>
              <td></td>
            </tr>
            ${users.map(u => `
              <tr>
                <td><span class="user-avatar-sm">${u.name.charAt(0).toUpperCase()}</span> ${u.name}</td>
                <td>${u.email}</td>
                <td><span class="role-chip">${u.role}</span></td>
                <td>${new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
                <td><button class="btn-sm btn-danger" onclick="Dashboard.deleteUser('${u.id}')"><i class="fa-solid fa-trash"></i></button></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  }

  function submitUser(event) {
    event.preventDefault();
    DB.addUser({
      name:  document.getElementById('new-name').value,
      email: document.getElementById('new-email').value,
      role:  document.getElementById('new-role').value
    });
    closeModal('modal-user');
    event.target.reset();
    loadUsers();
    loadOverview();
  }

  function deleteUser(id) {
    if (!confirm('Excluir este usuário?')) return;
    DB.deleteUser(id);
    loadUsers();
    loadOverview();
  }

  // ---------- Roles ----------

  function loadRoles() {
    const roles = DB.getRoles();
    document.getElementById('roles-list').innerHTML = roles.length ? `
      <div class="table-wrapper">
        <table class="dash-table">
          <thead><tr><th>Nome</th><th>ID</th><th>Permissões</th><th></th></tr></thead>
          <tbody>
            ${roles.map(r => `
              <tr>
                <td>${r.name}</td>
                <td><code>${r.id}</code></td>
                <td><span class="role-chip">${r.permissions.join(', ')}</span></td>
                <td>${r.id !== 'preview'
                  ? `<button class="btn-sm btn-danger" onclick="Dashboard.deleteRole('${r.id}')"><i class="fa-solid fa-trash"></i></button>`
                  : ''}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>` : '<p class="empty-state">Nenhum cargo.</p>';
  }

  function submitRole(event) {
    event.preventDefault();
    const perms = [...document.querySelectorAll('#modal-role input[type="checkbox"]:checked')].map(cb => cb.value);
    const permsError = document.getElementById('perms-error');
    if (!perms.length) { permsError.style.display = 'block'; return; }
    permsError.style.display = 'none';
    DB.addRole({ name: document.getElementById('new-role-name').value, permissions: perms });
    closeModal('modal-role');
    event.target.reset();
    loadRoles();
    loadOverview();
  }

  function deleteRole(id) {
    if (!confirm('Excluir este cargo?')) return;
    DB.deleteRole(id);
    loadRoles();
    loadOverview();
  }

  // ---------- Notifications ----------

  function roleHasNotificationPermission() {
    const previewRole = DB.getRoles().find(r => r.id === 'preview');
    if (!previewRole) return false;
    return previewRole.permissions.includes('all') || previewRole.permissions.includes('notifications');
  }

  let _notifMuted = false;

  function requestNotificationPermission() {
    if (!roleHasNotificationPermission() || !('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      _notifMuted = !_notifMuted;
      updateNotifStatus('granted');
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(updateNotifStatus);
    }
  }

  function updateNotifStatus(permission) {
    const btn = document.getElementById('notif-status-btn');
    if (!btn) return;
    if (permission === 'granted') {
      if (_notifMuted) {
        btn.innerHTML = '<i class="fa-solid fa-bell-slash"></i> Notificações pausadas';
        btn.dataset.status = 'muted';
      } else {
        btn.innerHTML = '<i class="fa-solid fa-bell"></i> Notificações ativas';
        btn.dataset.status = 'granted';
      }
    } else if (permission === 'denied') {
      btn.innerHTML = '<i class="fa-solid fa-bell-slash"></i> Notificações bloqueadas';
      btn.dataset.status = 'denied';
    } else {
      btn.innerHTML = '<i class="fa-solid fa-bell"></i> Ativar notificações';
      btn.dataset.status = 'default';
    }
  }

  let _lastMsgCount = 0;

  function _handleNewMessages(msgs) {
    if (msgs.length <= _lastMsgCount) return;
    const newMsgs = msgs.slice(0, msgs.length - _lastMsgCount);
    _lastMsgCount = msgs.length;
    if (roleHasNotificationPermission()) newMsgs.forEach(notifyNewMessage);
    updateUnreadBadge();
    const active = document.querySelector('.dash-nav-btn.active');
    if (active) {
      const s = active.dataset.section;
      if (s === 'messages') loadMessages();
      else if (s === 'overview') loadOverview();
    }
  }

  function startMessagePolling() {
    _lastMsgCount = DB.getMessages().length;
    // Polling: funciona em file:// e http/https
    setInterval(() => _handleNewMessages(DB.getMessages()), 3000);
    // Storage event: dispara instantaneamente entre abas em http/https
    window.addEventListener('storage', (e) => {
      if (e.key !== 'ldhub_data' || !e.newValue) return;
      _handleNewMessages(JSON.parse(e.newValue).messages || []);
    });
  }

  function notifyNewMessage(msg) {
    if (_notifMuted || !('Notification' in window) || Notification.permission !== 'granted') return;
    const n = new Notification('Nova mensagem no painel!', {
      body: `De: ${msg.name}${msg.subject ? ' — ' + msg.subject : ''}\n${msg.message.substring(0, 80)}`,
      icon: './images/logo.png',
      tag: 'ldhub-msg-' + msg.id,
    });
    n.onclick = () => { window.focus(); n.close(); };
  }

  // ---------- Modals ----------

  function openModal(id)  { document.getElementById(id).style.display = 'flex'; }
  function closeModal(id) { document.getElementById(id).style.display = 'none'; }

  let _noticeTimeout;
  function showFullSystemNotice() {
    const el = document.getElementById('full-system-notice');
    el.style.display = 'flex';
    clearTimeout(_noticeTimeout);
    _noticeTimeout = setTimeout(() => { el.style.display = 'none'; }, 3000);
  }

  return { init, navigateTo, markRead, deleteMsg, loadUsers, submitUser, deleteUser, loadRoles, submitRole, deleteRole, openModal, closeModal, showFullSystemNotice, requestNotificationPermission };
})();

document.addEventListener('DOMContentLoaded', Dashboard.init);
