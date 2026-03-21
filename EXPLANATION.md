# How Everything Works

## Project Structure

```
bike-rental/
├── backend/           # NestJS API server
│   └── src/
│       ├── auth/              # authentication (login, JWT)
│       ├── users/             # user entity and service
│       ├── price-periods/     # CRUD + price calculation
│       ├── settings/          # default price per day
│       ├── seed.ts            # creates initial admin user
│       ├── app.module.ts      # root module, wires everything together
│       └── main.ts            # entry point, starts the server
├── frontend/          # React SPA
│   └── src/
│       ├── api/               # axios client + TypeScript types
│       ├── components/        # Navbar
│       ├── hooks/             # useAuth (auth context)
│       ├── pages/             # CalculatorPage, LoginPage, AdminPage
│       └── styles/            # CSS files per section
```

## Backend

### Tech used

- **NestJS** - Node.js framework with decorators, modules, dependency injection. Organizes the code into modules (auth, users, price-periods, settings) that each have their own controller (handles HTTP requests) and service (business logic).
- **TypeORM** - ORM that maps TypeScript classes to PostgreSQL tables. The `@Entity` decorator marks a class as a table, `@Column` maps properties to columns. We use `synchronize: true` so tables are auto-created from entities (fine for dev, in production you'd use migrations).
- **passport + @nestjs/jwt** - Handles JWT authentication. When a user logs in, they get a token. Protected routes use `JwtAuthGuard` which checks the token.
- **class-validator** - Validates incoming request bodies. DTOs (Data Transfer Objects) have decorators like `@IsString()`, `@IsNumber()` etc. The `ValidationPipe` in `main.ts` automatically rejects requests that don't match.
- **bcrypt** - Hashes passwords before storing them. When logging in, we compare the plain password against the stored hash.

### Database tables

**users** - stores registered users
- `id` (auto-generated)
- `username` (unique)
- `password` (bcrypt hash)

**price_periods** - stores pricing rules
- `id` (auto-generated)
- `price_per_day` (decimal)
- `start_date` (date)
- `end_date` (date)
- `created_at` (auto-set timestamp) - this is important for the overlap logic

**settings** - key-value store for app config
- `id`
- `key` (unique, e.g. "default_price_per_day")
- `value` (string)

### API Routes

All routes are prefixed with `/api`.

#### Auth

| Method | Route | Auth? | Description |
|--------|-------|-------|-------------|
| POST | `/api/auth/login` | No | Login with `{ username, password }`. Returns `{ access_token, username }` |

#### Price Periods

| Method | Route | Auth? | Description |
|--------|-------|-------|-------------|
| GET | `/api/price-periods` | No | List all price periods (ordered by created_at) |
| GET | `/api/price-periods/:id` | No | Get a single period |
| POST | `/api/price-periods` | Yes | Create a new period. Body: `{ price_per_day, start_date, end_date }` |
| PUT | `/api/price-periods/:id` | Yes | Update a period |
| DELETE | `/api/price-periods/:id` | Yes | Delete a period |
| POST | `/api/price-periods/calculate` | No | Calculate rental price. Body: `{ start_date, end_date }` |

#### Settings

| Method | Route | Auth? | Description |
|--------|-------|-------|-------------|
| GET | `/api/settings/default-price` | No | Returns `{ default_price_per_day }` |
| PUT | `/api/settings/default-price` | Yes | Update default price. Body: `{ price }` |

### Price Calculation Logic

This is the core of the app, located in `price-periods.service.ts` in the `calculatePrice` method.

For a given date range (start_date to end_date, inclusive):

1. Load all price periods from the database, ordered by `created_at` ascending.
2. For each day in the range:
   - Start with the default price from the settings table.
   - Loop through ALL price periods in order. If the current day falls within a period's range (`start_date <= day <= end_date`), use that period's price.
   - Because we loop in `created_at` order, if multiple periods overlap for a day, the one added LATER wins (it overwrites the earlier one's price).
3. Sum up all the daily prices = total price.
4. Return `{ rental_days, total_price, breakdown }` where breakdown shows each day and its price.

**Example from the spec:**
- Period 1 (added first): $2/day for Sep 1
- Period 2 (added second): $60/day for Sep 3-8
- Period 3 (added third): $15/day for Sep 5-8
- Period 4 (added last): $150/day for Sep 9-10
- Default: $5/day

Searching Sep 8 - Sep 11:
- Sep 8: Period 2 says $60, but Period 3 was added later and also covers Sep 8, so $15
- Sep 9: Period 4 covers it, $150
- Sep 10: Period 4 covers it, $150
- Sep 11: No period covers it, so default $5
- Total: $320

### Auth Flow

1. User sends POST to `/api/auth/login` with username and password.
2. `AuthService` looks up the user by username, compares the password hash with bcrypt.
3. If valid, it signs a JWT token containing `{ sub: userId, username }` with the secret from `.env`.
4. The token expires in 24 hours.
5. Protected routes have `@UseGuards(JwtAuthGuard)`. The guard extracts the token from the `Authorization: Bearer <token>` header, verifies it using the same secret, and populates `request.user`.

### Seed Script

`npm run seed` runs `src/seed.ts` which:
1. Connects directly to PostgreSQL using TypeORM.
2. Checks if a user with username "admin" exists.
3. If not, creates one with password "admin123" (bcrypt hashed).

## Frontend

### Tech used

- **React** (via Vite) - UI library, component-based.
- **react-router-dom** - Client-side routing. Three routes: `/` (calculator), `/login`, `/admin`.
- **axios** - HTTP client for API calls. The `client.ts` file sets up a base instance with the API URL and automatically attaches the JWT token from localStorage to every request.
- **react-datepicker** - Date picker component for selecting rental dates on the calculator page.
- **react-hot-toast** - Shows small notification messages (success/error) at the bottom-right corner.

### Pages

**CalculatorPage** (`/`)
- Available to everyone (no login needed).
- Two date pickers for start and end date.
- Hits `POST /api/price-periods/calculate` when you click Calculate.
- Shows the total price, number of days, and a day-by-day breakdown table.

**LoginPage** (`/login`)
- Simple username/password form.
- Calls `POST /api/auth/login`, stores the token and username in localStorage.
- Redirects to `/admin` on success.

**AdminPage** (`/admin`)
- Protected by `ProtectedRoute` component - if not logged in, redirects to `/login`.
- Two sections:
  1. **Default Price** - loads current default price, lets you change it (PUT `/api/settings/default-price`).
  2. **Price Periods** - table of all periods with Edit/Delete buttons, plus an "Add Period" form.

### Auth Context

`useAuth.tsx` provides a React context that:
- Checks localStorage on mount for existing token/username.
- Exposes `login()` / `logout()` / `isLoggedIn` / `username` to all components.
- The Navbar uses it to show/hide the login link, admin link, and logout button.

### Styling

Plain CSS files in `src/styles/`. No component library. Each page/component has its own CSS file to keep things organized. The color scheme uses a dark navy navbar (#1a1a2e) with a light gray page background (#f0f2f5) and blue accent buttons (#4a6fa5).
