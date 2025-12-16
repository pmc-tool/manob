# Quickstart: Bootstrap to Tailwind Migration

**Feature**: Bootstrap to Tailwind Migration
**Date**: 2025-12-16

## Overview

This guide helps developers migrate components from Bootstrap/custom CSS to Tailwind CSS + Ant Design components.

---

## Prerequisites

- Node.js 20+
- Familiarity with Tailwind CSS utility classes
- Familiarity with Ant Design component library

**Already Installed**:
- Tailwind CSS 4 (`tailwindcss: ^4`)
- Ant Design 6 (`antd: ^6.0.0`)

---

## Quick Reference

### Bootstrap → Tailwind Cheatsheet

| Bootstrap | Tailwind |
|-----------|----------|
| `d-flex` | `flex` |
| `d-none` | `hidden` |
| `d-block` | `block` |
| `justify-content-center` | `justify-center` |
| `justify-content-between` | `justify-between` |
| `align-items-center` | `items-center` |
| `flex-column` | `flex-col` |
| `mt-3`, `mb-3` | `mt-4`, `mb-4` |
| `ms-2`, `me-2` | `ml-2`, `mr-2` |
| `p-3` | `p-4` |
| `fw-bold` | `font-bold` |
| `text-center` | `text-center` |
| `position-relative` | `relative` |
| `rounded-3` | `rounded-lg` |

### Component Replacements

| Bootstrap CSS | Ant Design Component |
|---------------|---------------------|
| `.btn`, `.btn-primary` | `<Button type="primary">` |
| `.btn-secondary` | `<Button>` |
| `.form-control` | `<Input>` |
| `.form-select` | `<Select>` |
| `.modal`, `.modal-dialog` | `<Modal>` |
| `.dropdown-toggle` | `<Dropdown>` |
| `.form-check-input` | `<Checkbox>`, `<Radio>` |
| Custom tabs | `<Tabs>` |

---

## Migration Steps

### Step 1: Identify Bootstrap/Custom Classes

```bash
# Find Bootstrap classes in a component
grep -E "className.*\b(d-flex|btn-|col-|justify-content|align-items)\b" ComponentName.tsx

# Find custom global classes
grep -E "className.*\b(ud-btn|btn-thm|fz\d+|bgc-)\b" ComponentName.tsx
```

### Step 2: Replace Layout Classes

```tsx
// Before
<div className="d-flex justify-content-between align-items-center p-3 mb-4">

// After
<div className="flex justify-between items-center p-4 mb-6">
```

### Step 3: Replace UI Components with AntD

```tsx
// Before
<button className="btn btn-primary ud-btn">Submit</button>
<input className="form-control" placeholder="Email" />

// After
import { Button, Input } from 'antd';

<Button type="primary">Submit</Button>
<Input placeholder="Email" />
```

### Step 4: Handle CSS Modules

If component uses a CSS Module:

1. **Check if needed**: Can the styles be expressed as Tailwind utilities?
2. **If yes**: Remove CSS Module, use Tailwind classes
3. **If no**: Keep CSS Module, document reason in `data-model.md`

```tsx
// Before (CSS Module)
import styles from './Component.module.css';
<div className={styles.customAnimation}>

// After (if animation can't be done with Tailwind)
// Keep the CSS Module, but document why
import styles from './Component.module.css';
<div className={`${styles.customAnimation} flex items-center`}>
```

### Step 5: Remove Unused CSS

After migrating a component:

1. Check if its CSS Module can be deleted
2. Check if any global CSS classes are now unused
3. Remove unused styles from `globals.css`

---

## Common Patterns

### Cards

```tsx
// Before
<div className="card p-3 rounded-3 shadow-sm">
  <h5 className="fw-bold mb-2">Title</h5>
  <p className="text-muted">Description</p>
</div>

// After (Option 1: Tailwind only)
<div className="p-4 rounded-lg shadow-sm bg-white">
  <h5 className="font-bold mb-2">Title</h5>
  <p className="text-gray-500">Description</p>
</div>

// After (Option 2: AntD Card)
import { Card } from 'antd';
<Card title="Title">
  <p>Description</p>
</Card>
```

### Buttons

```tsx
// Before
<button className="btn btn-primary ud-btn">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-soft-primary">Soft</button>

// After
import { Button } from 'antd';
<Button type="primary">Primary</Button>
<Button>Secondary</Button>
<Button type="default">Soft</Button>
```

### Forms

```tsx
// Before
<form>
  <label className="form-label">Email</label>
  <input className="form-control" type="email" />
  <select className="form-select">
    <option>Option 1</option>
  </select>
</form>

// After
import { Form, Input, Select } from 'antd';
<Form layout="vertical">
  <Form.Item label="Email">
    <Input type="email" />
  </Form.Item>
  <Form.Item label="Choice">
    <Select options={[{ value: '1', label: 'Option 1' }]} />
  </Form.Item>
</Form>
```

### Modals

```tsx
// Before
<div className="modal show" style={{ display: 'block' }}>
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Title</h5>
        <button className="btn-close" onClick={onClose}></button>
      </div>
      <div className="modal-body">Content</div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary">Save</button>
      </div>
    </div>
  </div>
</div>

// After
import { Modal, Button } from 'antd';
<Modal
  open={isOpen}
  onCancel={onClose}
  title="Title"
  footer={[
    <Button key="cancel" onClick={onClose}>Cancel</Button>,
    <Button key="save" type="primary">Save</Button>,
  ]}
>
  Content
</Modal>
```

### Grid Layout

```tsx
// Before
<div className="row g-4">
  <div className="col-12 col-lg-4">Sidebar</div>
  <div className="col-12 col-lg-8">Main Content</div>
</div>

// After
<div className="flex flex-wrap gap-6">
  <div className="w-full lg:w-1/3">Sidebar</div>
  <div className="w-full lg:w-2/3">Main Content</div>
</div>

// Or with CSS Grid
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-1">Sidebar</div>
  <div className="lg:col-span-2">Main Content</div>
</div>
```

---

## Verification Checklist

After migrating a component:

- [ ] No Bootstrap classes remain (`grep -E "d-flex|btn-|col-lg"`)
- [ ] No custom global classes remain (`grep -E "ud-btn|btn-thm|fz\d+"`)
- [ ] Visual appearance matches original (compare screenshots)
- [ ] Focus states are visible (Tab through interactive elements)
- [ ] Responsive layout works (test at 375px, 768px, 1280px)
- [ ] No console errors
- [ ] Component API unchanged (props work the same)

---

## Troubleshooting

### "Class not found" errors

Tailwind purges unused classes. Ensure dynamic class names use full strings:

```tsx
// Bad - Tailwind can't detect
const size = 'lg';
<div className={`text-${size}`}>

// Good - Full class names
const sizeClasses = { sm: 'text-sm', lg: 'text-lg' };
<div className={sizeClasses[size]}>
```

### AntD styles not applying

Ensure AntD's CSS is imported and ConfigProvider wraps the app:

```tsx
// app/layout.tsx
import { AntdRegistry } from '@ant-design/nextjs-registry';

<AntdRegistry>{children}</AntdRegistry>
```

### Specificity issues

Use Tailwind's `!` modifier for important:

```tsx
<div className="!mt-0">  // margin-top: 0 !important
```

Or override in ConfigProvider theme for AntD components.

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Ant Design Components](https://ant.design/components/overview)
- [Bootstrap to Tailwind Converter](https://tailwind.build/from-bootstrap)
- [research.md](./research.md) - Full class mapping reference
