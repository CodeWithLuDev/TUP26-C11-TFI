import React from "react";
import logoMundial from "../imagen/mundial_2026.png";
import fondoPrincipal from "../imagen/pagina-principal.png";

const banderas = [
  { codigo: "us", nombre: "USA" },
  { codigo: "ca", nombre: "Canadá" },
  { codigo: "mx", nombre: "México" },
];

export default function LandingPage({ onIngresar }) {
  return (
    <div className="landing" style={{ backgroundImage: `url(${fondoPrincipal})` }}>
      <div className="landing-overlay"></div>
      <div className="landing-card">
        <div className="landing-logo">
          <img src={logoMundial} alt="Mundial 2026" className="logo-mundial" />
        </div>
        <h1 className="landing-titulo">Copa del Mundo 2026</h1>
        <div className="landing-bandera-container">
          {banderas.map((b) => (
            <div key={b.codigo} className="landing-bandera-item">
              <img
                src={`https://flagcdn.com/w80/${b.codigo}.png`}
                alt={b.nombre}
                className="landing-bandera-img"
              />
              <span className="landing-bandera-nombre">{b.nombre}</span>
            </div>
          ))}
        </div>
        <button className="landing-boton" onClick={onIngresar}>Comenzar</button>
      </div>
    </div>
  );
}
