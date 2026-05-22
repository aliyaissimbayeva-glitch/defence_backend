# RescueBite

RescueBite is a food rescue platform that helps restaurants reduce food waste by offering expiring food to consumers and shelters.

## Features

### Authentication
- JWT Authentication
- Refresh tokens
- Email verification
- Password reset
- Role based access

Roles:
- Restaurant
- Consumer
- Shelter
- Driver
- Admin

---

## Listings

Restaurants can:

- Create food listings
- Delete listings
- Manage quantity
- Automatic decay states:

FRESH → DISCOUNTED → FREE → EXPIRED

---

## Orders Flow

Consumer / Shelter

Create order

status = PENDING

Restaurant

Accept order

status = CONFIRMED

Driver

Take delivery

status = DRIVER_ASSIGNED

Driver

Pick up

status = IN_TRANSIT

Driver

Deliver

status = DELIVERED

---

## Delivery System

Driver features:

- View confirmed orders
- Take delivery
- Track delivery status
- Update progress

---

## Auction System

Shelters can:

- Place bids
- Offer delivery fees

---

## Tech Stack

Backend:
- Node.js
- Express
- Prisma
- PostgreSQL
- Redis
- JWT

Frontend:
- React
- Redux Toolkit
- React Router
- Axios
- Vite

Infrastructure:
- Docker Compose

---

## Run with Docker

```bash
docker compose up --build