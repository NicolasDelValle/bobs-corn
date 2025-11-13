# Bob's Corn Backend API 🌽

Express + TypeScript + Prisma REST API.

## Stack

- **Runtime:** Node.js 22
- **Language:** TypeScript 5.9
- **Framework:** Express 5
- **ORM:** Prisma 6
- **Database:** PostgreSQL 17
- **Security:** Helmet, CORS
- **Logging:** Morgan
- **Dev Tools:** tsx, nodemon, Vitest

## Quick Start

### With Docker (Recommended)

```bash
# From project root
docker-compose up backend
```

### Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local .env

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start dev server
npm run dev
```
## Scripts

| Action | Command |
|--------|---------|
| **Development server with hot reload** | `npm run dev` |
| **Compile TypeScript to JavaScript** | `npm run build` |
| **Start production server** | `npm run start` |
| **Start with NODE_ENV=development** | `npm run start:dev` |
| **Start with NODE_ENV=production** | `npm run start:prod` |
| **Generate Prisma Client** | `npm run prisma:generate` |
| **Create and apply migration** | `npm run prisma:migrate` |
| **Apply pending migrations** | `npm run prisma:migrate:deploy` |
| **Open Prisma Studio GUI** | `npm run prisma:studio` |
| **Run tests with Vitest** | `npm run test` |
| **Run tests with UI** | `npm run test:ui` |
| **Type-check with TypeScript** | `npm run lint` |

## Environment Variables

See `.env.example` for all available variables.

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption secret

**Optional:**
- `PORT` (default: 5000)
- `NODE_ENV` (default: development)
- `CORS_ORIGIN` (default: http://localhost:5173)
- `LOG_LEVEL` (default: info)

## Database

### Prisma Commands

```bash
# Generate Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Validate schema
npx prisma validate

# Format schema
npx prisma format
```

### Database Schema

Located in `prisma/schema.prisma`. The Prisma Client is generated to `generated/prisma`.

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-12T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "version": "v1"
}
```

### API Root
```
GET /api
```

Response:
```json
{
  "name": "bobs-corn-api",
  "version": "v1",
  "environment": "development",
  "message": "Bob's Corn API is running!"
}
```

### Example Endpoint
```
GET /api/hello
```

Response:
```json
{
  "message": "Hello from Bob's Corn API!",
  "timestamp": "2025-11-12T10:30:00.000Z"
}
```

## Security Features

- **Helmet:** Secure HTTP headers
- **CORS:** Configurable cross-origin requests
- **Rate Limiting:** Configurable request limits
- **Environment Validation:** Required variables checked on startup

## Docker

### Development

```bash
# Build
docker build --target development -t bobs-corn-api:dev .

# Run
docker run -p 5000:5000 --env-file .env.development bobs-corn-api:dev
```

### Production

```bash
# Build
docker build --target production -t bobs-corn-api:prod .

# Run
docker run -p 5000:5000 --env-file .env.production bobs-corn-api:prod
```

## Testing

```bash
# Run all tests
npm run test

# Run with UI
npm run test:ui

# Run in watch mode
npm run test -- --watch
```

## Logging

Morgan logger with different formats per environment:
- **Development:** `dev` format (colored, concise)
- **Production:** `combined` format (Apache standard)

Configure with `LOG_LEVEL` and `LOG_FORMAT` environment variables.

## Production Deployment

1. Set environment variables in `.env.production`
2. Generate secure secrets:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Build the application:
   ```bash
   npm run build
   ```
4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```
5. Start the server:
   ```bash
   npm run start
   ```

Or use Docker:
```bash
docker-compose -f docker-compose.prod.yml up -d backend
```

## Debugging

### Enable Debug Logging

```bash
# Set in .env
LOG_LEVEL=debug
```

### View Database Queries

```bash
# Set in .env
DEBUG=prisma:query
```

### Docker Logs

```bash
# View logs
docker-compose logs backend -f

# Access container
docker-compose exec backend sh

# Check environment
docker-compose exec backend env
```

## Adding New Features

### 1. Add Route

```typescript
// src/routes/example.ts
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Example route' });
});

export default router;
```

### 2. Register in index.ts

```typescript
import exampleRoutes from './routes/example';
app.use('/api/example', exampleRoutes);
```

### 3. Add Database Model

```prisma
// prisma/schema.prisma
model Example {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
}
```

Then run:
```bash
npx prisma migrate dev --name add_example_model
```

---

## Usar Base de Datos Personalizada

Si quieres conectarte a tu propia base de datos PostgreSQL en lugar de usar el contenedor de Docker, sigue estos pasos:

### 1. Obtener Connection String

El formato del connection string de PostgreSQL es:

```
postgresql://[usuario]:[contraseña]@[host]:[puerto]/[nombre_db]?[opciones]
```

Ejemplos:

```bash
# Base de datos local
postgresql://myuser:mypassword@localhost:5432/mydb

# Base de datos remota
postgresql://admin:secret@db.example.com:5432/production_db

# Con SSL (recomendado para producción)
postgresql://user:pass@host:5432/db?sslmode=require

# Azure Database for PostgreSQL
postgresql://user@server:pass@server.postgres.database.azure.com:5432/db?sslmode=require

# AWS RDS
postgresql://user:pass@mydb.abc123.us-east-1.rds.amazonaws.com:5432/mydb?sslmode=require
```

### 2. Actualizar Variables de Entorno

Abre el archivo de entorno que estés usando:

- `.env.local` - Desarrollo sin Docker
- `.env.development` - Desarrollo con Docker
- `.env.production` - Producción

Reemplaza la variable `DATABASE_URL`:

```bash
# Antes (Docker)
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/bobs_corn"

# Después (base de datos personalizada)
DATABASE_URL="postgresql://tu_usuario:tu_password@tu_host:5432/tu_database"
```

### 3. Configurar SSL/TLS (Opcional)

Para conexiones seguras, agrega parámetros SSL al connection string:

```bash
# Require SSL
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# Verificar certificado completo
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=verify-full&sslrootcert=/path/to/ca.pem"
```

### 4. Verificar Conexión

Prueba la conexión antes de ejecutar migraciones:

```bash
# Test de conexión
npx prisma db pull

# Si funciona, aplica tus migraciones
npx prisma migrate deploy
```

### 5. Consideraciones Importantes

- **Firewall**: Asegúrate de que tu base de datos permita conexiones desde tu IP
- **Credenciales**: Nunca commitees archivos `.env` con credenciales reales al repositorio
- **SSL**: Siempre usa SSL en producción (`sslmode=require` como mínimo)
- **Permisos**: El usuario de la base de datos necesita permisos para crear/modificar tablas
- **Timeout**: Algunas bases de datos remotas pueden necesitar timeout más largo en `config.ts`

### 6. Ejemplo Completo

Para conectarte a una base de datos de Azure:

1. Crea la base de datos en Azure Portal
2. Obtén el connection string desde Azure
3. Actualiza `.env.production`:

```bash
DATABASE_URL="postgresql://admin@myserver:MyP@ssw0rd@myserver.postgres.database.azure.com:5432/bobs_corn?sslmode=require"
```

4. Ejecuta las migraciones:

```bash
npx prisma migrate deploy
npx prisma generate
```

5. Inicia el servidor:

```bash
npm start
```
