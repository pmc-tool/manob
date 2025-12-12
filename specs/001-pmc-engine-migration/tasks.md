# Tasks: PMC Website to PMC Engine Migration

**Input**: Design documents from `/specs/001-pmc-engine-migration/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Manual functional parity testing as per spec. No automated test tasks generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js App Router**: `app/` for pages, `components/` for UI, `lib/` for utilities
- Migrated components: `components/pmc-migrated/`
- API client: `lib/api/`
- Contexts: `context/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and directory structure for migration

- [ ] T001 Create directory structure for migrated components in components/pmc-migrated/ (auth/, product/, seller/, user/, checkout/, community/, shared/)
- [ ] T002 [P] Create lib/api/ directory structure with empty files (client.ts, types.ts, auth.ts, products.ts, orders.ts, seller.ts, forum.ts, support.ts)
- [ ] T003 [P] Create route group directories in app/ ((auth)/, (marketplace)/, (seller)/, (user)/, (checkout)/, (community)/)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create API types file with all entity interfaces (CONTRACT: exact PMC shapes) in lib/api/types.ts
- [ ] T005 [P] Create base API client with fetch wrapper and auth headers in lib/api/client.ts
- [ ] T006 [P] Create error handling utilities with PMC retry logic + Engine toast UI in lib/api/error-handler.ts
- [ ] T007 Create AuthContext with token/session management (CONTRACT: PMC storage pattern) in context/AuthContext.tsx
- [ ] T008 Create DashboardLayout wrapper component for migrated pages in components/pmc-migrated/shared/DashboardLayout.tsx
- [ ] T009 Update app/layout.tsx to include AuthProvider in context chain
- [ ] T010 [P] Create shared loading/error state components using Engine patterns in components/pmc-migrated/shared/LoadingState.tsx and ErrorBoundary.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Seller Dashboard (Priority: P1) 🎯 MVP

**Goal**: Seller can access all dashboard features (product management, order tracking, analytics) within PMC Engine shell

**Independent Test**: Seller logs in, navigates to seller dashboard, views/manages products, tracks orders - sidebar/chat remain functional throughout

### Implementation for User Story 1

- [ ] T011 [P] [US1] Create seller API module with all seller endpoints in lib/api/seller.ts
- [ ] T012 [P] [US1] Create Product type exports and product API module in lib/api/products.ts
- [ ] T013 [P] [US1] Create Order type exports and orders API module in lib/api/orders.ts
- [ ] T014 [P] [US1] Create SellerDashboardOverview component in components/pmc-migrated/seller/DashboardOverview.tsx
- [ ] T015 [P] [US1] Create SellerProductList component in components/pmc-migrated/seller/ProductList.tsx
- [ ] T016 [P] [US1] Create SellerProductForm component (create/edit) in components/pmc-migrated/seller/ProductForm.tsx
- [ ] T017 [P] [US1] Create SellerOrderList component in components/pmc-migrated/seller/OrderList.tsx
- [ ] T018 [P] [US1] Create SellerAnalytics component in components/pmc-migrated/seller/Analytics.tsx
- [ ] T019 [US1] Create seller dashboard main page in app/(seller)/dashboard/page.tsx
- [ ] T020 [US1] Create seller products page in app/(seller)/dashboard/products/page.tsx
- [ ] T021 [US1] Create seller orders page in app/(seller)/dashboard/orders/page.tsx
- [ ] T022 [US1] Create seller analytics page in app/(seller)/dashboard/analytics/page.tsx
- [ ] T023 [US1] Add seller dashboard navigation links to sidebar (if applicable) or internal nav in components/pmc-migrated/seller/SellerNav.tsx

**Checkpoint**: Seller Dashboard should be fully functional and testable independently

---

## Phase 4: User Story 2 - Product Browsing & Purchase (Priority: P1)

**Goal**: User can browse categories, search products, view details, add to cart, and complete checkout within dashboard

**Independent Test**: User browses products, searches, adds to cart, completes purchase - all within Engine shell with identical API behavior to PMC

### Implementation for User Story 2

- [ ] T024 [P] [US2] Create categories API module in lib/api/categories.ts
- [ ] T025 [P] [US2] Create search API module in lib/api/search.ts
- [ ] T026 [P] [US2] Create cart API module in lib/api/cart.ts
- [ ] T027 [P] [US2] Create ProductCard component in components/pmc-migrated/product/ProductCard.tsx
- [ ] T028 [P] [US2] Create ProductGrid component in components/pmc-migrated/product/ProductGrid.tsx
- [ ] T029 [P] [US2] Create ProductDetail component in components/pmc-migrated/product/ProductDetail.tsx
- [ ] T030 [P] [US2] Create CategoryList component in components/pmc-migrated/product/CategoryList.tsx
- [ ] T031 [P] [US2] Create SearchResults component in components/pmc-migrated/product/SearchResults.tsx
- [ ] T032 [P] [US2] Create CartView component in components/pmc-migrated/checkout/CartView.tsx
- [ ] T033 [P] [US2] Create CheckoutForm component in components/pmc-migrated/checkout/CheckoutForm.tsx
- [ ] T034 [P] [US2] Create PaymentForm component in components/pmc-migrated/checkout/PaymentForm.tsx
- [ ] T035 [US2] Create products listing page in app/(marketplace)/products/page.tsx
- [ ] T036 [US2] Create product detail page in app/(marketplace)/products/[id]/page.tsx
- [ ] T037 [US2] Create services listing page in app/(marketplace)/services/page.tsx
- [ ] T038 [US2] Create service detail page in app/(marketplace)/services/[id]/page.tsx
- [ ] T039 [US2] Create jobs listing page in app/(marketplace)/jobs/page.tsx
- [ ] T040 [US2] Create job detail page in app/(marketplace)/jobs/[id]/page.tsx
- [ ] T041 [US2] Create categories listing page in app/(marketplace)/categories/page.tsx
- [ ] T042 [US2] Create category detail page in app/(marketplace)/categories/[slug]/page.tsx
- [ ] T043 [US2] Create search page in app/(marketplace)/search/page.tsx
- [ ] T044 [US2] Create cart page in app/(checkout)/cart/page.tsx
- [ ] T045 [US2] Create checkout page in app/(checkout)/checkout/page.tsx
- [ ] T046 [US2] Create payment page in app/(checkout)/payment/page.tsx

**Checkpoint**: Product browsing and purchase flow should be fully functional

---

## Phase 5: User Story 3 - Authentication (Priority: P1)

**Goal**: User can sign-in, sign-up, verify OTP, and recover password with identical behavior to PMC

**Independent Test**: Complete full auth flows (signup → OTP → login → logout → recovery) with identical API behavior

### Implementation for User Story 3

- [ ] T047 [P] [US3] Create auth API module with all auth endpoints in lib/api/auth.ts
- [ ] T048 [P] [US3] Create SignInForm component in components/pmc-migrated/auth/SignInForm.tsx
- [ ] T049 [P] [US3] Create SignUpForm component in components/pmc-migrated/auth/SignUpForm.tsx
- [ ] T050 [P] [US3] Create OTPVerification component in components/pmc-migrated/auth/OTPVerification.tsx
- [ ] T051 [P] [US3] Create PasswordRecovery component in components/pmc-migrated/auth/PasswordRecovery.tsx
- [ ] T052 [P] [US3] Create ResetPassword component in components/pmc-migrated/auth/ResetPassword.tsx
- [ ] T053 [US3] Create sign-in page in app/(auth)/sign-in/page.tsx
- [ ] T054 [US3] Create sign-up page in app/(auth)/sign-up/page.tsx
- [ ] T055 [US3] Create OTP verification page in app/(auth)/otp/page.tsx
- [ ] T056 [US3] Create password recovery page in app/(auth)/recovery/page.tsx

**Checkpoint**: All authentication flows should work identically to PMC

---

## Phase 6: User Story 4 - Support & Forums (Priority: P2)

**Goal**: User can access support pages, browse forums, and participate in discussions within dashboard

**Independent Test**: User views support, browses forums, reads/creates posts within Engine shell

### Implementation for User Story 4

- [ ] T057 [P] [US4] Create forum API module in lib/api/forum.ts
- [ ] T058 [P] [US4] Create support API module in lib/api/support.ts
- [ ] T059 [P] [US4] Create SupportPage component in components/pmc-migrated/community/SupportPage.tsx
- [ ] T060 [P] [US4] Create SupportTicketForm component in components/pmc-migrated/community/SupportTicketForm.tsx
- [ ] T061 [P] [US4] Create ForumTopicList component in components/pmc-migrated/community/ForumTopicList.tsx
- [ ] T062 [P] [US4] Create ForumPostList component in components/pmc-migrated/community/ForumPostList.tsx
- [ ] T063 [P] [US4] Create ForumPostDetail component in components/pmc-migrated/community/ForumPostDetail.tsx
- [ ] T064 [P] [US4] Create DiscussionList component in components/pmc-migrated/community/DiscussionList.tsx
- [ ] T065 [P] [US4] Create DiscussionDetail component in components/pmc-migrated/community/DiscussionDetail.tsx
- [ ] T066 [US4] Create support page in app/(community)/support/page.tsx
- [ ] T067 [US4] Create forum listing page in app/(community)/forum/page.tsx
- [ ] T068 [US4] Create forum topic page in app/(community)/forum/[topic]/page.tsx
- [ ] T069 [US4] Create discussions listing page in app/(community)/discussion/page.tsx
- [ ] T070 [US4] Create discussion detail page in app/(community)/discussion/[id]/page.tsx

**Checkpoint**: Support and forum features should be functional within dashboard

---

## Phase 7: User Story 5 - Become Seller (Priority: P2)

**Goal**: User can complete seller registration flow to become a seller

**Independent Test**: User initiates become-seller, fills application, submits - API calls match PMC contract

### Implementation for User Story 5

- [ ] T071 [P] [US5] Create BecomeSellerForm component in components/pmc-migrated/seller/BecomeSellerForm.tsx
- [ ] T072 [P] [US5] Create SellerApplicationStatus component in components/pmc-migrated/seller/ApplicationStatus.tsx
- [ ] T073 [US5] Create become-seller page in app/(seller)/become-seller/page.tsx

**Checkpoint**: Become Seller flow should work identically to PMC

---

## Phase 8: User Dashboard (Priority: P2)

**Goal**: User can access their dashboard with orders, profile, and settings

**Independent Test**: User views orders, updates profile, changes settings within dashboard

### Implementation for User Dashboard

- [ ] T074 [P] Create user API module in lib/api/user.ts
- [ ] T075 [P] Create UserDashboardOverview component in components/pmc-migrated/user/DashboardOverview.tsx
- [ ] T076 [P] Create UserOrderList component in components/pmc-migrated/user/OrderList.tsx
- [ ] T077 [P] Create UserProfile component in components/pmc-migrated/user/Profile.tsx
- [ ] T078 [P] Create UserSettings component in components/pmc-migrated/user/Settings.tsx
- [ ] T079 Create user dashboard main page in app/(user)/dashboard/page.tsx
- [ ] T080 Create user orders page in app/(user)/dashboard/orders/page.tsx
- [ ] T081 Create user profile page in app/(user)/dashboard/profile/page.tsx
- [ ] T082 Create user settings page in app/(user)/dashboard/settings/page.tsx

**Checkpoint**: User dashboard should be fully functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T083 [P] Verify all migrated pages render within dashboard shell (no header/footer leakage)
- [ ] T084 [P] Verify sidebar remains stable across all page navigations
- [ ] T085 [P] Verify chat remains accessible across all pages
- [ ] T086 Run full functional parity testing against PackMyCode baseline
- [ ] T087 [P] Add missing MIGRATION/CONTRACT/VIPER comment tags to all migrated files
- [ ] T088 [P] Remove any unused imports or dead code from migration
- [ ] T089 Performance audit - verify page load times within 10% of PMC baseline
- [ ] T090 Run quickstart.md validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1 (Seller Dashboard), US2 (Products/Purchase), US3 (Auth) are all P1 - can proceed in parallel
  - US4 (Support/Forums), US5 (Become Seller), User Dashboard are P2 - can proceed after P1 or in parallel
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (Seller Dashboard)**: Requires auth to be functional for seller login; can share auth context with US3
- **User Story 2 (Products/Purchase)**: Independent; uses shared API client and types
- **User Story 3 (Auth)**: No dependencies on other stories; provides auth foundation
- **User Story 4 (Support/Forums)**: Independent; may require auth for posting
- **User Story 5 (Become Seller)**: Requires auth context
- **User Dashboard**: Requires auth context

### Within Each User Story

- API modules before components (components depend on API)
- Components before pages (pages compose components)
- Shared components can be built in parallel

### Parallel Opportunities

- All Phase 1 tasks can run in parallel
- All Phase 2 tasks marked [P] can run in parallel
- Once Foundational phase completes, all P1 user stories can start in parallel
- Within each user story, all [P] tasks can run in parallel
- Different user stories can be worked on by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all API modules in parallel:
Task: "Create seller API module in lib/api/seller.ts"
Task: "Create Product type exports in lib/api/products.ts"
Task: "Create Order type exports in lib/api/orders.ts"

# Launch all components in parallel:
Task: "Create SellerDashboardOverview component"
Task: "Create SellerProductList component"
Task: "Create SellerProductForm component"
Task: "Create SellerOrderList component"
Task: "Create SellerAnalytics component"

# Then create pages sequentially (depend on components):
Task: "Create seller dashboard main page"
Task: "Create seller products page"
Task: "Create seller orders page"
Task: "Create seller analytics page"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 5: User Story 3 (Auth) - enables all authenticated features
4. Complete Phase 3: User Story 1 (Seller Dashboard) - core business value
5. **STOP and VALIDATE**: Test seller flow end-to-end
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Auth (US3) → Users can sign in/up
3. Seller Dashboard (US1) → Sellers can manage their business
4. Products/Purchase (US2) → Buyers can shop
5. Support/Forums (US4) → Community features
6. Become Seller (US5) → Growth features
7. User Dashboard → Complete user experience

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 3 (Auth) then User Story 1 (Seller)
   - Developer B: User Story 2 (Products/Purchase)
   - Developer C: User Story 4 (Support) + User Story 5 (Become Seller)
3. Stories complete and integrate via shared API client and AuthContext

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- All API calls must match contracts/api-endpoints.md exactly (CONTRACT freeze)
- All components must use PMC Engine design tokens (STYLING policy)
- No header/footer imports from PMC (DASHBOARD-ONLY policy)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
