import { initState } from "./logic/state.js";
import { renderGruposCompletos } from "./ui/grupos.js";
import { initFixture } from "./ui/fixture.js";
import { initModal } from "./ui/modal.js";
import { renderEstadisticas } from "./ui/estadisticas.js";
import { guardarZonaHoraria, getZonaHoraria } from "./logic/state.js";
import { initBracket } from "./ui/bracket.js";
import { initAlbum } from "./ui/album.js";
import { initTheme, initHamburger } from "./logic/ui.js";

// ─── NAVEGACIÓN ───────────────────────────────────────────
function initNavegacion() {
    const navBtns = document.querySelectorAll(".nav-btn");
    const vistas = document.querySelectorAll(".vista");

    function irAVista(target) {
        navBtns.forEach(b => {
            const on = b.dataset.vista === target;
            b.classList.toggle("active", on);
            b.setAttribute("aria-current", on ? "page" : "false");
            b.setAttribute("aria-selected", on ? "true" : "false");
        });
        vistas.forEach(v => v.classList.remove("active"));
        document.getElementById(`vista-${target}`)?.classList.add("active");

        if (target === "grupos") renderGruposCompletos();
        if (target === "estadisticas") renderEstadisticas();

        if (window.location.hash !== `#${target}`) {
            history.pushState(null, "", `#${target}`);
        }
    }

    navBtns.forEach(btn => {
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", btn.classList.contains("active") ? "true" : "false");
        btn.addEventListener("click", () => irAVista(btn.dataset.vista));
    });

    window.addEventListener("hashchange", () => {
        const target = window.location.hash.replace("#", "") || "dashboard";
        irAVista(target);
    });

    window.addEventListener("popstate", () => {
        const target = window.location.hash.replace("#", "") || "dashboard";
        irAVista(target);
    });

    // Restaurar vista desde hash al cargar
    const hash = window.location.hash.replace("#", "");
    if (hash) irAVista(hash);
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
    initState();
    initTheme();
    initHamburger();
    initNavegacion();
    initFecha();
    initZonaHoraria();
    initModal();
    initFixture();
    initBracket();
    initAlbum();

    console.log("⚽ Copa Potrero '26 — Sistema iniciado correctamente");
});