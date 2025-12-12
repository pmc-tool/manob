# Quickstart: PMC Website to PMC Engine Migration

**Feature**: 001-pmc-engine-migration
**Date**: 2025-12-12

This guide helps developers get started with the PMC migration work.

---

## Prerequisites

- Node.js 18+ (Next.js 16 requirement)
- Access to `pmc-web-client-main` source repository
- PMC Engine development environment running

## Setup

### 1. Clone and Install

```bash
cd pmc-engine-web-main
npm install
```

### 2. Environment Configuration

Create `.env.local` with:

```bash
# API base URL (leave empty for mocks during development)
NEXT_PUBLIC_API_BASE_URL=

# When ready to connect to real backend:
# NEXT_PUBLIC_API_BASE_URL=https://api.packmycode.com
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Migration Workflow

### Step 1: Identify Component in PMC Source

1. Locate the page/component in `pmc-web-client-main`
2. Note all imports, especially:
   - API calls
   - Auth hooks
   - Global styles

### Step 2: Create Page in Engine

```bash
# Example: Creating sign-in page
mkdir -p app/\(auth\)/sign-in
touch app/\(auth\)/sign-in/page.tsx
```

### Step 3: Create Migrated Component

```bash
# Place migrated components in dedicated directory
mkdir -p components/pmc-migrated/auth
touch components/pmc-migrated/auth/SignInForm.tsx
```

### Step 4: Apply Migration Checklist

For each component:

- [ ] Remove header/footer imports
- [ ] Replace PMC styles with Engine tokens
- [ ] Use centralized API client (`lib/api/`)
- [ ] Use AuthContext (`context/AuthContext.tsx`)
- [ ] Wrap in DashboardLayout
- [ ] Add comment tags

### Step 5: Verify Functional Parity

1. Run both PMC and Engine side-by-side
2. Execute the user story flow in both
3. Compare API calls (Network tab)
4. Verify identical behavior

---

## Code Patterns

### Page Template

```tsx
// app/(auth)/sign-in/page.tsx
import { SignInForm } from '@/components/pmc-migrated/auth/SignInForm';

// MIGRATION: Auth page migrated from PMC
export default function SignInPage() {
  return <SignInForm />;
}
```

### Component Template

```tsx
// components/pmc-migrated/auth/SignInForm.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api/auth';

// MIGRATION: SignIn form from PMC
// CONTRACT: Uses identical login API shape
export function SignInForm() {
  const { login } = useAuth();

  const handleSubmit = async (data: LoginRequest) => {
    // CONTRACT: Exact PMC API call pattern
    const response = await authApi.login(data);
    login(response);
  };

  return (
    // VIPER: Engine design tokens applied
    <div className="mx-auto max-w-md p-6 bg-white rounded-2xl border border-gray-200">
      {/* Form content */}
    </div>
  );
}
```

### API Client Template

```typescript
// lib/api/auth.ts
import { apiRequest } from './client';
import type { LoginRequest, AuthSession } from './types';

// CONTRACT: Exact PMC API endpoints and shapes
export const authApi = {
  login: (data: LoginRequest) =>
    apiRequest<AuthSession>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ... other auth methods
};
```

---

## Comment Tags Reference

| Tag | Usage |
|-----|-------|
| `// MIGRATION:` | Layout/structure decisions |
| `// CONTRACT:` | API shape preservation |
| `// VIPER:` | Quality attribute notes |

---

## Directory Reference

| Path | Purpose |
|------|---------|
| `app/(auth)/` | Auth pages (sign-in, sign-up, etc.) |
| `app/(marketplace)/` | Product/service/job pages |
| `app/(seller)/` | Seller dashboard pages |
| `app/(user)/` | User dashboard pages |
| `app/(checkout)/` | Cart/checkout/payment pages |
| `app/(community)/` | Forum/support/discussion pages |
| `components/pmc-migrated/` | Migrated components |
| `lib/api/` | API client and types |
| `context/AuthContext.tsx` | Auth state management |

---

## Troubleshooting

### Sidebar/Chat Broken

- Check: Are you using DashboardLayout wrapper?
- Check: Any global CSS imports from PMC?

### API Call Shape Mismatch

- Check: Using `lib/api/` client?
- Check: Types match `contracts/api-endpoints.md`?

### Styles Look Wrong

- Check: Using Tailwind/Engine tokens?
- Check: No PMC global.css imports?

---

## Validation Commands

```bash
# Type check
npm run build

# Lint
npm run lint

# Find forbidden imports
grep -r "pmc-web-client" app/ components/
# Should return empty

# Find header/footer imports (should be zero)
grep -r "Header\|Footer" components/pmc-migrated/
```

---

## Next Steps

After setup:
1. Run `/speckit.tasks` to generate task breakdown
2. Start with P1 user stories (Auth, Seller Dashboard, Products)
3. Complete one page group before moving to next
