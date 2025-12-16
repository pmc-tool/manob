# Research: Bootstrap to Tailwind Migration

**Feature**: Bootstrap to Tailwind Migration
**Date**: 2025-12-16

## Executive Summary

This document consolidates research findings for migrating from Bootstrap-compatible custom CSS to Tailwind CSS with Ant Design components. The migration involves ~4374 lines of global CSS and ~180 component files.

---

## 1. Bootstrap Class Mapping to Tailwind

### Decision: Direct Tailwind equivalents for Bootstrap utilities

**Rationale**: Tailwind CSS 4 provides direct equivalents for most Bootstrap utility classes, with slightly different naming conventions.

### Spacing Utilities

| Bootstrap | Tailwind | Notes |
|-----------|----------|-------|
| `.mt-0` to `.mt-5` | `mt-0`, `mt-2`, `mt-4`, `mt-6`, `mt-12` | Different scale (Tailwind uses 4px base) |
| `.mb-0` to `.mb-5` | `mb-0`, `mb-2`, `mb-4`, `mb-6`, `mb-12` | Bootstrap 3=1rem, Tailwind 4=1rem |
| `.ms-2`, `.me-2` | `ml-2`, `mr-2` | ms/me → ml/mr (start/end → left/right) |
| `.p-0` to `.p-4` | `p-0`, `p-2`, `p-4`, `p-6` | Similar mapping |
| `.px-3`, `.py-3` | `px-4`, `py-4` | Bootstrap 3=1rem, Tailwind 4=1rem |
| `.mx-auto` | `mx-auto` | Identical |
| `.gap-2`, `.gap-3` | `gap-2`, `gap-4` | Bootstrap 2=0.5rem, 3=1rem |

### Flexbox Utilities

| Bootstrap | Tailwind | Notes |
|-----------|----------|-------|
| `.d-flex` | `flex` | No prefix |
| `.d-inline-flex` | `inline-flex` | No prefix |
| `.d-block` | `block` | No prefix |
| `.d-none` | `hidden` | Different name |
| `.flex-column` | `flex-col` | Shorter name |
| `.flex-row` | `flex-row` | Identical |
| `.flex-wrap` | `flex-wrap` | Identical |
| `.flex-grow-1` | `grow` | Simplified |
| `.flex-shrink-0` | `shrink-0` | Similar |
| `.justify-content-center` | `justify-center` | Shorter |
| `.justify-content-between` | `justify-between` | Shorter |
| `.align-items-center` | `items-center` | Shorter |
| `.align-items-start` | `items-start` | Shorter |

### Grid System

| Bootstrap | Tailwind | Notes |
|-----------|----------|-------|
| `.container` | `container mx-auto px-4` | Built-in Tailwind container |
| `.row` | `flex flex-wrap -mx-3` | Manual flex grid |
| `.col-6` | `w-1/2` or `basis-1/2` | Fraction-based |
| `.col-12` | `w-full` | Full width |
| `.col-lg-4` | `lg:w-1/3` | Responsive prefix |
| `.col-lg-8` | `lg:w-2/3` | Responsive prefix |
| `.g-4` | `gap-6` | Gap utilities |

### Typography

| Bootstrap | Tailwind | Notes |
|-----------|----------|-------|
| `.fw-bold` | `font-bold` | Similar |
| `.fw-medium` | `font-medium` | Similar |
| `.fw-normal` | `font-normal` | Similar |
| `.fst-italic` | `italic` | Shorter |
| `.text-center` | `text-center` | Identical |
| `.text-nowrap` | `whitespace-nowrap` | Different name |
| `.lh-1` | `leading-none` | Named scale |
| `.lh-base` | `leading-normal` | Named scale |

### Border & Radius

| Bootstrap | Tailwind | Notes |
|-----------|----------|-------|
| `.border` | `border` | Identical |
| `.border-0` | `border-0` | Identical |
| `.rounded-2` | `rounded-md` | Named scale |
| `.rounded-3` | `rounded-lg` | Named scale |
| `.rounded-4` | `rounded-xl` | Named scale |
| `.rounded-pill` | `rounded-full` | Different name |

### Position

| Bootstrap | Tailwind | Notes |
|-----------|----------|-------|
| `.position-relative` | `relative` | Shorter |
| `.position-absolute` | `absolute` | Shorter |
| `.position-fixed` | `fixed` | Shorter |
| `.position-sticky` | `sticky` | Shorter |

---

## 2. Ant Design Component Replacement Strategy

### Decision: Replace Bootstrap components with Ant Design equivalents

**Rationale**: AntD 6 provides accessible, well-tested components with consistent design language.

### Component Mapping

| Bootstrap CSS Component | Ant Design Replacement |
|------------------------|------------------------|
| `.btn`, `.btn-primary`, `.btn-secondary` | `<Button type="primary">`, `<Button>` |
| `.form-control`, `.form-select` | `<Input>`, `<Select>` |
| `.form-check-input` | `<Checkbox>`, `<Radio>` |
| `.modal`, `.modal-dialog`, `.modal-content` | `<Modal>` |
| `.dropdown-toggle`, `.dropdown-menu` | `<Dropdown>` |
| `.alert-warning` | `<Alert type="warning">` |
| `.badge` | `<Badge>`, `<Tag>` |
| `.form-label` | `<Form.Item label="">` |
| Custom tabs (`.item-details-tabs`) | `<Tabs>` |

### AntD Configuration for Brand Colors

```tsx
// ConfigProvider theme for brand colors
const theme = {
  token: {
    colorPrimary: 'oklch(0.6 0.23 27.83)', // --primary from globals.css
    borderRadius: 6, // AntD default
  },
};
```

---

## 3. CSS Module Migration Strategy

### Decision: Migrate CSS Modules to Tailwind utilities in component files

**Rationale**: CSS Modules create component-scoped styles but add complexity. Tailwind utilities inline provide same isolation with less overhead.

### Migration Priority

| Priority | CSS Modules | Reason |
|----------|-------------|--------|
| P1 | `home.module.css` (20 matches) | High usage |
| P1 | `JobListPage.module.css` (9 matches) | High usage |
| P1 | `forum.module.css` (15 matches) | High usage |
| P1 | `chat.module.css` (12 matches) | High usage |
| P2 | `ProductCard.module.css` | Medium usage |
| P2 | `ServiceCard.module.css` | Medium usage |
| P2 | `settings.module.css` | Medium usage |
| P3 | All remaining (26 files) | Low usage |

### CSS Module Exception Criteria

Keep as CSS Module only when:
1. Complex keyframe animations not possible with Tailwind
2. Third-party component style overrides requiring specificity
3. Pseudo-element content generation (::before, ::after with complex content)

---

## 4. Global CSS Reduction Plan

### Decision: Reduce `globals.css` from 4374 lines to ~50 lines

**Rationale**: Most global CSS duplicates Tailwind utilities or Bootstrap-compatible classes that will be replaced.

### What to Keep in globals.css

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@vscode/codicons/dist/codicon.css";

@theme inline {
  /* Custom CSS variables for brand colors */
  --color-primary: oklch(0.6 0.23 27.83);
  --color-background: #f8f4f3;
  /* ... minimal custom tokens ... */
}

/* Monaco editor specific styles (required) */
.monaco-wrapper { /* ... */ }

/* Ant Design overrides (minimal) */
.ant-modal .ant-modal-content { /* ... */ }
```

### What to Remove

1. **Bootstrap-compatible utilities** (lines 543-700, 1068-1259): ~700 lines
2. **Bootstrap modal styles** (lines 1388-1509): ~120 lines
3. **Bootstrap button styles** (lines 1511-1565): ~55 lines
4. **Custom utility classes** (.ud-btn, .btn-thm, etc.): ~200 lines
5. **Bootstrap grid system** (.row, .col-*, .g-4): ~100 lines
6. **Form controls** (.form-control, .form-select): ~100 lines
7. **Redundant theme variables**: After AntD theme configuration

---

## 5. Responsive Breakpoint Alignment

### Decision: Use Tailwind breakpoints with mapping to Bootstrap equivalents

**Rationale**: Tailwind's mobile-first approach aligns with modern responsive design.

| Bootstrap | Tailwind | Pixels |
|-----------|----------|--------|
| (default) | (default) | <640px |
| `sm:` | `sm:` | ≥640px |
| `md:` | `md:` | ≥768px |
| `lg:` | `lg:` | ≥1024px |
| `xl:` | `xl:` | ≥1280px |
| `xxl:` | `2xl:` | ≥1536px |

---

## 6. Visual Regression Testing Approach

### Decision: Screenshot-based visual comparison

**Rationale**: Ensures pixel-perfect migration without visual regressions.

### Testing Strategy

1. **Pre-migration screenshots**: Capture all pages/components before changes
2. **Post-migration comparison**: Use Playwright or Percy for visual diff
3. **Manual spot-check**: Interactive elements, hover states, focus states

### Key Pages to Test

| Page | Route | Critical Components |
|------|-------|---------------------|
| Marketplace | `/marketplace` | ProductCard, FilterBar, CategorySection |
| Product Details | `/product-details/[slug]` | PriceBox, Reviews, Comments |
| Service Details | `/service-details/[slug]` | PackageTable, SellerCard |
| Profile | `/my-profile` | ProfileCard, SkillsSection |
| Checkout | `/checkout` | Cart, Stepper, Payment |
| Settings | `/settings/*` | Forms, Tabs |

---

## 7. Migration Tooling

### Decision: Manual migration with codemods for utility class replacement

**Rationale**: Automated tools can handle mechanical replacements; complex components need manual attention.

### Recommended Tools

1. **Tailwind CSS IntelliSense** (VS Code): Autocomplete for Tailwind classes
2. **windicss/prettier-plugin-tailwindcss**: Class sorting
3. **ESLint with eslint-plugin-tailwindcss**: Linting for class usage
4. **Custom regex search/replace**: For bulk Bootstrap → Tailwind replacements

### Search/Replace Patterns

```regex
# Flexbox
className="([^"]*)\bd-flex\b([^"]*)" → className="$1flex$2"
className="([^"]*)\bd-none\b([^"]*)" → className="$1hidden$2"
className="([^"]*)\bjustify-content-center\b([^"]*)" → className="$1justify-center$2"
className="([^"]*)\balign-items-center\b([^"]*)" → className="$1items-center$2"

# Spacing
className="([^"]*)\bmt-3\b([^"]*)" → className="$1mt-4$2"
className="([^"]*)\bmb-3\b([^"]*)" → className="$1mb-4$2"
className="([^"]*)\bms-2\b([^"]*)" → className="$1ml-2$2"
className="([^"]*)\bme-2\b([^"]*)" → className="$1mr-2$2"
```

---

## Alternatives Considered

### Option A: Tailwind-only (recreate AntD visuals)
- **Rejected because**: High effort to maintain visual parity; reinventing existing components

### Option C: Hybrid per-component decision
- **Rejected because**: Inconsistent approach leads to maintenance burden; harder to train team

### CSS-in-JS (Emotion, styled-components)
- **Rejected because**: Additional runtime cost; Tailwind already provides utility-first approach

---

## Open Questions (Resolved)

1. ~~Migration approach (A/B/C)?~~ → **Option B selected by user**
2. ~~CSS Module retention policy?~~ → Keep only for complex animations/overrides (max 5)
3. ~~Visual testing tool?~~ → Manual + Playwright screenshots
