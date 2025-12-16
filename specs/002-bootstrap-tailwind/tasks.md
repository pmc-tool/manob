# Tasks: Bootstrap to Tailwind Migration

**Input**: Design documents from `/specs/002-bootstrap-tailwind/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested - no test tasks included

**Organization**: Tasks grouped by user story to enable independent implementation and verification

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Project type**: Next.js App Router
- **CSS files**: `app/globals.css`, `components/**/*.module.css`
- **Components**: `components/pmc-migrated/**/*.tsx`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Configuration and tooling preparation before migration begins

- [x] T001 Create Tailwind CSS 4 configuration file at tailwind.config.ts with custom theme tokens (pmc-primary, pmc-link, background colors)
- [x] T002 Configure AntD theme provider in app/layout.tsx with ConfigProvider using brand colors (colorPrimary: #e54d2e, borderRadius: 6)
- [x] T003 [P] Create component migration tracking spreadsheet or checklist in specs/002-bootstrap-tailwind/migration-tracker.md
- [x] T004 [P] Capture baseline screenshots of all pages for visual regression testing (marketplace, product-details, service-details, profile, checkout, settings)
- [x] T005 [P] Add ESLint rule or script to detect Bootstrap class usage in components

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before component migration

**⚠️ CRITICAL**: No component migration can begin until globals.css foundation is established

- [x] T006 Audit app/globals.css and document all sections with line ranges (Bootstrap utilities, custom classes, retain sections)
- [x] T007 Create minimal globals.css structure in app/globals-new.css with only: @import "tailwindcss", @import "tw-animate-css", @import "@vscode/codicons/dist/codicon.css"
- [x] T008 Extract essential CSS variables (@theme inline block) from current globals.css to globals-new.css
- [x] T009 Extract Monaco editor overrides from globals.css to globals-new.css (required for code editor)
- [x] T010 Create reusable button components at components/ui/pmc-button.tsx replacing .ud-btn, .btn-thm patterns with AntD Button
- [x] T011 [P] Create reusable form input component at components/ui/pmc-input.tsx replacing .form-control with AntD Input
- [x] T012 [P] Create reusable select component at components/ui/pmc-select.tsx replacing .form-select with AntD Select
- [x] T013 [P] Create reusable modal component at components/ui/pmc-modal.tsx replacing Bootstrap modal patterns with AntD Modal

**Checkpoint**: Foundation ready - globals.css structure established, reusable components created

---

## Phase 3: User Story 1 - Developer Removes Bootstrap from Component (Priority: P1) 🎯 MVP

**Goal**: Migrate core marketplace components from Bootstrap classes to Tailwind utilities

**Independent Test**: Visit /marketplace, verify all components render correctly with no Bootstrap classes

### Marketplace Components Migration (14 components)

- [ ] T014 [P] [US1] Migrate ProductCard.tsx at components/pmc-migrated/marketplace/product-card/ - replace d-flex, col-*, btn-* with Tailwind
- [ ] T015 [P] [US1] Migrate ServiceCard.tsx at components/pmc-migrated/marketplace/service-card/ - replace Bootstrap grid with Tailwind flex/grid
- [ ] T016 [P] [US1] Migrate ProductsCarousel.tsx at components/pmc-migrated/marketplace/products-carousel/ - replace Bootstrap spacing with Tailwind
- [ ] T017 [P] [US1] Migrate ProductCardSkeleton.tsx at components/pmc-migrated/marketplace/products-carousel/ - replace Bootstrap classes
- [ ] T018 [P] [US1] Migrate ServicesCarousel.tsx at components/pmc-migrated/marketplace/services-carousel/ - replace Bootstrap classes
- [ ] T019 [P] [US1] Migrate ServiceCardSkeleton.tsx at components/pmc-migrated/marketplace/services-carousel/ - replace Bootstrap classes
- [ ] T020 [P] [US1] Migrate SearchBar.tsx at components/pmc-migrated/marketplace/search-bar/ - replace form-control with AntD Input
- [ ] T021 [P] [US1] Migrate SearchModal.tsx at components/pmc-migrated/marketplace/search-bar/ - replace modal-* with AntD Modal
- [ ] T022 [P] [US1] Migrate FilterBar.tsx at components/pmc-migrated/marketplace/filter-bar/ - replace d-flex, justify-content-* with Tailwind
- [ ] T023 [P] [US1] Migrate SidebarFilter.tsx at components/pmc-migrated/marketplace/sidebar-filter/ - replace Bootstrap utilities
- [ ] T024 [P] [US1] Migrate CategorySection.tsx at components/pmc-migrated/marketplace/category-section/ - replace row/col with Tailwind grid
- [ ] T025 [P] [US1] Migrate ListingToggle.tsx at components/pmc-migrated/marketplace/listing-toggle/ - replace btn-* with AntD Button
- [ ] T026 [P] [US1] Migrate ReviewStars.tsx at components/pmc-migrated/marketplace/review-stars/ - replace Bootstrap utilities
- [ ] T027 [P] [US1] Migrate Ribbon.tsx at components/pmc-migrated/marketplace/ribbon/ - replace position-* with Tailwind

### Product/Service Details Components Migration

- [ ] T028 [P] [US1] Migrate ProductDetailsPage.tsx at components/pmc-migrated/product-details/ - replace container, row, col-lg-* with Tailwind
- [ ] T029 [P] [US1] Migrate ItemHeader.tsx at components/pmc-migrated/product-details/ - replace d-flex, align-items-* with Tailwind
- [ ] T030 [P] [US1] Migrate ItemDescription.tsx at components/pmc-migrated/product-details/ - replace Bootstrap typography classes
- [ ] T031 [P] [US1] Migrate PriceBox.tsx at components/pmc-migrated/product-details/ - replace btn-primary, form-* with AntD
- [ ] T032 [P] [US1] Migrate Reviews.tsx at components/pmc-migrated/product-details/ - replace Bootstrap spacing and flex
- [ ] T033 [P] [US1] Migrate Comments.tsx at components/pmc-migrated/product-details/ - replace Bootstrap utilities
- [ ] T034 [P] [US1] Migrate CommentForm.tsx at components/pmc-migrated/product-details/ - replace form-control with AntD
- [ ] T035 [P] [US1] Migrate ItemAttributes.tsx at components/pmc-migrated/product-details/ - replace Bootstrap grid
- [ ] T036 [P] [US1] Migrate ItemSocialShare.tsx at components/pmc-migrated/product-details/ - replace d-flex with Tailwind
- [ ] T037 [P] [US1] Migrate ProductPreview.tsx at components/pmc-migrated/product-details/ - replace Bootstrap classes
- [ ] T038 [P] [US1] Migrate RelatedProductsCarousel.tsx at components/pmc-migrated/product-details/ - replace Bootstrap classes
- [ ] T039 [P] [US1] Migrate CommunityBadgesCard.tsx at components/pmc-migrated/product-details/ - replace Bootstrap card classes

### Service Details Components Migration

- [ ] T040 [P] [US1] Migrate ServiceDetailsPage.tsx at components/pmc-migrated/service-details/ - replace container, row, col with Tailwind
- [ ] T041 [P] [US1] Migrate ServiceHeader.tsx at components/pmc-migrated/service-details/ - replace d-flex, justify-content with Tailwind
- [ ] T042 [P] [US1] Migrate ServiceDescription.tsx at components/pmc-migrated/service-details/ - replace Bootstrap typography
- [ ] T043 [P] [US1] Migrate ServicePackages.tsx at components/pmc-migrated/service-details/ - replace Bootstrap tabs, btn-* with AntD
- [ ] T044 [P] [US1] Migrate PackageComparisonTable.tsx at components/pmc-migrated/service-details/ - replace Bootstrap table with AntD Table
- [ ] T045 [P] [US1] Migrate PackageDetails.tsx at components/pmc-migrated/service-details/ - replace Bootstrap card
- [ ] T046 [P] [US1] Migrate ServiceGallery.tsx at components/pmc-migrated/service-details/ - replace Bootstrap grid
- [ ] T047 [P] [US1] Migrate ServiceFAQ.tsx at components/pmc-migrated/service-details/ - replace Bootstrap accordion with AntD Collapse
- [ ] T048 [P] [US1] Migrate ServiceReviews.tsx at components/pmc-migrated/service-details/ - replace Bootstrap spacing
- [ ] T049 [P] [US1] Migrate SellerCard.tsx at components/pmc-migrated/service-details/ - replace Bootstrap card with Tailwind
- [ ] T050 [P] [US1] Migrate OrderCartSidebar.tsx at components/pmc-migrated/service-details/ - replace Bootstrap utilities
- [ ] T051 [P] [US1] Migrate RelatedServicesCarousel.tsx at components/pmc-migrated/service-details/ - replace Bootstrap carousel
- [ ] T052 [P] [US1] Migrate ServiceSocialShare.tsx at components/pmc-migrated/service-details/ - replace d-flex with Tailwind
- [ ] T053 [P] [US1] Migrate InputSpinner.tsx at components/pmc-migrated/service-details/ - replace form-control with AntD InputNumber

**Checkpoint**: Core marketplace and detail pages migrated - verify at /marketplace, /product-details/[slug], /service-details/[slug]

---

## Phase 4: User Story 2 - Developer Removes Custom Global CSS (Priority: P1)

**Goal**: Remove custom global CSS classes from components and delete definitions from globals.css

**Independent Test**: Verify globals.css contains only Tailwind directives and essential overrides

### Profile Components Migration (5 components + CSS Modules)

- [ ] T054 [P] [US2] Migrate ProfileCard.tsx at components/pmc-migrated/profile/profile-card/ - remove custom CSS classes, delete ProfileCard.module.css
- [ ] T055 [P] [US2] Migrate ProfileHeaderSection.tsx at components/pmc-migrated/profile/profile-header/ - remove custom classes, delete module.css
- [ ] T056 [P] [US2] Migrate ProfileAboutSection.tsx at components/pmc-migrated/profile/profile-about/ - remove custom classes, delete module.css
- [ ] T057 [P] [US2] Migrate SkillsSection.tsx at components/pmc-migrated/profile/skills-section/ - remove custom classes, delete module.css
- [ ] T058 [P] [US2] Migrate MetaInfoSection.tsx at components/pmc-migrated/profile/meta-info/ - remove custom classes, delete module.css

### Checkout Components Migration (9 components + CSS Modules)

- [ ] T059 [P] [US2] Migrate Cart.tsx at components/pmc-migrated/checkout/ - remove ud-btn, btn-thm, use AntD Button
- [ ] T060 [P] [US2] Migrate CartItem.tsx at components/pmc-migrated/checkout/ - remove custom cart-item classes
- [ ] T061 [P] [US2] Migrate Stepper.tsx at components/pmc-migrated/checkout/ - replace with AntD Steps, delete Stepper.module.css
- [ ] T062 [P] [US2] Migrate Payment.tsx at components/pmc-migrated/checkout/ - remove form-control, btn-*, use AntD
- [ ] T063 [P] [US2] Migrate BillingModal.tsx at components/pmc-migrated/checkout/ - replace modal-* with AntD Modal
- [ ] T064 [P] [US2] Migrate CheckoutComplete.tsx at components/pmc-migrated/checkout/ - remove custom classes
- [ ] T065 [P] [US2] Migrate PmcStripe.tsx at components/pmc-migrated/checkout/ - remove custom classes, delete module.css
- [ ] T066 [P] [US2] Migrate PmcWallet.tsx at components/pmc-migrated/checkout/ - remove custom classes
- [ ] T067 [P] [US2] Migrate InputSpinner.tsx at components/pmc-migrated/checkout/ - replace with AntD InputNumber

### Shared Components Migration (7 components + CSS Modules)

- [ ] T068 [P] [US2] Migrate Modal.tsx at components/pmc-migrated/shared/modal/ - replace with AntD Modal, delete Modal.module.css
- [ ] T069 [P] [US2] Migrate Avatar.tsx at components/pmc-migrated/shared/avatar/ - remove custom classes, delete Avatar.module.css
- [ ] T070 [P] [US2] Migrate PageLayout.tsx at components/pmc-migrated/shared/page-layout/ - replace container, delete module.css
- [ ] T071 [P] [US2] Migrate LoadingState.tsx at components/pmc-migrated/shared/ - replace with AntD Spin
- [ ] T072 [P] [US2] Migrate ErrorBoundary.tsx at components/pmc-migrated/shared/ - replace alert-* with AntD Alert
- [ ] T073 [P] [US2] Migrate sidebar-filter.tsx at components/pmc-migrated/shared/sidebar-filter/ - remove custom classes
- [ ] T074 [P] [US2] Migrate search.tsx at components/pmc-migrated/shared/search/ - replace form-control with AntD

### Global CSS Cleanup

- [ ] T075 [US2] Remove Bootstrap-compatible utilities section (lines 543-700) from app/globals.css
- [ ] T076 [US2] Remove Bootstrap grid system section (lines 1068-1259) from app/globals.css
- [ ] T077 [US2] Remove Bootstrap modal styles section (lines 1388-1509) from app/globals.css
- [ ] T078 [US2] Remove Bootstrap button styles section (lines 1511-1565) from app/globals.css
- [ ] T079 [US2] Remove custom button classes (.ud-btn, .btn-thm, .btn-soft-*) from app/globals.css
- [ ] T080 [US2] Remove font size utilities (.fz12, .fz14, etc.) from app/globals.css
- [ ] T081 [US2] Remove background color utilities (.bgc-*) from app/globals.css
- [ ] T082 [US2] Replace app/globals.css with app/globals-new.css (swap files)

**Checkpoint**: globals.css reduced to ~50 lines, all custom classes removed from components

---

## Phase 5: User Story 3 - Developer Applies Ant Design Patterns (Priority: P2)

**Goal**: Ensure migrated components follow AntD design patterns for consistency

**Independent Test**: Compare button, form, modal styling against Ant Design documentation

### Form Components with AntD Patterns

- [ ] T083 [P] [US3] Update seller-registration forms at components/pmc-migrated/seller-registration/ to use AntD Form, Input, Select patterns
- [ ] T084 [P] [US3] Migrate RegistrationStart.tsx with AntD Form layout and validation
- [ ] T085 [P] [US3] Migrate ChooseCategories.tsx with AntD Checkbox.Group or Select
- [ ] T086 [P] [US3] Migrate Skills.tsx with AntD Tag or Select mode="tags"
- [ ] T087 [P] [US3] Migrate SellerStepper.tsx with AntD Steps component
- [ ] T088 [P] [US3] Migrate SellFormPrompt.tsx with AntD Alert or Card
- [ ] T089 [P] [US3] Migrate SellerHeader.tsx with AntD typography patterns

### Settings Pages with AntD Patterns

- [ ] T090 [P] [US3] Migrate SecurityPage.tsx at components/pmc-migrated/settings/ with AntD Form, Switch
- [ ] T091 [P] [US3] Migrate NotificationPage.tsx with AntD Switch, Checkbox patterns
- [ ] T092 [P] [US3] Migrate LoginActivityPage.tsx with AntD Table for activity list
- [ ] T093 [P] [US3] Migrate SettingsNav.tsx with AntD Menu component

### Forum Components with AntD Patterns

- [ ] T094 [P] [US3] Migrate QuestionsPage.tsx at components/pmc-migrated/forum/ with AntD List, Pagination
- [ ] T095 [P] [US3] Migrate QuestionCard.tsx with AntD Card component
- [ ] T096 [P] [US3] Migrate QuestionDetailPage.tsx with AntD Typography, Divider
- [ ] T097 [P] [US3] Migrate AskQuestionPage.tsx with AntD Form, Input.TextArea
- [ ] T098 [P] [US3] Migrate CommentCard.tsx with AntD Comment or Card
- [ ] T099 [P] [US3] Migrate ForumSidebar.tsx with AntD Menu or Card patterns
- [ ] T100 [P] [US3] Migrate ForumSearch.tsx with AntD Input.Search

### Chat Components with AntD Patterns

- [ ] T101 [P] [US3] Migrate ChatApp.tsx at components/pmc-migrated/chat/ with AntD Layout
- [ ] T102 [P] [US3] Migrate ChatList.tsx with AntD List component
- [ ] T103 [P] [US3] Migrate ChatContent.tsx with AntD layout patterns
- [ ] T104 [P] [US3] Migrate MessageInput.tsx with AntD Input.TextArea, Button
- [ ] T105 [P] [US3] Migrate UserInfoSidebar.tsx with AntD Descriptions or Card

**Checkpoint**: All interactive components follow AntD patterns - consistent look and feel

---

## Phase 6: User Story 4 - Developer Handles Repeated Styling Patterns (Priority: P2)

**Goal**: Extract repeated patterns into reusable components or Tailwind config

**Independent Test**: Search codebase for duplicate styling patterns, verify extraction

### Home Page Components (8 components)

- [ ] T106 [P] [US4] Migrate HomePage.tsx at components/pmc-migrated/home/ - identify repeated patterns
- [ ] T107 [P] [US4] Migrate HeroSection.tsx - extract hero layout as reusable pattern
- [ ] T108 [P] [US4] Migrate HowItWorksSection.tsx - use consistent card pattern
- [ ] T109 [P] [US4] Migrate ShowcaseSection.tsx - use consistent grid pattern
- [ ] T110 [P] [US4] Migrate ServicesSection.tsx - reuse ServiceCard component
- [ ] T111 [P] [US4] Migrate CodePacksSection.tsx - reuse ProductCard component
- [ ] T112 [P] [US4] Migrate CTASection.tsx - extract CTA pattern as component
- [ ] T113 [P] [US4] Migrate MobileAppSection.tsx - use consistent layout

### Blog Components (8 components)

- [ ] T114 [P] [US4] Migrate BlogPage.tsx at components/pmc-migrated/blog/ - use AntD List
- [ ] T115 [P] [US4] Migrate BlogHeroCard.tsx - extract hero card pattern
- [ ] T116 [P] [US4] Migrate BlogFeaturedCard.tsx - use consistent card styling
- [ ] T117 [P] [US4] Migrate BlogGridCard.tsx - use consistent card styling
- [ ] T118 [P] [US4] Migrate BlogDetails.tsx - use AntD Typography
- [ ] T119 [P] [US4] Migrate RelatedPosts.tsx - reuse BlogGridCard
- [ ] T120 [P] [US4] Migrate ShareArticle.tsx - extract social share pattern
- [ ] T121 [P] [US4] Migrate Newsletter.tsx - use AntD Form, Input

### Job List Components (2 components)

- [ ] T122 [P] [US4] Migrate JobListPage.tsx at components/pmc-migrated/job-list/ - use AntD List
- [ ] T123 [P] [US4] Migrate job-card.tsx - extract job card as reusable component

### Other Feature Components

- [ ] T124 [P] [US4] Migrate DashboardHome.tsx at components/pmc-migrated/dashboard-home/ - use AntD Card, Statistic
- [ ] T125 [P] [US4] Migrate NotificationDropdown.tsx at components/pmc-migrated/notifications/ - use AntD Dropdown, List
- [ ] T126 [P] [US4] Migrate NotificationCard.tsx - use consistent card pattern
- [ ] T127 [P] [US4] Migrate ReferralPopup.tsx at components/pmc-migrated/referral/ - use AntD Modal

### Become Seller Components (7 components)

- [ ] T128 [P] [US4] Migrate BecomeSellerPage.tsx at components/pmc-migrated/become-seller/ - structure with reusable sections
- [ ] T129 [P] [US4] Migrate WhyChoosePackMyCode.tsx - use consistent feature card pattern
- [ ] T130 [P] [US4] Migrate PackmycodeWork.tsx - use consistent step pattern
- [ ] T131 [P] [US4] Migrate SellSection.tsx - reuse section layout
- [ ] T132 [P] [US4] Migrate ToolsSection.tsx - use consistent icon card pattern
- [ ] T133 [P] [US4] Migrate ReadyToEarn.tsx - reuse CTA pattern
- [ ] T134 [P] [US4] Migrate Accordion.tsx - replace with AntD Collapse

### Product Components (4 components)

- [ ] T135 [P] [US4] Migrate ProductGrid.tsx at components/pmc-migrated/product/ - use Tailwind grid
- [ ] T136 [P] [US4] Migrate CategoryList.tsx - use AntD Menu or List
- [ ] T137 [P] [US4] Migrate ProductCard.tsx - ensure matches marketplace ProductCard
- [ ] T138 [P] [US4] Migrate SearchResults.tsx - use AntD List, Empty

### Tailwind Config Updates

- [ ] T139 [US4] Add brand colors to tailwind.config.ts theme.extend.colors (pmc-primary, pmc-link, grays)
- [ ] T140 [US4] Add custom border-radius to tailwind.config.ts (pmc: 0.625rem)
- [ ] T141 [US4] Document all custom Tailwind tokens in specs/002-bootstrap-tailwind/tailwind-tokens.md

**Checkpoint**: Repeated patterns extracted, Tailwind config extended with custom tokens

---

## Phase 7: User Story 5 - Accessibility and Responsiveness Preserved (Priority: P1)

**Goal**: Verify all components maintain accessibility and responsive behavior

**Independent Test**: Tab through all interactive elements, test at 375px/768px/1280px viewports

### Accessibility Audit

- [ ] T142 [US5] Audit all Button components for focus-visible styling across codebase
- [ ] T143 [US5] Audit all form inputs for proper label association and focus states
- [ ] T144 [US5] Audit all Modal components for focus trap and ARIA attributes
- [ ] T145 [US5] Audit all navigation components for keyboard accessibility
- [ ] T146 [US5] Fix any accessibility issues found in audit (create sub-tasks as needed)

### Responsive Layout Verification

- [ ] T147 [US5] Test /marketplace page at 375px, 768px, 1280px viewports
- [ ] T148 [US5] Test /product-details/[slug] page responsiveness
- [ ] T149 [US5] Test /service-details/[slug] page responsiveness
- [ ] T150 [US5] Test /my-profile page responsiveness
- [ ] T151 [US5] Test /checkout page responsiveness
- [ ] T152 [US5] Test /settings/* pages responsiveness
- [ ] T153 [US5] Test / (home) page responsiveness
- [ ] T154 [US5] Fix any responsive layout issues found (create sub-tasks as needed)

**Checkpoint**: All pages accessible via keyboard, responsive across all breakpoints

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and validation

### CSS Module Cleanup

- [ ] T155 [P] Delete unused CSS Module files in components/pmc-migrated/marketplace/ (after migration verified)
- [ ] T156 [P] Delete unused CSS Module files in components/pmc-migrated/profile/ (after migration verified)
- [ ] T157 [P] Delete unused CSS Module files in components/pmc-migrated/shared/ (after migration verified)
- [ ] T158 [P] Delete unused CSS Module files in components/pmc-migrated/checkout/ (after migration verified)
- [ ] T159 [P] Delete app/marketplace/page.module.css (after migration verified)
- [ ] T160 [P] Delete app/service-list/page.module.css (after migration verified)
- [ ] T161 [P] Delete app/my-profile/page.module.css (after migration verified)
- [ ] T162 [P] Delete app/auth/auth.module.css (after migration verified)

### Documentation Updates

- [ ] T163 [P] Document CSS Module exceptions (max 5) in specs/002-bootstrap-tailwind/css-module-exceptions.md
- [ ] T164 [P] Update migration-tracker.md with final component status
- [ ] T165 Compare post-migration screenshots against baseline for visual regression

### Final Validation

- [ ] T166 Run grep for any remaining Bootstrap classes: grep -rE "d-flex|btn-primary|col-lg|modal-dialog" components/
- [ ] T167 Run grep for any remaining custom global classes: grep -rE "ud-btn|btn-thm|fz[0-9]+" components/
- [ ] T168 Verify globals.css line count is ≤100 lines
- [ ] T169 Run npm run build to verify no build errors
- [ ] T170 Measure build output size for comparison with baseline

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all component migration
- **User Story 1 (Phase 3)**: Depends on Phase 2 (reusable components created)
- **User Story 2 (Phase 4)**: Can run in parallel with US1, shares globals.css work
- **User Story 3 (Phase 5)**: Depends on Phase 3-4 (components exist to apply patterns)
- **User Story 4 (Phase 6)**: Can run in parallel with US3
- **User Story 5 (Phase 7)**: Depends on Phase 3-6 (components must be migrated first)
- **Polish (Phase 8)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: After Foundational - Core marketplace migration
- **User Story 2 (P1)**: After Foundational - Can parallel with US1, coordinated globals.css changes
- **User Story 3 (P2)**: After US1/US2 components exist - Applies AntD patterns
- **User Story 4 (P2)**: After US1/US2 - Extracts patterns from migrated components
- **User Story 5 (P1)**: After US1-4 - Verifies accessibility/responsiveness

### Within Each User Story

- All tasks marked [P] can run in parallel (different files)
- Tasks without [P] have sequential dependencies
- Complete all [P] tasks in a story before dependent tasks

### Parallel Opportunities

- **Phase 1**: T003, T004, T005 can run in parallel
- **Phase 2**: T011, T012, T013 can run in parallel (after T010)
- **Phase 3-6**: All tasks marked [P] within each story can run in parallel
- **Phase 7**: T147-T154 can run in parallel
- **Phase 8**: T155-T164 can run in parallel

---

## Parallel Example: User Story 1 (Marketplace)

```bash
# Launch all marketplace component migrations together:
Task: "Migrate ProductCard.tsx"
Task: "Migrate ServiceCard.tsx"
Task: "Migrate ProductsCarousel.tsx"
Task: "Migrate ServicesCarousel.tsx"
Task: "Migrate SearchBar.tsx"
Task: "Migrate FilterBar.tsx"
Task: "Migrate CategorySection.tsx"
# ... all 14 components in parallel
```

---

## Implementation Strategy

### MVP First (User Stories 1+2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Marketplace core)
4. Complete Phase 4: User Story 2 (Global CSS cleanup)
5. **STOP and VALIDATE**: Test /marketplace, /product-details, /service-details
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Marketplace) → Test → Deploy (MVP!)
3. Add US2 (Global CSS) → globals.css minimized → Deploy
4. Add US3 (AntD patterns) → Consistent design → Deploy
5. Add US4 (Extract patterns) → Maintainable code → Deploy
6. Add US5 (A11y/Responsive) → Quality validated → Deploy
7. Each story adds value without breaking previous

### Suggested MVP Scope

**Phase 1-4 (US1 + US2)**: Core migration delivering:
- All Bootstrap classes removed from core components
- globals.css reduced to minimal Tailwind config
- Visual parity maintained

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 170 |
| Phase 1 (Setup) | 5 tasks |
| Phase 2 (Foundational) | 8 tasks |
| Phase 3 (US1 - Bootstrap removal) | 40 tasks |
| Phase 4 (US2 - Custom CSS removal) | 29 tasks |
| Phase 5 (US3 - AntD patterns) | 23 tasks |
| Phase 6 (US4 - Pattern extraction) | 36 tasks |
| Phase 7 (US5 - A11y/Responsive) | 13 tasks |
| Phase 8 (Polish) | 16 tasks |
| Parallel opportunities | ~150 tasks marked [P] |

---

## Notes

- [P] tasks = different files, no dependencies - can run in parallel
- [Story] label maps task to specific user story for traceability
- Verify visual parity after each phase checkpoint
- Commit after each component migration
- Stop at any checkpoint to validate independently
- Avoid: modifying same file in parallel tasks
