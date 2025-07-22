// --- Configuración de retos por mes ---
const retosPorMes = {
  0: [ // Enero
    "Haz una foto juntos hoy 📸",
    "Dime 3 cosas que amas de mí 💬",
    "Dibuja un corazón y mándamelo 💌",
    "Mándame nuestra canción 🎶",
    "Escríbeme una carta de amor 📝",
    "Dime una meta que quieras cumplir conmigo ✨",
    "Planea una mini cita virtual o física 💑",
    "Haz un dibujo de nosotros 🖌️",
    "Recrea una foto que tengamos juntos 📷",
    "Escribe un poema o verso para mí 📖",
    "Hazme un masaje en la espalda 💆‍♀️",
    "Prepara una cena especial 🍽️",
    "Mándame una foto sexy (solo si te animas) 🔥",
    "Bésame de forma inesperada 😘",
    "Hazme reír con un chiste nuevo 😂",
    "Planea una noche de películas juntos 🎬",
    "Dime un secreto tuyo 🤫",
    "Hazme una pregunta atrevida 🔥",
    "Dame un abrazo largo 🤗",
    "Haz una lista de deseos para este año juntos 📝",
    "Sorpréndeme con un mensaje picante 🔥",
    "Hazme un cumplido sincero 💖",
    "Baila conmigo una canción lenta 💃🕺",
    "Hazme una videollamada sorpresa 📱",
    "Dibuja algo sexy y mándamelo 🔥🎨",
    "Haz un brindis por nosotros 🥂",
    "Planea una escapada romántica (real o imaginaria) 🏖️",
    "Hazme una pregunta sobre el futuro juntos 🔮",
    "Hazme sentir especial hoy 💝",
    "Escríbeme una fantasía tuya 🔥"
  ],
  1: [ /* Febrero: otros 28-29 retos variados, incluyendo calientes, románticos y divertidos */
    "Hazme un desayuno sorpresa 🍳",
    "Dime tu recuerdo favorito conmigo 🥰",
    "Envíame un audio diciendo algo sexy 🔥",
    "Hazme una pregunta atrevida 🔥",
    "Planea una cita temática (ej: noche mexicana) 🌮",
    "Hazme un dibujo divertido 🎨",
    "Bésame en un lugar nuevo 😘",
    "Hazme una confesión picante 🔥",
    "Escríbeme una carta de amor 📝",
    "Hazme una playlist de canciones que te recuerden a mí 🎶",
    "Hazme un masaje de pies 🦶",
    "Hazme una propuesta loca para el futuro 🤪",
    "Hazme una foto sexy (si te animas) 🔥",
    "Hazme una pregunta sobre mi infancia 👶",
    "Hazme reír con un meme 😂",
    "Hazme una promesa para este mes 🤞",
    "Hazme un dibujo de nosotros en el futuro 🖌️",
    "Hazme una lista de deseos para este mes 📝",
    "Hazme una sorpresa virtual 🎁",
    "Hazme una pregunta sobre el amor 💖",
    "Hazme sentir especial hoy 💝",
    "Hazme una fantasía tuya 🔥",
    "Hazme una pregunta atrevida 🔥",
    "Hazme un cumplido sincero 💬",
    "Hazme una videollamada sorpresa 📱",
    "Hazme una carta de amor 📝",
    "Hazme una pregunta sobre el futuro juntos 🔮",
    "Hazme sentir especial hoy 💝"
  ],
  // ... Repetir para los 12 meses, con retos variados, románticos, divertidos y "calientes" (puedes personalizar más retos aquí) ...
};

// --- Función para obtener los retos del mes actual ---
function obtenerRetosDelMes() {
  let mes = 0;
  if (fechaInicio) {
    mes = new Date(fechaInicio).getMonth();
  } else {
    mes = new Date().getMonth();
  }
  return retosPorMes[mes] || retosPorMes[0];
}

const TOTAL_DIAS = 30;

// --- Utilidades de localStorage ---
function guardarDatos(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function obtenerDatos(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}
function limpiarDatos() {
  localStorage.removeItem('nombres');
  localStorage.removeItem('progreso');
  localStorage.removeItem('ultimoDiaAbierto');
  localStorage.removeItem('fechaInicio'); // Limpiar fecha de inicio
}

// --- Elementos DOM ---
const welcomeModal = document.getElementById('welcome-modal');
const namesForm = document.getElementById('names-form');
const girlNameInput = document.getElementById('girl-name');
const partnerNameInput = document.getElementById('partner-name');
const greetingDiv = document.getElementById('greeting');
const cardsGrid = document.getElementById('cards-grid');
const challengeModal = document.getElementById('challenge-modal');
const challengeTitle = document.getElementById('challenge-title');
const challengeText = document.getElementById('challenge-text');
const completeChallengeBtn = document.getElementById('complete-challenge');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const resetBtn = document.getElementById('reset-btn');
const themeToggleBtn = document.getElementById('theme-toggle');
const confirmResetBtn = document.getElementById('confirm-reset');
const resetModalEl = document.getElementById('reset-modal');
const resetModal = new bootstrap.Modal(resetModalEl);

// Mostrar modal de información de autoría
const infoBtn = document.getElementById('info-btn');
const infoModal = document.getElementById('info-modal');
if (infoBtn && infoModal) {
  infoBtn.addEventListener('click', function() {
    const modal = new bootstrap.Modal(infoModal);
    modal.show();
  });
}

// --- Estado global ---
let nombres = obtenerDatos('nombres') || null;
let progreso = obtenerDatos('progreso') || Array(TOTAL_DIAS).fill(false);
let fechaInicio = obtenerDatos('fechaInicio') || null; // Nueva: fecha de inicio del reto
let cartaSeleccionada = null;
let fechasCompletado = obtenerDatos('fechasCompletado') || Array(TOTAL_DIAS).fill(null);

function guardarFechasCompletado() {
  guardarDatos('fechasCompletado', fechasCompletado);
}

// --- Función para obtener la fecha de hoy en formato yyyy-mm-dd ---
function getFechaHoy() {
  const hoy = new Date();
  return hoy.toISOString().slice(0, 10);
}

// --- Calcular el día del reto según la fecha de inicio ---
function getDiaRetoActual() {
  if (!fechaInicio) return 0;
  const inicio = new Date(fechaInicio);
  const hoy = new Date(getFechaHoy());
  const diff = Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24));
  return diff;
}

// --- Mostrar u ocultar modal de bienvenida con Bootstrap ---
function mostrarModalBienvenida() {
  const modal = new bootstrap.Modal(document.getElementById('welcome-modal'));
  modal.show();
}
function ocultarModalBienvenida() {
  const modalEl = document.getElementById('welcome-modal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
}

// --- Guardar nombres, fecha de inicio y mostrar saludo ---
namesForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const girl = girlNameInput.value.trim();
  const partner = partnerNameInput.value.trim();
  if (girl && partner) {
    nombres = { girl, partner };
    guardarDatos('nombres', nombres);
    // Guardar fecha de inicio solo si no existe
    if (!fechaInicio) {
      fechaInicio = getFechaHoy();
      guardarDatos('fechaInicio', fechaInicio);
    }
    ocultarModalBienvenida();
    mostrarSaludo();
    generarCartas();
    actualizarProgreso();
  }
});

function mostrarSaludo() {
  if (nombres) {
    greetingDiv.textContent = `Hola ${nombres.girl}, este es tu reto de amor con ${nombres.partner}`;
  }
}

// --- Generar cuadrícula de cartas con Bootstrap ---
function generarCartas() {
  const grid = document.getElementById('cards-grid');
  grid.innerHTML = '';
  const diaActual = getDiaRetoActual();
  for (let i = 0; i < TOTAL_DIAS; i++) {
    const col = document.createElement('div');
    col.className = 'col-6 col-sm-4 col-md-3 col-lg-2 d-flex justify-content-center';
    const card = document.createElement('div');
    card.className = 'card-reto shadow-sm text-center px-2 py-3 mb-2 w-100';
    card.innerHTML = `<span class='day-number'>${i + 1}</span> Día ${i + 1}`;
    card.dataset.dia = i;
    if (progreso[i]) {
      card.classList.add('completed');
    } else if (i === 0 && !progreso[i]) {
      // Día 1 siempre se puede abrir si no está completado
      card.addEventListener('click', () => abrirReto(i));
    } else if (i > 0 && !progreso[i] && progreso[i-1]) {
      // Solo se puede abrir si el anterior está completado y ha pasado 24h desde la hora de completado
      const fechaPrev = fechasCompletado[i-1] ? new Date(fechasCompletado[i-1]) : null;
      const ahora = new Date();
      if (fechaPrev) {
        const diffMs = fechaPrev.getTime() + 24*60*60*1000 - ahora.getTime();
        if (diffMs > 0) {
          // Bloqueado, mostrar horas/minutos restantes
          let horas = Math.floor(diffMs / (1000 * 60 * 60));
          let minutos = Math.ceil((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          if (horas < 0) horas = 0;
          if (minutos < 0) minutos = 0;
          card.classList.add('locked');
          card.innerHTML += ' <span class="lock">🔒</span>';
          card.title = 'Aún no puedes abrir este reto.';
          card.addEventListener('click', () => mostrarAlerta('¡Aún no puedes abrir este reto! Debes esperar 24 horas desde que completaste el anterior.', horas, minutos));
        } else {
          // Ya se puede abrir
          card.addEventListener('click', () => abrirReto(i));
        }
      } else {
        // Si no hay fecha previa, bloquear
        card.classList.add('locked');
        card.innerHTML += ' <span class="lock">🔒</span>';
        card.title = 'Aún no puedes abrir este reto.';
        card.addEventListener('click', () => mostrarAlerta('¡Aún no puedes abrir este reto! Debes esperar 24 horas desde que completaste el anterior.'));
      }
    } else if (i > 0 && !progreso[i] && !progreso[i-1]) {
      // No se puede abrir si el anterior no está completado
      card.classList.add('locked');
      card.innerHTML += ' <span class="lock">🔒</span>';
      card.title = 'Debes completar el reto anterior primero.';
      card.addEventListener('click', () => mostrarAlerta('Debes completar el reto anterior antes de desbloquear este.'));
    } else if (i < diaActual) {
      card.classList.add('missed');
      card.innerHTML += ' <span class="lock">🔒</span>';
      card.title = 'Este día ya pasó y no se puede completar.';
      card.addEventListener('click', () => mostrarAlerta('Este reto ya no se puede realizar. ¡Debes esperar al siguiente día!'));
    } else {
      card.addEventListener('click', () => abrirReto(i));
    }
    if (progreso[i]) {
      card.addEventListener('click', () => abrirReto(i));
    }
    col.appendChild(card);
    grid.appendChild(col);
  }
}

// --- Mostrar/ocultar modal de reto diario con Bootstrap ---
function abrirReto(dia) {
  cartaSeleccionada = dia;
  challengeTitle.textContent = `Día ${dia + 1}`;
  const reto = obtenerRetosDelMes()[dia % obtenerRetosDelMes().length];
  challengeText.textContent = reto;
  const modal = new bootstrap.Modal(document.getElementById('challenge-modal'));
  modal.show();
}

// El botón de cerrar ya es manejado por Bootstrap con data-bs-dismiss="modal"
// Así que no necesitamos closeChallengeBtn ni su eventListener

// --- Completar reto ---
completeChallengeBtn.addEventListener('click', () => {
  if (cartaSeleccionada !== null) {
    progreso[cartaSeleccionada] = true;
    fechasCompletado[cartaSeleccionada] = new Date().toISOString();
    guardarDatos('progreso', progreso);
    guardarFechasCompletado();
    generarCartas();
    actualizarProgreso();
    // Cerrar modal con Bootstrap
    const modalEl = document.getElementById('challenge-modal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    cartaSeleccionada = null;
  }
});

// --- Barra de progreso Bootstrap ---
function actualizarProgreso() {
  const completados = progreso.filter(Boolean).length;
  const porcentaje = (completados / TOTAL_DIAS) * 100;
  const progressBar = document.getElementById('progress-bar');
  progressBar.style.width = porcentaje + '%';
  progressBar.setAttribute('aria-valuenow', completados);
  progressBar.textContent = `${completados}/30`;
}

// --- Reiniciar reto ---
resetBtn.addEventListener('click', () => {
  resetModal.show();
});

confirmResetBtn.addEventListener('click', () => {
  limpiarDatos();
  nombres = null;
  progreso = Array(TOTAL_DIAS).fill(false);
  fechaInicio = null;
  mostrarModalBienvenida();
  greetingDiv.textContent = '';
  cardsGrid.innerHTML = '';
  actualizarProgreso();
  resetModal.hide();
});

// --- Tema (claro/oscuro) ---
function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark');
    themeToggleBtn.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    themeToggleBtn.textContent = '🌙';
  }
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const current = document.body.classList.contains('dark') ? 'dark' : 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
}

themeToggleBtn.addEventListener('click', toggleTheme);

// Al cargar, aplicar el tema guardado o preferencia del sistema
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme('light'); // Siempre tema claro por defecto
  }
});

// --- Inicialización al cargar la página ---
window.onload = function() {
  if (!nombres) {
    mostrarModalBienvenida();
  } else {
    ocultarModalBienvenida();
    mostrarSaludo();
    generarCartas();
    actualizarProgreso();
  }
};

// --- Toast Bootstrap ---
function mostrarAlerta(mensaje, horasRestantes = null, minutosRestantes = null) {
  const toastEl = document.getElementById('alerta-toast');
  const toastBody = toastEl.querySelector('.toast-body');
  if (horasRestantes !== null) {
    let tiempo = '';
    if (horasRestantes > 0) {
      tiempo = `<b>${horasRestantes}</b> horas`;
      if (minutosRestantes > 0) tiempo += ` y <b>${minutosRestantes}</b> minutos`;
    } else if (minutosRestantes > 0) {
      tiempo = `<b>${minutosRestantes}</b> minutos`;
    } else {
      tiempo = '<b>menos de 1 minuto</b>';
    }
    toastBody.innerHTML = `${mensaje}<br><span style='font-size:0.95em;'>Faltan ${tiempo} para desbloquear este reto.</span>`;
  } else {
    toastBody.textContent = mensaje;
  }
  const toast = new bootstrap.Toast(toastEl, { delay: 8000 });
  toast.show();
} 