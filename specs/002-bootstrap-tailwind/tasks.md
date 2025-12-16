# Tasks: Module CSS to Tailwind CSS Migration

**Input**: Scan of all `*.module.css` files in the codebase
**Goal**: Convert all remaining CSS modules to Tailwind CSS + Ant Design components

**Status**: Marketplace components COMPLETED, 31 module.css files remaining

**Tests**: Not requested - no test tasks included

**Organization**: Tasks grouped by page/area to enable independent implementation and verification

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which area this task belongs to (US1=Shared, US2=Auth, US3=Profile, etc.)
- Include exact file paths in descriptions

---

## Phase 1: Setup (COMPLETED)

**Purpose**: Configuration and tooling preparation

- [x] T001 Tailwind CSS 4 configuration with custom theme tokens
- [x] T002 AntD theme provider configured in app/layout.tsx
- [x] T003 globals.css reduced to ~270 lines with essential utilities

**Checkpoint**: Foundation ready

---

## Phase 2: Marketplace Components (COMPLETED)

**Status**: All 15 marketplace module.css files converted and deleted

- [x] T004 ProductCard.tsx converted to Tailwind, ProductCard.module.css deleted
- [x] T005 ServiceCard.tsx converted to Tailwind, ServiceCard.module.css deleted
- [x] T006 SearchBar.tsx converted to Tailwind, SearchBar.module.css deleted
- [x] T007 SearchModal.tsx converted to Tailwind, SearchModal.module.css deleted
- [x] T008 SidebarFilter.tsx converted to Tailwind, SidebarFilter.module.css deleted
- [x] T009 ListingToggle.tsx converted to Tailwind, ListingToggle.module.css deleted
- [x] T010 Ribbon.tsx converted to Tailwind, Ribbon.module.css deleted
- [x] T011 ReviewStars.tsx converted to Tailwind, ReviewStars.module.css deleted
- [x] T012 ProductsCarousel.tsx converted to Tailwind, ProductsCarousel.module.css deleted
- [x] T013 ServicesCarousel.tsx converted to Tailwind, ServicesCarousel.module.css deleted
- [x] T014 ProductCardSkeleton.tsx converted to Tailwind, ProductCardSkeleton.module.css deleted
- [x] T015 ServiceCardSkeleton.tsx converted to Tailwind, ServiceCardSkeleton.module.css deleted
- [x] T016 FilterBar.module.css deleted
- [x] T017 CategorySection.module.css deleted
- [x] T018 page.module.css (marketplace) deleted

**Checkpoint**: Marketplace fully converted - 15 files removed, ~2000 lines CSS deleted

---

## Phase 3: Shared Components (Priority: P1) 🎯 NEXT

**Goal**: Convert shared components used across multiple pages

**Independent Test**: Verify shared components render correctly across all pages

### Implementation

- [ ] T019 [P] [US1] Convert Modal.tsx in components/pmc-migrated/shared/modal/, delete Modal.module.css
- [ ] T020 [P] [US1] Convert Avatar.tsx in components/pmc-migrated/shared/avatar/, delete Avatar.module.css
- [ ] T021 [P] [US1] Convert PageLayout.tsx in components/pmc-migrated/shared/page-layout/, delete PageLayout.module.css
- [ ] T022 [P] [US1] Convert Search component in components/pmc-migrated/shared/search/, delete search.module.css
- [ ] T023 [P] [US1] Convert Shorting component in components/pmc-migrated/shared/shorting/, delete shorting.module.css

**Checkpoint**: Shared components ready - 5 files

---

## Phase 4: Auth Pages (Priority: P2)

**Goal**: Convert authentication page styles to Tailwind

**Independent Test**: Login, signup, password recovery pages render correctly

### Implementation

- [ ] T024 [US2] Convert auth styles in app/auth/ pages to Tailwind, delete app/auth/auth.module.css

**Checkpoint**: Auth pages converted - 1 file

---

## Phase 5: Profile Components (Priority: P3)

**Goal**: Convert profile section components to Tailwind

**Independent Test**: Profile page displays correctly with all sections

### Implementation

- [ ] T025 [P] [US3] Convert ProfileHeaderSection.tsx, delete ProfileHeaderSection.module.css
- [ ] T026 [P] [US3] Convert ProfileAboutSection.tsx, delete ProfileAboutSection.module.css
- [ ] T027 [P] [US3] Convert MetaInfoSection.tsx, delete MetaInfoSection.module.css
- [ ] T028 [P] [US3] Convert SkillsSection.tsx, delete SkillsSection.module.css
- [ ] T029 [P] [US3] Convert ProfileCard.tsx, delete ProfileCard.module.css
- [ ] T030 [US3] Convert my-profile page, delete app/my-profile/page.module.css

**Checkpoint**: Profile pages converted - 6 files

---

## Phase 6: Job List & Details (Priority: P4)

**Goal**: Convert job listing pages and components to Tailwind

**Independent Test**: Job list page, job cards, and job details display correctly

### Implementation

- [ ] T031 [P] [US4] Convert JobCard in components/pmc-migrated/job-list/job-card.tsx, delete JobCard.module.css
- [ ] T032 [P] [US4] Convert JobListPage.tsx, delete JobListPage.module.css
- [ ] T033 [P] [US4] Convert JobDetailDrawer.tsx, delete JobDetailDrawer.module.css
- [ ] T034 [P] [US4] Convert JobDetailsPage.tsx, delete JobDetailsPage.module.css
- [ ] T035 [US4] Convert JobPost page, delete app/user/job-post/JobPost.module.css

**Checkpoint**: Job pages converted - 5 files

---

## Phase 7: Product & Service List Pages (Priority: P5)

**Goal**: Convert product and service list pages to Tailwind

**Independent Test**: Product list and service list pages render correctly

### Implementation

- [ ] T036 [P] [US5] Convert product-list page, delete app/product-list/page.module.css
- [ ] T037 [P] [US5] Convert service-list page, delete app/service-list/page.module.css

**Checkpoint**: List pages converted - 2 files

---

## Phase 8: Checkout Components (Priority: P6)

**Goal**: Convert checkout flow components to Tailwind

**Independent Test**: Checkout stepper and payment forms display correctly

### Implementation

- [ ] T038 [P] [US6] Convert Stepper.tsx, delete Stepper.module.css
- [ ] T039 [P] [US6] Convert PmcStripe.tsx, delete PmcStripe.module.css

**Checkpoint**: Checkout components converted - 2 files

---

## Phase 9: Settings & Notifications (Priority: P7)

**Goal**: Convert settings and notifications to Tailwind

**Independent Test**: Settings page and notifications display correctly

### Implementation

- [ ] T040 [P] [US7] Convert settings styles, delete settings.module.css
- [ ] T041 [P] [US7] Convert notifications, delete notifications.module.css

**Checkpoint**: Settings/Notifications converted - 2 files

---

## Phase 10: Support Pages (Priority: P8)

**Goal**: Convert support pages to Tailwind

**Independent Test**: Support pages display correctly

### Implementation

- [ ] T042 [P] [US8] Convert support-requests page, delete app/support-requests/page.module.css
- [ ] T043 [P] [US8] Convert support-contact page, delete app/support-contact/page.module.css

**Checkpoint**: Support pages converted - 2 files

---

## Phase 11: Seller Registration (Priority: P9)

**Goal**: Convert seller registration flow to Tailwind

**Independent Test**: Seller registration wizard displays correctly

### Implementation

- [ ] T044 [US9] Convert SellerRegistration components, delete SellerRegistration.module.css

**Checkpoint**: Seller registration converted - 1 file

---

## Phase 12: Dashboard Home (Priority: P10)

**Goal**: Convert dashboard home to Tailwind

**Independent Test**: Dashboard home displays correctly

### Implementation

- [ ] T045 [US10] Convert DashboardHome, delete DashboardHome.module.css

**Checkpoint**: Dashboard home converted - 1 file

---

## Phase 13: Service Details (Priority: P11)

**Goal**: Convert service details order cart sidebar to Tailwind

**Independent Test**: Service details order cart displays correctly

### Implementation

- [ ] T046 [US11] Convert OrderCartSidebar.tsx, delete OrderCartSidebar.module.css

**Checkpoint**: Service details converted - 1 file

---

## Phase 14: Home Page (Priority: P12)

**Goal**: Convert home page components to Tailwind

**Independent Test**: Home page displays correctly

### Implementation

- [ ] T047 [US12] Convert home styles, delete home.module.css

**Checkpoint**: Home page converted - 1 file

---

## Phase 15: Forum (Priority: P13)

**Goal**: Convert forum components to Tailwind

**Independent Test**: Forum pages display correctly

### Implementation

- [ ] T048 [US13] Convert forum styles, delete forum.module.css

**Checkpoint**: Forum converted - 1 file

---

## Phase 16: Chat (Priority: P14) ⚠️ CAUTION

**Goal**: Convert chat components to Tailwind (CAREFUL - previously had scroll issues)

**Independent Test**: Chat interface displays correctly with proper scroll and input visibility

### Implementation

- [ ] T049 [US14] Convert chat styles, delete chat.module.css (PRESERVE scroll/layout behavior!)

**Checkpoint**: Chat converted - 1 file

---

## Phase 17: Final Validation

**Purpose**: Verify all module.css files are removed

- [ ] T050 Run `find . -name "*.module.css" -path "*/pmc-migrated/*"` to verify no files remain
- [ ] T051 Run `npm run build` to verify no build errors
- [ ] T052 Manual testing of all converted pages
- [ ] T053 Git commit with summary of all conversions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1-2 (Setup + Marketplace)**: COMPLETED
- **Phase 3 (Shared)**: Can start immediately - BLOCKS pages that use shared components
- **Phase 4-16**: All depend on Phase 3 (Shared Components)
  - Can proceed in parallel (different pages/components)
  - Or sequentially in priority order
- **Phase 17 (Validation)**: Depends on all phases complete

### Parallel Opportunities

After Phase 3 (Shared Components) is complete, ALL remaining phases can run in parallel:
- Different developers can work on different pages simultaneously
- Within each phase, [P] marked tasks can run in parallel

---

## Summary

| Phase | Area | Files | Priority | Status |
|-------|------|-------|----------|--------|
| 1-2 | Setup + Marketplace | 18 | - | DONE |
| 3 | Shared Components | 5 | P1 | NEXT |
| 4 | Auth Pages | 1 | P2 | Pending |
| 5 | Profile Components | 6 | P3 | Pending |
| 6 | Job List & Details | 5 | P4 | Pending |
| 7 | Product/Service List | 2 | P5 | Pending |
| 8 | Checkout | 2 | P6 | Pending |
| 9 | Settings/Notifications | 2 | P7 | Pending |
| 10 | Support Pages | 2 | P8 | Pending |
| 11 | Seller Registration | 1 | P9 | Pending |
| 12 | Dashboard Home | 1 | P10 | Pending |
| 13 | Service Details | 1 | P11 | Pending |
| 14 | Home Page | 1 | P12 | Pending |
| 15 | Forum | 1 | P13 | Pending |
| 16 | Chat | 1 | P14 | Pending |
| **Remaining** | | **31** | | |

---

## Implementation Strategy

### Recommended Order for Single Developer

1. **Shared Components (Phase 3)** - Must do first, used by other pages
2. **Auth Pages (Phase 4)** - High visibility, simple
3. **Profile (Phase 5)** - User-facing, 6 files
4. **Job List (Phase 6)** - Core feature, 5 files
5. **Product/Service List (Phase 7)** - Core feature, 2 files
6. **Checkout (Phase 8)** - Critical flow, 2 files
7. Continue with remaining in priority order...
8. **Chat (Phase 16)** - Do last, requires careful testing

### File Count Summary

- **Completed**: 18 files (marketplace)
- **Remaining**: 31 files
- **Total**: 49 module.css files to convert

---

## Notes

- [P] tasks = different files, no dependencies - can run in parallel
- [Story] label maps task to specific area for traceability
- Chat component (Phase 16) requires special care - previously had scroll issues
- Commit after each component migration
- Stop at any checkpoint to validate independently
