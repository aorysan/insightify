---
title: "UI Component Library"
description: "Inventory of reusable UI primitives with props, variants, and usage"
audience: "developers, designers"
sources:
  - ui-component-library.md
---


## Overview

Complete inventory of reusable UI primitives. Each component follows consistent API patterns, TypeScript interfaces, and accessibility standards. Components are built with Tailwind CSS and composed using `class-variance-authority` for variant management.

> **Source:** ui-component-library.md § Component Library Overview

---

## Component Categories

| Category | Components | Purpose |
|----------|------------|---------|
| **Primitive** | Button, Input, Textarea, Label, Select, Checkbox, Radio, Switch | Basic form controls |
| **Composite** | Modal, Dropdown, Tabs, Tooltip, Popover, Avatar, Badge | Composed primitives |
| **Feedback** | Toast, Alert, ConfirmDialog, Spinner, Skeleton, Progress | User feedback |
| **Layout** | Card, Divider, ScrollArea, Separator, Container | Structural components |
| **Navigation** | Breadcrumb, Pagination, PaginationItem | Navigation aids |
| **Data Display** | Table, DataTable, List, DescriptionList, Stat | Data presentation |

---

## 1. Primitive Components

### Button
**File:** `components/ui/Button/Button.tsx`

```typescript
// Source: source-005.md § components/ui/Button/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean; // For use with Link/Router
}

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
        ghost: 'bg-transparent hover:bg-gray-100',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);
```

| Variant | Usage |
|---------|-------|
| `primary` | Main CTAs, form submits |
| `secondary` | Secondary actions |
| `outline` | Bordered buttons, less emphasis |
| `ghost` | Toolbar actions, subtle |
| `destructive` | Delete, remove, dangerous |
| `link` | Inline actions, breadcrumbs |

**Example:**
```tsx
<Button variant="primary" size="md" leftIcon={<PlusIcon />}>Add User</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="destructive" loading>Deleting...</Button>
```

---

### Input
**File:** `components/ui/Input/Input.tsx`

```typescript
// Source: source-005.md § components/ui/Input/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({ label, error, hint, leftIcon, rightIcon, className, id, ...props }: InputProps) {
  const inputId = id || useId();
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;
  
  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </Label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
            'transition-colors duration-200',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(errorId, hintId)}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-sm text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
}
```

---

### Modal
**File:** `components/ui/Modal/Modal.tsx`

```typescript
// Source: source-005.md § components/ui/Modal/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogContent
        className={cn(
          'fixed left-[50%] top-[50%] z-50 w-full translate-x-[-50%] translate-y-[-50%]',
          'bg-white rounded-xl shadow-xl p-6',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          sizeClasses[size]
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              {title && <DialogTitle className="text-lg font-semibold text-gray-900">{title}</DialogTitle>}
              {description && <DialogDescription className="mt-1 text-sm text-gray-500">{description}</DialogDescription>}
            </div>
            {showCloseButton && (
              <DialogClose asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8">
                  <XIcon className="h-4 w-4" />
                </Button>
              </DialogClose>
            )}
          </div>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
}
```

---

## 2. Composite Components

### Dropdown Menu
```typescript
// Source: source-005.md § components/ui/Dropdown/Dropdown.tsx
interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'end' | 'center';
}

interface DropdownItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  divider?: boolean;
}
```

### Tabs
```typescript
// Source: source-005.md § components/ui/Tabs/Tabs.tsx
interface TabsProps {
  defaultValue: string;
  items: TabItem[];
  onChange?: (value: string) => void;
  variant?: 'default' | 'underline' | 'pills';
}

interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}
```

---

## 3. Feedback Components

### Toast System
```typescript
// Source: source-005.md § components/ui/Toast/Toast.tsx
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'default';
  title: string;
  description?: string;
  duration?: number; // 0 = persistent
  action?: { label: string; onClick: () => void };
  onClose?: () => void;
}

const toastVariants = {
  success: 'border-green-500 bg-green-50',
  error: 'border-red-500 bg-red-50',
  warning: 'border-yellow-500 bg-yellow-50',
  info: 'border-blue-500 bg-blue-50',
  default: 'border-gray-300 bg-gray-50',
};
```

### Toast Container (Global)
```tsx
// Source: source-005.md § components/ui/Toast/ToastContainer.tsx
export function ToastContainer() {
  const { toasts } = useAppStore();
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}
```

---

## 4. Data Display Components

### DataTable (TanStack Table Wrapper)
```typescript
// Source: source-005.md § components/ui/DataTable/DataTable.tsx
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  pagination?: { pageSize?: number; pageCount?: number };
  sorting?: boolean;
  filtering?: boolean;
  rowSelection?: { selected: string[]; onChange: (ids: string[]) => void };
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}
```

---

## 5. Component Registry Table

| Component | Category | File | Variants | States | A11y |
|-----------|----------|------|----------|--------|------|
| Button | Primitive | `Button/Button.tsx` | 6 | 5 | ✅ |
| Input | Primitive | `Input/Input.tsx` | 1 | 4 | ✅ |
| Textarea | Primitive | `Textarea/Textarea.tsx` | 1 | 4 | ✅ |
| Select | Primitive | `Select/Select.tsx` | 2 | 4 | ✅ |
| Checkbox | Primitive | `Checkbox/Checkbox.tsx` | 1 | 4 | ✅ |
| Radio | Primitive | `Radio/Radio.tsx` | 1 | 4 | ✅ |
| Switch | Primitive | `Switch/Switch.tsx` | 1 | 4 | ✅ |
| Label | Primitive | `Label/Label.tsx` | 1 | 2 | ✅ |
| Modal | Composite | `Modal/Modal.tsx` | 5 | 2 | ✅ |
| Dropdown | Composite | `Dropdown/Dropdown.tsx` | 2 | 2 | ✅ |
| Tabs | Composite | `Tabs/Tabs.tsx` | 3 | 2 | ✅ |
| Tooltip | Composite | `Tooltip/Tooltip.tsx` | 4 | 2 | ✅ |
| Popover | Composite | `Popover/Popover.tsx` | 2 | 2 | ✅ |
| Avatar | Composite | `Avatar/Avatar.tsx` | 3 | 3 | ✅ |
| Badge | Composite | `Badge/Badge.tsx` | 4 | 1 | ✅ |
| Toast | Feedback | `Toast/Toast.tsx` | 5 | 3 | ✅ |
| Alert | Feedback | `Alert/Alert.tsx` | 4 | 1 | ✅ |
| ConfirmDialog | Feedback | `ConfirmDialog/ConfirmDialog.tsx` | 1 | 2 | ✅ |
| Spinner | Feedback | `Spinner/Spinner.tsx` | 3 | 1 | ✅ |
| Skeleton | Feedback | `Skeleton/Skeleton.tsx` | 3 | 1 | ✅ |
| Progress | Feedback | `Progress/Progress.tsx` | 2 | 1 | ✅ |
| Card | Layout | `Card/Card.tsx` | 3 | 1 | ✅ |
| Divider | Layout | `Divider/Divider.tsx` | 2 | 1 | - |
| Table | Data Display | `Table/Table.tsx` | 3 | 3 | ✅ |
| DataTable | Data Display | `DataTable/DataTable.tsx` | - | 3 | ✅ |
| Pagination | Navigation | `Pagination/Pagination.tsx` | 1 | 2 | ✅ |

---

## 6. Design Token References

### Colors (Tailwind Config)
```typescript
// Source: source-005.md § tailwind.config.ts
colors: {
  primary: {
    50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0',
    300: '#86efac', 400: '#4ade80', 500: '#22c55e',
    600: '#16a34a', 700: '#15803d', 800: '#166534',
    900: '#14532d', 950: '#052e16',
  },
  // ... gray, red, yellow, blue scales
}
```

### Spacing & Typography
```typescript
// Source: source-005.md § tailwind.config.ts
spacing: {
  '0': '0', '1': '0.25rem', '2': '0.5rem', '3': '0.75rem',
  '4': '1rem', '5': '1.25rem', '6': '1.5rem', '8': '2rem',
  '10': '2.5rem', '12': '3rem', '16': '4rem', '20': '5rem',
},
fontSize: {
  xs: ['0.75rem', { lineHeight: '1rem' }],
  sm: ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem', { lineHeight: '1.5rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  xl: ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
},
```

---

## 7. Accessibility Checklist

| Requirement | Implementation |
|-------------|----------------|
| Keyboard navigation | All interactive elements focusable, logical tab order |
| Focus indicators | Visible focus rings (`focus:ring-2 focus:ring-primary/20`) |
| ARIA labels | `aria-label`, `aria-labelledby`, `aria-describedby` |
| Role attributes | `role="dialog"`, `role="menu"`, `role="tablist"` |
| Live regions | `role="alert"` for toasts, `aria-live="polite"` |
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |
| Reduced motion | `prefers-reduced-motion` respected |

---

## 8. Usage Guidelines

### Do's ✅
- Import from `@/components/ui` (barrel exports)
- Use `cn()` for class composition
- Prefer variants over custom classes
- Test with keyboard and screen readers

### Don'ts ❌
- Don't override internal styles with `!important`
- Don't access internal state via refs
- Don't compose primitives incorrectly (e.g., Button inside Button)

---

*All component specifications extracted from source code. See individual source citations for exact file locations.*