import { useState } from 'react';
import '../styles/docs.css';

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`accordion-item ${open ? 'open' : ''}`}>
      <button className="accordion-header" onClick={() => setOpen(!open)}>
        {title}
        <span className="accordion-arrow">&#9660;</span>
      </button>
      <div className="accordion-body">{children}</div>
    </div>
  );
}

function DocsPage() {
  return (
    <div className="container">
      <div className="docs-page">
        <h1>How It Works</h1>
        <p className="docs-intro">
          A breakdown of the tech stack, architecture and the pricing logic behind this app.
        </p>

        <div className="accordion">
          <Accordion title="Tech Stack">
            <h4>Backend</h4>
            <ul>
              <li><strong>NestJS</strong> — Node.js framework built on top of Express. Uses decorators for routing, dependency injection for services, and modules to organize the code.</li>
              <li><strong>TypeORM</strong> — maps TypeScript classes to PostgreSQL tables. Each entity class becomes a table, each property becomes a column.</li>
              <li><strong>PostgreSQL</strong> — relational database. Stores users, price periods, and app settings.</li>
              <li><strong>Passport + JWT</strong> — handles authentication. On login, the server returns a signed token. Protected routes check for that token in the request header.</li>
              <li><strong>bcrypt</strong> — hashes passwords before storing. Never stores plain text.</li>
              <li><strong>class-validator</strong> — validates incoming request data using decorators on DTO classes.</li>
            </ul>
            <h4>Frontend</h4>
            <ul>
              <li><strong>React</strong> (via Vite) — component-based UI library.</li>
              <li><strong>react-router-dom</strong> — handles client-side page navigation without full page reloads.</li>
              <li><strong>axios</strong> — HTTP client that talks to the backend API. Automatically attaches the JWT token to every request.</li>
              <li><strong>react-datepicker</strong> — date selection component for the calculator page.</li>
              <li><strong>react-hot-toast</strong> — lightweight toast notifications for success/error feedback.</li>
            </ul>
          </Accordion>

          <Accordion title="Project Structure">
            <div className="code-block">
{`backend/src/
  auth/          - login endpoint, JWT strategy, guard
  users/         - user entity + service
  price-periods/ - CRUD controller + service, price calc logic
  settings/      - default price (stored in DB settings table)
  seed.ts        - script to create the admin user

frontend/src/
  api/           - axios client, shared types
  components/    - Navbar
  hooks/         - useAuth (auth context provider)
  pages/         - CalculatorPage, LoginPage, AdminPage, DocsPage
  styles/        - CSS per component/page`}
            </div>
          </Accordion>

          <Accordion title="Database Schema">
            <p>Three tables, all auto-created by TypeORM on startup:</p>
            <h4>users</h4>
            <table>
              <thead><tr><th>Column</th><th>Type</th><th>Notes</th></tr></thead>
              <tbody>
                <tr><td><code>id</code></td><td>int (PK)</td><td>auto-increment</td></tr>
                <tr><td><code>username</code></td><td>varchar</td><td>unique</td></tr>
                <tr><td><code>password</code></td><td>varchar</td><td>bcrypt hash</td></tr>
              </tbody>
            </table>
            <h4>price_periods</h4>
            <table>
              <thead><tr><th>Column</th><th>Type</th><th>Notes</th></tr></thead>
              <tbody>
                <tr><td><code>id</code></td><td>int (PK)</td><td>auto-increment</td></tr>
                <tr><td><code>price_per_day</code></td><td>decimal(10,2)</td><td></td></tr>
                <tr><td><code>start_date</code></td><td>date</td><td></td></tr>
                <tr><td><code>end_date</code></td><td>date</td><td></td></tr>
                <tr><td><code>created_at</code></td><td>timestamp</td><td>used for overlap priority</td></tr>
              </tbody>
            </table>
            <h4>settings</h4>
            <table>
              <thead><tr><th>Column</th><th>Type</th><th>Notes</th></tr></thead>
              <tbody>
                <tr><td><code>id</code></td><td>int (PK)</td><td>auto-increment</td></tr>
                <tr><td><code>key</code></td><td>varchar</td><td>unique, e.g. "default_price_per_day"</td></tr>
                <tr><td><code>value</code></td><td>varchar</td><td>stored as string, parsed when needed</td></tr>
              </tbody>
            </table>
          </Accordion>

          <Accordion title="API Endpoints">
            <h4>Authentication</h4>
            <table>
              <thead><tr><th>Method</th><th>Route</th><th>Auth</th><th>Description</th></tr></thead>
              <tbody>
                <tr>
                  <td><span className="tag green">POST</span></td>
                  <td><code>/api/auth/login</code></td>
                  <td>No</td>
                  <td>Returns JWT token</td>
                </tr>
              </tbody>
            </table>
            <h4>Price Periods</h4>
            <table>
              <thead><tr><th>Method</th><th>Route</th><th>Auth</th><th>Description</th></tr></thead>
              <tbody>
                <tr>
                  <td><span className="tag">GET</span></td>
                  <td><code>/api/price-periods</code></td>
                  <td>No</td>
                  <td>List all periods</td>
                </tr>
                <tr>
                  <td><span className="tag">GET</span></td>
                  <td><code>/api/price-periods/:id</code></td>
                  <td>No</td>
                  <td>Get single period</td>
                </tr>
                <tr>
                  <td><span className="tag green">POST</span></td>
                  <td><code>/api/price-periods</code></td>
                  <td>Yes</td>
                  <td>Create period</td>
                </tr>
                <tr>
                  <td><span className="tag green">POST</span></td>
                  <td><code>/api/price-periods/calculate</code></td>
                  <td>No</td>
                  <td>Calculate rental price</td>
                </tr>
                <tr>
                  <td><span className="tag">PUT</span></td>
                  <td><code>/api/price-periods/:id</code></td>
                  <td>Yes</td>
                  <td>Update period</td>
                </tr>
                <tr>
                  <td><span className="tag red">DELETE</span></td>
                  <td><code>/api/price-periods/:id</code></td>
                  <td>Yes</td>
                  <td>Delete period</td>
                </tr>
              </tbody>
            </table>
            <h4>Settings</h4>
            <table>
              <thead><tr><th>Method</th><th>Route</th><th>Auth</th><th>Description</th></tr></thead>
              <tbody>
                <tr>
                  <td><span className="tag">GET</span></td>
                  <td><code>/api/settings/default-price</code></td>
                  <td>No</td>
                  <td>Get current default price</td>
                </tr>
                <tr>
                  <td><span className="tag">PUT</span></td>
                  <td><code>/api/settings/default-price</code></td>
                  <td>Yes</td>
                  <td>Update default price</td>
                </tr>
              </tbody>
            </table>
          </Accordion>

          <Accordion title="Price Calculation Logic">
            <p>
              The core logic lives in <code>price-periods.service.ts</code> in the <code>calculatePrice</code> method. Here is how it works step by step:
            </p>
            <ul>
              <li>Load all price periods from the database, sorted by <code>created_at</code> ascending (oldest first).</li>
              <li>For each day in the requested range (inclusive):</li>
              <ul>
                <li>Start with the default price from the settings table.</li>
                <li>Loop through every period. If the day falls within that period's start/end range, overwrite the price with that period's <code>price_per_day</code>.</li>
                <li>Because we iterate in creation order, a period added later will always overwrite an earlier one for the same day. This handles overlaps.</li>
              </ul>
              <li>Sum up all daily prices to get the total.</li>
            </ul>
            <p>
              The endpoint returns three things: <code>rental_days</code>, <code>total_price</code>, and a <code>breakdown</code> array showing the price for each individual day.
            </p>
          </Accordion>

          <Accordion title="Example Calculation">
            <p>Given these price periods (in the order they were added):</p>
            <table>
              <thead><tr><th>#</th><th>Price/Day</th><th>Start</th><th>End</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>$2</td><td>2026-09-01</td><td>2026-09-01</td></tr>
                <tr><td>2</td><td>$60</td><td>2026-09-03</td><td>2026-09-08</td></tr>
                <tr><td>3</td><td>$15</td><td>2026-09-05</td><td>2026-09-08</td></tr>
                <tr><td>4</td><td>$150</td><td>2026-09-09</td><td>2026-09-10</td></tr>
              </tbody>
            </table>
            <p>Default price per day: <strong>$5</strong></p>
            <p>Searched period: <strong>2026-09-08</strong> to <strong>2026-09-11</strong></p>

            <div className="example-calc">
              <h4>Day-by-day breakdown:</h4>
              <p><strong>Sep 8</strong> — Period #2 ($60) covers it, but Period #3 ($15) was added later and also covers it, so <strong>$15</strong> wins.</p>
              <p><strong>Sep 9</strong> — Period #4 covers it → <strong>$150</strong></p>
              <p><strong>Sep 10</strong> — Period #4 covers it → <strong>$150</strong></p>
              <p><strong>Sep 11</strong> — No period covers this date → default price <strong>$5</strong></p>
              <p className="example-result">Result: 4 rental days, total price $320</p>
            </div>
          </Accordion>

          <Accordion title="Authentication Flow">
            <ul>
              <li>User submits username and password to <code>POST /api/auth/login</code>.</li>
              <li>The server looks up the user by username, then compares the submitted password against the stored bcrypt hash.</li>
              <li>If it matches, the server signs a JWT token with the user's id and username, set to expire in 24 hours.</li>
              <li>The frontend stores the token in <code>localStorage</code> and attaches it as a <code>Bearer</code> header on every subsequent request via an axios interceptor.</li>
              <li>Protected backend routes use <code>JwtAuthGuard</code> which extracts and verifies the token. If invalid or expired, it returns 401.</li>
              <li>On logout, the frontend removes the token from <code>localStorage</code>.</li>
            </ul>
          </Accordion>

          <Accordion title="What Does My Code Do (File by File)">
            <h4>Backend — Entry & Config</h4>
            <table>
              <thead><tr><th>File</th><th>What it does</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>backend/src/main.ts</code></td>
                  <td>Entry point. Creates the NestJS app, enables CORS so the frontend can talk to it, sets up global validation (rejects bad request bodies automatically), prefixes all routes with <code>/api</code>, and starts listening on port 3000.</td>
                </tr>
                <tr>
                  <td><code>backend/src/app.module.ts</code></td>
                  <td>Root module that wires everything together. Imports the config module (reads <code>.env</code>), sets up the TypeORM database connection, and imports all feature modules (auth, users, price-periods, settings).</td>
                </tr>
                <tr>
                  <td><code>backend/src/seed.ts</code></td>
                  <td>Standalone script (not part of the server). Connects to the database directly, checks if an admin user exists, and creates one with a hashed password if not. Run it once with <code>npm run seed</code> before starting the app.</td>
                </tr>
              </tbody>
            </table>

            <h4>Backend — Auth Module</h4>
            <table>
              <thead><tr><th>File</th><th>What it does</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>auth/auth.module.ts</code></td>
                  <td>Configures the auth module. Registers JWT with the secret from <code>.env</code> and a 24h expiration. Imports the Users module so the auth service can look up users.</td>
                </tr>
                <tr>
                  <td><code>auth/auth.controller.ts</code></td>
                  <td>Exposes <code>POST /api/auth/login</code>. Takes the request body, passes it to the auth service, and returns the result.</td>
                </tr>
                <tr>
                  <td><code>auth/auth.service.ts</code></td>
                  <td>Contains the login logic. Finds the user by username, compares the password with bcrypt, and if valid, signs and returns a JWT token. Throws 401 if credentials are wrong.</td>
                </tr>
                <tr>
                  <td><code>auth/jwt.strategy.ts</code></td>
                  <td>Tells Passport how to validate JWT tokens. Extracts the token from the Authorization header, verifies it with the secret, and puts the user data (<code>id</code>, <code>username</code>) on the request object.</td>
                </tr>
                <tr>
                  <td><code>auth/jwt-auth.guard.ts</code></td>
                  <td>A one-liner guard class. Put <code>@UseGuards(JwtAuthGuard)</code> on any route to make it require a valid token. If the token is missing or invalid, NestJS automatically returns 401.</td>
                </tr>
                <tr>
                  <td><code>auth/dto/login.dto.ts</code></td>
                  <td>Defines the shape of a login request body. Uses class-validator decorators to ensure <code>username</code> is a string and <code>password</code> is a non-empty string. Bad requests get rejected before reaching the service.</td>
                </tr>
              </tbody>
            </table>

            <h4>Backend — Users Module</h4>
            <table>
              <thead><tr><th>File</th><th>What it does</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>users/user.entity.ts</code></td>
                  <td>Defines the <code>users</code> table. Three columns: auto-generated <code>id</code>, unique <code>username</code>, and <code>password</code> (stores the bcrypt hash, never plain text).</td>
                </tr>
                <tr>
                  <td><code>users/users.service.ts</code></td>
                  <td>Provides two methods: <code>findByUsername()</code> used during login, and <code>create()</code> used by the seed script. No controller here because users are only accessed internally by the auth module.</td>
                </tr>
                <tr>
                  <td><code>users/users.module.ts</code></td>
                  <td>Registers the User entity with TypeORM and exports the UsersService so other modules (auth) can inject it.</td>
                </tr>
              </tbody>
            </table>

            <h4>Backend — Price Periods Module</h4>
            <table>
              <thead><tr><th>File</th><th>What it does</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>price-periods/price-period.entity.ts</code></td>
                  <td>Defines the <code>price_periods</code> table. Has <code>price_per_day</code> (decimal), <code>start_date</code> and <code>end_date</code> (date type), and <code>created_at</code> (auto-set timestamp). The <code>created_at</code> field is critical — it determines which period wins when dates overlap.</td>
                </tr>
                <tr>
                  <td><code>price-periods/price-periods.controller.ts</code></td>
                  <td>Defines all the REST endpoints. GET and calculate are public. POST, PUT, DELETE are protected with <code>JwtAuthGuard</code>. Each method delegates to the service and returns the result.</td>
                </tr>
                <tr>
                  <td><code>price-periods/price-periods.service.ts</code></td>
                  <td>The core of the app. Handles CRUD operations (find, create, update, delete) and contains the <code>calculatePrice()</code> method which loops through each day, checks all periods in creation order, and picks the right price. Also validates that start date is not after end date.</td>
                </tr>
                <tr>
                  <td><code>price-periods/price-periods.module.ts</code></td>
                  <td>Registers the PricePeriod entity and imports SettingsModule (because the calculation needs the default price).</td>
                </tr>
                <tr>
                  <td><code>price-periods/dto/create-price-period.dto.ts</code></td>
                  <td>Validates create requests: <code>price_per_day</code> must be a number &ge; 0, <code>start_date</code> and <code>end_date</code> must be valid date strings.</td>
                </tr>
                <tr>
                  <td><code>price-periods/dto/update-price-period.dto.ts</code></td>
                  <td>Same as create but all fields are optional — you can update just the price without touching the dates.</td>
                </tr>
                <tr>
                  <td><code>price-periods/dto/calculate-price.dto.ts</code></td>
                  <td>Validates the calculation request: just <code>start_date</code> and <code>end_date</code>, both required date strings.</td>
                </tr>
              </tbody>
            </table>

            <h4>Backend — Settings Module</h4>
            <table>
              <thead><tr><th>File</th><th>What it does</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>settings/setting.entity.ts</code></td>
                  <td>A generic key-value table. Used to store the default price per day. Could be extended for other settings later without schema changes.</td>
                </tr>
                <tr>
                  <td><code>settings/settings.service.ts</code></td>
                  <td>On startup (<code>onModuleInit</code>), inserts the default price row if it does not exist yet (value: 5). Provides <code>getDefaultPrice()</code> and <code>setDefaultPrice()</code> methods. Uses <code>upsert</code> for updates so it never creates duplicates.</td>
                </tr>
                <tr>
                  <td><code>settings/settings.controller.ts</code></td>
                  <td>GET is public (anyone can see the default price). PUT is protected (only admins can change it).</td>
                </tr>
                <tr>
                  <td><code>settings/dto/update-default-price.dto.ts</code></td>
                  <td>Validates the update: <code>price</code> must be a number &ge; 0.</td>
                </tr>
                <tr>
                  <td><code>settings/settings.module.ts</code></td>
                  <td>Registers the entity and exports SettingsService so the price-periods module can use it during calculations.</td>
                </tr>
              </tbody>
            </table>

            <h4>Frontend — Core</h4>
            <table>
              <thead><tr><th>File</th><th>What it does</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>frontend/src/main.tsx</code></td>
                  <td>Entry point. Renders the App component into the DOM and imports the global CSS reset.</td>
                </tr>
                <tr>
                  <td><code>frontend/src/App.tsx</code></td>
                  <td>Sets up routing and the auth provider. Wraps protected routes (<code>/admin</code>, <code>/docs</code>) in a <code>ProtectedRoute</code> component that redirects to login if unauthenticated. Also renders the Navbar and toast notifications.</td>
                </tr>
              </tbody>
            </table>

            <h4>Frontend — API Layer</h4>
            <table>
              <thead><tr><th>File</th><th>What it does</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>api/client.ts</code></td>
                  <td>Creates a single axios instance pointed at the backend. Has a request interceptor that reads the JWT from localStorage and attaches it as a Bearer token on every outgoing request.</td>
                </tr>
                <tr>
                  <td><code>api/types.ts</code></td>
                  <td>Shared TypeScript type definitions (<code>PricePeriod</code>, <code>CalculationResult</code>, <code>LoginResponse</code>). Keeps the types in one place so pages stay consistent.</td>
                </tr>
              </tbody>
            </table>

            <h4>Frontend — Hooks</h4>
            <table>
              <thead><tr><th>File</th><th>What it does</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>hooks/useAuth.tsx</code></td>
                  <td>Creates a React Context for auth state. On mount, checks localStorage for an existing token. Exposes <code>login()</code> (calls the API, stores token), <code>logout()</code> (clears token), <code>isLoggedIn</code>, and <code>username</code>. Every component in the app can access these via the <code>useAuth()</code> hook.</td>
                </tr>
              </tbody>
            </table>

            <h4>Frontend — Components</h4>
            <table>
              <thead><tr><th>File</th><th>What it does</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>components/Navbar.tsx</code></td>
                  <td>Top navigation bar. Shows "Calculator" link for everyone. When logged in, shows "Manage", "Docs", the username, and a logout button. On mobile, collapses into a hamburger menu with an animated open/close.</td>
                </tr>
              </tbody>
            </table>

            <h4>Frontend — Pages</h4>
            <table>
              <thead><tr><th>File</th><th>What it does</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>pages/CalculatorPage.tsx</code></td>
                  <td>Public page. Two date pickers (start/end), a calculate button. Sends the dates to <code>POST /api/price-periods/calculate</code> and displays the total price, rental days, and a day-by-day breakdown table.</td>
                </tr>
                <tr>
                  <td><code>pages/LoginPage.tsx</code></td>
                  <td>Simple login form. Calls <code>useAuth().login()</code>, redirects to <code>/admin</code> on success, shows an error message on failure.</td>
                </tr>
                <tr>
                  <td><code>pages/AdminPage.tsx</code></td>
                  <td>Protected page with two sections. Top section: edit the default price per day. Bottom section: a table of all price periods with edit/delete buttons, plus a form to add new ones. All changes are persisted through the API.</td>
                </tr>
                <tr>
                  <td><code>pages/DocsPage.tsx</code></td>
                  <td>This page. Protected. Shows accordion sections explaining the tech, architecture, and logic. Built so I can reference it during a walkthrough.</td>
                </tr>
              </tbody>
            </table>

            <h4>Frontend — Styles</h4>
            <table>
              <thead><tr><th>File</th><th>What it does</th></tr></thead>
              <tbody>
                <tr>
                  <td><code>styles/global.css</code></td>
                  <td>CSS reset and base styles. Sets the font, background color, and container max-width. Applied once in <code>main.tsx</code>.</td>
                </tr>
                <tr>
                  <td><code>styles/nav.css</code></td>
                  <td>Navbar styling including the hamburger menu animation and mobile breakpoint.</td>
                </tr>
                <tr>
                  <td><code>styles/calculator.css</code></td>
                  <td>Calculator page layout, date picker sizing, result box, and breakdown table.</td>
                </tr>
                <tr>
                  <td><code>styles/login.css</code></td>
                  <td>Login form centering and field styling.</td>
                </tr>
                <tr>
                  <td><code>styles/admin.css</code></td>
                  <td>Admin panel tables, period form fields, button variants, and responsive stacking.</td>
                </tr>
                <tr>
                  <td><code>styles/docs.css</code></td>
                  <td>Accordion component, code blocks, inline tags, example boxes, and table styling for this docs page.</td>
                </tr>
              </tbody>
            </table>
          </Accordion>

          <Accordion title="Frontend Architecture">
            <h4>Routing</h4>
            <p>
              Uses <code>react-router-dom</code> with three routes: <code>/</code> (calculator, public), <code>/login</code> (public), and <code>/admin</code> + <code>/docs</code> (protected). Protected routes are wrapped in a <code>ProtectedRoute</code> component that checks if the user is logged in — if not, it redirects to <code>/login</code>.
            </p>
            <h4>State Management</h4>
            <p>
              Auth state is managed through React Context (<code>useAuth</code> hook). It provides <code>isLoggedIn</code>, <code>username</code>, <code>login()</code>, and <code>logout()</code> to the entire app. Each page manages its own local state with <code>useState</code> — no external state library needed for an app this size.
            </p>
            <h4>API Layer</h4>
            <p>
              A single axios instance in <code>api/client.ts</code> is configured with the backend base URL. A request interceptor reads the JWT token from localStorage and attaches it. All pages import this client to make API calls.
            </p>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default DocsPage;
