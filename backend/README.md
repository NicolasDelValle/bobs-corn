# Bob's Corn Backend API 🌽

Express + TypeScript + Prisma REST API.

## 🚀 Quick Start

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

## 📝 Scripts

```bash
npm run dev              # Development server with hot reload
npm run build            # Compile TypeScript to JavaScript
npm run start            # Start production server
npm run start:dev        # Start with NODE_ENV=development
npm run start:prod       # Start with NODE_ENV=production
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Create and apply migration
npm run prisma:migrate:deploy  # Apply pending migrations
npm run prisma:studio    # Open Prisma Studio GUI
npm run test             # Run tests with Vitest
npm run test:ui          # Run tests with UI
npm run lint             # Type-check with TypeScript
```

## 🛠️ Tech Stack

- **Runtime:** Node.js 22
- **Language:** TypeScript 5.9
- **Framework:** Express 5
- **ORM:** Prisma 6
- **Database:** PostgreSQL 17
- **Security:** Helmet, CORS
- **Logging:** Morgan
- **Dev Tools:** tsx, nodemon, Vitest

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.ts         # Main entry point
│   ├── config.ts        # Environment configuration
│   ├── routes/          # API routes (add here)
│   ├── controllers/     # Route controllers (add here)
│   ├── services/        # Business logic (add here)
│   └── middleware/      # Custom middleware (add here)
├── prisma/
│   └── schema.prisma    # Database schema
├── generated/           # Prisma Client (generated)
├── dist/                # Compiled JavaScript (generated)
├── .env.example         # Environment template
├── .env.development     # Development config
├── .env.local           # Local config (no Docker)
├── .env.production      # Production config
└── Dockerfile           # Multi-stage Docker build
```

## 🔐 Environment Variables

See `.env.example` for all available variables.

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption secret

**Optional:**
- `PORT` (default: 5000)
- `NODE_ENV` (default: development)
- `CORS_ORIGIN` (default: http://localhost:5173)
- `LOG_LEVEL` (default: info)

## 🗄️ Database

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

## 🔌 API Endpoints

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

## 🔒 Security Features

- **Helmet:** Secure HTTP headers
- **CORS:** Configurable cross-origin requests
- **Rate Limiting:** Configurable request limits
- **Environment Validation:** Required variables checked on startup

## 🐳 Docker

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

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run with UI
npm run test:ui

# Run in watch mode
npm run test -- --watch
```

## 📊 Logging

Morgan logger with different formats per environment:
- **Development:** `dev` format (colored, concise)
- **Production:** `combined` format (Apache standard)

Configure with `LOG_LEVEL` and `LOG_FORMAT` environment variables.

## 🚀 Production Deployment

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

## 🐛 Debugging

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

## 📝 Adding New Features

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

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use Prisma for database operations
3. Add proper error handling
4. Write tests for new features
5. Update documentation

## 📄 License

ISC
