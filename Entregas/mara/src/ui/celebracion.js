// src/ui/celebracion.js
// Efecto de papelitos al confirmar resultado

const COLORES = [
  "#c9a84c","#e8c96a","#74b9ff","#00ff88",
  "#ff6b6b","#fff","#a29bfe","#fd79a8",
];

export function lanzarCelebracion() {
  const contenedor = document.getElementById("celebracion");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const cantidad = 80;

  for (let i = 0; i < cantidad; i++) {
    const papel = document.createElement("div");
    papel.className = "papel";

    const x     = Math.random() * 100;          // posición horizontal %
    const dur   = 1.5 + Math.random() * 1.5;    // duración segundos
    const drift = (Math.random() - 0.5) * 200;  // desplazamiento horizontal px
    const color = COLORES[Math.floor(Math.random() * COLORES.length)];
    const delay = Math.random() * 0.8;
    const rot   = Math.random() > 0.5 ? "3px" : "8px";
    const alto  = 8 + Math.random() * 8;

    papel.style.cssText = `
      left: ${x}%;
      background: ${color};
      --dur: ${dur}s;
      --drift: ${drift}px;
      animation-delay: ${delay}s;
      width: ${rot};
      height: ${alto}px;
      border-radius: ${Math.random() > 0.5 ? "50%" : "1px"};
    `;

    contenedor.appendChild(papel);
  }

  // Limpiar después de la animación
  setTimeout(() => { contenedor.innerHTML = ""; }, 3500);
}