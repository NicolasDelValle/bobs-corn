# Backend Structure

```
backend/src/
├── index.ts              # Application entry point
├── config.ts             # Environment configuration
├── models/
│   └── index.ts          # Database connection and Prisma client
├── controllers/
│   ├── health.controller.ts    # Health check logic
│   └── example.controller.ts   # Example endpoint logic
├── routes/
│   ├── index.ts          # Main router (aggregates all routes)
│   ├── health.routes.ts  # Health check routes
│   ├── api.routes.ts     # API routes
│   └── example.routes.ts # Example routes
└── middleware/
    └── errorHandler.ts   # Error handling middleware
```

## How it works

### 1. Models (`src/models/`)
- Database connection and Prisma client initialization
- Export `prisma` instance for use in controllers
- Database connection/disconnection functions

### 2. Controllers (`src/controllers/`)
- Business logic for each endpoint
- Request/response handling
- Data validation and transformation

### 3. Routes (`src/routes/`)
- Route definitions
- Map URLs to controller functions
- Route grouping and organization

### 4. Middleware (`src/middleware/`)
- Error handlers
- Authentication (future)
- Validation (future)
- Logging (future)

## Adding a new feature

### 1. Create a model (if needed)

```prisma
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

Run: `npx prisma migrate dev --name add_user_model`

### 2. Create controller

```typescript
// src/controllers/user.controller.ts
import type { Request, Response } from "express";
import { prisma } from "../models";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    const user = await prisma.user.create({
      data: { email, name },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};
```

### 3. Create routes

```typescript
// src/routes/user.routes.ts
import { Router } from "express";
import { getUsers, createUser } from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);

export default router;
```

### 4. Register routes

```typescript
// src/routes/api.routes.ts
import { Router } from "express";
import { getApiInfo } from "../controllers/health.controller";
import exampleRoutes from "./example.routes";
import userRoutes from "./user.routes"; // Add this

const router = Router();

router.get("/", getApiInfo);
router.use("/hello", exampleRoutes);
router.use("/users", userRoutes); // Add this

export default router;
```

Now you have:
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
