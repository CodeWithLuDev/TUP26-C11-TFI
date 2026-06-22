let ESTADO_TORNEO = null;

function migrarPartido(partido) {
  return {
    ...partido,
    definidoEn: partido.definidoEn || "tiempo_regular",
    goleadores: partido.goleadores || [],
    asistencias: partido.asistencias || [],
    eventos: partido.eventos || [],
  };
}

function inicializarEstadoTorneo() {
  const estadoGuardado = cargarEstado();

  if (estadoGuardado && Array.isArray(estadoGuardado.partidos) && estadoGuardado.partidos.length === PARTIDOS_GRUPOS.length) {
    estadoGuardado.partidos = estadoGuardado.partidos.map(migrarPartido);
    return estadoGuardado;
  }

  return {
    partidos: JSON.parse(JSON.stringify(PARTIDOS_GRUPOS)).map(migrarPartido),
    bracket: null,
  };
}

function obtenerEstadoTorneo() {
  return ESTADO_TORNEO;
}

function guardarYPersistir(estadoTorneo) {
  ESTADO_TORNEO = estadoTorneo;
  guardarEstado(estadoTorneo);
}

function actualizarPartido(idPartido, cambios) {
  const indice = ESTADO_TORNEO.partidos.findIndex((p) => p.id === idPartido);
  if (indice === -1) return;
  ESTADO_TORNEO.partidos[indice] = { ...ESTADO_TORNEO.partidos[indice], ...cambios };
  guardarYPersistir(ESTADO_TORNEO);
}

function refrescarVistaActual() {
  const tabActiva = document.querySelector(".navegacion__item.activo").dataset.vista;
  renderizarVista(tabActiva);
}

function renderizarVista(nombreVista) {
  const estadoTorneo = obtenerEstadoTorneo();
  switch (nombreVista) {
    case "inicio":
      renderizarInicio();
      break;
    case "equipos":
      renderizarEquipos();
      break;
    case "grupos":
      renderizarGrupos(estadoTorneo);
      break;
    case "fixture":
      renderizarFixture(estadoTorneo);
      break;
    case "playoffs":
      renderizarPlayoffs(estadoTorneo);
      break;
    case "estadisticas":
      renderizarEstadisticas(estadoTorneo);
      break;
    case "campeones":
      renderizarCampeones();
      break;
    case "jugadores":
      renderizarJugadores();
      break;
    case "destacados":
      renderizarDestacados();
      break;
    case "donde-ver":
      renderizarDondeVer();
      break;
  }
}

function configurarNavegacion() {
  const botonesNav = document.querySelectorAll(".navegacion__item");
  botonesNav.forEach((boton) => {
    boton.addEventListener("click", () => {
      botonesNav.forEach((b) => b.classList.remove("activo"));
      boton.classList.add("activo");

      document.querySelectorAll(".vista").forEach((vista) => vista.classList.remove("activa"));
      document.getElementById(`vista-${boton.dataset.vista}`).classList.add("activa");

      renderizarVista(boton.dataset.vista);
    });
  });
}

function configurarBotonReiniciar() {
  document.getElementById("boton-reiniciar").addEventListener("click", () => {
    if (!confirm("Esto borra todos los resultados cargados y el bracket de playoffs. ¿Continuar?")) return;
    borrarEstado();
    ESTADO_TORNEO = inicializarEstadoTorneo();
    refrescarVistaActual();
  });
}

function configurarTema() {
  const html = document.documentElement;
  const boton = document.getElementById("boton-tema");
  const temaGuardado = localStorage.getItem("fixture-mundial-2026-tema") || "oscuro";
  html.setAttribute("data-tema", temaGuardado);
  actualizarBotonTema(boton, temaGuardado);

  boton.addEventListener("click", () => {
    const actual = html.getAttribute("data-tema");
    const nuevo = actual === "oscuro" ? "claro" : "oscuro";
    html.setAttribute("data-tema", nuevo);
    localStorage.setItem("fixture-mundial-2026-tema", nuevo);
    actualizarBotonTema(boton, nuevo);
  });
}

function actualizarBotonTema(boton, tema) {
  boton.textContent = tema === "oscuro" ? "☀️" : "🌙";
  boton.title = tema === "oscuro" ? "Modo claro" : "Modo oscuro";
}

document.addEventListener("DOMContentLoaded", () => {
  ESTADO_TORNEO = inicializarEstadoTorneo();
  configurarNavegacion();
  configurarBotonReiniciar();
  configurarTema();
  renderizarVista("inicio");
});
