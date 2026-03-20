# Studented.me REST API Specification

Base URL: `https://api.studented.me/v1`

## Authentication

All authenticated endpoints require `Authorization: Bearer {access_token}` header.

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new student account | No |
| POST | `/auth/login` | Login with email/password | No |
| POST | `/auth/refresh` | Refresh access token | No (refresh token in cookie) |
| POST | `/auth/logout` | Logout and revoke tokens | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password with token | No |
| POST | `/auth/verify-email` | Verify email with token | No |
| GET | `/auth/me` | Get current user profile | Yes |

## Users

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/users/me` | Get own profile | All authenticated |
| PUT | `/users/me` | Update own profile | All authenticated |
| DELETE | `/users/me` | Delete own account (GDPR) | All authenticated |
| GET | `/users/me/export` | Export all personal data | All authenticated |
| GET | `/users/:id` | Get user by ID | Staff only |
| GET | `/users` | List users | Superadmin only |

## Students

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/students/me/profile` | Get own student profile | Student |
| PUT | `/students/me/profile` | Update profile | Student |
| POST | `/students/me/education` | Add education history | Student |
| PUT | `/students/me/education/:id` | Update education entry | Student |
| DELETE | `/students/me/education/:id` | Delete education entry | Student |
| POST | `/students/me/language-scores` | Add language test score | Student |
| GET | `/students/:id` | Get student by ID | Staff (if assigned) |
| GET | `/students` | List students | Staff |

## Leads (CRM)

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| POST | `/leads` | Create new lead | Public or Staff |
| GET | `/leads` | List leads | Counselor, Superadmin |
| GET | `/leads/:id` | Get lead details | Counselor (if assigned) |
| PUT | `/leads/:id` | Update lead | Counselor (if assigned) |
| PATCH | `/leads/:id/status` | Change lead status | Counselor (if assigned) |
| POST | `/leads/:id/activities` | Log activity | Counselor (if assigned) |
| POST | `/leads/:id/convert` | Convert lead to student | Counselor (if assigned) |
| DELETE | `/leads/:id` | Delete lead | Superadmin |

## Opportunities

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/opportunities` | Search opportunities | All authenticated |
| GET | `/opportunities/:id` | Get opportunity details | All authenticated |
| POST | `/opportunities` | Create opportunity | Partner Manager |
| PUT | `/opportunities/:id` | Update opportunity | Partner Manager |
| DELETE | `/opportunities/:id` | Delete opportunity | Superadmin |
| GET | `/opportunities/:id/requirements` | Get requirements | All authenticated |
| GET | `/opportunities/:id/deadlines` | Get deadlines | All authenticated |

## Applications

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/applications` | List applications | Student (own), Staff (assigned) |
| POST | `/applications` | Create application | Student |
| GET | `/applications/:id` | Get application | Student (own), Staff (assigned) |
| PUT | `/applications/:id` | Update application | Student (own), Staff (assigned) |
| PATCH | `/applications/:id/status` | Change status | Staff (assigned) |
| POST | `/applications/:id/submit` | Submit application | Staff (assigned) |
| GET | `/applications/:id/checklist` | Get checklist | Student (own), Staff (assigned) |
| PATCH | `/applications/:id/checklist` | Update checklist | Staff (assigned) |
| POST | `/applications/:id/notes` | Add note | Staff (assigned) |
| GET | `/applications/:id/notes` | Get notes | Staff (assigned) |
| GET | `/applications/:id/history` | Get status history | Student (own), Staff (assigned) |
| DELETE | `/applications/:id` | Delete application | Superadmin |

## Documents

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/documents` | List documents | Student (own), Staff (assigned) |
| POST | `/documents/upload-url` | Get signed upload URL | Student |
| POST | `/documents/:id/confirm` | Confirm upload complete | Student |
| GET | `/documents/:id` | Get document metadata | Student (own), Staff (assigned) |
| GET | `/documents/:id/download` | Get signed download URL | Student (own), Staff (assigned) |
| POST | `/documents/:id/new-version` | Upload new version | Student (own) |
| POST | `/documents/:id/review` | Submit review | Document Specialist |
| PUT | `/documents/:id` | Update metadata | Student (own), Staff (assigned) |
| DELETE | `/documents/:id` | Delete document | Student (own), Superadmin |

## Visa Cases

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/visa-cases` | List visa cases | Student (own), Visa Specialist |
| POST | `/visa-cases` | Create visa case | Visa Specialist |
| GET | `/visa-cases/:id` | Get visa case | Student (own), Visa Specialist |
| PUT | `/visa-cases/:id` | Update visa case | Visa Specialist |
| PATCH | `/visa-cases/:id/status` | Change status | Visa Specialist |
| POST | `/visa-cases/:id/appointments` | Add appointment | Visa Specialist |
| GET | `/visa-cases/:id/documents` | Get linked documents | Student (own), Visa Specialist |
| POST | `/visa-cases/:id/documents` | Link document | Visa Specialist |

## Tasks

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/tasks` | List tasks | Student (assigned), Staff (assigned) |
| POST | `/tasks` | Create task | Staff |
| GET | `/tasks/:id` | Get task | Student/Staff (assigned) |
| PUT | `/tasks/:id` | Update task | Staff (assigned) |
| PATCH | `/tasks/:id/status` | Change status | Student/Staff (assigned) |
| DELETE | `/tasks/:id` | Delete task | Staff (created by) |

## Invoices & Payments

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/invoices` | List invoices | Student (own), Finance Admin |
| POST | `/invoices` | Create invoice | Finance Admin |
| GET | `/invoices/:id` | Get invoice | Student (own), Finance Admin |
| PUT | `/invoices/:id` | Update invoice | Finance Admin |
| POST | `/invoices/:id/send` | Send invoice to student | Finance Admin |
| POST | `/invoices/:id/payment-intent` | Create payment intent | Student (own) |
| GET | `/invoices/:id/receipt` | Download receipt PDF | Student (own), Finance Admin |
| POST | `/payments/webhook` | Stripe webhook | Public (verified) |
| GET | `/payments` | List payments | Finance Admin |
| POST | `/refunds` | Create refund | Finance Admin |

## Partners & Commissions

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/institutions` | List institutions | All authenticated |
| POST | `/institutions` | Create institution | Partner Manager |
| GET | `/institutions/:id` | Get institution | All authenticated |
| PUT | `/institutions/:id` | Update institution | Partner Manager |
| GET | `/partners` | List partners | Partner Manager |
| POST | `/partners` | Create partner | Partner Manager |
| GET | `/commissions` | List commissions | Finance Admin, Partner Manager |
| PATCH | `/commissions/:id/approve` | Approve commission | Finance Admin |
| PATCH | `/commissions/:id/pay` | Mark as paid | Finance Admin |

## Notifications

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/notifications` | List in-app notifications | Own only |
| GET | `/notifications/unread-count` | Get unread count | Own only |
| PATCH | `/notifications/:id/read` | Mark as read | Own only |
| PATCH | `/notifications/read-all` | Mark all as read | Own only |
| GET | `/notification-preferences` | Get preferences | Own only |
| PUT | `/notification-preferences` | Update preferences | Own only |

## Messages

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/messages` | List messages | Own only |
| POST | `/messages` | Send message | All authenticated |
| GET | `/messages/:id` | Get message | Sender or recipient |
| PATCH | `/messages/:id/read` | Mark as read | Recipient only |

## Analytics (Staff Only)

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/analytics/funnel` | Get conversion funnel | Staff |
| GET | `/analytics/counselor-performance` | Counselor metrics | Manager, Superadmin |
| GET | `/analytics/popular-opportunities` | Top opportunities | Staff |
| GET | `/analytics/revenue` | Revenue by channel | Finance Admin |
| GET | `/analytics/dashboard` | Operational dashboard | Staff |

## Admin

| Method | Endpoint | Description | Permissions |
|--------|----------|-------------|-------------|
| GET | `/admin/audit-logs` | Search audit logs | Superadmin |
| GET | `/admin/system-health` | System health check | Superadmin |
| POST | `/admin/users/:id/impersonate` | Impersonate user | Superadmin |
| POST | `/admin/data-cleanup` | Run data retention job | Superadmin |

## Query Parameters

### Pagination

```
?page=1&perPage=20
```

### Filtering

```
?status=SUBMITTED&country=USA
?search=harvard
?createdAfter=2026-01-01&createdBefore=2026-12-31
```

### Sorting

```
?sortBy=createdAt&sortOrder=desc
```

### Including Relations

```
?include=opportunity,documents,student
```

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors, malformed JSON |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (e.g., email already exists) |
| 422 | Unprocessable Entity | Semantic errors (e.g., can't submit incomplete application) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | System maintenance |

## Rate Limits

| User Type | Limit | Window |
|-----------|-------|--------|
| Anonymous | 100 requests | 1 hour |
| Authenticated | 1000 requests | 1 hour |
| Staff | 5000 requests | 1 hour |

## Idempotency

POST requests support idempotency via `Idempotency-Key` header:

```
POST /api/v1/applications
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

Server caches response for 24 hours. Duplicate requests with same key return cached response.

## Webhooks (Outbound)

Studented.me can send webhooks to partner systems for key events:

```json
{
  "event": "application.submitted",
  "timestamp": "2026-03-08T10:00:00Z",
  "data": {
    "applicationId": "app_123",
    "studentId": "student_456",
    "opportunityId": "opp_789"
  }
}
```

Webhook signature verification via HMAC-SHA256.
