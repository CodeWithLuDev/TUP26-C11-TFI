import React from "react";

export default function LandingPage({ onIngresar }) {
  return (
    <div className="landing">
      <div className="landing-card">
        <div className="landing-logo">
          <svg viewBox="0 0 512 512" width="160" height="160">
            <defs>
              <linearGradient id="dorado" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0d060"/>
                <stop offset="50%" stopColor="#c9a227"/>
                <stop offset="100%" stopColor="#a07818"/>
              </linearGradient>
            </defs>
            <rect x="180" y="340" width="152" height="20" rx="4" fill="url(#dorado)"/>
            <rect x="200" y="320" width="112" height="24" rx="3" fill="url(#dorado)"/>
            <path d="M200 320 L210 200 L302 200 L312 320 Z" fill="none" stroke="url(#dorado)" strokeWidth="8"/>
            <line x1="210" y1="250" x2="302" y2="250" stroke="url(#dorado)" strokeWidth="3"/>
            <line x1="206" y1="280" x2="306" y2="280" stroke="url(#dorado)" strokeWidth="3"/>
            <path d="M200 240 Q160 240 160 290 Q160 320 200 310" fill="none" stroke="url(#dorado)" strokeWidth="6" strokeLinecap="round"/>
            <path d="M312 240 Q352 240 352 290 Q352 320 312 310" fill="none" stroke="url(#dorado)" strokeWidth="6" strokeLinecap="round"/>
            <circle cx="256" cy="140" r="55" fill="none" stroke="url(#dorado)" strokeWidth="6"/>
            <ellipse cx="256" cy="140" rx="20" ry="55" fill="none" stroke="url(#dorado)" strokeWidth="2"/>
            <ellipse cx="256" cy="140" rx="55" ry="20" fill="none" stroke="url(#dorado)" strokeWidth="2"/>
            <polygon points="256,125 261,140 276,140 264,150 268,166 256,156 244,166 248,150 236,140 251,140" fill="url(#dorado)"/>
            <rect x="210" y="370" width="92" height="36" rx="8" fill="none" stroke="url(#dorado)" strokeWidth="3"/>
            <text x="256" y="395" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="bold" fill="url(#dorado)" textAnchor="middle">2026</text>
          </svg>
        </div>
        <h1 className="landing-titulo">Mundial 2026</h1>
        <p className="landing-subtitulo">Fixture interactivo de la Copa del Mundo</p>
        <button className="landing-boton" onClick={onIngresar}>Comenzar</button>
      </div>
    </div>
  );
}