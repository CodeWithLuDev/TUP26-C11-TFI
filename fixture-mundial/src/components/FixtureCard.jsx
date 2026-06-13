import React, { useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { getEquipoById } from "../utils/logic";
import Flag from "./Flag";

const SEDES = {
  A1:"MEXICO CITY",A2:"GUADALAJARA",A3:"ATLANTA",A4:"GUADALAJARA",A5:"MEXICO CITY",A6:"MONTERREY",
  B1:"TORONTO",B2:"SAN FRANCISCO",B3:"LOS ANGELES",B4:"VANCOUVER",B5:"VANCOUVER",B6:"SEATTLE",
  C1:"BOSTON",C2:"NEW YORK",C3:"BOSTON",C4:"PHILADELPHIA",C5:"MIAMI",C6:"ATLANTA",
  D1:"LOS ANGELES",D2:"VANCOUVER",D3:"SEATTLE",D4:"SAN FRANCISCO",D5:"LOS ANGELES",D6:"SAN FRANCISCO",
  E1:"PHILADELPHIA",E2:"HOUSTON",E3:"TORONTO",E4:"KANSAS CITY",E5:"PHILADELPHIA",E6:"NEW YORK",
  F1:"DALLAS",F2:"MONTERREY",F3:"HOUSTON",F4:"MONTERREY",F5:"DALLAS",F6:"KANSAS CITY",
  G1:"SEATTLE",G2:"LOS ANGELES",G3:"LOS ANGELES",G4:"VANCOUVER",G5:"SEATTLE",G6:"VANCOUVER",
  H1:"ATLANTA",H2:"MIAMI",H3:"ATLANTA",H4:"MIAMI",H5:"HOUSTON",H6:"GUADALAJARA",
  I1:"NEW YORK",I2:"BOSTON",I3:"PHILADELPHIA",I4:"NEW YORK",I5:"BOSTON",I6:"TORONTO",
  J1:"KANSAS CITY",J2:"SAN FRANCISCO",J3:"DALLAS",J4:"SAN FRANCISCO",J5:"KANSAS CITY",J6:"DALLAS",
  K1:"HOUSTON",K2:"MEXICO CITY",K3:"HOUSTON",K4:"GUADALAJARA",K5:"MIAMI",K6:"ATLANTA",
  L1:"DALLAS",L2:"TORONTO",L3:"BOSTON",L4:"TORONTO",L5:"NEW YORK",L6:"PHILADELPHIA",
};

const DIAS = ["DOM","LUN","MAR","MIÉ","JUE","VIE","SÁB"];
const MESES = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SET","OCT","NOV","DIC"];

function aYMD(fecha) {
  if (typeof fecha === "string") return fecha.split("T")[0];
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatearFecha(fechaISO) {
  const [y, m, d] = fechaISO.split("T")[0].split("-").map(Number);
  const fecha = new Date(y, m - 1, d);
  return `${DIAS[fecha.getDay()]}, ${d} ${MESES[m - 1]}`;
}

function formatearHora(fechaISO) {
  const [, hora] = fechaISO.split("T");
  return hora.slice(0, 5);
}

export default function FixtureCard() {
  const { equipos, partidos } = useAppContext();
  const hoyStr = aYMD(new Date());
  const [fechaSel, setFechaSel] = useState(hoyStr);

  const cambiarDia = (delta) => {
    const d = new Date(fechaSel + "T12:00:00");
    d.setDate(d.getDate() + delta);
    setFechaSel(aYMD(d));
  };

  const partidosDelDia = useMemo(() => {
    return partidos
      .filter(p => p.fase === "Grupos" && aYMD(p.fecha) === fechaSel)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }, [partidos, fechaSel]);

  const fechaFormateada = partidosDelDia.length > 0
    ? formatearFecha(partidosDelDia[0].fecha)
    : (() => {
        const [y, m, d] = fechaSel.split("-").map(Number);
        const fecha = new Date(y, m - 1, d);
        return `${DIAS[fecha.getDay()]}, ${d} ${MESES[m - 1]}`;
      })();

  const hoyBool = fechaSel === hoyStr;

  return (
    <div className="fixture-wrapper">
      {/* Navegador de fechas */}
      <div className="fixture-nav">
        <button className="fixture-nav-btn" onClick={() => cambiarDia(-1)}>◀</button>
        <div className="fixture-nav-fecha">
          <input
            type="date"
            value={fechaSel}
            onChange={e => setFechaSel(e.target.value)}
            className="fixture-date-input"
          />
          <span className="fixture-nav-label">{fechaFormateada.toUpperCase()}</span>
        </div>
        <button className="fixture-nav-btn" onClick={() => cambiarDia(1)}>▶</button>
        <button
          className={`fixture-nav-hoy ${hoyBool ? "activo" : ""}`}
          onClick={() => setFechaSel(hoyStr)}
          disabled={hoyBool}
        >Hoy</button>
      </div>

      {partidosDelDia.length === 0 ? (
        <div className="fixture-empty">
          <p>No hay partidos de fase de grupos para esta fecha.</p>
        </div>
      ) : (
        <div className="fixture-lista">
          {partidosDelDia.map(p => {
            const local = getEquipoById(equipos, p.id_local);
            const visitante = getEquipoById(equipos, p.id_visitante);
            if (!local || !visitante) return null;
            return (
              <div key={p.id} className="fixture-partido">
                <div className="fixture-info">
                  <span className="fixture-hora">{formatearHora(p.fecha)}</span>
                  <span className="fixture-sede">{SEDES[p.id] || "TBD"}</span>
                  <span className="fixture-fase">Group Stage - {p.grupo}</span>
                </div>

                <div className="fixture-equipos">
                  <div className="fixture-equipo">
                    <div className="fixture-equipo-izq">
                      <Flag equipoId={p.id_local} size="w20" className="bandera-img" />
                      <span className="fixture-nombre">{local.nombre}</span>
                    </div>
                    <span className="fixture-abrev">{p.grupo}</span>
                  </div>

                  <div className="fixture-divisor" />

                  <div className="fixture-equipo">
                    <div className="fixture-equipo-izq">
                      <Flag equipoId={p.id_visitante} size="w20" className="bandera-img" />
                      <span className="fixture-nombre">{visitante.nombre}</span>
                    </div>
                    <span className="fixture-abrev">{p.grupo}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}