'use strict';

const DB = (() => {
  const KEY = 'ldhub_data';

  function getExampleMessages() {
    const now = Date.now();
    return [
      { id: 'msg_ex1', name: 'João Silva',      message: 'Olá! Gostaria de saber mais sobre o pacote Professional. Qual o prazo de entrega e o que está incluso?',                                         read: false, createdAt: new Date(now - 1  * 60 * 60 * 1000).toISOString() },
      { id: 'msg_ex2', name: 'Carla Mendes',    message: 'Oi! Vi seu portfólio e adorei os projetos. Tenho interesse em um site para minha empresa. Podemos conversar?',                                    read: false, createdAt: new Date(now - 4  * 60 * 60 * 1000).toISOString() },
      { id: 'msg_ex3', name: 'Pedro Alves',     message: 'Bom dia! Quero contratar o pacote Starter para uma landing page de vendas. Como faço para iniciar o projeto?',                                   read: true,  createdAt: new Date(now - 22 * 60 * 60 * 1000).toISOString() },
      { id: 'msg_ex4', name: 'Ana Lima',        message: 'Olá Luís! Preciso de um site completo com integração de pagamento. Isso está no escopo do pacote Advanced?',                                     read: false, createdAt: new Date(now - 2  * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'msg_ex5', name: 'Marcos Ferreira', message: 'Boa tarde! Vi que você trabalha com Go também. Preciso de uma API REST para um projeto. Podemos conversar sobre orçamento e prazo?',             read: true,  createdAt: new Date(now - 3  * 24 * 60 * 60 * 1000).toISOString() }
    ];
  }

  const DEFAULT = {
    users:    [],
    roles:    [{ id: 'preview', name: 'Preview', permissions: ['all'] }],
    messages: []
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) {
        const initial = JSON.parse(JSON.stringify(DEFAULT));
        initial.messages = getExampleMessages();
        return initial;
      }
      return JSON.parse(raw);
    } catch {
      const initial = JSON.parse(JSON.stringify(DEFAULT));
      initial.messages = getExampleMessages();
      return initial;
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  // Reseta status de leitura de todas as mensagens para não lidas
  function resetReadStatus() {
    const db = load();
    db.messages.forEach(m => { m.read = false; });
    save(db);
  }

  function getUsers()    { return load().users    || []; }
  function getRoles()    { return load().roles     || []; }
  function getMessages() { return load().messages  || []; }

  function addUser({ name, email, role }) {
    const db = load();
    db.users.push({ id: 'usr_' + Date.now(), name, email, role, createdAt: new Date().toISOString() });
    save(db);
  }

  function deleteUser(id) {
    const db = load();
    db.users = db.users.filter(u => u.id !== id);
    save(db);
  }

  function addRole({ name, permissions }) {
    const db = load();
    db.roles.push({ id: 'role_' + Date.now(), name, permissions });
    save(db);
  }

  function deleteRole(id) {
    const db = load();
    db.roles = db.roles.filter(r => r.id !== id);
    save(db);
  }

  function addMessage({ name, email, subject, message }) {
    const db = load();
    db.messages.unshift({ id: 'msg_' + Date.now(), name, email: email || '', subject: subject || '', message, read: false, createdAt: new Date().toISOString() });
    save(db);
  }

  function markRead(id, author) {
    const db = load();
    const m = db.messages.find(m => m.id === id);
    if (m) { m.read = true; m.readBy = author || null; m.readAt = new Date().toISOString(); save(db); }
  }

  function deleteMessage(id) {
    const db = load();
    db.messages = db.messages.filter(m => m.id !== id);
    save(db);
  }

  return { load, save, resetReadStatus, getUsers, addUser, deleteUser, getRoles, addRole, deleteRole, getMessages, addMessage, markRead, deleteMessage };
})();
