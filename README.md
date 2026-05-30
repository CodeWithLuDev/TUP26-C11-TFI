# Trabajo Final Integrador — Fixture del Mundial en Tiempo Real ⚽

**Materia:** Programación III  
**Carrera:** Tecnicatura en Programación  
**Modalidad:** Individual o Grupal (max. 3 personas)  
**Ponderación:** 40% de la nota final  
**Entrega:** 28 de Junio

---

## 1. Introducción y objetivo

El fútbol es el deporte más popular del planeta, y el Mundial es su máxima expresión. Detrás de cada torneo existe un sistema complejo de datos: grupos, posiciones, goles, cruces y estadísticas que se actualizan en tiempo real con cada resultado. En este Trabajo Práctico Integrador, el desafío es construir exactamente eso.

El objetivo es desarrollar una **aplicación interactiva —web o desktop—** que permita gestionar y visualizar un fixture completo de un Mundial de fútbol, desde la fase de grupos hasta la gran final, con actualización dinámica de resultados, tablas de posiciones y estadísticas del torneo.

Este proyecto integra los contenidos fundamentales de la materia: estructuras de datos, lógica condicional, modularización de código, manejo de estado y construcción de interfaces. Se espera un **producto funcional, robusto y con buena experiencia de usuario**.

> 💡 **Motivación:** Este no es un ejercicio teórico. Es un sistema real que podrías ver funcionando en una pantalla gigante durante un torneo. Cada decisión de diseño que tomes tiene impacto directo en la experiencia de quien lo usa. Pensá como programador y como hincha.

---

## 2. Requisitos de la interfaz de usuario (Frontend / UI)

### 2.1 Pantalla principal — Lista de equipos

La pantalla de inicio debe presentar la **lista completa de los equipos participantes** del torneo. Como mínimo, cada equipo debe mostrar:

- Nombre del equipo
- Bandera o escudo representativo
- Grupo al que pertenece

El diseño debe ser claro, ordenado y permitir una lectura rápida del estado general del torneo.

---

### 2.2 Sección de Fase de Grupos

Se debe representar visualmente la organización de todos los grupos (A, B, C, etc.). Cada grupo debe contener una **tabla de posiciones interactiva** con las siguientes columnas:

| # | Equipo | PJ | PG | PE | PP | GF | GC | DG | PTS |
|---|--------|----|----|----|----|----|----|-----|-----|
| 1 | ...    | 0  | 0  | 0  | 0  | 0  | 0  | 0   | 0   |

**Referencias:**
- `PJ` — Partidos jugados
- `PG` — Partidos ganados
- `PE` — Partidos empatados
- `PP` — Partidos perdidos
- `GF` — Goles a favor
- `GC` — Goles en contra
- `DG` — Diferencia de goles (`GF - GC`)
- `PTS` — Puntos

La tabla debe **ordenarse automáticamente** según los criterios de clasificación reglamentarios (ver sección 3.1).

---

### 2.3 Sección de Playoffs y llaves de eliminación directa

Una vez finalizada la fase de grupos, el sistema debe construir y visualizar las **llaves de eliminación directa** en el siguiente orden:

1. Octavos de final
2. Cuartos de final
3. Semifinales
4. Final (incluyendo el partido por el tercer puesto, opcional como punto extra)

Las llaves deben **actualizarse automáticamente** a medida que se ingresan los resultados de cada partido, reflejando al ganador en la siguiente ronda de forma inmediata. El aspecto visual debe evocar un bracket de eliminación clásico.

---

### 2.4 Carga de resultados — El fixture interactivo

Este es el **corazón del sistema**. Debe existir un mecanismo intuitivo —similar al fixture de papel clásico pero digitalizado— donde el usuario pueda:

1. Visualizar los partidos programados (por fecha, grupo o ronda)
2. Seleccionar un partido y **ingresar el resultado**: goles del equipo local y goles del visitante
3. Opcionalmente, registrar si el resultado se definió en tiempo extra o en penales (para la fase eliminatoria)
4. Confirmar el resultado y ver cómo todos los datos del torneo se actualizan de forma inmediata

El sistema no debe permitir cargar un resultado dos veces para el mismo partido sin antes confirmarlo o borrarlo explícitamente.

---

## 3. Requisitos lógicos y funcionales

### 3.1 Procesamiento en tiempo real

Al registrar un resultado, la tabla de posiciones del grupo correspondiente debe **recalcularse de forma instantánea**, sin necesidad de que el usuario presione un botón adicional de "actualizar" o "recalcular".

El sistema debe manejar correctamente los siguientes criterios de puntuación:

- **Victoria:** 3 puntos
- **Empate:** 1 punto para cada equipo
- **Derrota:** 0 puntos

**Criterios de desempate** (en orden de prioridad, según reglamento FIFA):

1. Mayor cantidad de puntos
2. Mayor diferencia de goles
3. Mayor cantidad de goles a favor
4. Resultado del enfrentamiento directo entre los equipos empatados
5. En caso de persistir el empate, sorteo o criterio definido por la cátedra

> ⚠️ **Condición crítica:** Un sistema que calcule mal los puntos o el orden de posiciones **no puede considerarse aprobado**, independientemente de la calidad visual o técnica del resto del proyecto.

---

### 3.2 Estadísticas avanzadas — Goleadores y asistidores

Al cargar el resultado de un partido, el sistema debe **permitir registrar** quién convirtió cada gol y quién realizó la asistencia correspondiente.

Con estos datos, la aplicación debe mantener y mostrar de forma visible:

- **Top de goleadores del torneo:** nombre del jugador, equipo y cantidad de goles
- **Top de asistidores del torneo:** nombre del jugador, equipo y cantidad de asistencias

Ambos rankings deben actualizarse en tiempo real junto con el resto de los datos del torneo. El ingreso de jugadores debe ser flexible (puede ser mediante un campo de texto libre, un selector, o un sistema propio de gestión de planteles).

---

### 3.3 Datos del encuentro — Fecha y hora

Cada partido debe mostrar de forma **clara y visible**:

- Fecha programada del encuentro
- Hora programada (con indicación explícita de la zona horaria de referencia utilizada)

El calendario de partidos debe estar **precargado en el sistema** y organizarse cronológicamente. Se valorará como punto adicional la conversión automática a la zona horaria local del usuario.

---

## 4. Requisitos técnicos

### 4.1 Tecnologías a libre elección

El stack tecnológico es completamente libre. A modo orientativo, se sugieren las siguientes alternativas:

**Desarrollo web:**
- HTML + CSS + JavaScript vanilla
- React, Vue, Angular u otro framework frontend
- Backend opcional con Node.js, Python (Flask/Django), PHP, etc.

**Desarrollo desktop:**
- Python con Tkinter, PyQt o CustomTkinter
- Java con JavaFX o Swing
- C# con WinForms o WPF

**Persistencia de datos (opcional pero recomendada):**
- Base de datos relacional (SQLite, MySQL, PostgreSQL)
- Base de datos no relacional (MongoDB, Firebase)
- Almacenamiento local (LocalStorage, archivo JSON, archivo de texto, pickle)

> Lo que **no es opcional** es que el sistema sea robusto: los datos no deben perderse al navegar entre secciones, al cerrar una pantalla o al actualizar la página.

---

### 4.2 Código limpio y modularizado

El código debe seguir las siguientes buenas prácticas de desarrollo:

- **Separación de responsabilidades:** la lógica del negocio (cálculo de puntos, clasificación, etc.) debe estar separada de la interfaz visual
- **Principio DRY (Don't Repeat Yourself):** evitar la duplicación de código; si una funcionalidad se repite, debe encapsularse en una función o módulo reutilizable
- **Nomenclatura descriptiva:** los nombres de variables, funciones, clases y archivos deben ser autoexplicativos
- **Comentarios pertinentes:** comentar únicamente donde la lógica no sea evidente por sí sola; no comentar lo obvio
- **Estructura de proyecto legible:** cualquier desarrollador que reciba el proyecto debe poder orientarse en menos de cinco minutos

---

### 4.3 Entregables requeridos

1. Crear una rama individual (alumno/nombre) o grupal (grupo/nombreGrupo) dependiendo de como trabajaron.
2. Estando en su rama correspondiente deben crear una carpeta dentro de la carpeta `Entregas` y subir su trabajo allí.
3. La entrega debe incluir obligatoriamente:

    - [ ] **Código fuente completo** del proyecto
    - [ ] **Archivo `README.md`** con:
      - Descripción general del proyecto
      - Tecnologías utilizadas y versiones
      - Instrucciones de instalación y ejecución paso a paso
      - Decisiones de diseño o técnicas relevantes
      - Integrantes del grupo (nombre y legajo)
    - [ ] **Demostración en vivo** del sistema funcionando durante la instancia de defensa

> ⚠️ La ausencia del archivo `README.md` penaliza directamente la nota de presentación y defensa.

---

## 5. Criterios de evaluación

La calificación se distribuye sobre **100 puntos** de acuerdo a la siguiente rúbrica:

---

### 5.1 Lógica y funcionalidad — 30 puntos

| Nivel | Descripción | Puntos |
|-------|-------------|--------|
| Excelente | Todos los cálculos son correctos, los desempates se aplican en orden reglamentario, las llaves se actualizan sin errores y las estadísticas son consistentes en todo momento. | 27–30 |
| Bueno | El cálculo de puntos es correcto pero hay errores menores en los criterios de desempate o en la propagación de resultados a los playoffs. | 20–26 |
| Regular | Existen errores de cálculo que afectan la consistencia de los datos, pero el flujo general del sistema puede seguirse. | 12–19 |
| Insuficiente | Los errores de lógica impiden el uso correcto del sistema o los datos del torneo son inconsistentes de forma sistemática. | 0–11 |

> 🔴 **Condición de aprobación:** Se requiere un mínimo de **18/30 puntos** en este criterio para aprobar el trabajo práctico, independientemente del puntaje total obtenido.

---

### 5.2 Experiencia de usuario (UX/UI) — 25 puntos

| Nivel | Descripción | Puntos |
|-------|-------------|--------|
| Excelente | La interfaz es clara, intuitiva y visualmente consistente. El usuario recibe feedback inmediato ante cada acción. La navegación es fluida y no genera confusión. | 22–25 |
| Bueno | La interfaz es funcional y ordenada, con algunos aspectos de claridad o feedback que podrían mejorarse. | 16–21 |
| Regular | La interfaz cumple su función pero presenta problemas de usabilidad que dificultan la experiencia. | 9–15 |
| Insuficiente | La interfaz es confusa, incompleta o no permite operar el sistema con fluidez. | 0–8 |

---

### 5.3 Calidad del código — 25 puntos

| Nivel | Descripción | Puntos |
|-------|-------------|--------|
| Excelente | Código modularizado, nomenclatura descriptiva, sin duplicación, con separación clara entre lógica y presentación. La estructura del proyecto es impecable. | 22–25 |
| Bueno | El código está mayormente organizado, con algunas funciones extensas o leve duplicación, pero demuestra comprensión de las buenas prácticas. | 16–21 |
| Regular | El código funciona pero es difícil de leer, presenta duplicación significativa o mezcla la lógica con la presentación de forma sistemática. | 9–15 |
| Insuficiente | El código es caótico, sin estructura aparente, con nombres genéricos y sin separación de responsabilidades. | 0–8 |

---

### 5.4 Presentación y defensa — 20 puntos

| Nivel | Descripción | Puntos |
|-------|-------------|--------|
| Excelente | Demostración fluida en vivo, explicación clara de las decisiones técnicas, manejo sólido de preguntas, README completo y bien redactado. | 18–20 |
| Bueno | La demostración es correcta y las explicaciones son claras, aunque con algunas dudas ante preguntas específicas. El README está presente y es adecuado. | 13–17 |
| Regular | La demostración tiene interrupciones o errores. Las explicaciones son parciales y el README es escueto o incompleto. | 7–12 |
| Insuficiente | No hay demostración en vivo, o el integrante no puede explicar su propio código. El README está ausente. | 0–6 |

---

### Resumen de la rúbrica

| Criterio | Puntos máximos |
|----------|---------------|
| Lógica y funcionalidad | 30 |
| Experiencia de usuario (UX/UI) | 25 |
| Calidad del código | 25 |
| Presentación y defensa | 20 |
| **Total** | **100** |

---

## Anexo — Estructura sugerida del proyecto

A continuación se presenta una estructura de proyecto orientativa para quienes elijan la ruta web. No es obligatoria, pero sí una buena referencia de organización:

```
fixture-mundial/
├── README.md
├── index.html
├── src/
│   ├── data/
│   │   ├── equipos.js        # Datos de los 32 equipos y grupos
│   │   └── partidos.js       # Calendario completo con fechas y horarios
│   ├── logic/
│   │   ├── posiciones.js     # Cálculo de tablas de posiciones y desempates
│   │   ├── playoffs.js       # Lógica de clasificación y armado de llaves
│   │   └── estadisticas.js   # Gestión de goleadores y asistidores
│   ├── ui/
│   │   ├── grupos.js         # Renderizado de la fase de grupos
│   │   ├── bracket.js        # Renderizado del bracket eliminatorio
│   │   └── fixture.js        # Interfaz de carga de resultados
│   └── main.js               # Punto de entrada y ensamblado general
└── styles/
    └── main.css
```

---

## Preguntas frecuentes

**¿Puedo usar un framework CSS como Bootstrap o Tailwind?**  
Sí, el uso de librerías de estilos es permitido y no afecta la evaluación.

**¿Puedo usar datos reales de un Mundial pasado?**  
Sí. Se recomienda utilizar los datos del Mundial 2022 (Qatar) o 2018 (Rusia) para tener un conjunto de partidos y resultados completos con los que probar el sistema.

**¿Es obligatorio implementar la persistencia de datos?**  
No es obligatorio, pero sí se recomienda. Un sistema que pierde los datos al refrescar la página tiene un impacto directo en la nota de experiencia de usuario.

**¿Se puede agregar funcionalidad extra no contemplada en el enunciado?**  
Sí, y suma a la nota. Funcionalidades adicionales como predicción de resultados, modo oscuro, exportación de datos o sistema de usuarios serán valoradas como puntos adicionales dentro del criterio de UX/UI o lógica.

---

*Tecnicatura en Programación · Materia: Programación III*  
*Cualquier consulta sobre el enunciado debe realizarse en el espacio de clases o por el canal habilitado por la cátedra.*
