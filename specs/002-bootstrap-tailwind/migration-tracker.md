# Component Migration Tracker

**Feature**: Bootstrap to Tailwind Migration
**Created**: 2025-12-16
**Status**: In Progress

## Legend

- ⬜ Not Started
- 🟡 In Progress
- ✅ Completed
- ⏭️ Skipped (not needed)

---

## Phase 1: Setup

| Task | Component/File | Status | Notes |
|------|----------------|--------|-------|
| T001 | tailwind.config.ts | ✅ | Already configured via @theme in globals.css |
| T002 | app/layout.tsx (AntD theme) | ✅ | PMCTheme already configured |
| T003 | migration-tracker.md | ✅ | This file |
| T004 | Baseline screenshots | ⬜ | Manual task |
| T005 | ESLint Bootstrap detection | ⬜ | |

---

## Phase 2: Foundational

| Task | Component/File | Status | Notes |
|------|----------------|--------|-------|
| T006 | globals.css audit | ⬜ | |
| T007 | globals-new.css | ⬜ | |
| T008 | CSS variables extraction | ⬜ | |
| T009 | Monaco editor overrides | ⬜ | |
| T010 | pmc-button.tsx | ⬜ | |
| T011 | pmc-input.tsx | ⬜ | |
| T012 | pmc-select.tsx | ⬜ | |
| T013 | pmc-modal.tsx | ⬜ | |

---

## Phase 3: US1 - Marketplace Components

### Marketplace (14 components)

| Task | Component | Status | Bootstrap Classes Found |
|------|-----------|--------|------------------------|
| T014 | ProductCard.tsx | ⬜ | |
| T015 | ServiceCard.tsx | ⬜ | |
| T016 | ProductsCarousel.tsx | ⬜ | |
| T017 | ProductCardSkeleton.tsx | ⬜ | |
| T018 | ServicesCarousel.tsx | ⬜ | |
| T019 | ServiceCardSkeleton.tsx | ⬜ | |
| T020 | SearchBar.tsx | ⬜ | |
| T021 | SearchModal.tsx | ⬜ | |
| T022 | FilterBar.tsx | ⬜ | |
| T023 | SidebarFilter.tsx | ⬜ | |
| T024 | CategorySection.tsx | ⬜ | |
| T025 | ListingToggle.tsx | ⬜ | |
| T026 | ReviewStars.tsx | ⬜ | |
| T027 | Ribbon.tsx | ⬜ | |

### Product Details (12 components)

| Task | Component | Status | Bootstrap Classes Found |
|------|-----------|--------|------------------------|
| T028 | ProductDetailsPage.tsx | ⬜ | |
| T029 | ItemHeader.tsx | ⬜ | |
| T030 | ItemDescription.tsx | ⬜ | |
| T031 | PriceBox.tsx | ⬜ | |
| T032 | Reviews.tsx | ⬜ | |
| T033 | Comments.tsx | ⬜ | |
| T034 | CommentForm.tsx | ⬜ | |
| T035 | ItemAttributes.tsx | ⬜ | |
| T036 | ItemSocialShare.tsx | ⬜ | |
| T037 | ProductPreview.tsx | ⬜ | |
| T038 | RelatedProductsCarousel.tsx | ⬜ | |
| T039 | CommunityBadgesCard.tsx | ⬜ | |

### Service Details (14 components)

| Task | Component | Status | Bootstrap Classes Found |
|------|-----------|--------|------------------------|
| T040 | ServiceDetailsPage.tsx | ⬜ | |
| T041 | ServiceHeader.tsx | ⬜ | |
| T042 | ServiceDescription.tsx | ⬜ | |
| T043 | ServicePackages.tsx | ⬜ | |
| T044 | PackageComparisonTable.tsx | ⬜ | |
| T045 | PackageDetails.tsx | ⬜ | |
| T046 | ServiceGallery.tsx | ⬜ | |
| T047 | ServiceFAQ.tsx | ⬜ | |
| T048 | ServiceReviews.tsx | ⬜ | |
| T049 | SellerCard.tsx | ⬜ | |
| T050 | OrderCartSidebar.tsx | ⬜ | |
| T051 | RelatedServicesCarousel.tsx | ⬜ | |
| T052 | ServiceSocialShare.tsx | ⬜ | |
| T053 | InputSpinner.tsx | ⬜ | |

---

## Phase 4: US2 - Custom Global CSS Removal

### Profile Components (5)

| Task | Component | Status | CSS Module Deleted |
|------|-----------|--------|-------------------|
| T054 | ProfileCard.tsx | ⬜ | |
| T055 | ProfileHeaderSection.tsx | ⬜ | |
| T056 | ProfileAboutSection.tsx | ⬜ | |
| T057 | SkillsSection.tsx | ⬜ | |
| T058 | MetaInfoSection.tsx | ⬜ | |

### Checkout Components (9)

| Task | Component | Status | CSS Module Deleted |
|------|-----------|--------|-------------------|
| T059 | Cart.tsx | ⬜ | |
| T060 | CartItem.tsx | ⬜ | |
| T061 | Stepper.tsx | ⬜ | |
| T062 | Payment.tsx | ⬜ | |
| T063 | BillingModal.tsx | ⬜ | |
| T064 | CheckoutComplete.tsx | ⬜ | |
| T065 | PmcStripe.tsx | ⬜ | |
| T066 | PmcWallet.tsx | ⬜ | |
| T067 | InputSpinner.tsx | ⬜ | |

### Shared Components (7)

| Task | Component | Status | CSS Module Deleted |
|------|-----------|--------|-------------------|
| T068 | Modal.tsx | ⬜ | |
| T069 | Avatar.tsx | ⬜ | |
| T070 | PageLayout.tsx | ⬜ | |
| T071 | LoadingState.tsx | ⬜ | |
| T072 | ErrorBoundary.tsx | ⬜ | |
| T073 | sidebar-filter.tsx | ⬜ | |
| T074 | search.tsx | ⬜ | |

### Global CSS Cleanup

| Task | Section | Status | Lines Removed |
|------|---------|--------|---------------|
| T075 | Bootstrap utilities (543-700) | ⬜ | |
| T076 | Bootstrap grid (1068-1259) | ⬜ | |
| T077 | Bootstrap modal (1388-1509) | ⬜ | |
| T078 | Bootstrap button (1511-1565) | ⬜ | |
| T079 | Custom button classes | ⬜ | |
| T080 | Font size utilities | ⬜ | |
| T081 | Background color utilities | ⬜ | |
| T082 | Swap globals.css | ⬜ | |

---

## Summary Metrics

| Metric | Target | Current |
|--------|--------|---------|
| globals.css lines | ~50 | 4374 |
| Bootstrap class occurrences | 0 | ~1195 |
| CSS Module files | ≤5 | 33 |
| Custom global classes | 0 | ~200 |
| Components migrated | 129 | 0 |

---

## CSS Module Exceptions (Max 5)

| File | Reason | Approved |
|------|--------|----------|
| (none yet) | | |

---

## Notes

- Update this tracker as components are migrated
- Mark CSS Modules for deletion only after visual verification
- Document any exceptions with justification
