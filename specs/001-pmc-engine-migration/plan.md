# Implementation Plan: PMC Website to PMC Engine Migration

**Branch**: `001-pmc-engine-migration` | **Date**: 2025-12-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-pmc-engine-migration/spec.md`

## Summary

Migrate all PackMyCode (PMC) website pages (except homepage) into the PMC Engine dashboard application. The migration preserves 100% API contract compatibility, identical auth behavior, and all existing features while integrating pages into the Engine's dashboard shell with sidebar/chat. Error handling uses a hybrid approach: PMC Engine UI patterns with PackMyCode retry logic.

## Technical Context

**Language/Version**: TypeScript 5.x with React 19.2.0
**Primary Dependencies**: Next.js 16.0.4, Ant Design 6.0, Radix UI, Tailwind CSS 4, Framer Motion
**Storage**: N/A (API-backed, frontend-only migration)
**Testing**: Manual functional parity testing against PackMyCode baseline
**Target Platform**: Web (modern browsers)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Page load times within 10% of PackMyCode baseline
**Constraints**: API contract frozen, Auth behavior frozen, Feature freeze
**Scale/Scope**: 11 page groups (Auth, Product/Service/Jobs, Category, Search, Become Seller, Shop/Payment, Support, Forum, Discussion, Seller Dashboard, User Dashboard)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. API Contract Freeze | ✅ PASS | All API calls preserved exactly; no payload/response changes |
| II. Auth Freeze | ✅ PASS | Token/session handling unchanged; auth flows preserved |
| III. Feature Freeze | ✅ PASS | No feature additions/removals; identical functionality |
| IV. Dashboard-Only Shell | ✅ PASS | All pages render in Engine shell; no header/footer |
| V. Sidebar & Chat Stability | ✅ PASS | Shell manages sidebar/chat; migrated content in slots |
| VI. Component Policy | ✅ PASS | Functional parity with design token alignment |
| VII. Styling Policy | ✅ PASS | PMC Engine tokens only; no legacy global CSS |

**Gate Result**: PASS — Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-pmc-engine-migration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contract documentation)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── layout.tsx                    # Root layout (already exists with AntD, contexts)
├── page.tsx                      # PMC Engine dashboard home (NOT migrated from PMC)
├── (auth)/                       # Auth pages group
│   ├── sign-in/page.tsx
│   ├── sign-up/page.tsx
│   ├── otp/page.tsx
│   └── recovery/page.tsx
├── (marketplace)/                # Product/commerce pages group
│   ├── products/
│   │   ├── page.tsx              # Product listing
│   │   └── [id]/page.tsx         # Product detail
│   ├── services/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── jobs/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── categories/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   └── search/page.tsx
├── (seller)/                     # Seller-specific pages group
│   ├── become-seller/page.tsx
│   └── dashboard/
│       ├── page.tsx
│       ├── products/page.tsx
│       ├── orders/page.tsx
│       └── analytics/page.tsx
├── (user)/                       # User dashboard pages group
│   └── dashboard/
│       ├── page.tsx
│       ├── orders/page.tsx
│       ├── profile/page.tsx
│       └── settings/page.tsx
├── (checkout)/                   # Shop/payment flow
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   └── payment/page.tsx
├── (community)/                  # Support/forum/discussion
│   ├── support/page.tsx
│   ├── forum/
│   │   ├── page.tsx
│   │   └── [topic]/page.tsx
│   └── discussion/
│       ├── page.tsx
│       └── [id]/page.tsx
├── api/                          # API routes (existing)
│   └── chat/route.ts
└── projects/                     # Existing PMC Engine projects feature

components/
├── ui/                           # Existing UI components (Radix-based)
├── sidebar/                      # Existing sidebar components
├── header/                       # Existing header components
├── ai-elements/                  # Existing AI chat components
├── previe-pane/                  # Existing preview pane
└── pmc-migrated/                 # NEW: Migrated PMC components
    ├── auth/                     # Auth form components
    ├── product/                  # Product display components
    ├── seller/                   # Seller dashboard components
    ├── user/                     # User dashboard components
    ├── checkout/                 # Cart/payment components
    ├── community/                # Forum/support components
    └── shared/                   # Shared migrated utilities

context/
├── RenameModalContext.tsx        # Existing
├── SettingsModalContext.tsx      # Existing
└── AuthContext.tsx               # NEW: Auth state (migrated from PMC)

lib/
├── api/                          # NEW: API client (migrated from PMC)
│   ├── client.ts                 # Base API client
│   ├── auth.ts                   # Auth API calls
│   ├── products.ts               # Product API calls
│   ├── orders.ts                 # Order API calls
│   └── types.ts                  # API types (CONTRACT: exact shapes)
└── utils/                        # Shared utilities
```

**Structure Decision**: Next.js App Router with route groups for logical organization. Migrated components live in `components/pmc-migrated/` to isolate them from existing Engine components. API client in `lib/api/` with frozen contract types.

## Complexity Tracking

> No Constitution Check violations requiring justification.

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Route Groups | `(auth)`, `(marketplace)`, etc. | Logical organization without affecting URLs |
| Component Isolation | `components/pmc-migrated/` | Keeps migrated code separate from Engine components |
| Hybrid Error Handling | Engine UI + PMC retry | Per clarification session decision |
