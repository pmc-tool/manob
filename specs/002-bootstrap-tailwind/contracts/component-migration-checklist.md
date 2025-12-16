# Component Migration Contract

**Feature**: Bootstrap to Tailwind Migration
**Date**: 2025-12-16

## Purpose

This contract defines the migration requirements for each component. Use this checklist when migrating any component from Bootstrap/custom CSS to Tailwind + Ant Design.

---

## Pre-Migration Assessment

### 1. Component Inventory

```bash
# Run these commands to assess the component
COMPONENT_PATH="components/pmc-migrated/[category]/[Component].tsx"

# Count Bootstrap classes
grep -oE "\b(d-flex|d-none|d-block|justify-content-[a-z]+|align-items-[a-z]+|flex-[a-z]+|col-[a-z0-9-]+|row|btn-[a-z]+|modal-[a-z]+|form-[a-z]+|mt-[0-9]+|mb-[0-9]+|p-[0-9]+|gap-[0-9]+)\b" "$COMPONENT_PATH" | wc -l

# Count custom global classes
grep -oE "\b(ud-btn|btn-thm|btn-soft-[a-z]+|fz[0-9]+|bgc-[a-z0-9-]+|item-details-[a-z]+)\b" "$COMPONENT_PATH" | wc -l

# Check for CSS Module import
grep "\.module\.css" "$COMPONENT_PATH"
```

### 2. Document Initial State

| Metric | Value |
|--------|-------|
| File path | |
| Bootstrap class count | |
| Custom class count | |
| CSS Module file | (path or N/A) |
| Associated page route | |

---

## Migration Requirements

### Mandatory (Must Complete)

- [ ] **M1**: Remove ALL Bootstrap utility classes
  - `d-flex` → `flex`
  - `d-none` → `hidden`
  - `justify-content-*` → `justify-*`
  - `align-items-*` → `items-*`
  - `col-*` → `w-*` or grid columns
  - `mt-3`, `mb-3` → `mt-4`, `mb-4`
  - `ms-*`, `me-*` → `ml-*`, `mr-*`

- [ ] **M2**: Remove ALL custom global CSS classes
  - `ud-btn` → `<Button>` from AntD
  - `btn-thm` → `<Button type="primary">`
  - `fz12`, `fz14`, etc. → `text-xs`, `text-sm`, `text-base`
  - `bgc-*` → `bg-*` Tailwind utilities

- [ ] **M3**: Replace Bootstrap components with Ant Design
  - Modal patterns → `<Modal>`
  - Button patterns → `<Button>`
  - Form inputs → `<Input>`, `<Select>`, `<Checkbox>`
  - Tabs patterns → `<Tabs>`
  - Dropdown patterns → `<Dropdown>`

- [ ] **M4**: Preserve accessibility
  - Focus states visible (`focus-visible:ring-2` or AntD default)
  - Keyboard navigation works
  - ARIA attributes preserved

- [ ] **M5**: Preserve responsive behavior
  - Test at 375px (mobile)
  - Test at 768px (tablet)
  - Test at 1280px+ (desktop)

- [ ] **M6**: Business logic unchanged
  - Props API identical
  - Event handlers work
  - State management unchanged

### Conditional (If Applicable)

- [ ] **C1**: If component has CSS Module
  - Evaluate: Can all styles be Tailwind utilities?
  - If yes: Delete CSS Module, use inline Tailwind
  - If no: Document exception with reason

- [ ] **C2**: If component uses Bootstrap grid
  - Convert `.row` → `flex flex-wrap` or `grid`
  - Convert `.col-*` → `w-*` fractions or `col-span-*`
  - Convert `.g-*` → `gap-*`

- [ ] **C3**: If component has hover/focus states
  - Use Tailwind variants: `hover:bg-gray-100`, `focus:ring-2`
  - Or use AntD component built-in states

---

## Post-Migration Verification

### Automated Checks

```bash
# Verify no Bootstrap classes remain
grep -E "\b(d-flex|d-none|justify-content|align-items|col-lg|btn-primary|modal-dialog)\b" "$COMPONENT_PATH"
# Expected: no output

# Verify no custom global classes remain
grep -E "\b(ud-btn|btn-thm|fz[0-9]+|bgc-)\b" "$COMPONENT_PATH"
# Expected: no output
```

### Manual Verification

- [ ] Visual comparison: Side-by-side screenshot matches original
- [ ] Tab navigation: All interactive elements receive focus
- [ ] Hover states: Buttons, links show hover feedback
- [ ] Mobile view: Layout adapts correctly at 375px
- [ ] Tablet view: Layout adapts correctly at 768px
- [ ] Desktop view: Layout correct at 1280px+
- [ ] No console errors during component interaction

---

## Migration Sign-off

| Field | Value |
|-------|-------|
| Migrated by | |
| Date | |
| Visual verification | Pass / Fail |
| Accessibility check | Pass / Fail |
| Responsive check | Pass / Fail |
| CSS Module exception? | Yes (reason) / No |

---

## CSS Module Exception Template

If retaining a CSS Module, complete this section:

| Field | Value |
|-------|-------|
| Module path | |
| Reason for retention | |
| Line count (after optimization) | |
| Could this be done with Tailwind in future? | |

**Valid exception reasons**:
1. Complex keyframe animations
2. Third-party component style override requiring specificity
3. Pseudo-element (::before, ::after) with complex content property
4. CSS features not supported by Tailwind (e.g., counter-reset)

---

## Component Categories Reference

### Category A: Layout Components (Tailwind Only)

Components that only need class replacement, no AntD components.

Examples:
- `PageLayout.tsx`
- `ProfileCard.tsx`
- `CategorySection.tsx`

### Category B: Interactive Components (AntD Required)

Components with buttons, forms, modals that should use AntD.

Examples:
- `BillingModal.tsx`
- `SearchBar.tsx`
- `FilterBar.tsx`
- `SellerRegistration.tsx`

### Category C: Complex Animation Components (CSS Module Retained)

Components with animations that can't be expressed in Tailwind.

Examples:
- TBD (identify during migration)
