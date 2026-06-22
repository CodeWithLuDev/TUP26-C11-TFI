const EQUIPOS = [
  { id: "MEX", nombre: "México", codigoIso: "mx", grupo: "A", confederacion: "CONCACAF", estadioLocal: "Estadio Azteca, CDMX" },
  { id: "RSA", nombre: "Sudáfrica", codigoIso: "za", grupo: "A", confederacion: "CAF", estadioLocal: "Estadio Azteca, CDMX" },
  { id: "KOR", nombre: "Corea del Sur", codigoIso: "kr", grupo: "A", confederacion: "AFC", estadioLocal: "Estadio BBVA, Monterrey" },
  { id: "CZE", nombre: "República Checa", codigoIso: "cz", grupo: "A", confederacion: "UEFA", estadioLocal: "Estadio Akron, Guadalajara" },

  { id: "CAN", nombre: "Canadá", codigoIso: "ca", grupo: "B", confederacion: "CONCACAF", estadioLocal: "BC Place, Vancouver" },
  { id: "BIH", nombre: "Bosnia y Herzegovina", codigoIso: "ba", grupo: "B", confederacion: "UEFA", estadioLocal: "Estadio Seattle" },
  { id: "QAT", nombre: "Qatar", codigoIso: "qa", grupo: "B", confederacion: "AFC", estadioLocal: "Estadio Los Ángeles" },
  { id: "SUI", nombre: "Suiza", codigoIso: "ch", grupo: "B", confederacion: "UEFA", estadioLocal: "Estadio Seattle" },

  { id: "BRA", nombre: "Brasil", codigoIso: "br", grupo: "C", confederacion: "CONMEBOL", estadioLocal: "MetLife Stadium, Nueva Jersey" },
  { id: "MAR", nombre: "Marruecos", codigoIso: "ma", grupo: "C", confederacion: "CAF", estadioLocal: "Estadio Boston" },
  { id: "HAI", nombre: "Haití", codigoIso: "ht", grupo: "C", confederacion: "CONCACAF", estadioLocal: "Estadio Filadelfia" },
  { id: "SCO", nombre: "Escocia", codigoIso: "gb-sct", grupo: "C", confederacion: "UEFA", estadioLocal: "Estadio Miami" },

  { id: "USA", nombre: "Estados Unidos", codigoIso: "us", grupo: "D", confederacion: "CONCACAF", estadioLocal: "Estadio Seattle" },
  { id: "PAR", nombre: "Paraguay", codigoIso: "py", grupo: "D", confederacion: "CONMEBOL", estadioLocal: "Estadio Bahía de San Francisco" },
  { id: "AUS", nombre: "Australia", codigoIso: "au", grupo: "D", confederacion: "AFC", estadioLocal: "Estadio Los Ángeles" },
  { id: "TUR", nombre: "Turquía", codigoIso: "tr", grupo: "D", confederacion: "UEFA", estadioLocal: "Estadio Seattle" },

  { id: "GER", nombre: "Alemania", codigoIso: "de", grupo: "E", confederacion: "UEFA", estadioLocal: "Estadio Houston" },
  { id: "CUW", nombre: "Curazao", codigoIso: "cw", grupo: "E", confederacion: "CONCACAF", estadioLocal: "AT&T Stadium, Dallas" },
  { id: "CIV", nombre: "Costa de Marfil", codigoIso: "ci", grupo: "E", confederacion: "CAF", estadioLocal: "Estadio Houston" },
  { id: "ECU", nombre: "Ecuador", codigoIso: "ec", grupo: "E", confederacion: "CONMEBOL", estadioLocal: "AT&T Stadium, Dallas" },

  { id: "NED", nombre: "Países Bajos", codigoIso: "nl", grupo: "F", confederacion: "UEFA", estadioLocal: "AT&T Stadium, Dallas" },
  { id: "JPN", nombre: "Japón", codigoIso: "jp", grupo: "F", confederacion: "AFC", estadioLocal: "Estadio Houston" },
  { id: "SWE", nombre: "Suecia", codigoIso: "se", grupo: "F", confederacion: "UEFA", estadioLocal: "Estadio Houston" },
  { id: "TUN", nombre: "Túnez", codigoIso: "tn", grupo: "F", confederacion: "CAF", estadioLocal: "Estadio Kansas City" },

  { id: "BEL", nombre: "Bélgica", codigoIso: "be", grupo: "G", confederacion: "UEFA", estadioLocal: "Estadio Seattle" },
  { id: "EGY", nombre: "Egipto", codigoIso: "eg", grupo: "G", confederacion: "CAF", estadioLocal: "Estadio Los Ángeles" },
  { id: "IRN", nombre: "Irán", codigoIso: "ir", grupo: "G", confederacion: "AFC", estadioLocal: "BC Place, Vancouver" },
  { id: "NZL", nombre: "Nueva Zelanda", codigoIso: "nz", grupo: "G", confederacion: "OFC", estadioLocal: "Estadio Los Ángeles" },

  { id: "ESP", nombre: "España", codigoIso: "es", grupo: "H", confederacion: "UEFA", estadioLocal: "Estadio Atlanta" },
  { id: "CPV", nombre: "Cabo Verde", codigoIso: "cv", grupo: "H", confederacion: "CAF", estadioLocal: "Estadio Miami" },
  { id: "KSA", nombre: "Arabia Saudí", codigoIso: "sa", grupo: "H", confederacion: "AFC", estadioLocal: "Estadio Atlanta" },
  { id: "URU", nombre: "Uruguay", codigoIso: "uy", grupo: "H", confederacion: "CONMEBOL", estadioLocal: "Estadio Miami" },

  { id: "FRA", nombre: "Francia", codigoIso: "fr", grupo: "I", confederacion: "UEFA", estadioLocal: "AT&T Stadium, Dallas" },
  { id: "SEN", nombre: "Senegal", codigoIso: "sn", grupo: "I", confederacion: "CAF", estadioLocal: "Estadio Seattle" },
  { id: "IRQ", nombre: "Irak", codigoIso: "iq", grupo: "I", confederacion: "AFC", estadioLocal: "Estadio Boston" },
  { id: "NOR", nombre: "Noruega", codigoIso: "no", grupo: "I", confederacion: "UEFA", estadioLocal: "AT&T Stadium, Dallas" },

  { id: "ARG", nombre: "Argentina", codigoIso: "ar", grupo: "J", confederacion: "CONMEBOL", estadioLocal: "AT&T Stadium, Dallas" },
  { id: "ALG", nombre: "Argelia", codigoIso: "dz", grupo: "J", confederacion: "CAF", estadioLocal: "Estadio Houston" },
  { id: "AUT", nombre: "Austria", codigoIso: "at", grupo: "J", confederacion: "UEFA", estadioLocal: "AT&T Stadium, Dallas" },
  { id: "JOR", nombre: "Jordania", codigoIso: "jo", grupo: "J", confederacion: "AFC", estadioLocal: "Estadio Houston" },

  { id: "POR", nombre: "Portugal", codigoIso: "pt", grupo: "K", confederacion: "UEFA", estadioLocal: "Estadio Houston" },
  { id: "COD", nombre: "República Democrática del Congo", codigoIso: "cd", grupo: "K", confederacion: "CAF", estadioLocal: "Estadio Guadalajara" },
  { id: "UZB", nombre: "Uzbekistán", codigoIso: "uz", grupo: "K", confederacion: "AFC", estadioLocal: "Estadio Guadalajara" },
  { id: "COL", nombre: "Colombia", codigoIso: "co", grupo: "K", confederacion: "CONMEBOL", estadioLocal: "Estadio Miami" },

  { id: "ENG", nombre: "Inglaterra", codigoIso: "gb-eng", grupo: "L", confederacion: "UEFA", estadioLocal: "BMO Field, Toronto" },
  { id: "CRO", nombre: "Croacia", codigoIso: "hr", grupo: "L", confederacion: "UEFA", estadioLocal: "Estadio Boston" },
  { id: "GHA", nombre: "Ghana", codigoIso: "gh", grupo: "L", confederacion: "CAF", estadioLocal: "BMO Field, Toronto" },
  { id: "PAN", nombre: "Panamá", codigoIso: "pa", grupo: "L", confederacion: "CONCACAF", estadioLocal: "MetLife Stadium, Nueva Jersey" },
];

const GRUPOS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

const URL_BANDERAS = "https://flagcdn.com/w80";

function getFlagUrl(codigoIso) {
  return `${URL_BANDERAS}/${codigoIso}.png`;
}

function getFlagImg(codigoIso, alt, tamano = "w80") {
  const textoAlt = alt || "?";
  if (!codigoIso) return `<span class="bandera-fallback">${textoAlt}</span>`;
  const url = tamano === "w80" ? `${URL_BANDERAS}/${codigoIso}.png` : `${URL_BANDERAS.replace("w80", tamano)}/${codigoIso}.png`;
  return `<img src="${url}" alt="${textoAlt}" class="bandera-img" loading="lazy" onerror="this.parentElement.innerHTML='<span class=\\'bandera-fallback\\'>${textoAlt}</span>'">`;
}

function obtenerEquiposPorGrupo(letraGrupo) {
  return EQUIPOS.filter((equipo) => equipo.grupo === letraGrupo);
}

function obtenerEquipoPorId(id) {
  return EQUIPOS.find((equipo) => equipo.id === id) || null;
}
