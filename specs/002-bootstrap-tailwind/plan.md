# Implementation Plan: Bootstrap to Tailwind Migration

**Branch**: `002-bootstrap-tailwind` | **Date**: 2025-12-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-bootstrap-tailwind/spec.md`

## Summary

Migrate the PMC Engine Web application from Bootstrap-compatible custom CSS to Tailwind CSS utilities with Ant Design components. This involves removing ~4374 lines of custom global CSS (including Bootstrap-compatible classes), updating ~180 component files containing ~1195 occurrences of Bootstrap-style class usage, and refactoring 33+ CSS Module files while preserving visual fidelity and functionality.

**Technical Approach**: Use Ant Design components for UI elements (buttons, modals, forms, tables) and Tailwind utilities for layout/spacing only (Option B from clarification).

## Technical Context

**Language/Version**: TypeScript 5.x with React 19.2.0
**Primary Dependencies**: Next.js 16.0.10, Ant Design 6.0, Tailwind CSS 4, Framer Motion
**Storage**: N/A (frontend migration)
**Testing**: Visual regression testing, manual browser testing, existing E2E tests
**Target Platform**: Web (Next.js SSR/SSG)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Build size reduction ≥20% (Bootstrap removal)
**Constraints**: Visual parity with current design, no business logic changes
**Scale/Scope**: ~180 component files, ~4374 lines of custom CSS, 33 CSS Module files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Note**: Project constitution template has not been customized. Using default best practices:

| Gate | Status | Notes |
|------|--------|-------|
| No new dependencies added | PASS | Using existing Tailwind 4 + AntD 6 |
| Incremental migration possible | PASS | Component-by-component approach |
| Visual parity testable | PASS | Before/after screenshots per component |
| Business logic unchanged | PASS | Only CSS/styling changes |

## Project Structure

### Documentation (this feature)

```text
specs/002-bootstrap-tailwind/
├── plan.md              # This file
├── research.md          # Phase 0: Bootstrap class mapping research
├── data-model.md        # Phase 1: CSS architecture model
├── quickstart.md        # Phase 1: Migration guide for developers
├── contracts/           # Phase 1: Component migration contracts
│   └── component-migration-checklist.md
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
# Next.js Web Application Structure
app/
├── globals.css          # PRIMARY TARGET: 4374 lines → ~10 lines (Tailwind only)
├── layout.tsx           # Root layout
├── marketplace/         # Page routes using pmc-migrated components
├── product-details/
├── service-details/
├── service-list/
├── my-profile/
├── auth/
│   └── auth.module.css  # CSS Module to migrate
└── user/
    └── job-post/
        └── JobPost.module.css

components/
├── pmc-migrated/        # PRIMARY TARGET: 33 CSS Module files + component TSX
│   ├── marketplace/     # 14 CSS Modules
│   ├── profile/         # 5 CSS Modules
│   ├── shared/          # 3 CSS Modules
│   ├── checkout/        # 2 CSS Modules
│   ├── job-list/        # 2 CSS Modules
│   ├── service-details/ # Uses global CSS
│   ├── product-details/ # Uses global CSS
│   ├── forum/           # 1 CSS Module
│   ├── chat/            # 1 CSS Module
│   ├── settings/        # 1 CSS Module
│   ├── notifications/   # 1 CSS Module
│   ├── home/            # 1 CSS Module
│   ├── seller-registration/ # 1 CSS Module
│   └── dashboard-home/  # 1 CSS Module
├── ui/                  # shadcn/ui components (already Tailwind-based)
└── header/              # Global header components
```

**Structure Decision**: Existing Next.js App Router structure maintained. Migration targets `app/globals.css` (global CSS reduction) and `components/pmc-migrated/` (33 CSS Module files + inline styles).

## Complexity Tracking

No violations identified - migration uses existing technology stack (Tailwind 4 + AntD 6 already installed).
