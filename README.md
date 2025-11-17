# Bob's Corn 🌽

Modern full-stack application with Express + TypeScript + Prisma backend and React + Vite frontend, ready for development and production with Docker.

## Stack

**Backend:** Node.js 22, TypeScript, Express 5, Prisma, PostgreSQL 17  
**Frontend:** React 19, TypeScript, Vite 7  
**DevOps:** Docker, Docker Compose, Hot reload

## Quick Start

### Without Docker

 - **DB**
```bash
docker-compose up -d postgres
```

 - **Backend**
```bash
cd backend
cp .env.local .env
npm install
npx prisma migrate dev
npm run dev
```

 - **Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

### With Docker (Recommended)

 - **Copy environment variables**
```bash
cp backend/.env.example backend/.env.development
cp frontend/.env.example frontend/.env.development
```

 - **Start everything**
```bash
docker-compose up
```

## Docker Commands

| Action | Command |
|--------|---------|
| **Start everything** | `docker-compose up` |
| **Start in background** | `docker-compose up -d` |
| **Rebuild** | `docker-compose up --build` |
| **View logs** | `docker-compose logs -f` |
| **Stop** | `docker-compose down` |
| **Backend only** | `docker-compose up backend` |
| **Frontend only** | `docker-compose up frontend` |
| **Database only** | `docker-compose up -d postgres` |
| **Reinstall Frontend deps** | `docker-compose exec frontend npm install` |
| **Reinstall Backend deps** | `docker-compose exec backend npm install` |

## Database (Prisma)

| Action | Command |
|--------|---------|
| **Generate client** | `docker-compose exec backend npx prisma generate` |
| **Migration** | `docker-compose exec backend npx prisma migrate dev` |
| **Prisma Studio** | `docker-compose exec backend npx prisma studio` |
| **PostgreSQL CLI** | `docker-compose exec postgres psql -U postgres -d bobs_corn` |

## Environment Variables

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

**Database connection error:**
```bash
docker-compose logs postgres
docker-compose restart backend
```

**Hot reload not working:**
```bash
docker-compose down
docker-compose up --build
```

**Clean everything:**
```bash
docker-compose down -v
docker-compose up --build
```