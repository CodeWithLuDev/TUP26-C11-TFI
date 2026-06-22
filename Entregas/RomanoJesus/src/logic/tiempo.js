/**
 * tiempo.js
 * Funciones puras de formateo de fecha/hora, incluida la conversión
 * automática del horario de cada partido a la zona horaria del
 * navegador de quien esté usando la app (punto adicional del TP, 3.3).
 */

const NOMBRES_MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** Formatea una fecha "AAAA-MM-DD" como "DD mes" (ej: "11 jun") */
function formatearFechaCorta(fechaISO) {
  const [, mes, dia] = fechaISO.split("-");
  return `${dia} ${NOMBRES_MES[parseInt(mes, 10) - 1]}`;
}

/** Devuelve la abreviatura de la zona horaria del navegador del usuario (ej: "GMT-3") */
function obtenerEtiquetaZonaHorariaLocal() {
  try {
    const formateador = new Intl.DateTimeFormat("es-AR", { timeZoneName: "shortOffset" });
    const partes = formateador.formatToParts(new Date());
    const parteZona = partes.find((p) => p.type === "timeZoneName");
    return parteZona ? parteZona.value : "";
  } catch (error) {
    return "";
  }
}

/** Convierte un instanteUTC (ISO string) a fecha+hora en la zona horaria del usuario */
function formatearHoraLocalDelUsuario(instanteUTC) {
  if (!instanteUTC) return null;
  const fecha = new Date(instanteUTC);

  const horaFormateada = new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(fecha);

  const fechaFormateada = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
  }).format(fecha);

  return { fecha: fechaFormateada, hora: horaFormateada };
}
