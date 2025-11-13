# Bob's Corn 🌽

Aplicación full-stack moderna con backend en Express + TypeScript + Prisma y frontend en React + Vite, lista para desarrollo y producción con Docker.

## Quick Start

### Con Docker (Recomendado)

```bash
# Copiar variables de entorno
cp backend/.env.example backend/.env.development
cp frontend/.env.example frontend/.env.development

# Levantar todo
docker-compose up
```

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- PostgreSQL: localhost:5432

### Sin Docker

```bash
# Solo PostgreSQL en Docker
docker-compose up -d postgres

# Backend
cd backend
cp .env.local .env
npm install
npx prisma migrate dev
npm run dev

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev
```

## Stack

**Backend:** Node.js 22, TypeScript, Express 5, Prisma, PostgreSQL 17  
**Frontend:** React 19, TypeScript, Vite 7  
**DevOps:** Docker, Docker Compose, Hot reload

## Comandos Docker

| Acción | Comando |
|--------|---------|
| **Levantar todo** | `docker-compose up` |
| **Levantar en background** | `docker-compose up -d` |
| **Rebuild** | `docker-compose up --build` |
| **Ver logs** | `docker-compose logs -f` |
| **Detener** | `docker-compose down` |
| **Solo backend** | `docker-compose up backend` |
| **Solo frontend** | `docker-compose up frontend` |
| **Solo base de datos** | `docker-compose up -d postgres` |

## 🗄️ Base de Datos (Prisma)

| Acción | Comando |
|--------|---------|
| **Generar cliente** | `docker-compose exec backend npx prisma generate` |
| **Migración** | `docker-compose exec backend npx prisma migrate dev` |
| **Prisma Studio** | `docker-compose exec backend npx prisma studio` |
| **PostgreSQL CLI** | `docker-compose exec postgres psql -U postgres -d bobs_corn` |

## Variables de Entorno

**Backend (.env.development):**
```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/bobs_corn
SESSION_SECRET=dev-session-secret
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env.development):**
```env
VITE_API_URL=http://localhost:5000/api
```

## Troubleshooting

**Error de conexión a BD:**
```bash
docker-compose logs postgres
docker-compose restart backend
```

**Hot reload no funciona:**
```bash
docker-compose down
docker-compose up --build
```

**Limpiar todo:**
```bash
docker-compose down -v
docker-compose up --build
```