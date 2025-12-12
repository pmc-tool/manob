# Research: PMC Website to PMC Engine Migration

**Feature**: 001-pmc-engine-migration
**Date**: 2025-12-12
**Status**: Complete

## Executive Summary

This research documents the technical decisions and patterns for migrating PackMyCode website pages into the PMC Engine dashboard. All decisions align with the constitution's API Contract Freeze, Auth Freeze, and Dashboard-Only Shell principles.

---

## 1. Dashboard Shell Integration Pattern

### Decision
Use Next.js App Router route groups with a shared dashboard layout wrapper that renders content within the PMC Engine shell's content slot.

### Rationale
- Route groups `(auth)`, `(marketplace)`, etc. provide logical organization without affecting URL structure
- A shared `DashboardLayout` component wraps all migrated pages to ensure consistent shell integration
- Sidebar and chat remain managed by the root layout; migrated content only fills the content area

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|-----------------|
| Parallel routes | Added complexity without benefit; shell already stable |
| Separate layout per group | Redundant; all pages use same shell pattern |
| Client-side routing only | Would break Next.js conventions and SSR benefits |

### Implementation Pattern

```typescript
// components/layouts/DashboardLayout.tsx
// MIGRATION: Wrapper ensuring content renders in Engine shell slot
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col">
      <main className="material-medium relative m-2 mt-0 flex-1 grow overflow-y-auto @container/page-layout bg-white border border-gray-200 rounded-2xl">
        <div className="mx-auto flex w-full max-w-[1264px] flex-1 flex-col gap-4 p-5">
          {children}
        </div>
      </main>
    </div>
  );
}
```

---

## 2. API Client Migration Strategy

### Decision
Migrate the PackMyCode API client as-is into `lib/api/`, preserving exact request/response types. Use environment variables for base URL configuration.

### Rationale
- CONTRACT: API shapes must remain identical
- Centralized client makes future backend hookup trivial (change env var only)
- TypeScript types enforce contract compliance at compile time

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|-----------------|
| Rewrite with new patterns (React Query, SWR) | Violates Feature Freeze; changes behavior |
| Direct fetch in components | Harder to maintain contract consistency |
| GraphQL wrapper | Changes API contract fundamentally |

### Implementation Pattern

```typescript
// lib/api/client.ts
// CONTRACT: Base client preserving PMC request patterns
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(), // CONTRACT: Same auth header pattern
      ...options?.headers,
    },
  });

  if (!response.ok) {
    // MIGRATION: Preserve PMC retry logic here
    throw new ApiError(response.status, await response.json());
  }

  return response.json();
}
```

---

## 3. Auth Context Migration

### Decision
Migrate PackMyCode auth context/hooks to `context/AuthContext.tsx`, preserving token storage strategy and session handling.

### Rationale
- Auth Freeze: Token/session behavior must remain identical
- Existing PMC Engine has no auth; this adds it without conflict
- Context pattern aligns with existing Engine contexts (RenameModalContext, SettingsModalContext)

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|-----------------|
| Next-Auth integration | Changes auth model; violates Auth Freeze |
| Zustand/Redux for auth | Overkill; context sufficient for existing pattern |
| Server-side session only | Changes how auth works; violates contract |

### Implementation Pattern

```typescript
// context/AuthContext.tsx
// CONTRACT: Preserves PMC token/session handling exactly
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  // CONTRACT: Same fields as PMC
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // CONTRACT: Same storage mechanism (localStorage/cookies as PMC uses)
  // CONTRACT: Same token refresh logic
  // CONTRACT: Same session validation
}
```

---

## 4. Error Handling (Hybrid Approach)

### Decision
Display errors using PMC Engine UI patterns (toast via Sonner, error boundaries) while preserving PackMyCode retry logic.

### Rationale
- Per clarification session: hybrid approach selected
- Visual consistency with Engine dashboard
- Behavioral consistency with PMC (retry intervals, max attempts)

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|-----------------|
| Full PMC error UI | Inconsistent with Engine visual language |
| Full Engine error handling | Loses PMC retry behavior (Feature Freeze violation) |

### Implementation Pattern

```typescript
// lib/api/error-handler.ts
// MIGRATION: Hybrid - Engine UI + PMC retry logic

import { toast } from 'sonner';

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts: number;      // CONTRACT: PMC values
    retryInterval: number;    // CONTRACT: PMC values
    onError?: (error: Error) => void;
  }
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < options.maxAttempts) {
        // MIGRATION: Engine UI for transient feedback
        toast.error(`Request failed. Retrying... (${attempt}/${options.maxAttempts})`);
        await delay(options.retryInterval);
      }
    }
  }

  // MIGRATION: Engine UI for final error
  toast.error('Request failed. Please try again.');
  throw lastError!;
}
```

---

## 5. Styling Migration Strategy

### Decision
Convert PackMyCode component styles to PMC Engine design tokens (Tailwind CSS 4). Scope any temporary legacy styles with CSS modules.

### Rationale
- Styling Policy: Engine tokens are only visual source of truth
- Tailwind 4 is already configured in Engine
- CSS modules provide isolation for any unavoidable legacy styles

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|-----------------|
| Import PMC global CSS | Violates Styling Policy; causes conflicts |
| Inline styles everywhere | Hard to maintain; inconsistent |
| Keep PMC's styling system | Creates two competing style systems |

### Token Mapping Reference

| PMC Pattern | Engine Equivalent |
|-------------|-------------------|
| Primary color | `bg-v0-blue-700` / theme primary |
| Card container | `bg-white border border-gray-200 rounded-2xl` |
| Page max-width | `max-w-[1264px]` |
| Spacing | Standard Tailwind spacing scale |
| Typography | `font-dm-sans` (already in layout) |

---

## 6. Component Migration Checklist

### Decision
Each migrated component must pass this checklist before merge:

1. ✅ No header/footer imports
2. ✅ Uses Engine design tokens
3. ✅ API calls use centralized client
4. ✅ Auth uses AuthContext
5. ✅ Renders in DashboardLayout slot
6. ✅ No global CSS imports
7. ✅ Comment tags present (// MIGRATION:, // CONTRACT:, // VIPER:)
8. ✅ Functional parity verified against PMC

---

## 7. Testing Strategy

### Decision
Manual functional parity testing against PackMyCode baseline for each migrated page group.

### Rationale
- Feature Freeze: Behavior must be identical
- Automated tests would require significant setup without clear ROI for migration
- Visual regression can be caught during PR review

### Test Protocol

1. Open PMC website and Engine side-by-side
2. For each user story in spec:
   - Execute flow in both applications
   - Verify identical behavior
   - Verify API calls match (Network tab)
   - Verify auth state handling
3. Document any discrepancies

---

## Dependencies Summary

| Dependency | Source | Notes |
|------------|--------|-------|
| Next.js 16 | Existing | App Router patterns |
| React 19 | Existing | Concurrent features |
| Ant Design 6 | Existing | Some UI components |
| Radix UI | Existing | Base UI primitives |
| Tailwind CSS 4 | Existing | Styling |
| Sonner | Existing | Toast notifications |
| pmc-web-client-main | Migration source | Components, API client, auth |

---

## Open Items

None. All technical decisions are resolved.

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-12 | Initial research complete |
