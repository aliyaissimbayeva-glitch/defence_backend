# RescueBite API

Production-grade backend API for reducing food waste through dynamic pricing, food rescue logistics, auctions, and real-time delivery workflows.

---

# Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- BullMQ
- Redis
- Swagger UI
- Jest
- Resend Email API

---

# Features

## Authentication

- Register
- Login
- Logout
- Refresh Tokens
- Email Verification
- Password Reset
- RBAC Authorization

---

## Listings

- Create food listings
- Dynamic decay pricing
- Allergen filtering
- Soft delete
- Cursor pagination

---

## Orders

- Create orders
- Track statuses
- Refund requests

---

## Drivers

- Driver registration
- Delivery status updates
- Route management

---

## Admin

- Ban users
- Override decay state
- Audit logs

---

## Background Workers

- Redis-backed BullMQ queues
- Async email sending
- Retry handling
- Decay cron jobs

---

# Installation

## Clone repository

```bash
git clone 