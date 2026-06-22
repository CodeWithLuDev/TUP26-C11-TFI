function renderizarInicio() {
  const contenedor = document.getElementById("vista-inicio");
  const nombreGuardado = localStorage.getItem("fixture-usuario");

  contenedor.innerHTML = `
    <div class="inicio-bg">
      <div class="inicio-bg-overlay"></div>
      <div class="inicio-content">
        <div class="inicio-trofeo">🏆</div>

        <h1 class="inicio-titulo">Mundial 2026</h1>
        <p class="inicio-subtitulo">México · Estados Unidos · Canadá</p>

        <div id="saludo-container" style="width:100%;max-width:480px">
          ${nombreGuardado ? `
            <div class="inicio-panel">
              <p class="inicio-saludo">¡Bienvenido <span class="inicio-nombre">${nombreGuardado}</span>!</p>
              <p style="font-size:13px;color:var(--texto-secundario);margin:0">Preparate para vivir la Copa del Mundo 2026</p>
              <div style="margin-top:20px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
                <button class="boton-chico confirmar" onclick="document.querySelector('[data-vista=\\'grupos\\']').click()">Ver grupos</button>
                <button class="boton-chico" onclick="document.querySelector('[data-vista=\\'fixture\\']').click()">Ir al fixture</button>
                <button class="boton-chico borrar" id="btn-cambiar-nombre" style="border-color:var(--borde);color:var(--texto-secundario)">Cambiar nombre</button>
              </div>
            </div>
          ` : `
            <div class="inicio-panel">
              <p style="font-size:18px;margin:0 0 16px;font-weight:500">¿Cómo te llamás?</p>
              <input type="text" id="input-nombre" placeholder="Tu nombre..." maxlength="30"
                style="width:100%;padding:12px 16px;font-size:16px;border:1px solid var(--borde);border-radius:8px;background:var(--fondo);color:var(--texto);font-family:var(--fuente-texto);box-sizing:border-box">
              <button id="btn-guardar-nombre" class="boton-chico confirmar" style="margin-top:14px;width:100%;padding:12px;font-size:14px">¡Ingresar al Mundial!</button>
            </div>
          `}
        </div>

        <div class="inicio-stats">
          <div class="historial-stat">
            <span class="historial-stat__num">48</span>
            <span class="historial-stat__label">Selecciones</span>
          </div>
          <div class="historial-stat">
            <span class="historial-stat__num">12</span>
            <span class="historial-stat__label">Grupos</span>
          </div>
          <div class="historial-stat">
            <span class="historial-stat__num">104</span>
            <span class="historial-stat__label">Partidos</span>
          </div>
          <div class="historial-stat">
            <span class="historial-stat__num">3</span>
            <span class="historial-stat__label">Países sede</span>
          </div>
        </div>

        <p class="inicio-desc">
          La Copa Mundial de la FIFA 2026 será la 23.ª edición. Por primera vez con <strong>48 selecciones</strong>
          en <strong>12 grupos</strong>, disputando 104 partidos en México, Estados Unidos y Canadá.
        </p>
      </div>
    </div>
  `;

  const btnGuardar = document.getElementById("btn-guardar-nombre");
  if (btnGuardar) {
    btnGuardar.addEventListener("click", () => {
      const input = document.getElementById("input-nombre");
      const nombre = input.value.trim();
      if (!nombre) { input.focus(); return; }
      localStorage.setItem("fixture-usuario", nombre);
      renderizarInicio();
    });
    document.getElementById("input-nombre").addEventListener("keydown", (e) => {
      if (e.key === "Enter") btnGuardar.click();
    });
  }

  const btnCambiar = document.getElementById("btn-cambiar-nombre");
  if (btnCambiar) {
    btnCambiar.addEventListener("click", () => {
      localStorage.removeItem("fixture-usuario");
      renderizarInicio();
    });
  }
}