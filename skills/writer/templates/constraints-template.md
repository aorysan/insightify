---
title: "Constraints & Limitations"
description: "Technical constraints, known issues, and workarounds"
audience: "developers, architects"
sources:
  - constraints.md
  - unanswered.md
---


## Overview

Documented technical constraints, known limitations, and workarounds. Understanding these boundaries helps teams make informed decisions and avoid unexpected issues.

> **Source:** constraints.md § Constraints Overview

---

## 1. Technical Constraints

### Runtime Requirements
| Constraint | Requirement | Impact | Workaround |
|------------|-------------|--------|------------|
| **Node.js Version** | >= 18.17.0 | Required for Vite 5, modern ES features | Use `.nvmrc` / `.node-version` |
| **React Version** | 18.2+ | Required for concurrent features, hooks | — |
| **TypeScript Version** | 5.0+ | Required for modern type features | — |
| **Browser Support** | Last 2 versions (Chrome, Firefox, Safari, Edge) | No IE11 support | Polyfills if needed |

### Build & Bundle Constraints
| Constraint | Limit | Current | Monitoring |
|------------|-------|---------|------------|
| **Initial JS Bundle** | < 200 KB gzipped | ~145 KB | `vite-bundle-analyzer` |
| **Total JS (uncompressed)** | < 1 MB | ~680 KB | CI check |
| **CSS Bundle** | < 50 KB gzipped | ~28 KB | CI check |
| **Build Time** | < 3 min | ~1 min 30s | — |
| **Dev Server Startup** | < 5s | ~2s | — |

### Dependency Constraints
| Package | Constraint | Reason |
|---------|------------|--------|
| `react` | ^18.2.0 | Peer dependency alignment |
| `react-dom` | ^18.2.0 | Peer dependency alignment |
| `zustand` | ^4.4.0 | Breaking changes in v5 |
| `@tanstack/react-query` | ^5.0.0 | Major version, new API |
| `react-router-dom` | ^6.20.0 | Stable, no v7 yet |
| `axios` | ^1.6.0 | Security updates |
| `zod` | ^3.22.0 | Validation schemas |

---

## 2. Performance Budgets

### Core Web Vitals Targets
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 1.8s | ✅ |
| **FID** (First Input Delay) | < 100ms | 45ms | ✅ |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.05 | ✅ |
| **FCP** (First Contentful Paint) | < 1.8s | 1.2s | ✅ |
| **TTFB** (Time to First Byte) | < 600ms | 350ms | ✅ |

### Bundle Budgets (per route)
| Route | JS Budget | CSS Budget | Current JS | Current CSS |
|-------|-----------|------------|------------|-------------|
| `/` (Landing) | 80 KB | 15 KB | 65 KB | 12 KB |
| `/dashboard` | 150 KB | 25 KB | 135 KB | 22 KB |
| `/dashboard/users` | 120 KB | 20 KB | 105 KB | 18 KB |
| `/dashboard/products` | 130 KB | 20 KB | 115 KB | 19 KB |

---

## 3. Dependency Constraints

### Peer Dependencies (Must Match Exactly)
```json
{
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

### Known Version Conflicts
| Conflict | Packages | Resolution |
|----------|----------|------------|
| **React 19** | Multiple UI libs not compatible | Stay on React 18 until ecosystem catches up |
| **Zod 4** | Breaking API changes | Pin to ^3.22 until migration |
| **Tailwind 4** | Major rewrite, not stable | Stay on v3.4 |

---

## 4. Security Requirements

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| **CSP** | `default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;` | ✅ |
| **CORS** | Configured on backend, allow specific origins | ✅ |
| **XSS Protection** | React auto-escaping, DOMPurify for rich text | ✅ |
| **CSRF** | SameSite cookies + custom header | ✅ |
| **Token Storage** | httpOnly cookies (preferred) or localStorage | ✅ |
| **Rate Limiting** | Backend: 100 req/min per IP | ✅ |
| **Input Validation** | Zod schemas on all forms + API | ✅ |
| **Dependency Scanning** | `npm audit` in CI, Dependabot alerts | ✅ |

### Data Handling Constraints
| Data Type | Constraint |
|-----------|------------|
| **PII** | Never log, encrypt at rest, minimal collection |
| **Passwords** | bcrypt (12 rounds), never stored in frontend |
| **Tokens** | Short-lived (15min), httpOnly cookies preferred |
| **File Uploads** | Max 10MB, type validation, virus scan |

---

## 5. Operational Constraints

### Deployment
| Constraint | Detail |
|------------|--------|
| **Platform** | Vercel / Netlify / Docker + Kubernetes |
| **Environment Variables** | Prefixed with `VITE_` for client exposure |
| **Build Command** | `npm run build` (outputs to `dist/`) |
| **Preview Deployments** | Automatic on PR |
| **Rollback** | Instant via platform CLI |

### Monitoring
| Requirement | Tool |
|-------------|------|
| **Error Tracking** | Sentry (DSN in env) |
| **Performance** | Vercel Analytics / Web Vitals |
| **Uptime** | Pingdom / UptimeRobot |
| **Logs** | Platform logs + custom logger |

---

## 6. Known Issues & Workarounds

| Issue | Description | Workaround | Status |
|-------|-------------|------------|--------|
| **Hydration Mismatch** | Theme flash on initial load | Use `suppressHydrationWarning` on `<html>` | 📋 |
| **Zustand Persistence Race** | Store rehydrates after component reads | Use `useStore.getState()` in effects | ✅ |
| **React Query Cache Staleness** | Data stale after mutation | Invalidate queries explicitly | ✅ |
| **Modal Focus Trap** | Focus not trapped in nested modals | Use `@radix-ui/react-focus-scope` | 🚧 |
| **Virtualized List Jump** | Scroll position lost on re-render | Use `overscan` + `getItemLayout` | 📋 |
| **TypeScript Slow** | Large project slows IDE | Use project references, skipLibCheck | ✅ |
| **Vite HMR Full Reload** | On context/provider changes | Accept limitation, optimize providers | 📋 |

---

## 7. Browser-Specific Limitations

| Browser | Limitation | Workaround |
|---------|------------|------------|
| **Safari < 16** | No `:has()` selector | Polyfill or avoid |
| **Firefox** | `Intl.Segmenter` not supported | Polyfill for word counting |
| **Mobile Safari** | 100vh includes address bar | Use `dvh` units |
| **All** | `localStorage` quota ~5MB | Monitor usage, clear old data |

---

## 8. Scalability Limits

| Dimension | Current Limit | Projected Limit | Action Needed |
|-----------|---------------|-----------------|---------------|
| **Concurrent Users** | 1,000 | 10,000 | Backend scaling, CDN |
| **Data Rows (per table)** | 10,000 | 1,000,000 | Virtualization, server-side pagination |
| **File Uploads/day** | 100 | 10,000 | S3 direct upload, processing queue |
| **Real-time Connections** | 500 | 5,000 | WebSocket server, connection pooling |

---

## 9. Migration Constraints

### From v3 to v4
| Area | Constraint | Migration Path |
|------|------------|----------------|
| **State Management** | Redux → Zustand | Incremental, feature by feature |
| **Routing** | React Router v5 → v6 | Codemod + manual fixes |
| **Styling** | CSS Modules → Tailwind | Per-component migration |
| **Data Fetching** | SWR → TanStack Query | Parallel run, gradual switch |

---

*All constraints documented from source code, configuration, and team knowledge. See individual source citations for exact file locations.*