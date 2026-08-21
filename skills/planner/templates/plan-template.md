---
project: "<Project Name>"
generated_at: "<ISO Timestamp>"
status: "approved"
total_pages: 14
audience: "frontend-developers"
doc_type: "frontend-technical-specification"
output_format: "artifact-html"
---

# Documentation Plan: <Project Name>

## Overview
<Generated from product.md + cross-cutting.md. Summary of the project, its purpose, tech stack (React, TypeScript, Zustand, React Router, etc.), and the goal of this technical specification.>

## Audience
- **Primary:** Frontend Developers (React/TypeScript) — implementation, maintenance, onboarding
- **Secondary:** Full-stack Developers, Tech Leads — architecture review, API integration
- **Tertiary:** QA Engineers, DevOps, Product Managers — testing, deployment, feature understanding

## Pages (Writing Order = Dependency Order)

### 1. Executive Summary
- **Purpose:** High-level project overview for stakeholders; quick orientation for new team members
- **Audience:** All
- **Sources:** product.md, features.md, cross-cutting.md
- **Sections:**
  - Project Vision & Value Proposition
  - Tech Stack Summary (badges)
  - Key Features at a Glance
  - Target Audience & Use Cases
  - Architecture Highlights
- **Dependencies:** None
- **Priority:** high

### 2. Directory Structure
- **Purpose:** Document the feature-based modular folder architecture for navigation and onboarding
- **Audience:** Developers
- **Sources:** directory-structure.md
- **Sections:**
  - Tree Diagram (collapsible)
  - Folder Purpose Descriptions
  - Module Boundary Rules
  - Import Path Conventions
- **Dependencies:** None
- **Priority:** high

### 3. Global Data Models
- **Purpose:** Define all TypeScript interfaces for entities, API responses, and shared types
- **Audience:** Developers
- **Sources:** data-models.md, api-patterns.md
- **Sections:**
  - Base Types (BaseEntity, ApiResponse, PaginatedResponse)
  - Authentication Types (User, UserRole, AuthTokens)
  - Domain Entities (per feature)
  - Form & Validation Types
  - Configuration Types
  - Type Relationship Diagram (Mermaid)
- **Dependencies:** None
- **Priority:** high

### 4. Component Architecture
- **Purpose:** Visualize and document the component tree with layouts and responsibilities
- **Audience:** Developers
- **Sources:** component-architecture.md, ui-component-library.md
- **Sections:**
  - Layout Components (PublicLayout, AuthLayout, ProtectedLayout)
  - Shell Components (Navbar, Sidebar, Footer, TopHeader, MainWrapper)
  - UI Primitives Inventory (Button, Input, Modal, Table, Card, Toast, etc.)
  - Feature Components by Domain
  - Component Composition Tree (Mermaid)
  - Props Drilling vs. Context Decisions
- **Dependencies:** Page 2 (Directory Structure)
- **Priority:** high

### 5. State Management
- **Purpose:** Document global stores, custom hooks, selectors, and data flow
- **Audience:** Developers
- **Sources:** state-management.md
- **Sections:**
  - Store Definitions (useAuthStore, useAppStore, feature stores)
  - State Shape Interfaces
  - Actions & Mutators
  - Selectors & Derived State
  - Persistence Configuration
  - Middleware Chain (logger, devtools, immer)
  - State Flow Diagram (Mermaid)
- **Dependencies:** Page 3 (Data Models — User type, AuthTokens)
- **Priority:** high

### 6. Routing & Layout Structure
- **Purpose:** Define route hierarchy, layout composition, and guard logic
- **Audience:** Developers
- **Sources:** routing-structure.md, component-architecture.md
- **Sections:**
  - Route Tree (nested paths with lazy loading)
  - Layout Mapping (which layout wraps which routes)
  - Guard Implementations (PublicRoute, PrivateRoute, RoleRoute)
  - Route Metadata (titles, breadcrumbs, permissions)
  - Navigation Flow Diagram (Mermaid)
- **Dependencies:** Page 4 (Component Architecture)
- **Priority:** high

### 7. UI Component Library
- **Purpose:** Inventory of reusable UI primitives with props, variants, and usage
- **Audience:** Developers, Designers
- **Sources:** ui-component-library.md
- **Sections:**
  - Component Categories (primitive, composite, feedback, layout)
  - Per-Component: Props Interface, Variants, States, Usage Example
  - Design Token References (colors, spacing, typography, radii)
  - Accessibility Checklist (ARIA, keyboard, focus management)
  - Component Registry Table
- **Dependencies:** Page 2 (Directory Structure)
- **Priority:** medium

### 8. API Interaction Patterns
- **Purpose:** Document API client, interceptors, custom hooks, and error handling
- **Audience:** Developers
- **Sources:** api-patterns.md, data-models.md
- **Sections:**
  - API Client Configuration (baseURL, timeout, headers)
  - Request/Response Interceptors (auth, logging, error normalization)
  - Custom Hooks (useFetchData, useMutation, useInfiniteQuery, useOptimisticUpdate)
  - Error Handling Strategy (global types, retry, toast integration)
  - Authentication Flow (token refresh, 401 redirect, interceptors)
  - Request/Response Type Mapping (linked to Data Models)
- **Dependencies:** Page 3 (Data Models — ApiResponse, PaginatedResponse)
- **Priority:** high

### 9. Features & Business Logic
- **Purpose:** Document business features with acceptance criteria and technical mapping
- **Audience:** Developers, Product Managers
- **Sources:** features.md, workflows.md
- **Sections:**
  - Feature Catalog (table with priority, status, owner)
  - Per Feature: User Stories (Gherkin), Acceptance Criteria
  - Technical Mapping: Components, Hooks, Stores, API Endpoints
  - Business Rules & Invariants
  - Edge Cases & Error Scenarios
- **Dependencies:** Pages 3, 4, 5 (Data Models, Component Architecture, State Management)
- **Priority:** medium

### 10. Cross-Cutting Concerns
- **Purpose:** Document auth, theming, i18n, error boundaries, logging, analytics, feature flags
- **Audience:** Developers, DevOps
- **Sources:** cross-cutting.md
- **Sections:**
  - Authentication Provider & Token Management
  - Theming System (CSS variables, dark/light/system, theme provider)
  - Internationalization (locale detection, translation structure, RTL)
  - Error Boundaries & Global Error Reporting
  - Logging Configuration (levels, PII redaction, transports)
  - Analytics & Event Tracking
  - Feature Flag Provider & Rollout Strategies
  - Provider Composition Tree (Mermaid)
- **Dependencies:** Pages 5, 6 (State Management, Routing)
- **Priority:** medium

### 11. Terminology & Glossary
- **Purpose:** Define domain-specific terms for shared understanding
- **Audience:** All
- **Sources:** terminology.md
- **Sections:**
  - Glossary Table (Term, Definition, Context, Source)
  - Acronyms & Abbreviations
  - Naming Conventions
- **Dependencies:** None
- **Priority:** low

### 12. Constraints & Limitations
- **Purpose:** Document technical constraints, known issues, and workarounds
- **Audience:** Developers, Architects
- **Sources:** constraints.md, unanswered.md
- **Sections:**
  - Technical Constraints (Node, React, browser versions, bundle size)
  - Dependency Constraints (peer deps, version conflicts)
  - Performance Budgets (Core Web Vitals, bundle budgets)
  - Security Requirements (CSP, CORS, data handling)
  - Operational Constraints (deployment, env, monitoring)
  - Known Issues & Workarounds
- **Dependencies:** None
- **Priority:** low

### 13. Workflows & Procedures
- **Purpose:** Step-by-step operational procedures for development and operations
- **Audience:** Developers, QA, Support
- **Sources:** workflows.md
- **Sections:**
  - Development Workflows (setup, test, build, deploy)
  - Feature Development Procedure
  - Bug Triage & Fix Workflow
  - Release Procedure
  - Rollback & Hotfix Procedures
  - Decision Trees for Common Scenarios
- **Dependencies:** Pages 4, 5, 8 (Component Architecture, State Management, API Patterns)
- **Priority:** low

### 14. Appendix
- **Purpose:** References, changelog, contributor guide, and external links
- **Audience:** All
- **Sources:** appendix.md (generated from all categories)
- **Sections:**
  - External References & Links
  - Changelog (generated from git/conventional commits)
  - Contributor Guide
  - License & Attribution
  - Generation Metadata (Insightify version, timestamp, sources)
- **Dependencies:** All previous pages
- **Priority:** low

## Page Dependency Graph

```
WAVE 1 (Parallel - No Dependencies):
  ├─ 1. Executive Summary
  ├─ 2. Directory Structure
  ├─ 3. Global Data Models
  ├─ 11. Terminology & Glossary
  └─ 12. Constraints & Limitations

WAVE 2 (Depends on Wave 1):
  ├─ 4. Component Architecture     ← needs: 2
  ├─ 5. State Management           ← needs: 3
  └─ 7. UI Component Library       ← needs: 2

WAVE 3 (Depends on Wave 2):
  ├─ 6. Routing & Layout Structure ← needs: 4
  └─ 8. API Interaction Patterns   ← needs: 3

WAVE 4 (Depends on Waves 2-3):
  ├─ 9. Features & Business Logic  ← needs: 3, 4, 5
  ├─ 10. Cross-Cutting Concerns    ← needs: 5, 6
  └─ 13. Workflows & Procedures    ← needs: 4, 5, 8

WAVE 5 (Depends on All):
  └─ 14. Appendix                  ← needs: all
```

## Writing Order (Sequential for Human Review)

1. Executive Summary
2. Directory Structure
3. Global Data Models
11. Terminology & Glossary
12. Constraints & Limitations
4. Component Architecture
5. State Management
7. UI Component Library
6. Routing & Layout Structure
8. API Interaction Patterns
9. Features & Business Logic
10. Cross-Cutting Concerns
13. Workflows & Procedures
14. Appendix

## Approval Checklist

- [ ] All 14 pages planned with clear purpose and sources
- [ ] Dependency graph is acyclic and max 5 waves
- [ ] Priority distribution: 7 high, 3 medium, 4 low
- [ ] Each page has 3-8 sections
- [ ] Sources mapped to existing knowledge categories
- [ ] Estimated total words: ~20,000-30,000
- [ ] Target audience clearly defined per page

---
*Generated by Insightify Planner — Review and approve before Writer stage.*