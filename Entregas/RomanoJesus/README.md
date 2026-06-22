# Fixture Mundial 2026

Aplicación web para simular y gestionar la Copa Mundial de la FIFA 2026 (México, Estados Unidos y Canadá).  
**100% cliente‑side** — sin servidor, sin frameworks, sin API keys.

## Tecnologías

- **JavaScript vanilla** (ES Modules)
- **HTML5 / CSS3** con variables para tema oscuro/claro
- **localStorage** para persistencia de datos

### APIs externas (gratuitas, sin key)

| API | Uso |
|---|---|
| [flagcdn.com](https://flagcdn.com) | Banderas de países |
| [ui-avatars.com](https://ui-avatars.com) | Avatares de jugadores con iniciales |

## Funcionalidades

- **48 selecciones** en 12 grupos, 104 partidos de fase de grupos
- **Fixture interactivo** — carga manual de resultados o simulación automática
- **Playoffs** — octavos, cuartos, semifinal, tercer puesto y final con bracket visual
- **Tabla de posiciones** por grupo con criterios de desempate
- **Goleadores, asistencias y eventos** por partido (tarjetas, cambios, goles)
- **Jugadores** — plantilla completa (23 × 48 equipos) en paneles colapsables
- **Jugadores destacados** — 50+ estrellas con club, posición, filtros
- **Historial** — ranking de campeones y línea de tiempo de todas las finales (1930–2022)
- **Simulación total** — genera resultados, goleadores, eventos y bracket completo
- **Tema oscuro/claro** con persistencia
- **Pantalla de inicio** con nombre de usuario personalizado y estadísticas del torneo
- **100% responsive**

## Estructura del proyecto

```
src/
├── data/              — Datos estáticos
│   ├── equipos.js     — 48 selecciones (ISO, confederación, estadio)
│   ├── partidos.js    — 104 partidos con fechas y sedes
│   ├── jugadores.js   — 50+ jugadores destacados
│   ├── historial.js   — 22 ediciones mundialistas
│   └── campeones.js   — Datos de campeones
├── logic/             — Lógica de negocio
│   ├── simulacion.js  — Simulación de partidos y playoff
│   ├── playoffs.js    — Bracket, propagación de ganadores
│   ├── posiciones.js  — Tabla de grupos
│   ├── estadisticas.js— Goleadores y asistencias
│   ├── tiempo.js      — Conversión de horarios
│   └── almacenamiento.js — Persistencia en localStorage
├── ui/                — Interfaz de usuario
│   ├── fixture.js     — Carga de resultados
│   ├── grupos.js      — Tablas de grupos
│   ├── bracket.js     — Visualización de playoffs
│   ├── jugadores.js   — Planteles y destacados
│   ├── inicio.js      — Pantalla de bienvenida
│   ├── campeones.js   — Historial y ranking
│   ├── equipos.js     — Listado de selecciones
│   └── donde-ver.js   — Plataformas de streaming
├── main.js            — Estado global, migración, routing, tema
styles/
└── main.css           — Único archivo CSS (tema oscuro/claro, responsive)
index.html             — Entry point
```

## Cómo usar

1. Cloná o descargá el repositorio
2. Abrí `index.html` en cualquier navegador moderno
3. Ingresá tu nombre en la pantalla de inicio
4. Navegá por las secciones: Grupos, Fixture, Playoffs, Jugadores, etc.
5. Hacé clic en **"Simular todo"** para generar resultados automáticos

No requiere instalación, npm, servidor ni conexión a internet (salvo para las banderas y avatares).

## Personalización

- **Tema oscuro/claro**: botón ☀️/🌙 en el header
- **Fondo de inicio**: la imagen de Argentina con la copa está hardcodeada en CSS
- **Resultados**: se pueden cargar manualmente partido por partido o simular todo

## Integrante del grupo
Nombre: Jesus Valentin Romano
Lj: 63909
## Licencia

Uso educativo y personal.
