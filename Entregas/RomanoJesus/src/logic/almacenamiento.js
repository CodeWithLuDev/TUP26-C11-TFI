/**
 * almacenamiento.js
 * Encapsula toda la interacción con localStorage para que el resto de la
 * app no dependa directamente del navegador: si el día de mañana se quisiera
 * cambiar a otro mecanismo de persistencia (archivo, base de datos, etc.),
 * solo habría que tocar este módulo.
 */

const CLAVE_ALMACENAMIENTO = "fixture-mundial-2026-estado";

/**
 * Guarda el estado completo del torneo (partidos jugados, bracket, etc.)
 * Se guarda solo lo que cambia con el uso: resultados, goleadores y bracket.
 * Los datos fijos (equipos, calendario) siempre se vuelven a generar desde
 * equipos.js / partidos.js al cargar la página.
 */
function guardarEstado(estado) {
  try {
    const serializado = JSON.stringify(estado);
    localStorage.setItem(CLAVE_ALMACENAMIENTO, serializado);
    return true;
  } catch (error) {
    console.error("No se pudo guardar el estado en localStorage:", error);
    return false;
  }
}

/** Recupera el estado guardado, o null si no hay nada o algo falla */
function cargarEstado() {
  try {
    const serializado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (!serializado) return null;
    return JSON.parse(serializado);
  } catch (error) {
    console.error("No se pudo leer el estado de localStorage:", error);
    return null;
  }
}

/** Borra todo el progreso guardado (botón "Reiniciar torneo") */
function borrarEstado() {
  try {
    localStorage.removeItem(CLAVE_ALMACENAMIENTO);
    return true;
  } catch (error) {
    console.error("No se pudo borrar el estado de localStorage:", error);
    return false;
  }
}
