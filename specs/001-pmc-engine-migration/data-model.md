# Data Model: PMC Website to PMC Engine Migration

**Feature**: 001-pmc-engine-migration
**Date**: 2025-12-12
**Status**: Complete

> **CONTRACT NOTE**: All entity shapes below MUST match the existing PackMyCode API responses exactly. DO NOT add, remove, or rename fields. These types serve as documentation of the frozen contract.

---

## Core Entities

### User

Represents an authenticated user in the system.

```typescript
// CONTRACT: Exact shape from PMC API
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'buyer' | 'seller' | 'admin';
  createdAt: string;      // ISO date string
  updatedAt: string;      // ISO date string
}
```

**Relationships**:
- A User can have many Orders (as buyer)
- A User can have many Products (as seller)
- A User can have many ForumPosts

---

### Auth Session

Represents the authentication state.

```typescript
// CONTRACT: Exact shape from PMC auth handling
interface AuthSession {
  token: string;
  refreshToken?: string;
  expiresAt: string;      // ISO date string
  user: User;
}

// CONTRACT: Login request shape
interface LoginRequest {
  email: string;
  password: string;
}

// CONTRACT: Signup request shape
interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

// CONTRACT: OTP verification shape
interface OTPVerifyRequest {
  email: string;
  otp: string;
}
```

---

### Product

Represents a product listing.

```typescript
// CONTRACT: Exact shape from PMC API
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: Category;
  seller: User;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  // Additional fields as per PMC response
  features?: string[];
  specifications?: Record<string, string>;
}

// CONTRACT: Product list response shape
interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}
```

---

### Service

Represents a service listing.

```typescript
// CONTRACT: Exact shape from PMC API
interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: Category;
  seller: User;
  status: 'active' | 'inactive' | 'pending';
  deliveryTime: string;   // e.g., "3 days"
  createdAt: string;
  updatedAt: string;
}
```

---

### Job

Represents a job posting.

```typescript
// CONTRACT: Exact shape from PMC API
interface Job {
  id: string;
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  category: Category;
  poster: User;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
```

---

### Category

Represents a category for products/services/jobs.

```typescript
// CONTRACT: Exact shape from PMC API
interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children?: Category[];
  icon?: string;
}
```

---

### Order

Represents a purchase order.

```typescript
// CONTRACT: Exact shape from PMC API
interface Order {
  id: string;
  buyer: User;
  seller: User;
  items: OrderItem[];
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  currency: string;
  paymentMethod: string;
  shippingAddress?: Address;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}
```

---

### Cart

Represents the shopping cart.

```typescript
// CONTRACT: Exact shape from PMC API/client state
interface Cart {
  items: CartItem[];
  total: number;
  currency: string;
}

interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}
```

---

### Forum / Discussion

Represents forum content.

```typescript
// CONTRACT: Exact shape from PMC API
interface ForumTopic {
  id: string;
  title: string;
  slug: string;
  description?: string;
  postCount: number;
}

interface ForumPost {
  id: string;
  topicId: string;
  author: User;
  title: string;
  content: string;
  replies: ForumReply[];
  createdAt: string;
  updatedAt: string;
}

interface ForumReply {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: User;
  participants: User[];
  messages: DiscussionMessage[];
  createdAt: string;
  updatedAt: string;
}

interface DiscussionMessage {
  id: string;
  discussionId: string;
  author: User;
  content: string;
  createdAt: string;
}
```

---

### Support

Represents support tickets.

```typescript
// CONTRACT: Exact shape from PMC API
interface SupportTicket {
  id: string;
  user: User;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
}

interface SupportMessage {
  id: string;
  ticketId: string;
  author: User | 'system';
  content: string;
  createdAt: string;
}
```

---

### Seller Application

Represents the "Become Seller" flow.

```typescript
// CONTRACT: Exact shape from PMC API
interface SellerApplication {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  documents?: string[];
  createdAt: string;
  updatedAt: string;
}
```

---

## State Transitions

### Order Status Flow

```
pending → paid → processing → shipped → delivered
    ↓
cancelled (can occur from pending, paid, or processing)
```

### Product/Service Status Flow

```
pending → active ↔ inactive
```

### Support Ticket Flow

```
open → in_progress → resolved → closed
```

---

## Validation Rules

> **Note**: These rules are enforced by the existing PMC backend. Frontend must match these validations for UX consistency.

| Entity | Field | Rule |
|--------|-------|------|
| User | email | Valid email format |
| User | password | Min 8 chars (signup) |
| Product | title | Required, max 200 chars |
| Product | price | > 0 |
| Order | items | At least 1 item |
| ForumPost | content | Required, max 10000 chars |

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-12 | Initial data model documentation |
