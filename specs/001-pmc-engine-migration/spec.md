# Feature Specification: PMC Website to PMC Engine Migration

**Feature Branch**: `001-pmc-engine-migration`
**Created**: 2025-12-12
**Status**: Draft
**Input**: User description: "PMC Website → PMC Engine Migration (Dashboard-Only UI, API-Contract Frozen) — Easital Viper"

## Clarifications

### Session 2025-12-12

- Q: How should migrated components handle API failures (error UI, retry logic)? → A: Hybrid approach - use PMC Engine error UI patterns while preserving PackMyCode retry logic
- Q: Where should authentication tokens/session data be stored in PMC Engine? → A: Match exactly what PackMyCode currently uses (no change to storage mechanism)
- Q: How should migrated pages handle mobile/responsive layouts? → A: Preserve PackMyCode responsive behavior within content area; PMC Engine shell handles its own responsive behavior (sidebar collapse, chat visibility)
- Q: What CSS isolation strategy should be used for migrated components? → A: CSS Modules for all migrated components (scoped class names to prevent style leakage)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Seller Accesses Dashboard Features (Priority: P1)

A seller who previously used PackMyCode website navigates to their dashboard within PMC Engine. They can access all seller-specific features (product management, order tracking, analytics) without leaving the unified dashboard experience.

**Why this priority**: Seller dashboard is core business functionality. Sellers generate revenue, so their experience must work flawlessly from day one.

**Independent Test**: Seller can log in, navigate to seller dashboard section, view products, manage listings, and track orders — all within PMC Engine shell with sidebar/chat remaining functional.

**Acceptance Scenarios**:

1. **Given** a logged-in seller, **When** they navigate to their dashboard, **Then** they see all seller features rendered inside PMC Engine dashboard shell with sidebar visible
2. **Given** a seller viewing their product listings, **When** they edit a product, **Then** the edit form appears within the dashboard content area without affecting sidebar/chat
3. **Given** a seller completing an action, **When** the action triggers an API call, **Then** the request/response shapes match exactly with existing PackMyCode API contract

---

### User Story 2 - User Browses and Purchases Products (Priority: P1)

A buyer navigates through product categories, searches for items, views product details, and completes a purchase — all within the PMC Engine dashboard experience.

**Why this priority**: Purchase flow is critical business functionality. Any regression in the shopping experience directly impacts revenue.

**Independent Test**: User can browse categories, search products, view details, add to cart, and complete checkout within PMC Engine dashboard.

**Acceptance Scenarios**:

1. **Given** a user on the dashboard, **When** they browse product categories, **Then** categories display within dashboard content area with consistent styling
2. **Given** a user searching for products, **When** they enter a search query, **Then** results appear using identical API calls to existing PackMyCode search
3. **Given** a user completing checkout, **When** they submit payment, **Then** the payment flow works identically to existing PackMyCode behavior

---

### User Story 3 - User Authenticates (Sign-in/Sign-up/Recovery) (Priority: P1)

A new or returning user accesses authentication flows (sign-in, sign-up, OTP verification, password recovery) that work identically to existing PackMyCode flows but render appropriately within the PMC Engine context.

**Why this priority**: Authentication is a prerequisite for all authenticated features. Any auth regression blocks all user access.

**Independent Test**: User can complete full sign-up flow, sign-in flow, OTP verification, and password recovery with identical behavior to PackMyCode.

**Acceptance Scenarios**:

1. **Given** a new user, **When** they complete sign-up, **Then** account creation uses identical API contract and token/session handling
2. **Given** a user needing OTP verification, **When** they enter OTP, **Then** verification works identically to PackMyCode OTP flow
3. **Given** a user with forgotten password, **When** they complete recovery, **Then** recovery flow behavior matches PackMyCode exactly

---

### User Story 4 - User Accesses Support and Forums (Priority: P2)

A user accesses support pages, forum discussions, and community features within the PMC Engine dashboard.

**Why this priority**: Support and community features are important for user retention but not blocking for core commerce flows.

**Independent Test**: User can view support pages, browse forums, participate in discussions within dashboard shell.

**Acceptance Scenarios**:

1. **Given** a user seeking help, **When** they navigate to support, **Then** support content renders within dashboard content area
2. **Given** a user browsing forums, **When** they view discussions, **Then** forum content displays with PMC Engine styling while preserving functionality

---

### User Story 5 - User Becomes a Seller (Priority: P2)

A user completes the "Become a Seller" flow to transition from buyer to seller status.

**Why this priority**: Important for platform growth but not blocking for existing functionality.

**Independent Test**: User can complete seller registration flow within dashboard.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they initiate "Become Seller", **Then** the registration flow works identically to PackMyCode
2. **Given** a user completing seller setup, **When** they submit seller information, **Then** API calls match existing contract

---

### Edge Cases

- What happens when a user navigates directly to a migrated page URL? The page must render within the dashboard shell.
- How does the system handle legacy bookmarks or shared links? URLs must resolve to the correct migrated content within dashboard.
- What happens if a migrated component references PackMyCode header/footer? Build must fail or lint must catch forbidden imports.
- How does navigation state persist when switching between migrated pages? Sidebar and chat state must remain stable.
- How does the system handle API failures? Error states use PMC Engine UI patterns (toast notifications, error boundaries, loading states) while retry logic preserves PackMyCode behavior (retry intervals, max attempts, fallback strategies).
- How do pages behave on mobile/tablet viewports? Migrated page content preserves its own PackMyCode responsive behavior; PMC Engine shell independently handles sidebar collapse and chat visibility at its breakpoints.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render all migrated pages inside PMC Engine dashboard shell with sidebar and chat functional
- **FR-002**: System MUST preserve identical API request payload shapes for all migrated features
- **FR-003**: System MUST preserve identical API response shape assumptions (field names, nesting, types)
- **FR-004**: System MUST maintain identical authentication token/session handling behavior, including using the same storage mechanism as PackMyCode (no migration of storage approach)
- **FR-005**: System MUST preserve all existing feature functionality without modification
- **FR-006**: System MUST NOT import or render PackMyCode header or footer components
- **FR-007**: System MUST use PMC Engine design tokens and styling exclusively
- **FR-008**: System MUST maintain sidebar stability across all page navigations
- **FR-009**: System MUST maintain chat availability and behavior across all pages
- **FR-010**: System MUST support all pages in scope: Auth, Product/Service/Jobs, Category, Search, Become Seller, Shop/Payment, Support, Forum, Discussion, Seller Dashboard, User Dashboard
- **FR-011**: System MUST display API error states using PMC Engine UI patterns (toast notifications, error boundaries, loading indicators)
- **FR-012**: System MUST preserve PackMyCode retry logic for API failures (retry intervals, max attempts, fallback strategies)
- **FR-013**: Migrated components MUST use CSS Modules for style isolation to prevent style leakage into PMC Engine shell

### Key Entities

- **Migrated Page**: A PackMyCode page component transplanted into PMC Engine dashboard, stripped of header/footer, using Engine layout slots
- **Dashboard Shell**: The PMC Engine layout container providing sidebar, chat, and content area
- **API Contract**: The exact request/response structure used by PackMyCode frontend that must remain unchanged
- **Auth Session**: The token/session data structure and handling logic that must remain identical

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of in-scope pages render correctly within PMC Engine dashboard shell
- **SC-002**: 0 PackMyCode header/footer components exist in migrated codebase
- **SC-003**: 100% of API calls from migrated pages match existing PackMyCode request/response contracts
- **SC-004**: Users complete authentication flows with identical success rates to PackMyCode baseline
- **SC-005**: Users complete purchase flows with identical success rates to PackMyCode baseline
- **SC-006**: Sidebar remains visible and functional across 100% of page navigations
- **SC-007**: Chat remains accessible and functional across 100% of page navigations
- **SC-008**: Page load times for migrated pages are within 10% of PackMyCode baseline performance
- **SC-009**: 0 CSS conflicts between migrated components and PMC Engine dashboard shell
- **SC-010**: 100% of migrated features pass functional parity testing against PackMyCode

## Assumptions

- PackMyCode source code (`pmc-web-client-main`) is available and accessible for migration
- PMC Engine dashboard shell is stable and provides documented layout slots for content
- PMC Engine design tokens and styling system are documented and ready for use
- Existing PackMyCode API backend will be connected later; frontend mocks current behavior
- No changes to PackMyCode backend or API contracts are planned during migration
- All PMC Engine sidebar/chat functionality is feature-complete and stable

---

## Working Instruction (v1.1)

### Working Model

- **Source project**: `pmc-web-client-main` (PackMyCode web client)
- **Target project**: PMC Engine (dashboard-based app)
- Migration is **gradual** — we bring pages/components step-by-step, based on what is needed now
- We will NOT attempt to finish the whole migration at once
- UI/design will be adjusted to fit the best place inside PMC Engine, but feature behavior and API contracts must remain consistent

### How We Work

1. You (Nowshid) will tell me what to bring (a page, a component set, or a feature screen) from `pmc-web-client-main`
2. I will provide the exact migration instructions for that request: what files to copy, what dependencies it needs, and how to fit it into PMC Engine layout
3. We will brainstorm where it best fits inside PMC Engine if the same feature can live in multiple places
4. After each step, we validate and lock it, then move to the next requested item

### API Contract Rules (NON-NEGOTIABLE)

| Rule | Description |
|------|-------------|
| Request Shapes | API calling must remain exactly as in current PackMyCode client. Request payload shapes must not change. |
| Response Shapes | Response structure expectations must not change. |
| No Data Mismatch | Do not rename, reshape, or normalize in a way that breaks backend compatibility. |
| View-Only Mapping | If UI needs a different view model, it must be derived without mutating the original API data. |

### Dummy Data Policy

**Purpose**: Use mock response data when needed to validate page layout/design before the real backend is connected.

| Rule | Description |
|------|-------------|
| Structure Match | Dummy data must exactly match the current PackMyCode API response structure (same keys, nesting, types) |
| Temporary Tool | Dummy data is a temporary validation tool, not a new contract |
| No UI Refactor | Switching from dummy data to real backend must require no UI refactor — only swapping the data source |
| Isolated Placement | Keep dummy data in isolated mock files/adapters, not scattered across components |
| Mark Clearly | Mark mock usage with comments: `// CONTRACT:` and `// MOCK:` |

### UI Shell Rules (NON-NEGOTIABLE)

- **NO PackMyCode header or footer** — everything must use PMC Engine dashboard pattern
- All imported pages must render inside the dashboard shell (sidebar + header + chat + content area)
- No separate layout systems allowed
- Sidebar/header/chat stability must NEVER break due to imported CSS or layout changes

### What Can Be Brought from PackMyCode

| Allowed | Disallowed |
|---------|------------|
| Pages/screens (as requested step-by-step) | PackMyCode global header/footer/layout wrappers |
| Components needed by those pages | Legacy global CSS that can override/break PMC Engine shell |
| Utilities/hooks/helpers for those components | Any change that alters API/auth behavior |
| Existing API client usage patterns | |

### Decision Style

- Prefer the **simplest integration** that preserves behavior
- If multiple design placements are possible, choose the one that fits the **dashboard UX best**
- We can remove or postpone non-essential parts, but only deliberately and step-by-step

### Execution Rule

- **One request at a time**: Migrate only what you asked in the current step
- **After each step, confirm**:
  1. Dashboard shell is intact
  2. API contract is intact
  3. Feature behaves like PackMyCode

## Scope Boundaries

### In Scope
- All pages listed in inventory: Auth, Product/Service/Jobs, Category, Search, Become Seller, Shop/Payment, Support, Forum, Discussion, Seller Dashboard, User Dashboard
- Visual alignment to PMC Engine design tokens
- Component migration with functional parity
- API call preservation (request/response shapes)
- Auth behavior preservation

### Out of Scope
- PackMyCode homepage (`page.tsx` home)
- PackMyCode header and footer components
- Backend/API changes
- New feature development
- Business rule changes
- Auth model changes
