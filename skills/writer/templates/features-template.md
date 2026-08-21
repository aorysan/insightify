---
title: "Features & Business Logic"
description: "Business features with acceptance criteria and technical mapping"
audience: "developers, product-managers"
sources:
  - features.md
  - workflows.md
---

# Features & Business Logic

## Overview

Complete catalog of business features with user stories, acceptance criteria, and technical implementation mapping. Each feature is traced to its components, hooks, stores, and API endpoints.

> **Source:** features.md § Feature Catalog

---

## 1. Feature Catalog

| Feature | Description | Priority | Status | Owner | Related Components |
|---------|-------------|----------|--------|-------|-------------------|
| **Authentication** | User login, registration, password reset, session management | P0 | ✅ Done | Auth Team | `AuthForm`, `useAuth`, `authApi` |
| **User Management** | CRUD users, roles, permissions, bulk actions | P0 | ✅ Done | Admin Team | `UserList`, `UserForm`, `useUsers` |
| **Product Catalog** | Products, categories, inventory, SEO | P1 | 🚧 In Progress | Product Team | `ProductGrid`, `ProductForm`, `useProducts` |
| **Order Management** | Order processing, status tracking, fulfillment | P1 | 📋 Planned | Orders Team | `OrderList`, `OrderDetail`, `useOrders` |
| **Dashboard Analytics** | KPIs, charts, reports, exports | P2 | 📋 Planned | Analytics Team | `DashboardWidgets`, `useAnalytics` |
| **Settings** | App config, preferences, integrations | P2 | 📋 Planned | Platform Team | `SettingsPage`, `useSettings` |
| **Notifications** | In-app, email, push notifications | P3 | 📋 Planned | Platform Team | `NotificationBell`, `useNotifications` |

---

## 2. Feature Specifications

### 2.1 Authentication

#### User Stories
```gherkin
Feature: User Authentication

  Scenario: Successful login with valid credentials
    Given a registered user exists
    When they enter valid email and password
    And click "Sign In"
    Then they are redirected to the dashboard
    And their session is persisted

  Scenario: Failed login with invalid credentials
    Given a user enters incorrect password
    When they click "Sign In"
    Then an error message is displayed
    And they remain on the login page

  Scenario: Password reset flow
    Given a user forgets their password
    When they request a reset link
    And click the link in email
    Then they can set a new password
    And are redirected to login
```

#### Acceptance Criteria
| ID | Criterion | Status |
|----|-----------|--------|
| AUTH-01 | Login with email/password works | ✅ |
| AUTH-02 | JWT tokens stored securely (httpOnly cookie or localStorage) | ✅ |
| AUTH-03 | Access token auto-refresh before expiry | ✅ |
| AUTH-04 | Logout clears all auth state | ✅ |
| AUTH-05 | Protected routes redirect to login | ✅ |
| AUTH-06 | Public routes redirect authenticated users | ✅ |
| AUTH-07 | Role-based access control enforced | ✅ |
| AUTH-08 | Password reset email sent within 2 min | 🚧 |
| AUTH-09 | Rate limiting on auth endpoints (5 req/min) | 📋 |

#### Technical Mapping
| Layer | Implementation |
|-------|----------------|
| **Components** | `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm` |
| **Hooks** | `useLogin`, `useRegister`, `useForgotPassword`, `useResetPassword`, `useAuth` |
| **Store** | `useAuthStore` (user, tokens, permissions, actions) |
| **API** | `authApi.login`, `authApi.register`, `authApi.refreshToken`, `authApi.me` |
| **Routes** | `/login`, `/register`, `/forgot-password`, `/reset-password/:token` |
| **Guards** | `PublicRoute`, `PrivateRoute`, `RoleRoute` |

---

### 2.2 User Management

#### User Stories
```gherkin
Feature: User Management

  Scenario: Admin creates new user
    Given an admin is on the users page
    When they click "Add User" and fill the form
    And submit with valid data
    Then the user appears in the list
    And an invitation email is sent

  Scenario: Admin edits user role
    Given an admin views a user
    When they change the role from USER to MANAGER
    And save
    Then the user's permissions update immediately
    And the change is audited

  Scenario: Bulk activate users
    Given multiple users are selected
    When admin clicks "Activate Selected"
    Then all selected users become active
    And a success toast shows count
```

#### Acceptance Criteria
| ID | Criterion | Status |
|----|-----------|--------|
| USR-01 | List users with pagination, search, filters | ✅ |
| USR-02 | Create user with validation | ✅ |
| USR-03 | Edit user details (name, email, role, status) | ✅ |
| USR-04 | Delete user with confirmation | ✅ |
| USR-05 | Bulk actions (activate, deactivate, delete) | 🚧 |
| USR-06 | Role-based column visibility | 📋 |
| USR-07 | Export users to CSV | 📋 |
| USR-08 | Audit log for user changes | 📋 |

#### Technical Mapping
| Layer | Implementation |
|-------|----------------|
| **Components** | `UserList`, `UserCard`, `UserForm`, `UserProfile`, `UserAvatar` |
| **Hooks** | `useUsers`, `useUser`, `useUserMutations`, `useUserSelection` |
| **Store** | `useUsersStore` (cache, filters, selection, sort) |
| **API** | `usersApi.list`, `usersApi.get`, `usersApi.create`, `usersApi.update`, `usersApi.delete`, `usersApi.bulkDelete` |
| **Routes** | `/dashboard/users`, `/dashboard/users/new`, `/dashboard/users/:id/edit` |
| **Permissions** | `ADMIN`, `MANAGER` only |

---

### 2.3 Product Catalog

#### User Stories
```gherkin
Feature: Product Catalog

  Scenario: Manager creates product with variants
    Given a manager opens new product form
    When they fill required fields and add images
    And set inventory tracking
    Then product is saved as draft
    And can be published when ready

  Scenario: Customer views product with inventory
    Given a product has 5 items in stock
    When customer views product page
    Then "In Stock (5)" is shown
    And "Add to Cart" is enabled

  Scenario: Low stock alert
    Given product inventory drops below threshold
    When inventory is updated
    Then admin receives notification
    And product shows "Low Stock" badge
```

#### Acceptance Criteria
| ID | Criterion | Status |
|----|-----------|--------|
| PRD-01 | CRUD products with full validation | 🚧 |
| PRD-02 | Category management (nested) | 📋 |
| PRD-03 | Multiple images with drag-drop reorder | 📋 |
| PRD-04 | Inventory tracking with reservations | 📋 |
| PRD-05 | SEO fields (title, description, keywords) | 📋 |
| PRD-06 | Product status workflow (draft → active → archived) | 📋 |
| PRD-07 | Featured products management | 📋 |
| PRD-08 | Bulk import/export CSV | 📋 |

#### Technical Mapping
| Layer | Implementation |
|-------|----------------|
| **Components** | `ProductGrid`, `ProductCard`, `ProductForm`, `ProductDetail`, `ProductImageUpload` |
| **Hooks** | `useProducts`, `useProduct`, `useProductMutations`, `useCategories` |
| **Store** | `useProductsStore` (cache, filters, sort) |
| **API** | `productsApi.list`, `productsApi.get`, `productsApi.create`, `productsApi.update`, `productsApi.delete` |
| **Routes** | `/dashboard/products`, `/dashboard/products/new`, `/dashboard/products/:id/edit` |

---

### 2.4 Order Management

#### User Stories
```gherkin
Feature: Order Management

  Scenario: Admin processes order
    Given an order is in CONFIRMED status
    When admin clicks "Process"
    Then status changes to PROCESSING
    And inventory is reserved
    And customer notified

  Scenario: Fulfillment creates shipment
    Given order is PROCESSING
    When warehouse ships items
    And tracking number added
    Then status changes to SHIPPED
    And customer receives tracking email

  Scenario: Partial refund
    Given delivered order has issue
    When support processes partial refund
    Then order shows PARTIALLY_REFUNDED
    And amount reflected in totals
```

#### Acceptance Criteria
| ID | Criterion | Status |
|----|-----------|--------|
| ORD-01 | Order list with status filters | 📋 |
| ORD-02 | Order detail with timeline | 📋 |
| ORD-03 | Status transitions with validation | 📋 |
| ORD-04 | Inventory reservation on confirm | 📋 |
| ORD-05 | Shipment tracking integration | 📋 |
| ORD-06 | Refund processing (full/partial) | 📋 |
| ORD-07 | Order export & reporting | 📋 |

#### Technical Mapping
| Layer | Implementation |
|-------|----------------|
| **Components** | `OrderList`, `OrderCard`, `OrderDetail`, `OrderTimeline`, `OrderStatusBadge` |
| **Hooks** | `useOrders`, `useOrder`, `useOrderMutations` |
| **Store** | `useOrdersStore` |
| **API** | `ordersApi.list`, `ordersApi.get`, `ordersApi.updateStatus` |
| **Routes** | `/dashboard/orders`, `/dashboard/orders/:id` |

---

## 3. Business Rules & Invariants

| Rule | Description | Enforcement |
|------|-------------|-------------|
| **Unique Email** | No two users can have the same email | DB unique constraint + API validation |
| **Role Hierarchy** | ADMIN > MANAGER > USER > GUEST | `ROLE_HIERARCHY` constant + `RoleRoute` |
| **Inventory Consistency** | `available = quantity - reserved` | Computed field, validated on update |
| **Order Total** | `total = subtotal + tax + shipping - discount` | Computed in API, validated on create |
| **Token Expiry** | Access token 15min, Refresh token 7 days | Config in `AuthConfig`, enforced by interceptor |
| **Password Policy** | Min 8 chars, 1 uppercase, 1 number, 1 special | Zod schema + backend validation |

---

## 4. Edge Cases & Error Scenarios

| Scenario | Expected Behavior |
|----------|-------------------|
| Concurrent user edit | Last-write-wins with toast notification |
| Network failure during mutation | Optimistic rollback + error toast + retry option |
| Expired token during request | Auto-refresh → retry → logout if fails |
| Deleted entity referenced | Show "Not found" state with navigation back |
| Bulk action partial failure | Process successful items, report failures |
| Race condition on inventory | Optimistic locking with version field |

---

*All feature specifications extracted from source code and documentation. See individual source citations for exact file locations.*