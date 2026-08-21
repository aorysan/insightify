---
title: "Terminology & Glossary"
description: "Domain-specific terms, definitions, and naming conventions"
audience: "all"
sources:
  - terminology.md
---


## Overview

Shared vocabulary for the project. Consistent terminology reduces ambiguity and improves communication across development, product, design, and QA teams.

> **Source:** terminology.md § Glossary Purpose

---

## 1. Glossary

| Term | Definition | Context | Source |
|------|------------|---------|--------|
| **Entity** | Core business object with identity and lifecycle | Domain layer | source-003.md § types/common.ts |
| **Aggregate** | Cluster of entities treated as a unit for consistency | DDD | source-003.md § types/common.ts |
| **Value Object** | Immutable object defined by its attributes | DDD | source-003.md § types/common.ts |
| **Repository** | Abstraction for data persistence | Data layer | source-015.md § features/users/api/usersApi.ts |
| **Use Case** | Application-specific business rule | Application layer | workflows.md |
| **DTO** | Data Transfer Object for API boundaries | API layer | data-models.md |
| **Idempotency** | Operation produces same result regardless of repetitions | API design | api-patterns.md |
| **Optimistic Locking** | Concurrency control using version fields | Data integrity | features.md |
| **Soft Delete** | Mark record as deleted without removing from DB | Data management | features.md |
| **Event Sourcing** | Store state changes as event sequence | Architecture | unanswered.md |

---

## 2. Acronyms & Abbreviations

| Acronym | Full Form | Context |
|---------|-----------|---------|
| **API** | Application Programming Interface | General |
| **CRUD** | Create, Read, Update, Delete | Data operations |
| **DDD** | Domain-Driven Design | Architecture |
| **DTO** | Data Transfer Object | API |
| **JWT** | JSON Web Token | Authentication |
| **RBAC** | Role-Based Access Control | Authorization |
| **SSR** | Server-Side Rendering | Rendering |
| **CSR** | Client-Side Rendering | Rendering |
| **SPA** | Single Page Application | Architecture |
| **PWA** | Progressive Web App | Platform |
| **SEO** | Search Engine Optimization | Marketing |
| **UI** | User Interface | Design |
| **UX** | User Experience | Design |
| **CI/CD** | Continuous Integration / Continuous Deployment | DevOps |
| **SLA** | Service Level Agreement | Operations |
| **SLO** | Service Level Objective | Operations |
| **RTO** | Recovery Time Objective | Disaster Recovery |
| **RPO** | Recovery Point Objective | Disaster Recovery |

---

## 3. Naming Conventions

### Files & Directories
| Type | Convention | Example |
|------|------------|---------|
| Directories | kebab-case | `user-management`, `product-catalog` |
| React Components | PascalCase | `UserList.tsx`, `Button.tsx` |
| Hooks | camelCase + `use` prefix | `useUsers.ts`, `useAuth.ts` |
| Utilities | camelCase | `formatters.ts`, `validators.ts` |
| Types/Interfaces | PascalCase | `User.ts`, `ApiResponse.ts` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_FILE_SIZE` |
| Test Files | `.test.ts` / `.spec.ts` | `Button.test.tsx` |
| Storybook | `.stories.tsx` | `Button.stories.tsx` |

### Code
| Element | Convention | Example |
|---------|------------|---------|
| Variables | camelCase | `userName`, `isLoading` |
| Functions | camelCase | `getUserById()`, `formatDate()` |
| Booleans | `is`/`has`/`can`/`should` prefix | `isActive`, `hasPermission` |
| Interfaces | PascalCase | `User`, `ApiResponse` |
| Types | PascalCase | `UserRole`, `OrderStatus` |
| Enums | PascalCase (singular) | `UserRole`, `ProductStatus` |
| Enum Values | UPPER_SNAKE_CASE | `ADMIN`, `PENDING` |
| Generics | Single uppercase letter | `<T>`, `<TData, TVariables>` |

### Git
| Element | Convention | Example |
|---------|------------|---------|
| Branches | `type/scope-description` | `feat/user-management`, `fix/login-error` |
| Commits | Conventional Commits | `feat(auth): add password reset flow` |
| Tags | `v<major>.<minor>.<patch>` | `v1.2.0`, `v2.0.0-beta.1` |

---

## 4. Domain-Specific Terms

### Authentication & Authorization
| Term | Definition |
|------|------------|
| **Access Token** | Short-lived JWT for API authentication (15 min) |
| **Refresh Token** | Long-lived token for obtaining new access tokens (7 days) |
| **Claims** | Key-value pairs in JWT payload (user ID, roles, permissions) |
| **Scope** | Permission granularity (e.g., `users:read`, `orders:write`) |
| **Session** | Period of authenticated user activity |
| **MFA** | Multi-Factor Authentication |

### Users & Roles
| Term | Definition |
|------|------------|
| **Admin** | Full system access, user management, system config |
| **Manager** | Department-level access, team management, reports |
| **User** | Standard access, own data, assigned tasks |
| **Guest** | Unauthenticated, limited public access |
| **Permission** | Atomic action allowed (e.g., `user.create`) |
| **Role** | Collection of permissions assigned to users |

### Products & Catalog
| Term | Definition |
|------|------------|
| **SKU** | Stock Keeping Unit - unique product identifier |
| **Variant** | Product variation (size, color, material) |
| **Bundle** | Group of products sold together |
| **Category** | Hierarchical product classification |
| **Attribute** | Product property (e.g., weight, dimensions) |
| **Inventory** | Available stock quantity |

### Orders & Transactions
| Term | Definition |
|------|------------|
| **Cart** | Temporary collection of items before checkout |
| **Checkout** | Process of converting cart to order |
| **Payment Intent** | Stripe/Payment provider object for processing |
| **Fulfillment** | Process of preparing and shipping order |
| **Shipment** | Physical package with tracking |
| **Return** | Customer-initiated product return |
| **Refund** | Monetary reimbursement |

---

## 5. Technical Terms

### React & Frontend
| Term | Definition |
|------|------------|
| **Hydration** | Attaching event listeners to server-rendered HTML |
| **Memoization** | Caching computed values to avoid recalculation |
| **Virtual DOM** | In-memory representation of UI for diffing |
| **Reconciliation** | Algorithm for diffing virtual DOM trees |
| **Suspense** | React feature for async component boundaries |
| **Server Component** | Component rendered only on server |

### State Management
| Term | Definition |
|------|------------|
| **Store** | Global state container (Zustand) |
| **Selector** | Function extracting derived state |
| **Action** | Function that mutates state |
| **Middleware** | Intercepts actions for side effects |
| **Persistence** | Syncing state to storage |

### API & Networking
| Term | Definition |
|------|------------|
| **Endpoint** | Specific API URL path |
| **Payload** | Request/response body data |
| **Query Params** | URL parameters for filtering/pagination |
| **Rate Limiting** | Restricting request frequency |
| **CORS** | Cross-Origin Resource Sharing |
| **Webhook** | HTTP callback for async events |

---

## 6. UI/UX Terms

| Term | Definition |
|------|------------|
| **Affordance** | Visual clue for how to interact |
| **Breakpoint** | Screen width where layout changes |
| **Design Token** | Atomic design value (color, spacing, font) |
| **Focus Trap** | Keeping keyboard focus in modal |
| **Micro-interaction** | Small animation for feedback |
| **Progressive Disclosure** | Revealing complexity gradually |
| **Skeleton Screen** | Placeholder during loading |
| **Toast** | Transient notification |

---

## 7. DevOps & Operations

| Term | Definition |
|------|------------|
| **Artifact** | Build output (Docker image, zip, etc.) |
| **Blue/Green Deploy** | Zero-downtime deployment strategy |
| **Canary Release** | Gradual rollout to subset of users |
| **Feature Flag** | Runtime toggle for feature visibility |
| **Health Check** | Endpoint for monitoring service status |
| **Observability** | Logs, metrics, traces for debugging |
| **Rollback** | Reverting to previous deployment |

---

*All terminology extracted from source code, documentation, and team conventions. See individual source citations for exact file locations.*