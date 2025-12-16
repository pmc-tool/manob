# Feature Specification: Bootstrap to Tailwind Migration

**Feature Branch**: `002-bootstrap-tailwind`
**Created**: 2025-12-16
**Status**: Draft
**Input**: User description: "Bootstrap to Tailwind migration - Remove Bootstrap completely, remove all custom global CSS, use Tailwind utilities directly with Ant Design patterns"

## Clarifications

### Session 2025-12-16

- Migration removes ALL Bootstrap dependencies (imports, classes, utilities)
- Removes ALL custom global CSS - only Tailwind entry file allowed (@tailwind base/components/utilities)
- Custom CSS classes in markup (e.g., .cardBox, .btnPrimary) must be replaced with Tailwind utilities
- Design follows Ant Design patterns for spacing, typography, radius, shadows, and states
- Implementation approach: Either Tailwind-only components (AntD-like) OR real antd components + Tailwind for layout
- No new "utility wrapper" classes allowed
- Repeated styling handled via: React components > Tailwind config tokens > CSS Modules (last resort)
- Business logic and component APIs remain unchanged
- Responsive and accessibility requirements preserved

**Q: Which implementation approach should be the PRIMARY strategy for migrated components?**
**A: Option B - Ant Design components + Tailwind for layout/spacing only**
- Use real Ant Design components (Button, Modal, Form, Table, etc.) for UI elements
- Use Tailwind utilities only for layout, spacing, and positioning
- Benefits: Consistent design system, built-in accessibility, reduced custom code

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Removes Bootstrap from Component (Priority: P1)

A developer working on the codebase selects a component that uses Bootstrap classes and migrates it to use Tailwind utilities directly. The component maintains identical visual appearance and behavior while removing all Bootstrap dependencies.

**Why this priority**: Core migration task. Every component must be migrated for the project to succeed. This is the fundamental unit of work.

**Independent Test**: Select any Bootstrap-styled component, convert all Bootstrap classes to Tailwind utilities, verify visual parity and functionality in browser.

**Acceptance Scenarios**:

1. **Given** a component with Bootstrap classes (e.g., `btn btn-primary`), **When** developer replaces with Tailwind utilities, **Then** the component renders identically with no Bootstrap imports remaining
2. **Given** a component with Bootstrap grid classes (e.g., `col-md-6`), **When** developer converts to Tailwind grid/flex, **Then** responsive behavior is preserved at all breakpoints
3. **Given** a component with Bootstrap spacing utilities (e.g., `mt-3 px-4`), **When** developer uses Tailwind spacing, **Then** visual spacing matches Ant Design patterns

---

### User Story 2 - Developer Removes Custom Global CSS (Priority: P1)

A developer identifies custom global CSS classes used in components and replaces them with Tailwind utilities or extracts reusable React components for repeated patterns.

**Why this priority**: Custom global CSS creates maintenance burden and style conflicts. Must be eliminated alongside Bootstrap for clean architecture.

**Independent Test**: Find any custom CSS class in markup, trace to its definition, replace with Tailwind utilities or React component, delete the CSS definition.

**Acceptance Scenarios**:

1. **Given** a component using custom class `.cardBox`, **When** developer replaces with Tailwind utilities, **Then** the custom CSS definition can be deleted
2. **Given** multiple components using same custom class `.btnPrimary`, **When** developer extracts to `<PrimaryButton />` component, **Then** all usages are updated and custom CSS is removed
3. **Given** the project's main CSS file, **When** migration is complete, **Then** only Tailwind directives remain (@tailwind base; @tailwind components; @tailwind utilities;)

---

### User Story 3 - Developer Applies Ant Design Patterns (Priority: P2)

A developer ensures migrated components follow Ant Design's visual patterns for consistent look and feel across the application, using either Tailwind utilities that match AntD or actual antd components.

**Why this priority**: Consistent design language improves user experience and developer productivity. Important but secondary to removing Bootstrap/custom CSS.

**Independent Test**: Compare migrated component against Ant Design documentation for spacing, typography, colors, and states.

**Acceptance Scenarios**:

1. **Given** a button being migrated, **When** styled with Tailwind, **Then** it uses AntD-compatible border-radius (6px), padding, and hover states
2. **Given** a form component, **When** migrated, **Then** label spacing, input heights, and focus states match Ant Design patterns
3. **Given** a modal or card component, **When** migrated, **Then** shadows, borders, and padding align with Ant Design specifications

---

### User Story 4 - Developer Handles Repeated Styling Patterns (Priority: P2)

When a developer encounters the same styling pattern used in multiple places, they extract it appropriately: as a React component for complex patterns, as Tailwind config tokens for simple values, or as CSS Modules for edge cases.

**Why this priority**: Ensures codebase remains maintainable without reintroducing global CSS anti-patterns.

**Independent Test**: Identify a repeated styling pattern, apply the appropriate extraction strategy, verify no new global CSS is created.

**Acceptance Scenarios**:

1. **Given** the same button styling in 5+ places, **When** developer extracts, **Then** a reusable `<PrimaryButton />` component is created
2. **Given** a custom brand color used throughout, **When** developer configures, **Then** it's added to `tailwind.config` theme.extend
3. **Given** a complex component-specific animation, **When** no other option works, **Then** CSS Modules are used with scoped class names

---

### User Story 5 - Accessibility and Responsiveness Preserved (Priority: P1)

All migrated components maintain their responsive behavior across device sizes and preserve accessibility features including focus states, keyboard navigation, and ARIA attributes.

**Why this priority**: Accessibility and responsiveness are non-negotiable requirements. Regression in either would be a critical defect.

**Independent Test**: Run component through keyboard navigation and screen reader, test at mobile/tablet/desktop breakpoints.

**Acceptance Scenarios**:

1. **Given** any interactive element, **When** user tabs to it, **Then** focus-visible styling is clearly visible
2. **Given** a modal component, **When** opened, **Then** focus is trapped and ARIA attributes are correct
3. **Given** a responsive layout, **When** viewport changes, **Then** layout adapts correctly at all breakpoints

---

### Edge Cases

- What happens when a Bootstrap class has no direct Tailwind equivalent? Use multiple Tailwind utilities or extend config.
- How to handle Bootstrap JavaScript components (modals, dropdowns)? Replace with Ant Design components or headless UI alternatives.
- What if removing a custom CSS class breaks third-party component styling? Document as exception with CSS Modules.
- How to handle CSS specificity issues during partial migration? Use Tailwind's important modifier or migrate complete sections.
- What about Bootstrap's normalize/reboot styles? Tailwind's preflight serves the same purpose.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST NOT import Bootstrap CSS or JavaScript in any file
- **FR-002**: System MUST NOT contain Bootstrap utility classes in component markup
- **FR-003**: System MUST NOT contain custom global CSS classes except Tailwind directives
- **FR-004**: All styling MUST use Tailwind utility classes directly in component markup
- **FR-005**: Repeated styling patterns MUST be handled via React components, Tailwind config, or CSS Modules (in that priority order)
- **FR-006**: System MUST NOT create new "utility wrapper" CSS classes (e.g., .btn, .containerX)
- **FR-007**: Visual design MUST follow Ant Design patterns for spacing, typography, radius, shadows, and interactive states
- **FR-008**: All interactive elements MUST have visible focus states (focus-visible)
- **FR-009**: All components MUST maintain keyboard navigation functionality
- **FR-010**: Modal and tab components MUST include appropriate ARIA attributes
- **FR-011**: All layouts MUST remain responsive across mobile, tablet, and desktop viewports
- **FR-012**: Business logic and component APIs MUST remain unchanged
- **FR-013**: Main CSS entry file MUST contain only: @tailwind base; @tailwind components; @tailwind utilities;
- **FR-014**: Any CSS Modules exceptions MUST be documented with justification

### Key Entities

- **Migrated Component**: A React component converted from Bootstrap/custom CSS to Tailwind utilities
- **Reusable Component**: A new React component extracted to handle repeated styling patterns (e.g., `<PrimaryButton />`)
- **Tailwind Config Token**: A custom value added to tailwind.config for repeated use (colors, spacing, etc.)
- **CSS Module Exception**: A scoped CSS file used only when Tailwind cannot achieve the required styling

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0 Bootstrap imports exist in the codebase after migration
- **SC-002**: 0 Bootstrap utility classes exist in component markup after migration
- **SC-003**: Main CSS file contains only Tailwind directives (3 lines: @tailwind base/components/utilities)
- **SC-004**: 0 custom global CSS classes remain in markup (excluding CSS Modules)
- **SC-005**: 100% of components pass visual regression testing against pre-migration baseline
- **SC-006**: 100% of interactive elements have visible focus states when tabbed to
- **SC-007**: 100% of pages remain functional across mobile (375px), tablet (768px), and desktop (1280px+) viewports
- **SC-008**: All existing end-to-end tests pass without modification (business logic unchanged)
- **SC-009**: CSS Modules exceptions documented and limited to maximum 5 components (with justification)
- **SC-010**: Build size reduction of at least 20% due to Bootstrap removal

## Assumptions

- Tailwind CSS is already installed and configured in the project
- Ant Design library is available for components if needed
- Existing component structure allows for incremental migration
- Visual regression testing tools are available or can be set up
- Team has access to Ant Design documentation for reference patterns
- No new features will be added during migration (feature freeze)
- Migration can proceed component-by-component rather than all-at-once
