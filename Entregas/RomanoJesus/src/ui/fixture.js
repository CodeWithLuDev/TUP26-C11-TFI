let filtroFixtureActivo = "todos";

function renderizarFixture(estadoTorneo) {
  const contenedor = document.getElementById("vista-fixture");
  const partidosOrdenados = [...estadoTorneo.partidos].sort((a, b) =>
    `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`)
  );

  const partidosFiltrados =
    filtroFixtureActivo === "todos"
      ? partidosOrdenados
      : partidosOrdenados.filter((partido) => partido.grupo === filtroFixtureActivo);

  contenedor.innerHTML = `
    <h2 class="titulo-seccion">Fixture — Carga de resultados</h2>
    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
      <button id="boton-simular" class="boton-simular">⚡ Simular todo</button>
      <button id="boton-borrar-resultados" class="boton-borrar-resultados">✕ Borrar resultados</button>
    </div>
    <div class="filtros-fixture">
      <button class="filtro-chip ${filtroFixtureActivo === "todos" ? "activo" : ""}" data-filtro="todos">Todos</button>
      ${GRUPOS.map((g) => `<button class="filtro-chip ${filtroFixtureActivo === g ? "activo" : ""}" data-filtro="${g}">Grupo ${g}</button>`).join("")}
    </div>
    <div class="lista-partidos">
      ${partidosFiltrados.map((partido) => renderizarTarjetaPartido(partido)).join("")}
    </div>
  `;

  const simBtn = contenedor.querySelector("#boton-simular");
  if (simBtn) simBtn.addEventListener("click", simularTodo);

  const borrarBtn = contenedor.querySelector("#boton-borrar-resultados");
  if (borrarBtn) borrarBtn.addEventListener("click", borrarResultados);

  contenedor.querySelectorAll(".filtro-chip").forEach((boton) => {
    boton.addEventListener("click", () => {
      filtroFixtureActivo = boton.dataset.filtro;
      renderizarFixture(obtenerEstadoTorneo());
    });
  });

  contenedor.querySelectorAll("[data-accion='confirmar']").forEach((boton) => {
    boton.addEventListener("click", () => confirmarResultado(boton.dataset.idPartido));
  });

  contenedor.querySelectorAll("[data-accion='borrar']").forEach((boton) => {
    boton.addEventListener("click", () => borrarResultado(boton.dataset.idPartido));
  });

  contenedor.querySelectorAll("[data-accion='alternar-detalle']").forEach((boton) => {
    boton.addEventListener("click", () => {
      const detalle = document.getElementById(`detalle-${boton.dataset.idPartido}`);
      if (detalle) detalle.classList.toggle("visible");
    });
  });

  contenedor.querySelectorAll("[data-accion='alternar-cronologia']").forEach((boton) => {
    boton.addEventListener("click", () => {
      const cronologia = document.getElementById(`cronologia-${boton.dataset.idPartido}`);
      if (cronologia) cronologia.classList.toggle("visible");
    });
  });

  contenedor.querySelectorAll("[data-accion='agregar-goleador']").forEach((boton) => {
    boton.addEventListener("click", () => agregarFilaJugador(boton.dataset.idPartido, "goleadores"));
  });

  contenedor.querySelectorAll("[data-accion='agregar-asistidor']").forEach((boton) => {
    boton.addEventListener("click", () => agregarFilaJugador(boton.dataset.idPartido, "asistencias"));
  });

  contenedor.querySelectorAll("[data-accion='agregar-evento']").forEach((boton) => {
    boton.addEventListener("click", () => agregarEvento(boton.dataset.idPartido));
  });

  contenedor.querySelectorAll("[data-accion='auto-goles']").forEach((boton) => {
    boton.addEventListener("click", () => autoGenerarGoles(boton.dataset.idPartido));
  });

  contenedor.querySelectorAll(".fila-jugador input[data-campo='jugador']").forEach((input) => {
    input.addEventListener("change", () => {
      const { idPartido, tipo, indice } = input.dataset;
      const partido = obtenerEstadoTorneo().partidos.find((p) => p.id === idPartido);
      if (!partido) return;
      const listaActual = [...(partido[tipo] || [])];
      listaActual[parseInt(indice, 10)].jugador = input.value;
      actualizarPartido(idPartido, { [tipo]: listaActual });
    });
  });

  contenedor.querySelectorAll("select[data-campo='definidoEn']").forEach((select) => {
    select.addEventListener("change", () => {
      actualizarPartido(select.dataset.idPartido, { definidoEn: select.value });
    });
  });

}

function renderizarTarjetaPartido(partido) {
  const local = obtenerEquipoPorId(partido.local);
  const visitante = obtenerEquipoPorId(partido.visitante);
  const golesLocal = partido.golesLocal ?? "";
  const golesVisitante = partido.golesVisitante ?? "";
  const horaLocalUsuario = formatearHoraLocalDelUsuario(partido.instanteUTC);
  const etiquetaZona = obtenerEtiquetaZonaHorariaLocal();

  return `
    <div class="tarjeta-partido ${partido.jugado ? "jugado" : ""}">
      <div class="tarjeta-partido__fecha">
        <strong>${formatearFechaCorta(partido.fecha)} · ${partido.hora} hs</strong><br>
        <small>${partido.sede}</small>
        ${
          horaLocalUsuario
            ? `<div class="tarjeta-partido__hora-local">🕐 ${horaLocalUsuario.fecha} · ${horaLocalUsuario.hora} hs ${etiquetaZona}</div>`
            : ""
        }
      </div>

      <div class="tarjeta-partido__equipo local">
        ${local ? getFlagImg(local.codigoIso, local.nombre, "w32") : ""} ${local ? local.nombre : partido.local}
      </div>

      <div class="tarjeta-partido__marcador">
        <input type="number" min="0" class="input-gol" data-rol="local" data-id-partido="${partido.id}" value="${golesLocal}">
        <span>—</span>
        <input type="number" min="0" class="input-gol" data-rol="visitante" data-id-partido="${partido.id}" value="${golesVisitante}">
      </div>

      <div class="tarjeta-partido__equipo visitante">
        ${visitante ? visitante.nombre : partido.visitante} ${visitante ? getFlagImg(visitante.codigoIso, visitante.nombre, "w32") : ""}
      </div>

      <div class="tarjeta-partido__acciones">
        ${
          partido.jugado
            ? `<span class="etiqueta-jugado">✓ ${etiquetaDefinicion(partido.definidoEn)}</span>
               <button class="boton-chico" data-accion="alternar-detalle" data-id-partido="${partido.id}">Goles</button>
               <button class="boton-chico" data-accion="alternar-cronologia" data-id-partido="${partido.id}">Cronología</button>
               <button class="boton-chico borrar" data-accion="borrar" data-id-partido="${partido.id}">Borrar</button>`
            : `<button class="boton-chico confirmar" data-accion="confirmar" data-id-partido="${partido.id}">Confirmar</button>`
        }
      </div>

      <div class="detalle-goles" id="detalle-${partido.id}">
        ${
          !partido.jugado
            ? `<div class="detalle-goles__definicion">
                <label>¿Cómo se definió?</label>
                <select data-campo="definidoEn" data-id-partido="${partido.id}">
                  <option value="tiempo_regular" ${partido.definidoEn === "tiempo_regular" ? "selected" : ""}>Tiempo regular</option>
                  <option value="tiempo_extra" ${partido.definidoEn === "tiempo_extra" ? "selected" : ""}>Tiempo extra</option>
                  <option value="penales" ${partido.definidoEn === "penales" ? "selected" : ""}>Penales</option>
                </select>
              </div>`
            : `<div class="detalle-goles__definicion">
                <button class="boton-chico" data-accion="auto-goles" data-id-partido="${partido.id}">⚡ Generar goles automáticos</button>
              </div>`
        }
        <div class="detalle-goles__columna">
          <h4>⚽ Goleadores</h4>
          ${(partido.goleadores || []).length === 0
            ? '<div class="sin-datos" style="padding:8px 0">Sin goles registrados</div>'
            : (partido.goleadores || []).map((gol, indice) => renderizarFilaJugador(partido.id, "goleadores", indice, gol)).join("")
          }
          <button class="boton-agregar-jugador" data-accion="agregar-goleador" data-id-partido="${partido.id}">+ Agregar gol</button>
        </div>
        <div class="detalle-goles__columna">
          <h4>🅰️ Asistidores</h4>
          ${(partido.asistencias || []).length === 0
            ? '<div class="sin-datos" style="padding:8px 0">Sin asistencias registradas</div>'
            : (partido.asistencias || []).map((asistencia, indice) => renderizarFilaJugador(partido.id, "asistencias", indice, asistencia)).join("")
          }
          <button class="boton-agregar-jugador" data-accion="agregar-asistidor" data-id-partido="${partido.id}">+ Agregar asistencia</button>
        </div>
      </div>

      <div class="cronologia" id="cronologia-${partido.id}">
        <h4>📋 Cronología del partido</h4>
        <div class="cronologia__linea">
          ${(partido.eventos || []).length === 0
            ? '<div class="cronologia__vacia">No hay eventos registrados.</div>'
            : (partido.eventos || []).map((evento, i) => renderizarEvento(evento, i, partido.id)).join("")
          }
        </div>
        <button class="boton-agregar-jugador" data-accion="agregar-evento" data-id-partido="${partido.id}">+ Agregar evento</button>
      </div>
    </div>
  `;
}

function etiquetaDefinicion(definidoEn) {
  if (definidoEn === "tiempo_extra") return "Jugado (tiempo extra)";
  if (definidoEn === "penales") return "Jugado (penales)";
  return "Jugado";
}

function renderizarFilaJugador(idPartido, tipo, indice, registro) {
  return `
    <div class="fila-jugador">
      <input type="text" placeholder="Nombre del jugador" value="${registro.jugador || ""}"
        data-id-partido="${idPartido}" data-tipo="${tipo}" data-indice="${indice}" data-campo="jugador">
      <button onclick="eliminarFilaJugador('${idPartido}', '${tipo}', ${indice})">✕</button>
    </div>
  `;
}

function renderizarEvento(evento, indice, idPartido) {
  const equipo = evento.equipoId ? obtenerEquipoPorId(evento.equipoId) : null;
  const iconos = { gol: "⚽", amarilla: "🟨", roja: "🟥", sust: "🔄", propia: "⚽ (e/c)" };
  return `
    <div class="cronologia__evento">
      <span class="cronologia__minuto">${evento.minuto || "?"}'</span>
      <span class="cronologia__icono">${iconos[evento.tipo] || "📌"}</span>
      <span class="cronologia__descripcion">${evento.descripcion || evento.jugador || ""}</span>
      <span class="cronologia__equipo">${equipo ? getFlagImg(equipo.codigoIso, equipo.nombre, "w24") : ""}</span>
      <button class="cronologia__borrar" onclick="eliminarEvento('${idPartido}', ${indice})">✕</button>
    </div>
  `;
}

function confirmarResultado(idPartido) {
  const inputLocal = document.querySelector(`.input-gol[data-rol='local'][data-id-partido='${idPartido}']`);
  const inputVisitante = document.querySelector(`.input-gol[data-rol='visitante'][data-id-partido='${idPartido}']`);

  const golesLocal = parseInt(inputLocal.value, 10);
  const golesVisitante = parseInt(inputVisitante.value, 10);

  if (Number.isNaN(golesLocal) || Number.isNaN(golesVisitante) || golesLocal < 0 || golesVisitante < 0) {
    alert("Ingresá un resultado válido para ambos equipos antes de confirmar.");
    return;
  }

  actualizarPartido(idPartido, { golesLocal, golesVisitante, jugado: true });
  refrescarVistaActual();
}

function borrarResultado(idPartido) {
  if (!confirm("¿Borrar el resultado cargado para este partido?")) return;
  actualizarPartido(idPartido, {
    golesLocal: null, golesVisitante: null, jugado: false,
    goleadores: [], asistencias: [], eventos: [],
  });
  refrescarVistaActual();
}

function agregarFilaJugador(idPartido, tipo) {
  const partido = obtenerEstadoTorneo().partidos.find((p) => p.id === idPartido);
  if (!partido) return;
  const listaActual = partido[tipo] || [];
  listaActual.push({ jugador: "", equipoId: partido.local });
  actualizarPartido(idPartido, { [tipo]: listaActual });
  refrescarVistaActual();
  const el = document.getElementById(`detalle-${idPartido}`);
  if (el) el.classList.add("visible");
}

function eliminarFilaJugador(idPartido, tipo, indice) {
  const partido = obtenerEstadoTorneo().partidos.find((p) => p.id === idPartido);
  if (!partido) return;
  const listaActual = [...(partido[tipo] || [])];
  listaActual.splice(indice, 1);
  actualizarPartido(idPartido, { [tipo]: listaActual });
  refrescarVistaActual();
  const el = document.getElementById(`detalle-${idPartido}`);
  if (el) el.classList.add("visible");
}

function autoGenerarGoles(idPartido) {
  const partido = obtenerEstadoTorneo().partidos.find((p) => p.id === idPartido);
  if (!partido || !partido.jugado) return;
  const local = obtenerEquipoPorId(partido.local);
  const visitante = obtenerEquipoPorId(partido.visitante);
  const apellidosLocal = ["García", "Martínez", "López", "González", "Rodríguez", "Fernández", "Pérez", "Silva", "Torres", "Romero", "Cruz", "Ortiz"];
  const apellidosVisit = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson", "Taylor", "Anderson", "Thomas", "Jackson"];
  const eventos = [];
  const goleadores = [];

  for (let i = 0; i < (partido.golesLocal || 0); i++) {
    const min = Math.floor(Math.random() * 90) + 1;
    const jugador = `${apellidosLocal[Math.floor(Math.random() * apellidosLocal.length)]}`;
    eventos.push({ idPartido, minuto: min, tipo: "gol", jugador, equipoId: partido.local, descripcion: `Gol de ${jugador}` });
    goleadores.push({ jugador, equipoId: partido.local });
  }
  for (let i = 0; i < (partido.golesVisitante || 0); i++) {
    const min = Math.floor(Math.random() * 90) + 1;
    const jugador = `${apellidosVisit[Math.floor(Math.random() * apellidosVisit.length)]}`;
    eventos.push({ idPartido, minuto: min, tipo: "gol", jugador, equipoId: partido.visitante, descripcion: `Gol de ${jugador}` });
    goleadores.push({ jugador, equipoId: partido.visitante });
  }

  eventos.sort((a, b) => a.minuto - b.minuto);
  actualizarPartido(idPartido, { eventos, goleadores });
  refrescarVistaActual();
  const el = document.getElementById(`detalle-${idPartido}`);
  if (el) el.classList.add("visible");
}

function agregarEvento(idPartido) {
  const partido = obtenerEstadoTorneo().partidos.find((p) => p.id === idPartido);
  if (!partido) return;
  const minuto = prompt("Minuto del evento:", "90");
  if (!minuto || isNaN(minuto)) return;
  const tipo = prompt("Tipo (gol / amarilla / roja / sust):", "gol");
  if (!tipo) return;
  const jugador = prompt("Jugador:", "");
  if (!jugador) return;
  const equipoPrompt = prompt("Equipo (id, ej: ARG):", partido.local);
  const equipoId = equipoPrompt || partido.local;

  const eventos = [...(partido.eventos || [])];
  eventos.push({
    idPartido, minuto: parseInt(minuto, 10), tipo, jugador, equipoId,
    descripcion: tipo === "gol" ? `Gol de ${jugador}` :
      tipo === "amarilla" ? `Tarjeta amarilla — ${jugador}` :
      tipo === "roja" ? `Tarjeta roja — ${jugador}` :
      tipo === "sust" ? `Cambio — ${jugador}` : jugador,
  });
  eventos.sort((a, b) => a.minuto - b.minuto);
  actualizarPartido(idPartido, { eventos });
  refrescarVistaActual();
  const el = document.getElementById(`cronologia-${idPartido}`);
  if (el) el.classList.add("visible");
}

function eliminarEvento(idPartido, indice) {
  const partido = obtenerEstadoTorneo().partidos.find((p) => p.id === idPartido);
  if (!partido) return;
  const eventos = [...(partido.eventos || [])];
  eventos.splice(indice, 1);
  actualizarPartido(idPartido, { eventos });
  refrescarVistaActual();
}


