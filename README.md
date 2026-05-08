# RescueBite Backend

##  Description

RescueBite is a backend API that helps reduce food waste by allowing restaurants to list surplus food and users to order it before expiration.

---

##  Setup

```bash
npm install
```

```bash
npx prisma migrate dev
```

```bash
node src/server.js
```

---

##  API Endpoints

### Auth

* POST /auth/register
* POST /auth/login
* POST /auth/refresh
* POST /auth/logout

### Listings

* POST /listings
* GET /listings (with cursor pagination)

### Orders

* POST /orders

### Allergy

* POST /allergy/check

---

##  Features

* JWT Authentication (access + refresh tokens)
* Role-Based Access Control (RBAC)
* Prisma ORM + PostgreSQL
* ACID Transactions (no overselling)
* Food State Machine (Fresh → Discounted → Free → Compost)
* Allergy validation system
* Rate limiting (auth endpoints)
* Swagger API documentation
* Cursor-based pagination
* Environment validation

---

## API Docs

http://localhost:3000/docs

---

##  Testing

```bash
npm test
```

Includes:

* Unit tests
* Integration tests
* Auth protection tests

---

##  Run

```bash
node src/server.js
```
