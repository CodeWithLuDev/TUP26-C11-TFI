function renderizarDondeVer() {
  const contenedor = document.getElementById("vista-donde-ver");

  const plataformas = [
    { nombre: "FIFA+", tipo: "Streaming", url: "https://www.plus.fifa.com", desc: "Transmisiones en vivo, repeticiones y contenido exclusivo oficial de la FIFA.", color: "#3b1f6e" },
    { nombre: "Fox Sports", tipo: "TV / Streaming", url: "https://www.foxsports.com", desc: "Cobertura principal en EE.UU. con todos los partidos en vivo.", color: "#003366" },
    { nombre: "Telemundo", tipo: "TV / Streaming", url: "https://www.telemundo.com/deportes", desc: "Transmisión en español para Estados Unidos y América Latina.", color: "#00843d" },
    { nombre: "TV Azteca", tipo: "TV / Streaming", url: "https://www.tvazteca.com", desc: "Cobertura para México con señal abierta y streaming.", color: "#c8102e" },
    { nombre: "Canal 5 (Televisa)", tipo: "TV", url: "https://www.televisa.com", desc: "Transmisión de partidos en México por señal abierta.", color: "#00205b" },
    { nombre: "ESPN / Star+", tipo: "Streaming", url: "https://www.espn.com", desc: "Cobertura en Latinoamérica vía ESPN y Star+.", color: "#db0032" },
    { nombre: "DSports (Directv)", tipo: "TV / Streaming", url: "https://www.directv.com.ar", desc: "Disponible en toda América Latina vía Directv y DGO.", color: "#002d62" },
    { nombre: "Globoplay / TV Globo", tipo: "TV / Streaming", url: "https://globoplay.globo.com", desc: "Señal abierta y streaming para Brasil.", color: "#00a651" },
    { nombre: "BBC iPlayer", tipo: "Streaming", url: "https://www.bbc.co.uk/iplayer", desc: "Cobertura en Reino Unido vía BBC y ITV.", color: "#bb1919" },
    { nombre: "ARD / ZDF", tipo: "TV / Streaming", url: "https://www.ard.de", desc: "Señal abierta y streaming en Alemania.", color: "#003153" },
    { nombre: "TF1 / M6", tipo: "TV / Streaming", url: "https://www.tf1.fr", desc: "Cobertura en Francia por TF1 y M6.", color: "#002395" },
    { nombre: "RAI", tipo: "TV / Streaming", url: "https://www.rai.it", desc: "Transmisión oficial en Italia.", color: "#003366" },
    { nombre: "NHK / TV Asahi", tipo: "TV", url: "https://www.nhk.or.jp", desc: "Cobertura en Japón.", color: "#222222" },
    { nombre: "SBS", tipo: "TV / Streaming", url: "https://www.sbs.com.au", desc: "Cobertura gratuita en Australia.", color: "#003399" },
    { nombre: "Mediaset España", tipo: "TV / Streaming", url: "https://www.mediaset.es", desc: "Transmisión en España (Telecinco, Cuatro).", color: "#00a94f" },
  ];

  const apps = [
    { nombre: "FIFA+", icono: "📱", tipo: "Web / iOS / Android", url: "https://www.plus.fifa.com" },
    { nombre: "OneFootball", icono: "⚽", tipo: "Web / iOS / Android", url: "https://onefootball.com" },
    { nombre: "LiveScore", icono: "📊", tipo: "Web / iOS / Android", url: "https://www.livescore.com" },
    { nombre: "Flashscore", icono: "⚡", tipo: "Web / iOS / Android", url: "https://www.flashscore.com" },
    { nombre: "365Scores", icono: "📰", tipo: "Web / iOS / Android", url: "https://www.365scores.com" },
    { nombre: "Sofascore", icono: "📈", tipo: "Web / iOS / Android", url: "https://www.sofascore.com" },
    { nombre: "Google Noticias", icono: "🔍", tipo: "Web / iOS / Android", url: "https://news.google.com" },
  ];

  contenedor.innerHTML = `
    <h2 class="titulo-seccion">Dónde ver el Mundial 2026</h2>

    <div class="donde-ver-grid">
      <div class="donde-ver-col">
        <h3 class="donde-ver-subtitulo">📺 Plataformas de TV y Streaming</h3>
        <div class="donde-ver-lista">
          ${plataformas.map(p => `
            <div class="donde-ver-tarjeta" style="border-left-color: ${p.color}">
              <div class="donde-ver-tarjeta__info">
                <strong>${p.nombre}</strong>
                <span class="donde-ver-tarjeta__tipo">${p.tipo}</span>
                <p>${p.desc}</p>
              </div>
              <a href="${p.url}" target="_blank" rel="noopener" class="donde-ver-tarjeta__link">Ir al sitio →</a>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="donde-ver-col">
        <h3 class="donde-ver-subtitulo">📱 Apps de seguimiento</h3>
        <div class="donde-ver-lista">
          ${apps.map(a => `
            <div class="donde-ver-tarjeta">
              <div class="donde-ver-tarjeta__info">
                <strong>${a.icono} ${a.nombre}</strong>
                <span class="donde-ver-tarjeta__tipo">${a.tipo}</span>
                <p>Resultados, estadísticas y notificaciones en tiempo real.</p>
              </div>
              <a href="${a.url}" target="_blank" rel="noopener" class="donde-ver-tarjeta__link">Abrir →</a>
            </div>
          `).join("")}
        </div>

        <div class="donde-ver-tip">
          <h4>💡 Consejos</h4>
          <ul>
            <li>Verificá la programación local según tu país — los horarios varían por zona horaria.</li>
            <li>Muchas plataformas ofrecen pruebas gratuitas durante el Mundial.</li>
            <li>Usá apps como Sofascore o Flashscore para recibir notificaciones de goles al instante.</li>
            <li>Consultá FIFA+ para contenido exclusivo detrás de escena y repeticiones.</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}
