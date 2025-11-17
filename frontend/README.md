# Bob's Corn Frontend 🌽

Modern React + TypeScript + Vite application siguiendo las mejores prácticas 2025.

## 🚀 Stack Tecnológico

- **Runtime:** Node.js 22
- **Language:** TypeScript 5.9 (strict mode)
- **Framework:** React 19 (con JSX automático)
- **Build Tool:** Vite 7 (ESM + HMR)
- **Linting:** ESLint 9 (flat config)

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API client y utilidades
│   ├── types/              # Definiciones TypeScript globales
│   └── index.css           # Estilos globales
├── vite.config.ts          # Configuración Vite
└── Dockerfile              # Docker config
```

## 🔧 Scripts Principales

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor desarrollo con HMR |
| `npm run build` | Build para producción |
| `npm run lint` | Linting con ESLint |

---

**¡Frontend configurado con las mejores prácticas 2025! 🎉**

- **Runtime:** Node.js 22
- **Language:** TypeScript 5.9
- **Framework:** React 19
- **Build Tool:** Vite 7
- **Linter:** ESLint
- **Dev Tools:** Vite Dev Server, Hot Module Replacement

## Quick Start

### With Docker (Recommended)

```bash
# From project root
docker-compose up frontend
```

### Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.development

# Start dev server
npm run dev
```

## Scripts

| Action | Command |
|--------|---------|
| **Development server with hot reload** | `npm run dev` |
| **Build for production** | `npm run build` |
| **Preview production build** | `npm run preview` |
| **Lint with ESLint** | `npm run lint` |

## Environment Variables

See `.env.example` for all available variables.

**Required:**
- `VITE_API_URL` - Backend API URL

**Available environments:**
- `.env.development` - Development mode
- `.env.production` - Production build

All environment variables must be prefixed with `VITE_` to be accessible in the code.

## API Connection

The frontend connects to the backend using the `VITE_API_URL` environment variable:

```typescript
// src/config.ts
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Usage in components
fetch(`${API_URL}/api/example`)
  .then(res => res.json())
  .then(data => console.log(data));
```

## Docker

### Development

```bash
# Build
docker build --target development -t bobs-corn-frontend:dev .

# Run
docker run -p 5173:5173 --env-file .env.development bobs-corn-frontend:dev
```

The development container includes:
- Hot reload via mounted volumes
- Vite dev server
- Port 5173 exposed

### Production

```bash
# Build
docker build --target production -t bobs-corn-frontend:prod .

# Run
docker run -p 80:80 bobs-corn-frontend:prod
```

The production container:
- Multi-stage optimized build
- Static files served by nginx
- Lightweight nginx:alpine base image

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
// eslint.config.js
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    extends: [tseslint.configs.recommended]
  }
)
```
