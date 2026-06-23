# REST-in-Peace — Fixture del Mundial

Aplicación web para gestionar y visualizar el fixture completo del Mundial Qatar 2022: fase de grupos, playoffs, carga de resultados y estadísticas. Cada usuario tiene su propia simulación del torneo, con datos persistidos en PostgreSQL.

**Materia:** Programación III — TFI  
**Branch del grupo:** `grupo/REST-in-peace`

---

## Integrantes

| Nombre | Legajo |
| ------ | ------ |
| —      | —      |
| —      | —      |
| —      | —      |

> Completar con los datos de cada integrante antes de la entrega.

---

## Stack tecnológico

| Capa              | Tecnología                     |
| ----------------- | ------------------------------ |
| Backend           | Node.js, Express 5, TypeScript |
| Base de datos     | PostgreSQL 15+, Prisma 7       |
| Autenticación     | JWT + bcrypt                   |
| Documentación API | Swagger UI (`/api/docs`)       |
| Frontend          | React 19, TypeScript, Vite 8   |

---

## Funcionalidades implementadas

### Backend (completo)

- **Autenticación** — Registro e inicio de sesión con JWT. Cada usuario gestiona sus propios resultados.
- **Datos del torneo** — 32 equipos, 64 partidos (48 de grupos + 16 eliminatorios) y plantillas completas de jugadores (Mundial 2022).
- **Carga de resultados** — Goles, tiempo extra, penales y eventos de gol/asistencia por jugador real del equipo.
- **Tablas de posiciones** — Cálculo automático con criterios FIFA: puntos → diferencia de gol → goles a favor → head-to-head.
- **Playoffs** — Bracket de octavos a final con propagación automática de ganadores y perdedores entre rondas.
- **Fixture personalizado** — Vista unificada de todos los partidos con equipos resueltos dinámicamente en eliminatorias.
- **Estadísticas** — Rankings de goleadores y asistidores por usuario.

### Frontend (en desarrollo)

El frontend está inicializado con Vite + React. La integración con la API es el siguiente paso del proyecto.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v20 o superior
- [PostgreSQL](https://www.postgresql.org/download/) v15 o superior
- [Git](https://git-scm.com/)

Verificar instalación:

```bash
node -v
npm -v
psql --version
```

---

## Clonar el repositorio

```bash
git clone <url-del-repo>
cd TUP26-C11-TFI
git checkout grupo/REST-in-peace
cd Entregas/grupo-REST-in-Peace
```

---

## Configurar PostgreSQL (local)

Cada integrante crea su propia base de datos en su máquina:

```bash
psql -U postgres
```

```sql
CREATE DATABASE fixture_mundial;
CREATE USER fixture_user WITH PASSWORD 'fixture_password';
GRANT ALL PRIVILEGES ON DATABASE fixture_mundial TO fixture_user;
\q
```

En PostgreSQL 15+, si hay errores de permisos en el schema `public`:

```bash
psql -U postgres -d fixture_mundial
```

```sql
GRANT ALL ON SCHEMA public TO fixture_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO fixture_user;
\q
```

---

## Instalación del Backend

```bash
cd backend
npm install
cp .env.example .env
```

El archivo `.env` debe quedar así (ajustar usuario/password si usaron otros):

```env
DATABASE_URL="postgresql://fixture_user:fixture_password@localhost:5432/fixture_mundial"
PORT=3001
JWT_SECRET=super_secret_key_change_in_production
```

> `JWT_SECRET` es obligatorio para registro, login y endpoints protegidos.

### Cargar la base de datos (Mundial 2022)

Datos precargados en `prisma/seed.ts`: **32 equipos**, **64 partidos** y **plantillas completas** de jugadores.

```bash
npx prisma migrate deploy   # aplicar migraciones (sin shadow DB)
npx prisma generate
npm run db:seed
```

Si `migrate dev` falla por permisos de shadow database, usar `migrate deploy` para aplicar migraciones existentes.

### Scripts disponibles

| Comando              | Descripción                                      |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Levanta el servidor en modo desarrollo           |
| `npm run build`      | Compila TypeScript a `dist/`                     |
| `npm start`          | Ejecuta el build de producción                   |
| `npm run db:migrate` | Crea y aplica migraciones (`prisma migrate dev`) |
| `npm run db:seed`    | Carga datos del Mundial Qatar 2022               |
| `npm run db:studio`  | Abre Prisma Studio en el navegador               |

### Verificar que el backend funciona

```bash
npm run dev
```

| Recurso      | URL                                 |
| ------------ | ----------------------------------- |
| Health check | http://localhost:3001/api/health    |
| Swagger UI   | http://localhost:3001/api/docs      |
| OpenAPI JSON | http://localhost:3001/api/docs.json |

Respuesta esperada del health check:

```json
{ "ok": true, "message": "REST-in-Peace API running" }
```

---

## API REST

### Autenticación

Todos los endpoints excepto `/api/health`, `/api/auth/*` y la documentación requieren el header:

```
Authorization: Bearer <token>
```

#### `POST /api/auth/register`

```json
{ "username": "hincha1", "password": "mi_password" }
```

Respuesta `201`:

```json
{ "token": "eyJ...", "user": { "id": 1, "username": "hincha1" } }
```

#### `POST /api/auth/login`

```json
{ "username": "hincha1", "password": "mi_password" }
```

### Torneo (datos globales)

| Método | Endpoint                | Descripción                                          |
| ------ | ----------------------- | ---------------------------------------------------- |
| `GET`  | `/api/teams`            | Lista los 32 equipos                                 |
| `GET`  | `/api/matches`          | Calendario completo del torneo                       |
| `GET`  | `/api/players?teamId=1` | Jugadores de un equipo (para goleadores/asistencias) |

### Usuario autenticado (`/api/me`)

| Método   | Endpoint                          | Descripción                                         |
| -------- | --------------------------------- | --------------------------------------------------- |
| `GET`    | `/api/me`                         | Datos del usuario logueado                          |
| `GET`    | `/api/me/fixture`                 | Fixture completo con resultados y equipos resueltos |
| `GET`    | `/api/me/standings`               | Tablas de posiciones de todos los grupos            |
| `GET`    | `/api/me/standings/:groupLetter`  | Tabla de un grupo (A–H)                             |
| `GET`    | `/api/me/bracket`                 | Llave eliminatoria por rondas                       |
| `GET`    | `/api/me/stats/scorers`           | Ranking de goleadores                               |
| `GET`    | `/api/me/stats/assisters`         | Ranking de asistidores                              |
| `POST`   | `/api/me/matches/:matchId/result` | Cargar resultado de un partido                      |
| `DELETE` | `/api/me/matches/:matchId/result` | Eliminar resultado de un partido                    |

---

## Instalación del Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abrir en el navegador: http://localhost:5173

| Comando           | Descripción                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Levanta el servidor de desarrollo |
| `npm run build`   | Genera el build de producción     |
| `npm run preview` | Previsualiza el build             |
| `npm run lint`    | Ejecuta ESLint                    |

---

## Levantar el proyecto completo

Se necesitan **dos terminales**:

**Terminal 1 — Backend:**

```bash
cd Entregas/grupo-REST-in-Peace/backend
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd Entregas/grupo-REST-in-Peace/frontend
npm run dev
```

| Servicio | URL                            |
| -------- | ------------------------------ |
| API      | http://localhost:3001          |
| Swagger  | http://localhost:3001/api/docs |
| Frontend | http://localhost:5173          |

---

## Estructura del proyecto

```
grupo-REST-in-Peace/
├── README.md
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Modelos: Team, Player, Match, User, UserResult...
│   │   ├── seed.ts            # Datos del Mundial Qatar 2022
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/       # Handlers HTTP
│   │   ├── routes/            # auth, tourney, me
│   │   ├── services/          # Lógica de negocio
│   │   │   ├── standingsService.ts   # Tablas y clasificados
│   │   │   ├── tiebreakers.ts          # Desempates FIFA
│   │   │   ├── playoffsCore.ts         # Resolución de llaves (compartido)
│   │   │   ├── playoffsService.ts      # Bracket
│   │   │   ├── meService.ts            # Fixture del usuario
│   │   │   ├── resultService.ts        # Carga/eliminación de resultados
│   │   │   └── statisticsService.ts    # Goleadores y asistidores
│   │   ├── middleware/
│   │   │   └── requireAuth.ts
│   │   ├── lib/
│   │   │   └── prisma.ts      # Cliente Prisma compartido
│   │   ├── docs/
│   │   │   └── paths.ts       # Definición OpenAPI
│   │   └── index.ts
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    ├── public/
    └── package.json
```

---

## Decisiones técnicas

1. **Datos globales vs. por usuario** — Equipos, partidos y jugadores son compartidos (seed estático). Los resultados (`UserResult`, `UserGoalEvent`) son privados por usuario, permitiendo que varios hinchas simulen el torneo en paralelo.

2. **Playoffs con fuentes dinámicas** — Los partidos eliminatorios no tienen equipos fijos en la base de datos. Se resuelven en runtime a partir de `homeSource` / `awaySource` (ej. `"Winner Group A"`, `"Winner R16-1"`) usando la misma lógica en fixture y bracket (`playoffsCore.ts`).

3. **Desempates FIFA** — La lógica de clasificación de grupos sigue el reglamento: puntos, diferencia de gol, goles a favor y enfrentamiento directo entre equipos empatados (`tiebreakers.ts`).

4. **Arquitectura en capas** — Routes → Controllers → Services. La lógica de negocio no vive en los handlers HTTP, lo que facilita testear y reutilizar (por ejemplo, `getGroupQualifiers` es usado por standings, bracket y fixture).

5. **Seed en el repositorio** — Los datos del Mundial 2022 viven en `prisma/seed.ts`, sin depender de APIs externas en runtime.

6. **PostgreSQL local por integrante** — Cada desarrollador tiene su propia base. Al clonar cambios nuevos, correr `npx prisma migrate deploy` y, si es la primera vez, `npm run db:seed`.

---

## Notas importantes

- **No commitear** el archivo `.env` — solo `.env.example`.
- Las carpetas `node_modules/`, `dist/` y `generated/` están en `.gitignore`.
- Cada integrante trabaja con su PostgreSQL local; los datos no se comparten entre máquinas.
- Al clonar cambios nuevos del repo, correr `npm install` en `backend/` y `frontend/` si hubo cambios en dependencias.
- Cuando se agreguen migraciones de Prisma, cada integrante debe ejecutar `npx prisma migrate deploy` en `backend/`.
- Después de clonar por primera vez, correr `npm run db:seed` para cargar equipos, partidos y jugadores.
