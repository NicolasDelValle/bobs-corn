# Bob's Corn Frontend 🌽

Modern React + TypeScript + Vite application siguiendo las mejores prácticas 2025.

## 🚀 Stack Tecnológico

- **Runtime:** Node.js 22
- **Language:** TypeScript 5.9 (strict mode)
- **Framework:** React 19 (con JSX automático)
- **Build Tool:** Vite 7 (ESM + HMR)
- **Styling:** Tailwind CSS 3.4 + CSS Variables
- **Testing:** Vitest 4 + Playwright
- **Storybook:** Storybook 10 (component development)
- **Linting:** ESLint 9 (flat config)

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Button/         # Componente Button con Storybook
│   │   └── ThemeSwitch/    # Toggle de tema dark/light
│   ├── contexts/           # React Context providers
│   │   └── themeContext.tsx # Gestión del tema global
│   ├── hooks/              # Custom React hooks
│   │   ├── useApi.ts       # Hooks para API calls
│   │   ├── useLocalStorage.ts # Gestión de localStorage
│   │   └── index.ts        # Barrel exports
│   ├── services/           # API client y utilidades
│   │   ├── api.ts          # Cliente API con tipos
│   │   └── index.ts        # Exportaciones y utilidades
│   ├── types/              # Definiciones TypeScript globales
│   │   └── index.ts        # Tipos para componentes y API
│   └── index.css           # Estilos globales + CSS Variables
├── tailwind.config.js      # Configuración Tailwind personalizada
└── vite.config.ts          # Configuración Vite + Storybook
```

## 🎨 Sistema de Temas

### CSS Variables Personalizadas
```css
:root {
  --background: #ffffff;
  --primary: #0969da;
  --secondary: #6f42c1;
  /* Variables para tema claro */
}

.dark {
  --background: #1f1f1f;
  --primary: #007acc;
  --secondary: #c586c0;
  /* Variables para tema oscuro */
}
```

### Integración con Tailwind
```tsx
// Las variables están mapeadas en Tailwind
<div className="bg-background text-foreground">
  <button className="bg-primary text-onPrimary">
    Click me
  </button>
</div>
```

## 🔧 Scripts Principales

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor desarrollo con HMR |
| `npm run build` | Build para producción |
| `npm run storybook` | Servidor Storybook |
| `npm run lint` | Linting con ESLint |

## ✅ Configuración Completada

### ✅ Tailwind CSS 3.4 Instalado
- Configuración personalizada con CSS Variables
- Colores del tema integrados
- Animaciones y utilidades adicionales
- Plugin de tipografía incluido

### ✅ Sistema de Temas Robusto
- ThemeContext con persistencia en localStorage
- Hook useTheme para cambio de tema
- CSS Variables para consistencia
- Componente ThemeToggle funcional

### ✅ Estructura de Hooks
- `useApi` para llamadas API
- `useLocalStorage` / `useSessionStorage` para persistencia
- `useDebounce` para optimización
- `useClickOutside` para interacciones UI

### ✅ Cliente API Configurado
- Manejo de errores tipado (ApiError)
- Timeout y retry logic
- Headers de sesión automáticos
- TypeScript types incluidos

### ✅ Tipos TypeScript
- Tipos globales centralizados
- Props de componentes definidos
- API response types
- Theme types

## 🎭 Storybook Configurado

```bash
npm run storybook
# http://localhost:6006
```

Incluye:
- Componente Button con stories
- Addon de accesibilidad
- Testing con Vitest
- Documentación automática

## 🐳 Docker Ready

Configuración multi-stage:
- **Development:** Hot reload + debugging
- **Production:** Nginx optimized

```bash
# Desarrollo
docker-compose up frontend

# Producción  
docker build --target production -t frontend:prod .
```

## 📝 Próximos Pasos Recomendados

1. **Agregar más componentes base**: Card, Modal, Input, etc.
2. **Implementar formularios**: Con validación y tipos
3. **Estado global**: Context API o Zustand para estado complejo
4. **Testing**: Tests unitarios e integración
5. **Routing**: React Router para navegación

## 🎯 Mejores Prácticas Implementadas (2025)

- ✅ React 19 con JSX Transform automático
- ✅ TypeScript strict mode
- ✅ ESLint 9 flat config  
- ✅ CSS Variables + Tailwind CSS
- ✅ Component-driven development
- ✅ Custom hooks pattern
- ✅ Barrel exports organization
- ✅ Error boundaries ready
- ✅ Performance optimizations
- ✅ Docker multi-stage builds

---

**¡Frontend configurado con las mejores prácticas 2025! 🎉**

- **Runtime:** Node.js 22
- **Language:** TypeScript 5.6
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

## Production Deployment

1. Set environment variables in `.env.production`:
   ```bash
   VITE_API_URL=https://api.example.com
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. The compiled files will be in `/dist` and can be served by any static server

Or use Docker:
```bash
docker-compose -f docker-compose.prod.yml up -d frontend
```

## Build Configuration

Build settings in `vite.config.ts`:

- Automatic minification
- Code splitting
- Asset optimization
- Source maps for debugging

## ESLint Configuration

The project uses the recommended ESLint configuration for React + TypeScript.

To enable stricter type-aware rules:

```js
// eslint.config.js
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      // Or for stricter rules:
      // tseslint.configs.strictTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

## Adding New Features

### 1. Create Component

```tsx
// src/components/Example.tsx
interface ExampleProps {
  title: string;
}

export const Example = ({ title }: ExampleProps) => {
  return <div>{title}</div>;
};
```

### 2. Use in App

```tsx
import { Example } from './components/Example';

function App() {
  return <Example title="Hello" />;
}
```

### 3. Add Styles

```css
/* src/components/Example.css */
.example {
  padding: 1rem;
}
```

## Debugging

### Enable Debug Mode

Check browser console for errors and warnings.

### Vite Dev Server

The dev server runs on `http://localhost:5173` with:
- Hot Module Replacement (HMR)
- Fast refresh for React components
- Instant server start

### Docker Logs

```bash
# View logs
docker-compose logs frontend -f

# Access container
docker-compose exec frontend sh

# Check environment
docker-compose exec frontend env
```
