// src/main.js
// Punto de entrada — ensamblado general de la aplicación

// ─── Navegación entre vistas ──────────────────────────────
function initNavegacion() {
  const navBtns = document.querySelectorAll(".nav-btn");
  const vistas  = document.querySelectorAll(".vista");

  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.vista;

      // Activar botón
      navBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Mostrar vista
      vistas.forEach(v => v.classList.remove("active"));
      document.getElementById(`vista-${target}`)?.classList.add("active");
    });
  });
}

// ─── Fecha en el header ───────────────────────────────────
function initFecha() {
  const el = document.getElementById("fechaHoy");
  if (!el) return;
  const ahora = new Date();
  const opciones = { weekday:"long", day:"numeric", month:"long", year:"numeric" };
  el.textContent = ahora.toLocaleDateString("es-AR", opciones);
}

// ─── Init ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initNavegacion();
  initFecha();
  console.log("⚽ Copa Potrero '26 — Iniciando...");
});