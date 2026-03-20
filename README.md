# Studented.me

International Education Concierge Platform — full-stack case-management system for students, counselors, institutions, and partners.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS (TypeScript) |
| Frontend | Next.js 14, Tailwind CSS, shadcn/ui |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | JWT access + refresh tokens |
| Storage | Google Cloud Storage |
| Payments | Stripe |
| Comms | SendGrid, Twilio |

## Prerequisites

- Node.js 18+
- Supabase account (free tier works)

## Quick Start

### 1. Install

```bash
git clone <repository-url>
cd studented.me
npm install
cd frontend && npm install && cd ..
```

### 2. Configure

```bash
cp .env.example .env
# Fill in your Supabase DATABASE_URL, DIRECT_URL, and keys
```

### 3. Database

```bash
npx prisma db push        # Push schema to Supabase
npx ts-node prisma/seed.ts # Seed demo data
```

### 4. Run

```bash
# Terminal 1 — Backend (port 4000)
npm run start:dev

# Terminal 2 — Frontend (port 3001)
cd frontend && PORT=3001 npm run dev
```

### 5. Open

- Frontend: http://localhost:3001
- API: http://localhost:4000/api
- Swagger: http://localhost:4000/api/docs

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | student@demo.com | Demo123! |
| Counselor | counselor@demo.com | Demo123! |

## Project Structure

```
studented.me/
├── src/                    # Backend (NestJS)
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/             # Guards, decorators, filters, interceptors
│   ├── database/           # Prisma service
│   ├── storage/            # GCS + local storage services
│   └── modules/
│       ├── auth/           # JWT authentication
│       ├── users/          # User management
│       ├── opportunities/  # Program & scholarship catalog
│       ├── applications/   # Application workflow engine
│       └── documents/      # Document upload & review
├── frontend/               # Next.js 14
│   └── src/
│       ├── app/            # Pages (login, register, dashboard, about, etc.)
│       ├── components/     # UI components (shadcn/ui)
│       └── lib/            # API client, auth store, utilities
├── prisma/
│   ├── schema.prisma       # Database schema (30+ models)
│   └── seed.ts             # Demo data seeder
└── docs/                   # Documentation
    ├── api-endpoints.md    # Full REST API specification
    ├── architecture.md     # System architecture & roadmap
    ├── project-structure.md
    ├── roadmap.md          # Implementation next steps
    └── investor-demo.md    # Demo script
```

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Backend with hot reload |
| `npm run build` | Build for production |
| `npx prisma studio` | Database GUI |
| `npx prisma db push` | Push schema to Supabase |

## Documentation

- [API Endpoints](docs/api-endpoints.md) — full REST specification
- [Architecture](docs/architecture.md) — system design & roadmap
- [Project Structure](docs/project-structure.md) — code organization
- [Roadmap](docs/roadmap.md) — implementation plan
- [Investor Demo](docs/investor-demo.md) — demo walkthrough
- [Frontend README](frontend/README.md) — frontend details
- [Frontend Deployment](frontend/DEPLOYMENT.md) — deployment guides

## License

Proprietary — All rights reserved
