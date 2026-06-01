// src/main.js
// Punto de entrada — ensambla todos los módulos

import { initGrupos } from "./ui/grupos.js";
import { initFixture } from "./ui/fixture.js";
import { initModal } from "./ui/modal.js";
import { renderEstadisticas } from "./ui/estadisticas.js";
import { guardarZonaHoraria, getZonaHoraria } from "./logic/state.js";
import { initBracket } from "./ui/bracket.js";
import { initAlbum } from "./ui/album.js";

// ─── NAVEGACIÓN ───────────────────────────────────────────
function initNavegacion() {
    const navBtns = document.querySelectorAll(".nav-btn");
    const vistas = document.querySelectorAll(".vista");

    navBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.vista;
            navBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            vistas.forEach(v => v.classList.remove("active"));
            document.getElementById(`vista-${target}`)?.classList.add("active");

            // Renderizar estadísticas al entrar en esa vista
            if (target === "estadisticas") renderEstadisticas();
        });
    });
}

// ─── FECHA HEADER ─────────────────────────────────────────
function initFecha() {
    const el = document.getElementById("fechaHoy");
    if (!el) return;
    const ahora = new Date();
    const opciones = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    el.textContent = ahora.toLocaleDateString("es-AR", opciones);
}

// ─── ZONA HORARIA ─────────────────────────────────────────
function initZonaHoraria() {
    const select = document.getElementById("zonaSelect");
    if (!select) return;

    // Restaurar valor guardado
    select.value = String(getZonaHoraria());

    select.addEventListener("change", () => {
        guardarZonaHoraria(parseInt(select.value, 10));
        // Re-renderizar fixture con nuevos horarios
        import("./ui/fixture.js").then(({ renderFixture, attachFixtureListeners }) => {
            renderFixture();
            attachFixtureListeners();
        });
    });
}

// ─── INIT GENERAL ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    initNavegacion();
    initFecha();
    initZonaHoraria();
    initModal();
    initGrupos();
    initFixture();
    initBracket();
    initAlbum();

    console.log("⚽ Copa Potrero '26 — Sistema iniciado correctamente");
});