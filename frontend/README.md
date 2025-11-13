# Bob's Corn Frontend 🌽

React + TypeScript + Vite application.

## Stack

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
