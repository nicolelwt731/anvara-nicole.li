# Anvara

A sponsorship marketplace connecting sponsors with publishers, built with a modern full-stack monorepo architecture.

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4
- **Backend**: Express.js, Prisma ORM, PostgreSQL
- **Auth**: Better Auth (role-based)
- **Monorepo**: PNPM workspaces
- **Testing**: Vitest
- **Linting**: ESLint 9

## Project Structure

```
apps/
├── frontend/                 # Next.js app (port 3847)
│   ├── app/
│   │   ├── components/       # Shared components
│   │   ├── api/auth/         # Better Auth routes
│   │   ├── dashboard/        # Role-based dashboards
│   │   │   ├── sponsor/
│   │   │   └── publisher/
│   │   └── marketplace/      # Public marketplace
│   └── lib/
│       ├── api.ts            # API client
│       ├── types.ts          # Type definitions
│       └── utils.ts          # Utilities
│
├── backend/                  # Express API (port 4291)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── index.ts          # API routes
│       ├── db.ts             # Prisma client
│       └── utils/
│           └── helpers.ts
│
└── packages/
    ├── config/               # Shared TypeScript config
    ├── eslint-config/        # Shared ESLint rules
    └── prettier-config/      # Shared Prettier config
```

## Prerequisites

- Node.js v20+
- PNPM v8+
- Docker

## Getting Started

```bash
git clone https://github.com/nicolelwt731/anvara.git
cd anvara
pnpm install
```

Start the database:

```bash
docker-compose up -d
```

Run migrations and seed:

```bash
pnpm --filter @anvara/backend db:migrate
pnpm --filter @anvara/backend db:seed
```

Start the dev servers:

```bash
pnpm dev
```

## Authentication

Role-based auth with two user types:

- **Sponsors** — view campaigns, create placements
- **Publishers** — view ad slots, manage availability

Demo accounts:

- `sponsor@example.com` / `password`
- `publisher@example.com` / `password`

## Scripts

```bash
pnpm dev          # Start all services
pnpm test         # Run tests
pnpm lint         # Lint
pnpm format       # Format with Prettier
pnpm --filter @anvara/backend db:studio   # Open Prisma Studio
```

## Database

PostgreSQL runs in Docker on port 5498.

```bash
docker-compose up -d    # Start
docker-compose down     # Stop
```
