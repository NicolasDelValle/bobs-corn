# Bob's Corn Frontend 🌽

Modern Vue 3 + TypeScript + Vite application con Context API y animaciones suaves.

## 🚀 Stack Tecnológico

- **Runtime:** Node.js 22
- **Language:** TypeScript 5.9 (strict mode)
- **Framework:** Vue 3.5 (Composition API + script setup)
- **Build Tool:** Vite 7.2 (ESM + HMR)
- **Styling:** Tailwind CSS 3.4
- **UI Components:** PrimeVue 4.5 + PrimeIcons
- **Animations:** @vueuse/motion 3.0
- **Routing:** Vue Router 4.6
- **Utils:** Lucide Vue Icons, CVA, clsx
- **Type Checking:** vue-tsc 3.1

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Commons/        # Componentes base comunes
│   │   ├── Forms/          # Formularios y validaciones  
│   │   ├── Layouts/        # Layouts de página
│   │   ├── Modals/         # Modales y overlays
│   │   ├── NavBar/         # Navegación
│   │   └── UserStats/      # Estadísticas de usuario
│   ├── composables/        # Composables Vue 3
│   ├── context/           # Context providers para estado global
│   ├── hooks/             # Custom hooks (legacy)
│   ├── router/            # Vue Router configuración
│   ├── services/          # API client y utilidades
│   ├── types/             # Definiciones TypeScript globales
│   ├── utils/             # Utilidades y helpers
│   ├── views/             # Páginas/vistas principales
│   └── style.css          # Estilos globales
├── vite.config.ts         # Configuración Vite + Vue
└── Dockerfile             # Docker multi-stage config
```

## 🔧 Scripts Principales

| Script | Descripción |
|--------|-----------|
| `npm run dev` | Servidor desarrollo con HMR |
| `npm run build` | Build para producción (incluye type checking) |
| `npm run preview` | Preview del build de producción |

## 🎯 Características Principales

- **Vue 3 Composition API:** Lógica reactiva moderna con `<script setup>`
- **Context Pattern:** Estado global con providers reactivos 
- **Reactive Wait Times:** Sistema de cooldowns con timers en tiempo real
- **Smooth Animations:** Transiciones suaves con v-motion y spring physics
- **Responsive Design:** Mobile-first con Tailwind CSS
- **Type Safety:** TypeScript estricto en todo el proyecto

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

# Start dev server
npm run dev
```

## Scripts

| Action | Command |
|--------|---------|
| **Development server with hot reload** | `npm run dev` |
| **Build for production** | `npm run build` |
| **Preview production build** | `npm run preview` |

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the code.

**Required:**
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)

**Available environments:**
- `.env.development` - Development mode
- `.env.production` - Production build

## API Connection

The frontend connects to the backend using the `VITE_API_URL` environment variable:

```typescript
// src/lib/config.ts
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Usage in services
import { API_URL } from '@/lib/config';

export const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/api/products`);
  return response.json();
};
```

## Context Pattern Usage

The app uses Vue 3 context/provider pattern for wait time management:

```typescript
// src/context/SessionContext.ts
export function createWaitTimeProvider() {
  const waitTime = ref<number>(1);
  const lastPurchaseTime = ref<number | null>(null);
  const isWaiting = computed(() => /* cooldown logic */);
  const remainingTime = computed(() => /* countdown logic */);
  
  const registerPurchase = (productId: string) => {
    // Update corn count and purchase time
  };
  
  return { 
    waitTime, 
    isWaiting, 
    remainingTime, 
    lastPurchaseTime,
    registerPurchase 
  };
}

// Usage in components
const { isWaiting, remainingTime, registerPurchase } = useWaitTimeContext();
```

## Key Features

### 🕒 Real-time Wait System
- Purchase cooldowns with live countdown timers
- Automatic cleanup when wait time expires
- Context-based reactive state management

### 🎨 Smooth Animations
- Spring-based transitions with @vueuse/motion
- Progress bars with organic feel
- Entrance animations for components

### 📱 Responsive Design
- Mobile-first approach with Tailwind CSS
- Adaptive layouts and typography
- Touch-friendly interactions

## Docker

### Development

```bash
# Build development image
docker build --target development -t bobs-corn-frontend:dev .

# Run with hot reload
docker run -p 5173:5173 bobs-corn-frontend:dev
```

The development container includes:
- Hot reload via Vite HMR
- Vue DevTools support
- Port 5173 exposed

### Production

```bash
# Build production image
docker build --target production -t bobs-corn-frontend:prod .

# Run optimized build
docker run -p 80:80 bobs-corn-frontend:prod
```

The production container:
- Multi-stage optimized build
- Static files served by nginx
- SPA routing support
- Security headers configured
- Asset caching optimized

## Vue 3 + TypeScript Best Practices

This project follows Vue 3 composition API patterns:

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useWaitTimeContext } from '@/context/SessionContext';
import { useSession } from '@/composables/useSession';

// Context for reactive wait time management
const { isWaiting, remainingTime, registerPurchase } = useWaitTimeContext();
const { sessionId, sessionName } = useSession();

// Local reactive state
const stats = computed(() => generateUserStats(cornCount.value));

// Type-safe props (when needed)
interface Props {
  productId: string;
}
const props = defineProps<Props>();

// Event handlers
const handlePurchase = () => {
  if (!isWaiting.value) {
    registerPurchase(props.productId);
  }
};
</script>

<template>
  <div class="product-card">
    <button 
      :disabled="isWaiting" 
      @click="handlePurchase"
      class="btn-purchase"
    >
      {{ isWaiting ? `Espera ${remainingTime}s` : 'Comprar' }}
    </button>
  </div>
</template>
```

---

**Frontend moderno con Vue 3, gestión reactiva de estado y animaciones suaves! 🎉**
