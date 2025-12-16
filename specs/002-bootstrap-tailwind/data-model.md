# Data Model: Bootstrap to Tailwind Migration

**Feature**: Bootstrap to Tailwind Migration
**Date**: 2025-12-16

## Overview

This document defines the CSS architecture model for the migration. Since this is a styling migration (not a data/API feature), the "data model" describes the CSS structure and component styling patterns.

---

## 1. CSS Architecture Model

### Target State

```
┌─────────────────────────────────────────────────────────────┐
│                     globals.css (~50 lines)                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  @import "tailwindcss"                               │   │
│  │  @import "tw-animate-css"                            │   │
│  │  @import "@vscode/codicons/dist/codicon.css"         │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  @theme inline { custom CSS variables }              │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Monaco editor overrides (required)                  │   │
│  │  AntD minimal overrides (if needed)                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   Component Layer                           │
│  ┌───────────────────┐  ┌───────────────────────────────┐  │
│  │  Ant Design       │  │  Tailwind Utilities           │  │
│  │  Components       │  │  (className="...")            │  │
│  │                   │  │                               │  │
│  │  <Button>         │  │  flex items-center gap-4      │  │
│  │  <Modal>          │  │  p-6 rounded-lg shadow-md     │  │
│  │  <Input>          │  │  mt-4 mb-6 w-full lg:w-1/2    │  │
│  │  <Select>         │  │  hover:bg-gray-100            │  │
│  │  <Tabs>           │  │  focus-visible:ring-2         │  │
│  └───────────────────┘  └───────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              CSS Modules (Exception Only - Max 5)           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Complex keyframe animations                         │   │
│  │  Third-party component overrides                     │   │
│  │  Pseudo-element complex content                      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Entity Definitions

### MigratedComponent

A React component that has been converted from Bootstrap/custom CSS to Tailwind + AntD.

| Property | Type | Description |
|----------|------|-------------|
| `path` | string | File path (e.g., `components/pmc-migrated/marketplace/ProductCard.tsx`) |
| `status` | enum | `pending` \| `in_progress` \| `completed` \| `verified` |
| `bootstrapClassCount` | number | Count of Bootstrap classes before migration |
| `customCssClassCount` | number | Count of custom global CSS classes before migration |
| `cssModuleUsed` | boolean | Whether component uses a CSS Module |
| `antdComponents` | string[] | List of AntD components used post-migration |
| `visuallyVerified` | boolean | Whether visual regression test passed |

### CSSModuleException

A CSS Module file retained after migration with documented justification.

| Property | Type | Description |
|----------|------|-------------|
| `path` | string | File path (e.g., `components/pmc-migrated/home/home.module.css`) |
| `reason` | string | Justification for keeping (animations, overrides, etc.) |
| `lineCount` | number | Lines of CSS after optimization |
| `approvedBy` | string | Who approved the exception |

### GlobalCSSSection

A section of globals.css to be removed or retained.

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Section identifier (e.g., "Bootstrap Modal Styles") |
| `lineRange` | [number, number] | Start and end line numbers |
| `action` | enum | `remove` \| `retain` \| `refactor` |
| `reason` | string | Why this action |

---

## 3. Component Categories

### Category A: Pure Tailwind Migration (No AntD)

Components that only need Bootstrap → Tailwind class replacement.

```tsx
// Before
<div className="d-flex justify-content-between align-items-center p-3 mb-4">
  <span className="fw-bold">Title</span>
</div>

// After
<div className="flex justify-between items-center p-4 mb-6">
  <span className="font-bold">Title</span>
</div>
```

**Estimated**: ~60% of components

### Category B: AntD Component Replacement

Components that should use AntD components for UI elements.

```tsx
// Before
<button className="btn btn-primary ud-btn">Submit</button>
<input className="form-control" type="text" />

// After
import { Button, Input } from 'antd';
<Button type="primary">Submit</Button>
<Input />
```

**Estimated**: ~35% of components

### Category C: CSS Module Retention

Components requiring CSS Modules for complex styling.

```tsx
// Retained CSS Module usage
import styles from './ComplexAnimation.module.css';
<div className={`${styles.animatedElement} flex items-center`}>
```

**Estimated**: ~5% of components (max 5 files)

---

## 4. Tailwind Config Extensions

### Custom Theme Tokens

```ts
// tailwind.config.ts (if needed)
export default {
  theme: {
    extend: {
      colors: {
        'pmc-primary': 'oklch(0.6 0.23 27.83)',
        'pmc-link': 'oklch(0.5 0.2 250)',
        'background': '#f8f4f3',
        'background-100': 'oklch(100% 0 0)',
      },
      borderRadius: {
        'pmc': '0.625rem', // --radius from globals.css
      },
    },
  },
};
```

### AntD Theme Configuration

```tsx
// app/layout.tsx or providers
import { ConfigProvider } from 'antd';

const antdTheme = {
  token: {
    colorPrimary: '#e54d2e', // oklch(0.6 0.23 27.83) converted
    borderRadius: 6,
    fontFamily: 'var(--font-geist-sans)',
  },
};

<ConfigProvider theme={antdTheme}>
  {children}
</ConfigProvider>
```

---

## 5. Migration State Tracking

### Component Migration Status

| Status | Definition | Count (Initial) |
|--------|------------|-----------------|
| `pending` | Not yet started | ~180 |
| `in_progress` | Currently being migrated | 0 |
| `completed` | Migration done, needs verification | 0 |
| `verified` | Visual regression test passed | 0 |

### CSS Reduction Metrics

| Metric | Before | Target |
|--------|--------|--------|
| globals.css lines | 4374 | ~50 |
| CSS Module files | 33 | ≤5 |
| Bootstrap class occurrences | ~1195 | 0 |
| Custom global CSS classes | ~200 | 0 |

---

## 6. Validation Rules

### Component Validation

1. **No Bootstrap classes**: `grep -E "className.*\b(d-flex|btn-primary|col-lg-|modal-dialog)\b"` returns 0
2. **No custom global classes**: `grep -E "className.*\b(ud-btn|btn-thm|fz\d+)\b"` returns 0
3. **Visual parity**: Screenshot diff < 1% threshold
4. **Accessibility preserved**: Focus states visible, ARIA attributes intact

### Global CSS Validation

1. **Only Tailwind imports**: First lines are `@import "tailwindcss"` etc.
2. **No Bootstrap-compatible utilities**: No `.d-flex`, `.justify-content-*`, `.btn-*` definitions
3. **Minimal custom classes**: ≤50 lines of custom CSS
4. **Monaco/third-party overrides documented**: Comments explain why retained

---

## 7. Relationships

```
┌─────────────────┐         ┌─────────────────────┐
│ MigratedComponent│────────▶│ CSSModuleException  │
│                 │ 0..1    │ (if retained)       │
└─────────────────┘         └─────────────────────┘
        │
        │ uses
        ▼
┌─────────────────┐         ┌─────────────────────┐
│ Tailwind Utils  │         │ AntD Components     │
│ (inline classes)│         │ (Button, Modal...)  │
└─────────────────┘         └─────────────────────┘
        │                           │
        └───────────┬───────────────┘
                    │
                    ▼
            ┌───────────────┐
            │ globals.css   │
            │ (theme vars)  │
            └───────────────┘
```
