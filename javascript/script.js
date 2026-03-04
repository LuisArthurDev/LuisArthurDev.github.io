const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-menu ul');

// Accordion helper
function makeAccordion(toggleId, formId) {
  const toggle   = document.getElementById(toggleId);
  const form     = document.getElementById(formId);
  const chevron  = toggle.querySelector('.contact-chevron');
  toggle.addEventListener('click', () => {
    const isOpen = form.classList.toggle('active');
    toggle.classList.toggle('active', isOpen);
    chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  });
}

makeAccordion('whatsapp-toggle', 'form-whatsapp');
makeAccordion('direct-toggle',   'form-direct');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.querySelector('i').className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.querySelector('i').className = 'fa-solid fa-bars';
  });
});

async function sendDirectMessage(event) {
  event.preventDefault();

  const name    = document.getElementById('direct-name').value.trim();
  const email   = document.getElementById('direct-email').value.trim();
  const subject = document.getElementById('direct-subject').value.trim();
  const message = document.getElementById('direct-message').value.trim();

  if (!name || !email || !subject || !message) { alert('Preencha todos os campos!'); return; }

  const btn      = event.target.querySelector('button[type="submit"]');
  const feedback = document.getElementById('direct-feedback');

  btn.disabled = true;
  btn.textContent = 'Enviando...';

  try {
    await DB.addMessage({ name, email, subject, message });
    event.target.reset();
    feedback.style.display = 'block';
    feedback.innerHTML = '<p class="direct-success"><i class="fa-solid fa-circle-check"></i> Mensagem enviada com sucesso!</p>';
    setTimeout(() => {
      feedback.style.display = 'none';
      document.getElementById('form-direct').classList.remove('active');
      document.getElementById('direct-toggle').classList.remove('active');
      document.getElementById('direct-toggle').querySelector('.contact-chevron').style.transform = 'rotate(0deg)';
    }, 3000);
  } catch {
    feedback.style.display = 'block';
    feedback.innerHTML = '<p class="direct-error"><i class="fa-solid fa-circle-exclamation"></i> Erro ao enviar. Tente novamente.</p>';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Enviar Mensagem';
  }
}

async function sendWhatsapp(event) {
  event.preventDefault();

  const clientname = document.getElementById('name').value;
  const message    = document.getElementById('message').value;
  const telefone   = '5524992905233';

  if (!clientname || !message) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    await DB.addMessage({ name: clientname, message });
  } catch (e) {
    console.error('Erro ao salvar mensagem:', e);
  }

  const text = `Olá! Me chamo ${clientname}, ${message}`;
  const url  = `https://wa.me/${telefone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

