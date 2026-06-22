// =============================================
// ETAPA 1: ESTRUCTURA DE DATOS - MUNDIAL 2026
// Equipos y partidos OFICIALES según sorteo FIFA
// del 5 de diciembre de 2025
// =============================================

export const equipos = [
  // GRUPO A
  { id: "e01", nombre: "México",             grupo: "A", bandera: "🇲🇽" },
  { id: "e02", nombre: "Sudáfrica",          grupo: "A", bandera: "🇿🇦" },
  { id: "e03", nombre: "Corea del Sur",      grupo: "A", bandera: "🇰🇷" },
  { id: "e04", nombre: "Chequia",            grupo: "A", bandera: "🇨🇿" },

  // GRUPO B
  { id: "e05", nombre: "Canadá",             grupo: "B", bandera: "🇨🇦" },
  { id: "e06", nombre: "Suiza",              grupo: "B", bandera: "🇨🇭" },
  { id: "e07", nombre: "Qatar",              grupo: "B", bandera: "🇶🇦" },
  { id: "e08", nombre: "Bosnia y Herz.",     grupo: "B", bandera: "🇧🇦" },

  // GRUPO C
  { id: "e09", nombre: "Brasil",             grupo: "C", bandera: "🇧🇷" },
  { id: "e10", nombre: "Marruecos",          grupo: "C", bandera: "🇲🇦" },
  { id: "e11", nombre: "Haití",              grupo: "C", bandera: "🇭🇹" },
  { id: "e12", nombre: "Escocia",            grupo: "C", bandera: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },

  // GRUPO D
  { id: "e13", nombre: "Estados Unidos",     grupo: "D", bandera: "🇺🇸" },
  { id: "e14", nombre: "Paraguay",           grupo: "D", bandera: "🇵🇾" },
  { id: "e15", nombre: "Australia",          grupo: "D", bandera: "🇦🇺" },
  { id: "e16", nombre: "Turquía",            grupo: "D", bandera: "🇹🇷" },

  // GRUPO E
  { id: "e17", nombre: "Alemania",           grupo: "E", bandera: "🇩🇪" },
  { id: "e18", nombre: "Curazao",            grupo: "E", bandera: "🇨🇼" },
  { id: "e19", nombre: "Costa de Marfil",    grupo: "E", bandera: "🇨🇮" },
  { id: "e20", nombre: "Ecuador",            grupo: "E", bandera: "🇪🇨" },

  // GRUPO F
  { id: "e21", nombre: "Países Bajos",       grupo: "F", bandera: "🇳🇱" },
  { id: "e22", nombre: "Japón",              grupo: "F", bandera: "🇯🇵" },
  { id: "e23", nombre: "Túnez",              grupo: "F", bandera: "🇹🇳" },
  { id: "e24", nombre: "Suecia",             grupo: "F", bandera: "🇸🇪" },

  // GRUPO G
  { id: "e25", nombre: "Bélgica",            grupo: "G", bandera: "🇧🇪" },
  { id: "e26", nombre: "Egipto",             grupo: "G", bandera: "🇪🇬" },
  { id: "e27", nombre: "Irán",               grupo: "G", bandera: "🇮🇷" },
  { id: "e28", nombre: "Nueva Zelanda",      grupo: "G", bandera: "🇳🇿" },

  // GRUPO H
  { id: "e29", nombre: "España",             grupo: "H", bandera: "🇪🇸" },
  { id: "e30", nombre: "Cabo Verde",         grupo: "H", bandera: "🇨🇻" },
  { id: "e31", nombre: "Arabia Saudita",     grupo: "H", bandera: "🇸🇦" },
  { id: "e32", nombre: "Uruguay",            grupo: "H", bandera: "🇺🇾" },

  // GRUPO I
  { id: "e33", nombre: "Francia",            grupo: "I", bandera: "🇫🇷" },
  { id: "e34", nombre: "Senegal",            grupo: "I", bandera: "🇸🇳" },
  { id: "e35", nombre: "Noruega",            grupo: "I", bandera: "🇳🇴" },
  { id: "e36", nombre: "Irak",               grupo: "I", bandera: "🇮🇶" },

  // GRUPO J
  { id: "e37", nombre: "Argentina",          grupo: "J", bandera: "🇦🇷" },
  { id: "e38", nombre: "Argelia",            grupo: "J", bandera: "🇩🇿" },
  { id: "e39", nombre: "Austria",            grupo: "J", bandera: "🇦🇹" },
  { id: "e40", nombre: "Jordania",           grupo: "J", bandera: "🇯🇴" },

  // GRUPO K
  { id: "e41", nombre: "Portugal",           grupo: "K", bandera: "🇵🇹" },
  { id: "e42", nombre: "Colombia",           grupo: "K", bandera: "🇨🇴" },
  { id: "e43", nombre: "Uzbekistán",         grupo: "K", bandera: "🇺🇿" },
  { id: "e44", nombre: "R.D. del Congo",     grupo: "K", bandera: "🇨🇩" },

  // GRUPO L
  { id: "e45", nombre: "Inglaterra",         grupo: "L", bandera: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "e46", nombre: "Croacia",            grupo: "L", bandera: "🇭🇷" },
  { id: "e47", nombre: "Ghana",              grupo: "L", bandera: "🇬🇭" },
  { id: "e48", nombre: "Panamá",             grupo: "L", bandera: "🇵🇦" },
];

export const partidos = [

  // ==================== GRUPO A ====================
  { id: "A1", id_local: "e01", id_visitante: "e02", goles_local: null, goles_visitante: null, grupo: "A", fase: "Grupos", fecha: "2026-06-11T16:00:00", estado: "pendiente" },
  { id: "A2", id_local: "e03", id_visitante: "e04", goles_local: null, goles_visitante: null, grupo: "A", fase: "Grupos", fecha: "2026-06-11T23:00:00", estado: "pendiente" },
  { id: "A3", id_local: "e04", id_visitante: "e02", goles_local: null, goles_visitante: null, grupo: "A", fase: "Grupos", fecha: "2026-06-18T13:00:00", estado: "pendiente" },
  { id: "A4", id_local: "e01", id_visitante: "e03", goles_local: null, goles_visitante: null, grupo: "A", fase: "Grupos", fecha: "2026-06-18T22:00:00", estado: "pendiente" },
  { id: "A5", id_local: "e04", id_visitante: "e01", goles_local: null, goles_visitante: null, grupo: "A", fase: "Grupos", fecha: "2026-06-24T22:00:00", estado: "pendiente" },
  { id: "A6", id_local: "e02", id_visitante: "e03", goles_local: null, goles_visitante: null, grupo: "A", fase: "Grupos", fecha: "2026-06-24T22:00:00", estado: "pendiente" },

  // ==================== GRUPO B ====================
  { id: "B1", id_local: "e05", id_visitante: "e08", goles_local: null, goles_visitante: null, grupo: "B", fase: "Grupos", fecha: "2026-06-12T16:00:00", estado: "pendiente" },
  { id: "B2", id_local: "e07", id_visitante: "e06", goles_local: null, goles_visitante: null, grupo: "B", fase: "Grupos", fecha: "2026-06-13T16:00:00", estado: "pendiente" },
  { id: "B3", id_local: "e06", id_visitante: "e08", goles_local: null, goles_visitante: null, grupo: "B", fase: "Grupos", fecha: "2026-06-18T16:00:00", estado: "pendiente" },
  { id: "B4", id_local: "e05", id_visitante: "e07", goles_local: null, goles_visitante: null, grupo: "B", fase: "Grupos", fecha: "2026-06-18T19:00:00", estado: "pendiente" },
  { id: "B5", id_local: "e06", id_visitante: "e05", goles_local: null, goles_visitante: null, grupo: "B", fase: "Grupos", fecha: "2026-06-24T16:00:00", estado: "pendiente" },
  { id: "B6", id_local: "e08", id_visitante: "e07", goles_local: null, goles_visitante: null, grupo: "B", fase: "Grupos", fecha: "2026-06-24T16:00:00", estado: "pendiente" },

  // ==================== GRUPO C ====================
  { id: "C1", id_local: "e11", id_visitante: "e12", goles_local: null, goles_visitante: null, grupo: "C", fase: "Grupos", fecha: "2026-06-13T22:00:00", estado: "pendiente" },
  { id: "C2", id_local: "e09", id_visitante: "e10", goles_local: null, goles_visitante: null, grupo: "C", fase: "Grupos", fecha: "2026-06-13T19:00:00", estado: "pendiente" },
  { id: "C3", id_local: "e12", id_visitante: "e10", goles_local: null, goles_visitante: null, grupo: "C", fase: "Grupos", fecha: "2026-06-19T19:00:00", estado: "pendiente" },
  { id: "C4", id_local: "e09", id_visitante: "e11", goles_local: null, goles_visitante: null, grupo: "C", fase: "Grupos", fecha: "2026-06-19T21:30:00", estado: "pendiente" },
  { id: "C5", id_local: "e12", id_visitante: "e09", goles_local: null, goles_visitante: null, grupo: "C", fase: "Grupos", fecha: "2026-06-24T19:00:00", estado: "pendiente" },
  { id: "C6", id_local: "e10", id_visitante: "e11", goles_local: null, goles_visitante: null, grupo: "C", fase: "Grupos", fecha: "2026-06-24T19:00:00", estado: "pendiente" },

  // ==================== GRUPO D ====================
  { id: "D1", id_local: "e13", id_visitante: "e14", goles_local: null, goles_visitante: null, grupo: "D", fase: "Grupos", fecha: "2026-06-12T22:00:00", estado: "pendiente" },
  { id: "D2", id_local: "e15", id_visitante: "e16", goles_local: null, goles_visitante: null, grupo: "D", fase: "Grupos", fecha: "2026-06-14T01:00:00", estado: "pendiente" },
  { id: "D3", id_local: "e13", id_visitante: "e15", goles_local: null, goles_visitante: null, grupo: "D", fase: "Grupos", fecha: "2026-06-19T16:00:00", estado: "pendiente" },
  { id: "D4", id_local: "e16", id_visitante: "e14", goles_local: null, goles_visitante: null, grupo: "D", fase: "Grupos", fecha: "2026-06-20T00:00:00", estado: "pendiente" },
  { id: "D5", id_local: "e16", id_visitante: "e13", goles_local: null, goles_visitante: null, grupo: "D", fase: "Grupos", fecha: "2026-06-25T23:00:00", estado: "pendiente" },
  { id: "D6", id_local: "e14", id_visitante: "e15", goles_local: null, goles_visitante: null, grupo: "D", fase: "Grupos", fecha: "2026-06-25T23:00:00", estado: "pendiente" },

  // ==================== GRUPO E ====================
  { id: "E1", id_local: "e19", id_visitante: "e20", goles_local: null, goles_visitante: null, grupo: "E", fase: "Grupos", fecha: "2026-06-14T20:00:00", estado: "pendiente" },
  { id: "E2", id_local: "e17", id_visitante: "e18", goles_local: null, goles_visitante: null, grupo: "E", fase: "Grupos", fecha: "2026-06-14T14:00:00", estado: "pendiente" },
  { id: "E3", id_local: "e17", id_visitante: "e19", goles_local: null, goles_visitante: null, grupo: "E", fase: "Grupos", fecha: "2026-06-20T17:00:00", estado: "pendiente" },
  { id: "E4", id_local: "e20", id_visitante: "e18", goles_local: null, goles_visitante: null, grupo: "E", fase: "Grupos", fecha: "2026-06-20T21:00:00", estado: "pendiente" },
  { id: "E5", id_local: "e18", id_visitante: "e19", goles_local: null, goles_visitante: null, grupo: "E", fase: "Grupos", fecha: "2026-06-25T17:00:00", estado: "pendiente" },
  { id: "E6", id_local: "e20", id_visitante: "e17", goles_local: null, goles_visitante: null, grupo: "E", fase: "Grupos", fecha: "2026-06-25T17:00:00", estado: "pendiente" },

  // ==================== GRUPO F ====================
  { id: "F1", id_local: "e21", id_visitante: "e22", goles_local: null, goles_visitante: null, grupo: "F", fase: "Grupos", fecha: "2026-06-14T17:00:00", estado: "pendiente" },
  { id: "F2", id_local: "e24", id_visitante: "e23", goles_local: null, goles_visitante: null, grupo: "F", fase: "Grupos", fecha: "2026-06-14T23:00:00", estado: "pendiente" },
  { id: "F3", id_local: "e21", id_visitante: "e24", goles_local: null, goles_visitante: null, grupo: "F", fase: "Grupos", fecha: "2026-06-20T14:00:00", estado: "pendiente" },
  { id: "F4", id_local: "e23", id_visitante: "e22", goles_local: null, goles_visitante: null, grupo: "F", fase: "Grupos", fecha: "2026-06-21T01:00:00", estado: "pendiente" },
  { id: "F5", id_local: "e22", id_visitante: "e24", goles_local: null, goles_visitante: null, grupo: "F", fase: "Grupos", fecha: "2026-06-25T20:00:00", estado: "pendiente" },
  { id: "F6", id_local: "e23", id_visitante: "e21", goles_local: null, goles_visitante: null, grupo: "F", fase: "Grupos", fecha: "2026-06-25T20:00:00", estado: "pendiente" },

  // ==================== GRUPO G ====================
  { id: "G1", id_local: "e25", id_visitante: "e26", goles_local: null, goles_visitante: null, grupo: "G", fase: "Grupos", fecha: "2026-06-15T16:00:00", estado: "pendiente" },
  { id: "G2", id_local: "e27", id_visitante: "e28", goles_local: null, goles_visitante: null, grupo: "G", fase: "Grupos", fecha: "2026-06-15T22:00:00", estado: "pendiente" },
  { id: "G3", id_local: "e25", id_visitante: "e27", goles_local: null, goles_visitante: null, grupo: "G", fase: "Grupos", fecha: "2026-06-21T16:00:00", estado: "pendiente" },
  { id: "G4", id_local: "e28", id_visitante: "e26", goles_local: null, goles_visitante: null, grupo: "G", fase: "Grupos", fecha: "2026-06-21T22:00:00", estado: "pendiente" },
  { id: "G5", id_local: "e26", id_visitante: "e27", goles_local: null, goles_visitante: null, grupo: "G", fase: "Grupos", fecha: "2026-06-27T00:00:00", estado: "pendiente" },
  { id: "G6", id_local: "e28", id_visitante: "e25", goles_local: null, goles_visitante: null, grupo: "G", fase: "Grupos", fecha: "2026-06-27T00:00:00", estado: "pendiente" },

  // ==================== GRUPO H ====================
  { id: "H1", id_local: "e29", id_visitante: "e30", goles_local: null, goles_visitante: null, grupo: "H", fase: "Grupos", fecha: "2026-06-15T13:00:00", estado: "pendiente" },
  { id: "H2", id_local: "e31", id_visitante: "e32", goles_local: null, goles_visitante: null, grupo: "H", fase: "Grupos", fecha: "2026-06-15T19:00:00", estado: "pendiente" },
  { id: "H3", id_local: "e29", id_visitante: "e31", goles_local: null, goles_visitante: null, grupo: "H", fase: "Grupos", fecha: "2026-06-21T13:00:00", estado: "pendiente" },
  { id: "H4", id_local: "e32", id_visitante: "e30", goles_local: null, goles_visitante: null, grupo: "H", fase: "Grupos", fecha: "2026-06-21T19:00:00", estado: "pendiente" },
  { id: "H5", id_local: "e30", id_visitante: "e31", goles_local: null, goles_visitante: null, grupo: "H", fase: "Grupos", fecha: "2026-06-26T21:00:00", estado: "pendiente" },
  { id: "H6", id_local: "e32", id_visitante: "e29", goles_local: null, goles_visitante: null, grupo: "H", fase: "Grupos", fecha: "2026-06-26T21:00:00", estado: "pendiente" },

  // ==================== GRUPO I ====================
  { id: "I1", id_local: "e33", id_visitante: "e34", goles_local: null, goles_visitante: null, grupo: "I", fase: "Grupos", fecha: "2026-06-16T16:00:00", estado: "pendiente" },
  { id: "I2", id_local: "e36", id_visitante: "e35", goles_local: null, goles_visitante: null, grupo: "I", fase: "Grupos", fecha: "2026-06-16T19:00:00", estado: "pendiente" },
  { id: "I3", id_local: "e33", id_visitante: "e36", goles_local: null, goles_visitante: null, grupo: "I", fase: "Grupos", fecha: "2026-06-22T18:00:00", estado: "pendiente" },
  { id: "I4", id_local: "e35", id_visitante: "e34", goles_local: null, goles_visitante: null, grupo: "I", fase: "Grupos", fecha: "2026-06-22T21:00:00", estado: "pendiente" },
  { id: "I5", id_local: "e35", id_visitante: "e33", goles_local: null, goles_visitante: null, grupo: "I", fase: "Grupos", fecha: "2026-06-26T16:00:00", estado: "pendiente" },
  { id: "I6", id_local: "e34", id_visitante: "e36", goles_local: null, goles_visitante: null, grupo: "I", fase: "Grupos", fecha: "2026-06-26T16:00:00", estado: "pendiente" },

  // ==================== GRUPO J ====================
  { id: "J1", id_local: "e37", id_visitante: "e38", goles_local: null, goles_visitante: null, grupo: "J", fase: "Grupos", fecha: "2026-06-16T22:00:00", estado: "pendiente" },
  { id: "J2", id_local: "e39", id_visitante: "e40", goles_local: null, goles_visitante: null, grupo: "J", fase: "Grupos", fecha: "2026-06-17T01:00:00", estado: "pendiente" },
  { id: "J3", id_local: "e37", id_visitante: "e39", goles_local: null, goles_visitante: null, grupo: "J", fase: "Grupos", fecha: "2026-06-22T14:00:00", estado: "pendiente" },
  { id: "J4", id_local: "e40", id_visitante: "e38", goles_local: null, goles_visitante: null, grupo: "J", fase: "Grupos", fecha: "2026-06-23T00:00:00", estado: "pendiente" },
  { id: "J5", id_local: "e38", id_visitante: "e39", goles_local: null, goles_visitante: null, grupo: "J", fase: "Grupos", fecha: "2026-06-27T23:00:00", estado: "pendiente" },
  { id: "J6", id_local: "e40", id_visitante: "e37", goles_local: null, goles_visitante: null, grupo: "J", fase: "Grupos", fecha: "2026-06-27T23:00:00", estado: "pendiente" },

  // ==================== GRUPO K ====================
  { id: "K1", id_local: "e41", id_visitante: "e44", goles_local: null, goles_visitante: null, grupo: "K", fase: "Grupos", fecha: "2026-06-17T14:00:00", estado: "pendiente" },
  { id: "K2", id_local: "e43", id_visitante: "e42", goles_local: null, goles_visitante: null, grupo: "K", fase: "Grupos", fecha: "2026-06-17T23:00:00", estado: "pendiente" },
  { id: "K3", id_local: "e41", id_visitante: "e43", goles_local: null, goles_visitante: null, grupo: "K", fase: "Grupos", fecha: "2026-06-23T14:00:00", estado: "pendiente" },
  { id: "K4", id_local: "e42", id_visitante: "e44", goles_local: null, goles_visitante: null, grupo: "K", fase: "Grupos", fecha: "2026-06-23T23:00:00", estado: "pendiente" },
  { id: "K5", id_local: "e42", id_visitante: "e41", goles_local: null, goles_visitante: null, grupo: "K", fase: "Grupos", fecha: "2026-06-27T20:30:00", estado: "pendiente" },
  { id: "K6", id_local: "e44", id_visitante: "e43", goles_local: null, goles_visitante: null, grupo: "K", fase: "Grupos", fecha: "2026-06-27T20:30:00", estado: "pendiente" },

  // ==================== GRUPO L ====================
  { id: "L1", id_local: "e45", id_visitante: "e46", goles_local: null, goles_visitante: null, grupo: "L", fase: "Grupos", fecha: "2026-06-17T17:00:00", estado: "pendiente" },
  { id: "L2", id_local: "e47", id_visitante: "e48", goles_local: null, goles_visitante: null, grupo: "L", fase: "Grupos", fecha: "2026-06-17T20:00:00", estado: "pendiente" },
  { id: "L3", id_local: "e45", id_visitante: "e47", goles_local: null, goles_visitante: null, grupo: "L", fase: "Grupos", fecha: "2026-06-23T17:00:00", estado: "pendiente" },
  { id: "L4", id_local: "e48", id_visitante: "e46", goles_local: null, goles_visitante: null, grupo: "L", fase: "Grupos", fecha: "2026-06-23T20:00:00", estado: "pendiente" },
  { id: "L5", id_local: "e48", id_visitante: "e45", goles_local: null, goles_visitante: null, grupo: "L", fase: "Grupos", fecha: "2026-06-27T18:00:00", estado: "pendiente" },
  { id: "L6", id_local: "e46", id_visitante: "e47", goles_local: null, goles_visitante: null, grupo: "L", fase: "Grupos", fecha: "2026-06-27T18:00:00", estado: "pendiente" },

  // ==================== 16AVOS DE FINAL (32 equipos) ====================
  { id: "R32_1",  id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "16avos", fecha: "2026-07-04T19:00:00", estado: "pendiente" },
  { id: "R32_2",  id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "16avos", fecha: "2026-07-04T23:00:00", estado: "pendiente" },
  { id: "R32_3",  id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "16avos", fecha: "2026-07-05T19:00:00", estado: "pendiente" },
  { id: "R32_4",  id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "16avos", fecha: "2026-07-05T23:00:00", estado: "pendiente" },
  { id: "R32_5",  id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "16avos", fecha: "2026-07-06T19:00:00", estado: "pendiente" },
  { id: "R32_6",  id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "16avos", fecha: "2026-07-06T23:00:00", estado: "pendiente" },
  { id: "R32_7",  id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "16avos", fecha: "2026-07-07T19:00:00", estado: "pendiente" },
  { id: "R32_8",  id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "16avos", fecha: "2026-07-07T23:00:00", estado: "pendiente" },
  { id: "R32_9",  id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "16avos", fecha: "2026-07-08T19:00:00", estado: "pendiente" },
  { id: "R32_10", id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "16avos", fecha: "2026-07-08T23:00:00", estado: "pendiente" },
  { id: "R32_11", id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "16avos", fecha: "2026-07-09T19:00:00", estado: "pendiente" },
  { id: "R32_12", id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "16avos", fecha: "2026-07-09T23:00:00", estado: "pendiente" },
  { id: "R32_13", id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "16avos", fecha: "2026-07-10T19:00:00", estado: "pendiente" },
  { id: "R32_14", id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "16avos", fecha: "2026-07-10T23:00:00", estado: "pendiente" },
  { id: "R32_15", id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "16avos", fecha: "2026-07-11T19:00:00", estado: "pendiente" },
  { id: "R32_16", id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "16avos", fecha: "2026-07-11T23:00:00", estado: "pendiente" },

  // ==================== OCTAVOS DE FINAL (16 equipos) ====================
  { id: "OCT1",  id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "Octavos", fecha: "2026-07-13T19:00:00", estado: "pendiente" },
  { id: "OCT2",  id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "Octavos", fecha: "2026-07-13T23:00:00", estado: "pendiente" },
  { id: "OCT3",  id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "Octavos", fecha: "2026-07-14T19:00:00", estado: "pendiente" },
  { id: "OCT4",  id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "Octavos", fecha: "2026-07-14T23:00:00", estado: "pendiente" },
  { id: "OCT5",  id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "Octavos", fecha: "2026-07-15T19:00:00", estado: "pendiente" },
  { id: "OCT6",  id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "Octavos", fecha: "2026-07-15T23:00:00", estado: "pendiente" },
  { id: "OCT7",  id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "Octavos", fecha: "2026-07-16T19:00:00", estado: "pendiente" },
  { id: "OCT8",  id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "Octavos", fecha: "2026-07-16T23:00:00", estado: "pendiente" },

  // ==================== CUARTOS DE FINAL (8 equipos) ====================
  { id: "CUA1", id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "Cuartos", fecha: "2026-07-19T19:00:00", estado: "pendiente" },
  { id: "CUA2", id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "Cuartos", fecha: "2026-07-19T23:00:00", estado: "pendiente" },
  { id: "CUA3", id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "Cuartos", fecha: "2026-07-20T19:00:00", estado: "pendiente" },
  { id: "CUA4", id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "Cuartos", fecha: "2026-07-20T23:00:00", estado: "pendiente" },

  // ==================== SEMIFINALES (4 equipos) ====================
  { id: "SEM1", id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "Semis", fecha: "2026-07-23T23:00:00", estado: "pendiente" },
  { id: "SEM2", id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "Semis", fecha: "2026-07-24T23:00:00", estado: "pendiente" },

  // ==================== TERCER PUESTO Y FINAL ====================
  { id: "3ER", id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "3er Puesto", fecha: "2026-07-18T23:00:00", estado: "pendiente" },
  { id: "FIN", id_local: null, id_visitante: null, goles_local: null, goles_visitante: null, grupo: null, fase: "Final",      fecha: "2026-07-19T23:00:00", estado: "pendiente" },
];
