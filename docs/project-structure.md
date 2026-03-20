# Studented.me Project Structure

```
studented-backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── permissions.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── permissions.guard.ts
│   │   │   └── rate-limit.guard.ts
│   │   ├── interceptors/
│   │   │   ├── audit-log.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── dto/
│   │       ├── pagination.dto.ts
│   │       └── response.dto.ts
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── security.config.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── refresh-token.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       ├── register.dto.ts
│   │   │       └── auth-response.dto.ts
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       └── update-user.dto.ts
│   │   ├── students/
│   │   │   ├── students.module.ts
│   │   │   ├── students.controller.ts
│   │   │   ├── students.service.ts
│   │   │   └── dto/
│   │   │       ├── create-student.dto.ts
│   │   │       └── update-profile.dto.ts
│   │   ├── leads/
│   │   │   ├── leads.module.ts
│   │   │   ├── leads.controller.ts
│   │   │   ├── leads.service.ts
│   │   │   └── dto/
│   │   ├── opportunities/
│   │   │   ├── opportunities.module.ts
│   │   │   ├── opportunities.controller.ts
│   │   │   ├── opportunities.service.ts
│   │   │   └── dto/
│   │   ├── applications/
│   │   │   ├── applications.module.ts
│   │   │   ├── applications.controller.ts
│   │   │   ├── applications.service.ts
│   │   │   ├── applications-authorization.service.ts
│   │   │   ├── applications-workflow.service.ts
│   │   │   ├── listeners/
│   │   │   │   └── application-events.listener.ts
│   │   │   └── dto/
│   │   │       ├── create-application.dto.ts
│   │   │       ├── update-application.dto.ts
│   │   │       └── change-status.dto.ts
│   │   ├── documents/
│   │   │   ├── documents.module.ts
│   │   │   ├── documents.controller.ts
│   │   │   ├── documents.service.ts
│   │   │   ├── documents-authorization.service.ts
│   │   │   ├── processors/
│   │   │   │   ├── virus-scan.processor.ts
│   │   │   │   └── ocr.processor.ts
│   │   │   └── dto/
│   │   ├── visa/
│   │   │   ├── visa.module.ts
│   │   │   ├── visa.controller.ts
│   │   │   └── visa.service.ts
│   │   ├── tasks/
│   │   │   ├── tasks.module.ts
│   │   │   ├── tasks.controller.ts
│   │   │   └── tasks.service.ts
│   │   ├── notifications/
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── email/
│   │   │   │   ├── email.service.ts
│   │   │   │   ├── email.processor.ts
│   │   │   │   └── templates.service.ts
│   │   │   ├── sms/
│   │   │   │   ├── sms.service.ts
│   │   │   │   └── sms.processor.ts
│   │   │   └── whatsapp/
│   │   │       ├── whatsapp.service.ts
│   │   │       └── whatsapp.processor.ts
│   │   ├── payments/
│   │   │   ├── payments.module.ts
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   ├── invoices.service.ts
│   │   │   └── webhooks.controller.ts
│   │   ├── partners/
│   │   │   ├── partners.module.ts
│   │   │   ├── partners.controller.ts
│   │   │   ├── partners.service.ts
│   │   │   └── commissions.service.ts
│   │   ├── analytics/
│   │   │   ├── analytics.module.ts
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── processors/
│   │   │       └── funnel-snapshot.processor.ts
│   │   └── admin/
│   │       ├── admin.module.ts
│   │       ├── admin.controller.ts
│   │       └── audit.service.ts
│   ├── database/
│   │   ├── database.module.ts
│   │   └── prisma.service.ts
│   ├── storage/
│   │   ├── storage.module.ts
│   │   └── storage.service.ts
│   ├── queue/
│   │   ├── queue.module.ts
│   │   └── queue.service.ts
│   └── events/
│       ├── events.module.ts
│       └── domain-events.ts
├── test/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

## Key Design Patterns

### 1. Modular Monolith
Each module is self-contained with clear boundaries. Modules communicate via:
- Direct service imports (for simple dependencies)
- Domain events (for loose coupling)

### 2. Layered Architecture
```
Controllers (HTTP/API Layer)
     ↓
Services (Business Logic)
     ↓
Repositories (Data Access - Prisma)
     ↓
Database
```

### 3. Dependency Injection
NestJS DI container manages all service lifecycles.

### 4. Event-Driven
Critical state changes emit events that other modules subscribe to.

### 5. Authorization Guards
Permissions checked at controller level + service level for defense in depth.

### 6. DTO Pattern
- Input validation via class-validator
- Response transformation via interceptors
- Type safety end-to-end
