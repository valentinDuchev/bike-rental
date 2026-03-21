# Bike Rental - Price Calculator

Web app for calculating bike rental prices based on configurable price periods.

## Prerequisites

- Node.js (v18+)
- PostgreSQL running locally
- npm

## Setup

### 1. Database

Create a PostgreSQL database:

```sql
CREATE DATABASE bike_rental;
```

### 2. Backend

```bash
cd backend
npm install
```

Edit `.env` if your PostgreSQL credentials are different from the defaults:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=bike_rental
JWT_SECRET=bike-rental-secret-key-change-me
```

Seed the admin user:

```bash
npm run seed
```

Start the server:

```bash
npm run start:dev
```

Backend runs on `http://localhost:3000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

### Default Login

- Username: `admin`
- Password: `admin123`
