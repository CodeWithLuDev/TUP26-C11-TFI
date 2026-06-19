# REST-in-Peace — Fixture del Mundial

Aplicación web para gestionar y visualizar el fixture de un Mundial de fútbol: fase de grupos, playoffs, carga de resultados y estadísticas.

**Materia:** Programación III — TFI  
**Branch del grupo:** `grupo/REST-in-peace`

---

## Integrantes

| Nombre | Legajo |
|--------|--------|
| — | — |
| — | — |
| — | — |

> Completar con los datos de cada integrante antes de la entrega.

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Backend | Node.js, Express, TypeScript |
| Base de datos | PostgreSQL, Prisma |
| Frontend | React, TypeScript, Vite |

---

## Requisitos previos

Antes de empezar, cada integrante debe tener instalado:

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
```

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Levanta el servidor en modo desarrollo |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Ejecuta el build de producción |
| `npm run db:migrate` | Aplica migraciones de Prisma |
| `npm run db:seed` | Carga datos iniciales (cuando esté configurado) |
| `npm run db:studio` | Abre Prisma Studio en el navegador |

### Verificar que el backend funciona

```bash
npm run dev
```

Abrir en el navegador: [http://localhost:3001/api/health](http://localhost:3001/api/health)

Respuesta esperada:

```json
{ "ok": true, "message": "REST-in-Peace API running" }
```

---

## Instalación del Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abrir en el navegador: [http://localhost:5173](http://localhost:5173)

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Levanta el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run preview` | Previsualiza el build |
| `npm run lint` | Ejecuta ESLint |

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

| Servicio | URL |
|----------|-----|
| API | http://localhost:3001 |
| Frontend | http://localhost:5173 |

---

## Estructura del proyecto

```
grupo-REST-in-Peace/
├── README.md
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    ├── public/
    └── package.json
```

---

## Notas importantes

- **No commitear** el archivo `.env` — solo `.env.example`.
- Las carpetas `node_modules/` y `dist/` están en `.gitignore`.
- Cada integrante trabaja con su PostgreSQL local; los datos no se comparten entre máquinas.
- Al clonar cambios nuevos del repo, correr `npm install` en `backend/` y `frontend/` si hubo cambios en dependencias.
- Cuando se agreguen migraciones de Prisma, cada integrante debe ejecutar `npm run db:migrate` en `backend/`.
