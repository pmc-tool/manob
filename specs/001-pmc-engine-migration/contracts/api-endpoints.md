# API Contracts: PMC Website to PMC Engine Migration

**Feature**: 001-pmc-engine-migration
**Date**: 2025-12-12
**Status**: Complete

> **CONTRACT FREEZE**: All endpoints below document the EXISTING PackMyCode API contract. DO NOT modify request/response shapes. This document serves as the reference for migration validation.

---

## Authentication Endpoints

### POST /auth/login

Login with email and password.

**Request**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response** (200):
```json
{
  "token": "string",
  "refreshToken": "string",
  "expiresAt": "2025-12-12T00:00:00Z",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "buyer | seller | admin"
  }
}
```

### POST /auth/signup

Register new user.

**Request**:
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

**Response** (201):
```json
{
  "message": "OTP sent to email",
  "email": "string"
}
```

### POST /auth/verify-otp

Verify OTP for email confirmation.

**Request**:
```json
{
  "email": "string",
  "otp": "string"
}
```

**Response** (200):
```json
{
  "token": "string",
  "refreshToken": "string",
  "expiresAt": "2025-12-12T00:00:00Z",
  "user": { ... }
}
```

### POST /auth/forgot-password

Initiate password recovery.

**Request**:
```json
{
  "email": "string"
}
```

**Response** (200):
```json
{
  "message": "Recovery email sent"
}
```

### POST /auth/reset-password

Reset password with recovery token.

**Request**:
```json
{
  "token": "string",
  "newPassword": "string"
}
```

**Response** (200):
```json
{
  "message": "Password reset successful"
}
```

### POST /auth/refresh

Refresh access token.

**Request**:
```json
{
  "refreshToken": "string"
}
```

**Response** (200):
```json
{
  "token": "string",
  "expiresAt": "2025-12-12T00:00:00Z"
}
```

---

## Products Endpoints

### GET /products

List products with pagination and filters.

**Query Params**:
- `page` (number, default: 1)
- `pageSize` (number, default: 20)
- `category` (string, optional)
- `search` (string, optional)
- `minPrice` (number, optional)
- `maxPrice` (number, optional)

**Response** (200):
```json
{
  "items": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "price": 0,
      "currency": "USD",
      "images": ["string"],
      "category": { "id": "string", "name": "string", "slug": "string" },
      "seller": { "id": "string", "name": "string" },
      "status": "active",
      "createdAt": "2025-12-12T00:00:00Z",
      "updatedAt": "2025-12-12T00:00:00Z"
    }
  ],
  "total": 0,
  "page": 1,
  "pageSize": 20
}
```

### GET /products/:id

Get product details.

**Response** (200):
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "price": 0,
  "currency": "USD",
  "images": ["string"],
  "category": { ... },
  "seller": { ... },
  "status": "active",
  "features": ["string"],
  "specifications": { "key": "value" },
  "createdAt": "2025-12-12T00:00:00Z",
  "updatedAt": "2025-12-12T00:00:00Z"
}
```

---

## Services Endpoints

### GET /services

List services (same pagination pattern as products).

### GET /services/:id

Get service details.

---

## Jobs Endpoints

### GET /jobs

List job postings.

### GET /jobs/:id

Get job details.

---

## Categories Endpoints

### GET /categories

List all categories with hierarchy.

**Response** (200):
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "parentId": null,
      "children": [
        { "id": "string", "name": "string", "slug": "string" }
      ]
    }
  ]
}
```

### GET /categories/:slug

Get category by slug with products/services.

---

## Search Endpoint

### GET /search

Unified search across products, services, jobs.

**Query Params**:
- `q` (string, required)
- `type` (string, optional: "products" | "services" | "jobs" | "all")
- `page` (number)
- `pageSize` (number)

**Response** (200):
```json
{
  "products": { "items": [...], "total": 0 },
  "services": { "items": [...], "total": 0 },
  "jobs": { "items": [...], "total": 0 }
}
```

---

## Cart Endpoints

### GET /cart

Get current user's cart.

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "items": [
    {
      "productId": "string",
      "product": { ... },
      "quantity": 1
    }
  ],
  "total": 0,
  "currency": "USD"
}
```

### POST /cart/add

Add item to cart.

**Request**:
```json
{
  "productId": "string",
  "quantity": 1
}
```

### PUT /cart/update

Update cart item quantity.

**Request**:
```json
{
  "productId": "string",
  "quantity": 2
}
```

### DELETE /cart/remove/:productId

Remove item from cart.

---

## Orders Endpoints

### GET /orders

List user's orders.

### GET /orders/:id

Get order details.

### POST /orders

Create order from cart.

**Request**:
```json
{
  "shippingAddress": {
    "street": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "postalCode": "string"
  },
  "paymentMethod": "string"
}
```

---

## Seller Endpoints

### POST /seller/apply

Submit seller application.

**Request**:
```json
{
  "businessName": "string",
  "businessType": "string",
  "description": "string"
}
```

### GET /seller/dashboard

Get seller dashboard data.

### GET /seller/products

Get seller's products.

### POST /seller/products

Create new product (seller only).

### PUT /seller/products/:id

Update product (seller only).

---

## User Dashboard Endpoints

### GET /user/profile

Get user profile.

### PUT /user/profile

Update user profile.

### GET /user/orders

Get user's order history.

### GET /user/settings

Get user settings.

### PUT /user/settings

Update user settings.

---

## Forum Endpoints

### GET /forum/topics

List forum topics.

### GET /forum/topics/:slug

Get topic with posts.

### POST /forum/posts

Create forum post.

### POST /forum/posts/:id/replies

Add reply to post.

---

## Discussion Endpoints

### GET /discussions

List discussions.

### GET /discussions/:id

Get discussion with messages.

### POST /discussions

Create discussion.

### POST /discussions/:id/messages

Add message to discussion.

---

## Support Endpoints

### GET /support/tickets

List user's support tickets.

### POST /support/tickets

Create support ticket.

### GET /support/tickets/:id

Get ticket details.

### POST /support/tickets/:id/messages

Add message to ticket.

---

## Error Response Shape

All endpoints return errors in this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

Common error codes:
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `VALIDATION_ERROR` (400)
- `INTERNAL_ERROR` (500)

---

## Authentication Headers

All authenticated endpoints require:

```
Authorization: Bearer <token>
```

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-12 | Initial API contract documentation |
