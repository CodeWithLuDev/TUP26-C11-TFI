// =============================================
// COMPONENTE FLAG — Bandera real desde flagcdn.com
// src/components/Flag.jsx
// =============================================

import React from "react";

// Mapa de código de equipo -> código ISO 3166-1 alpha-2 (minúsculas)
export const CODIGOS_PAIS = {
  e01: "mx", // México
  e02: "za", // Sudáfrica
  e03: "kr", // Corea del Sur
  e04: "cz", // Chequia
  e05: "ca", // Canadá
  e06: "ch", // Suiza
  e07: "qa", // Qatar
  e08: "ba", // Bosnia y Herz.
  e09: "br", // Brasil
  e10: "ma", // Marruecos
  e11: "ht", // Haití
  e12: "gb-sct", // Escocia
  e13: "us", // Estados Unidos
  e14: "py", // Paraguay
  e15: "au", // Australia
  e16: "tr", // Turquía
  e17: "de", // Alemania
  e18: "cw", // Curazao
  e19: "ci", // Costa de Marfil
  e20: "ec", // Ecuador
  e21: "nl", // Países Bajos
  e22: "jp", // Japón
  e23: "tn", // Túnez
  e24: "se", // Suecia
  e25: "be", // Bélgica
  e26: "eg", // Egipto
  e27: "ir", // Irán
  e28: "nz", // Nueva Zelanda
  e29: "es", // España
  e30: "cv", // Cabo Verde
  e31: "sa", // Arabia Saudita
  e32: "uy", // Uruguay
  e33: "fr", // Francia
  e34: "sn", // Senegal
  e35: "no", // Noruega
  e36: "iq", // Irak
  e37: "ar", // Argentina
  e38: "dz", // Argelia
  e39: "at", // Austria
  e40: "jo", // Jordania
  e41: "pt", // Portugal
  e42: "co", // Colombia
  e43: "uz", // Uzbekistán
  e44: "cd", // R.D. del Congo
  e45: "gb-eng", // Inglaterra
  e46: "hr", // Croacia
  e47: "gh", // Ghana
  e48: "pa", // Panamá
};

// w20, w40, w80, w160, w320, w640, w1280, w2560 son los anchos disponibles en flagcdn
export default function Flag({ equipoId, size = "w40", className = "" }) {
  const codigo = CODIGOS_PAIS[equipoId];
  if (!codigo) return <span className={`flag-fallback ${className}`}>🏳️</span>;

  return (
    <img
      src={`https://flagcdn.com/${size}/${codigo}.png`}
      srcSet={`https://flagcdn.com/${size.replace('w','w')}/${codigo}.png 1x, https://flagcdn.com/${size === 'w20' ? 'w40' : 'w80'}/${codigo}.png 2x`}
      alt={`Bandera de ${codigo}`}
      className={`flag-img ${className}`}
      loading="lazy"
    />
  );
}