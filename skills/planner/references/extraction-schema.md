# Knowledge Extraction Schema Reference — Frontend Technical Specification

Extracted knowledge MUST be categorized into **14 files** under `[OUT_DIR]/.insightify/knowledge/`:

## Core Categories (Always Generated)

1. `product.md`: Product name, description, target audience, value proposition, tech stack.
2. `directory-structure.md`: Feature-based modular folder tree with purpose descriptions.
3. `data-models.md`: TypeScript interfaces — BaseEntity, ApiResponse, PaginatedResponse, User, domain entities.
4. `component-architecture.md`: Component tree — PublicLayout, AuthLayout, ProtectedLayout, UI primitives, feature components.
5. `state-management.md`: Global stores (auth, app, feature), custom hooks, selectors, persistence.
6. `routing-structure.md`: Route configuration, layouts, guards (PublicRoute, PrivateRoute), route hierarchy.
7. `ui-component-library.md`: Reusable UI primitives inventory — Button, Input, Modal, Table, Card, Toast, Form, etc.
8. `api-patterns.md`: API client (axios/fetch), interceptors, custom hooks (useFetchData, useMutation), error handling.
9. `features.md`: Business features with descriptions, acceptance criteria, related components.
10. `terminology.md`: Domain-specific glossary terms and definitions with sources.
11. `workflows.md`: Step-by-step user procedures, operational workflows, decision trees.
12. `constraints.md`: Technical limitations, dependencies, version requirements, known issues.
13. `unanswered.md`: Gaps, contradictions, ambiguities, missing information.
14. `cross-cutting.md`: Auth providers, theming, i18n, error boundaries, logging, analytics, feature flags.

---

## YAML Frontmatter (Required for Every Category)

```yaml
---
category: "<category_name>"
extracted_from:
  - source-001.md
  - source-005.md
confidence: "high" | "medium" | "low"
extracted_at: "YYYY-MM-DDTHH:mm:ssZ"
tags:
  - "typescript"
  - "react"
  - "architecture"
---
```

### Field Definitions

| Field | Required | Description |
|-------|----------|-------------|
| `category` | ✅ | Exact filename without `.md` (e.g., `data-models`) |
| `extracted_from` | ✅ | Array of source IDs that contributed to this category |
| `confidence` | ✅ | `high` = explicit in source, `medium` = inferred, `low` = ambiguous |
| `extracted_at` | ✅ | ISO 8601 timestamp |
| `tags` | ❌ | Optional: technology/domain tags for filtering |

---

## Source Citations & Fact Traceability

Every extracted fact, interface, component, store, route, workflow, or constraint MUST include a blockquote citation referencing the origin source file and section:

```markdown
> **Source:** source-001.md § Section Name
```

---

## Category-Specific Extraction Guidelines

### 1. `product.md`
**Source signals:** `package.json`, `README.md`, `docs/`, `CHANGELOG.md`
**Extract:** name, version, description, repository, license, author, keywords, target audience, value proposition, tech stack (React, TypeScript, Zustand, React Router, etc.)

### 2. `directory-structure.md`
**Source signals:** File system walk of `src/`, import statements, folder naming conventions
**Extract:** Complete tree with folder purposes:
```
src/
├── assets/           # Static assets (images, fonts, icons)
├── components/       # Shared/global components
│   ├── ui/           # Primitive UI components
│   ├── layout/       # Layout shells (Navbar, Sidebar, Footer)
│   └── feedback/     # Toast, Alert, Skeleton, Spinner
├── features/         # Domain-driven feature modules
│   └── [featureName]/
│       ├── components/
│       ├── api/
│       └── hooks/
├── hooks/            # Global custom hooks
├── pages/            # Route-level components
│   ├── public/
│   ├── auth/
│   └── dashboard/
├── routes/           # Routing configuration & guards
├── services/         # API client, interceptors
├── stores/           # Global state (Zustand/Redux)
├── types/            # Global TypeScript interfaces
└── utils/            # Pure utility functions
```

### 3. `data-models.md`
**Source signals:** `types/`, `interfaces/`, `*.ts`, `*.tsx`, API response samples
**Extract:** 
- **Base types:** `BaseEntity`, `ApiResponse<T>`, `PaginatedResponse<T>`
- **Auth types:** `User`, `UserRole`, `AuthTokens`, `LoginCredentials`
- **Domain entities:** Feature-specific interfaces
- **Form types:** Validation schemas, input types
- **Config types:** Environment, feature flags, theme

**Format each interface:**
```typescript
// Source: source-003.md § types/user.ts
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
}
```

### 4. `component-architecture.md`
**Source signals:** `components/`, `layouts/`, `pages/`, JSX imports, component exports
**Extract:**
- **Layout components:** `PublicLayout`, `AuthLayout`, `ProtectedLayout`
- **Shell components:** `Navbar`, `Sidebar`, `Footer`, `TopHeader`, `MainWrapper`
- **UI primitives:** `Button`, `Input`, `Modal`, `Table`, `Card`, `Toast`, `Dropdown`, `Tabs`
- **Feature components:** Grouped by domain (e.g., `UserList`, `ProductCard`, `OrderForm`)
- **Component relationships:** Parent-child, composition, context providers

**Format:** JSX tree + Mermaid diagram + responsibility descriptions

### 5. `state-management.md`
**Source signals:** `stores/`, `hooks/use*.ts`, Zustand/Redux imports, `create<State>()`
**Extract:**
- **Store definitions:** `useAuthStore`, `useAppStore`, `useFeatureStore`
- **State shape:** Interface for each store's state
- **Actions:** Mutators with signatures
- **Selectors:** Derived state hooks
- **Persistence:** `persist` middleware config
- **Middleware:** Logger, devtools, immer

### 6. `routing-structure.md`
**Source signals:** `routes/`, `App.tsx`, router config, `React Router` / `TanStack Router` imports
**Extract:**
- **Route tree:** Nested routes with paths
- **Layout mapping:** Which layout wraps which routes
- **Guards:** `PublicRoute`, `PrivateRoute`, `RoleRoute` logic
- **Lazy loading:** `React.lazy` / `Suspense` boundaries
- **Route metadata:** Titles, breadcrumbs, required permissions

### 7. `ui-component-library.md`
**Source signals:** `components/ui/`, Storybook stories, component props interfaces
**Extract:** For each component:
- Name, category (primitive/composite/feedback/layout)
- Props interface (TypeScript)
- Variants/sizes/states
- Usage example (JSX)
- Accessibility notes (ARIA, keyboard)
- Design token references (colors, spacing, typography)

### 8. `api-patterns.md`
**Source signals:** `services/`, `hooks/useFetch*.ts`, `hooks/useMutation*.ts`, axios/fetch config
**Extract:**
- **API client:** Base URL, timeout, headers, interceptors (request/response/error)
- **Custom hooks:** `useFetchData<T>`, `useInfiniteQuery`, `useMutation`, `useOptimisticUpdate`
- **Error handling:** Global error types, retry logic, toast integration
- **Authentication:** Token refresh, interceptors, redirect on 401
- **Request/Response types:** Linked to `data-models.md`

### 9. `features.md`
**Source signals:** `features/[name]/`, domain logic, business rules, acceptance criteria
**Extract:** Per feature:
- Name, description, priority
- User stories / acceptance criteria (Gherkin format)
- Related components, hooks, stores, API endpoints
- Business rules & invariants
- Edge cases & error scenarios

### 10. `terminology.md`
**Source signals:** Code comments, JSDoc, README, docs, type names, variable names
**Extract:** Glossary entries:
| Term | Definition | Context | Source |
|------|------------|---------|--------|
| Entity | Core business object with identity | Domain layer | source-003.md § User |

### 11. `workflows.md`
**Source signals:** README, docs, code comments, test files, user guides
**Extract:** Step-by-step procedures:
1. **Trigger** — What initiates the workflow
2. **Preconditions** — Required state/data
3. **Steps** — Numbered actions with expected outcomes
4. **Decision points** — Branching logic
5. **Success criteria** — Done definition
6. **Rollback/error handling** — Failure recovery

### 12. `constraints.md`
**Source signals:** `package.json`, config files, docs, code comments, CI/CD
**Extract:**
- **Technical:** Node version, React version, browser support, bundle size limits
- **Dependencies:** Peer deps, version constraints, known conflicts
- **Performance:** Budget limits, lazy loading requirements
- **Security:** CSP, CORS, auth requirements, data handling
- **Operational:** Deployment targets, env requirements, monitoring

### 13. `unanswered.md`
**Source signals:** Conflicts between sources, missing documentation, TODOs, FIXMEs
**Extract:** Structured gaps:
- **Question:** What is unknown
- **Context:** Where it appears
- **Impact:** What decisions are blocked
- **Suggested source:** Where to find answer

### 14. `cross-cutting.md`
**Source signals:** `App.tsx`, providers, middleware, context, global config
**Extract:**
- **Auth:** Provider, token storage, refresh flow, role hierarchy
- **Theming:** Theme provider, CSS variables, dark/light/system modes
- **I18n:** Locale detection, translation structure, RTL support
- **Error handling:** Error boundaries, global error reporter, Sentry/LogRocket
- **Logging:** Logger config, log levels, PII redaction
- **Analytics:** Event tracking, consent management
- **Feature flags:** Flag provider, rollout strategies

---

## Conflict Handling

| Scenario | Resolution |
|----------|------------|
| Same fact, different sources | Keep both, cite both sources |
| Contradictory facts | Keep both, flag in `unanswered.md` with both citations |
| Fact doesn't fit any category | Add to `unanswered.md` with suggested category |
| Thin sources (few files) | Produce minimum viable: `product.md`, `directory-structure.md`, `unanswered.md` |

---

## Confidence Scoring

| Level | Criteria |
|-------|----------|
| `high` | Explicit declaration in source (interface, JSDoc, config) |
| `medium` | Inferred from usage patterns, naming conventions, imports |
| `low` | Ambiguous, single weak signal, requires assumption |

---

## Minimum Viable Output

Even with minimal sources, these 3 categories MUST be produced:
1. `product.md` — At least name + description
2. `directory-structure.md` — At least `src/` tree from file scan
3. `unanswered.md` — List what couldn't be determined

All other categories: produce empty file with `confidence: "none"` and note in `unanswered.md`.