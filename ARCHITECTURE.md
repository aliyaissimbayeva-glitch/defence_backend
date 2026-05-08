# Architecture Overview

##  System Architecture

The application follows a layered architecture:

* Routes Layer → Handles HTTP requests
* Controller Layer → Processes request/response
* Service Layer → Contains business logic
* Data Layer (Prisma ORM) → Database access

---

## Authentication & Authorization

* JWT-based authentication (access + refresh tokens)
* Passwords hashed using bcrypt
* Role-Based Access Control (RBAC)
* Protected routes using middleware

---

## Database

* PostgreSQL
* Prisma ORM (no raw SQL)
* ACID transactions for critical operations (orders, stock updates)

---

## Core Business Logic

### Order Flow

* Uses Prisma transactions
* Prevents overselling
* Ensures atomic operations

### Food State Machine

Food status is calculated dynamically based on expiration time:

* FRESH
* DISCOUNTED
* FREE
* COMPOST

---

## Allergy System

* Implemented using ENUM in database
* Users store allergy preferences
* Listings store allergens
* Validation prevents unsafe orders

---

## Price Decay

Price decay is implemented in application logic based on expiration time.

* Price decreases as expiration approaches
* Ensures food is sold before spoilage

---

##  Geospatial Support

* Listings store:

  * latitude (lat)
  * longitude (lng)

* Distance calculations can be performed using the Haversine formula

---

##  Performance

* Cursor-based pagination for scalability
* Rate limiting on authentication endpoints

---

##  Testing Strategy

* Unit tests for logic
* Integration tests for database operations
* Auth tests for protected endpoints

---

## CI/CD

* GitHub Actions pipeline
* Runs tests on every push
* Ensures code quality and stability
