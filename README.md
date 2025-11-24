📌 Helpdesk Lite — Prompt-Driven Development (PDD)

## Overview
Helpdesk Lite is a complete two-tier support platform composed of a Laravel backend API, an Angular frontend, and a Storybook-powered design system. Every line of code is produced via Prompt-Driven Development: Gemini prompts define the desired change and OpenAI Codex executes those prompts to generate code. The stack, specification, and LLM logs live in this monorepo so the workflow is transparent and reproducible.

## 🏗 Project Structure (monorepo)
```
helpdesk-lite/
│
├── project_spec.md           # full product specification (source of truth)
├── README.md                 # instructions + workflow
├── .gemini/                  # commands for Gemini CLI
├── notes/llm/                # logs of prompts and model responses
│
├── backend/                  # Laravel 10 (API)
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── ...
│
└── frontend/                 # Angular + Storybook
    ├── src/
    ├── .storybook/
    ├── ...
```

## Prerequisites
- PHP 8.2+ with Composer
- Node.js 20+ with npm
- Angular CLI (`npm install -g @angular/cli`)
- Docker & Docker Compose (optional, for containerized workflow)

## Backend Setup
The backend is a Laravel API. Configure environment variables before running migrations (DB, cache, external API keys, etc.).

```bash
cd backend
composer install
cp .env.example .env
touch database/database.sqlite   # create SQLite file once
composer require laravel/sanctum
php artisan key:generate
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate --seed
```

Run the API locally:

```bash
php artisan serve
```

By default the project uses SQLite (handy for local dev and CI). To switch to MySQL/Postgres, edit `.env` and update the usual `DB_*` variables before running the migrations.

Or bring up the Docker environment (PHP + SQLite baked in) if you prefer container parity with CI:

```bash
docker compose up --build
```

Essential Artisan commands:

- `php artisan test` — backend feature/unit tests (used locally and in CI)
- `php artisan migrate` — apply pending migrations
- `php artisan db:seed` — reseed demo data
- `composer require laravel/sanctum` — install Sanctum before running auth-protected endpoints (already added to composer.json; re-run if vendor directory is reset)

### Environment configuration
- Default `.env` uses SQLite (`DB_CONNECTION=sqlite`, `DB_DATABASE=database/database.sqlite`). Ensure the file exists (`touch database/database.sqlite`) before running migrations.
- To switch to MySQL/Postgres, update `.env` accordingly, e.g.:
  ```
  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=helpdesk_lite
  DB_USERNAME=root
  DB_PASSWORD=secret
  ```
  Then rerun `php artisan migrate:fresh --seed`.
- Docker containers read the same `.env`, so any DB changes should be reflected there before `docker compose up`.
- Sanctum SPA config: set `SANCTUM_STATEFUL_DOMAINS` (default provided) when running the Angular app on a different host/port so cookies/tokens work.

## Frontend Setup
The Angular app uses the same prompt-driven workflow and Storybook design system.

```bash
cd frontend
npm install
# optional: API_PROXY_TARGET overrides the dev proxy (defaults to http://127.0.0.1:8000)
# API_PROXY_TARGET=http://backend:8000 npm start
npm start
```

Quality gates:

```bash
npm run lint
npm run test
npm run e2e
```

E2E tests rely on Playwright; install browsers if they are missing:

```bash
npx playwright install
```

Mock data toggle — useful for E2E suites or UI development without a backend:

```js
localStorage.useMockData = 'true';
```

Reset to real API data by removing the key or setting it to `'false'`.

### Hero counters
- The counters in the top hero (`Live tickets`, `Awaiting triage`, `Avg response`) read from the full ticket dataset fetched after login.
- Filtering the list only affects the table; the hero always shows totals for **all** tickets (filters are ignored for these stats).

## Storybook
Storybook documents the shared UI components that power the Angular frontend.

- Run locally: `cd frontend && npm run storybook`
- Build static bundle: `cd frontend && npm run build-storybook`
- Deploy: `cd frontend && npm run deploy-storybook` (builds and pushes `storybook-static/` to the `gh-pages` branch—set `GH_TOKEN` or configure git auth first). Once GitHub Pages is enabled for `gh-pages`, the docs publish to `https://<your-user>.github.io/helpDesk-lite/`.

## Docker workflow 
You can run both tiers via Docker Compose (hot reload enabled through bind mounts):

```bash
# from helpdesk-lite/
docker compose up --build backend frontend
```

- Backend runs at `http://localhost:8000` (the container executes `composer install`, copies `.env.example` if missing, runs migrations/seeds, then `php artisan serve`).
- Frontend runs at `http://localhost:4200` via `npm start --host 0.0.0.0 --port 4200`.
- Frontend proxy target is controlled via `API_PROXY_TARGET`; Docker Compose sets it to `http://backend:8000` so the Angular container talks to the backend service. For local CLI runs it falls back to `http://127.0.0.1:8000`. Because the app uses real Sanctum auth, always ensure the backend is running (and seeded) before `npm start` or `npm run e2e`, otherwise the SPA cannot log in or load tickets.
- Storybook can be started with `docker compose up storybook` (served on `http://localhost:6006`).

Use `docker compose exec backend php artisan migrate --seed` if you change migrations while the containers are running. Stop everything with `Ctrl+C` or `docker compose down`.

## API usage
All endpoints live under `/api/*`. Every request should include `X-USER-ROLE` (`admin`, `agent`, or `reporter`). Examples:

```bash
# List tickets
curl -s http://127.0.0.1:8000/api/tickets

# Create a ticket (reporter role)
curl -i -X POST http://127.0.0.1:8000/api/tickets \
  -H "Content-Type: application/json" \
  -H "X-USER-ROLE: reporter" \
  -d '{
        "title": "Customer cannot reset password",
        "description": "User reports password reset emails never arrive.",
        "priority": "high",
        "status": "new",
        "assignee_id": 2,
        "tags": ["auth", "email"]
      }'

# Partial update (PATCH)
curl -i -X PATCH http://127.0.0.1:8000/api/tickets/1 \
  -H "Content-Type: application/json" \
  -H "X-USER-ROLE: admin" \
  -d '{"status":"resolved","priority":"low"}'

# Delete a ticket
curl -i -X DELETE http://127.0.0.1:8000/api/tickets/1 \
  -H "X-USER-ROLE: admin"
```

Validation errors return HTTP 422 with JSON bodies (e.g., `{"message":"The title field is required.","errors":{"title":["..."]}}`).

### Default credentials
Seeder creates three demo accounts:

| Role     | Email                | Password |
|----------|---------------------|----------|
| Admin    | `admin@example.com` | `password` |
| Agent    | `agent@example.com` | `password` |
| Reporter | `reporter@example.com` | `password` |

Only these `@example.com` accounts exist—make sure you enter them exactly as above when signing in (older docs referencing `helpdesk.test` are obsolete). Password hashes live in `database/seeders/DatabaseSeeder.php`.

### External API integration
`GET /api/external/user-info` proxies [JsonPlaceholder](https://jsonplaceholder.typicode.com/users/1). Responses are cached for 10 minutes, and failures return `{"error":"external_api_failed"}` (HTTP 502) so the frontend can display a fallback (“N/A” + snackbar).

## LLM Workflow
Prompt-Driven Development (PDD) keeps code generation deterministic:

1. **Prompt definition (Gemini CLI)** – Every change begins with a Gemini iteration; the final prompt is captured in `.gemini/commands.yaml` (always referencing `{{file "project_spec.md"}}`).
2. **Optional Codex sync** – `npm run sync:commands` converts the Gemini entry into `.codex/codex.toml` if we plan to run `codex`.
3. **Code generation (Codex CLI)** – `codex run <command>` (or `npm run codex -- <command>`) asks the agent to produce backend/frontend/Storybook code.
4. **Code review** – The output is reviewed (with Codex’s help or manually) and any fixes are applied.
5. **Finalization** – Once accepted, the change is committed and Gemini writes a summary in `notes/llm/<prompt>-${timestamp}.md`.
6. **Archiving** – We don’t commit the entire `notes/llm` directory; a single representative log (e.g., `notes/llm/backend_refactor-tests-unit-2025-11-18T20-29-00.058Z.md`) is enough to show how the LLM performed the task.

This process ensures Gemini prompts and Codex execution stay aligned, giving us reproducible generation for backend, frontend, and Storybook features.

## Continuous Integration
GitHub Actions at `.github/workflows/ci.yml` enforce guardrails on every push:

- Backend job: installs Composer dependencies and runs `php artisan test`.
- Frontend job: executes `npm run lint`, `npm run test`, and `npm run e2e`.
- Storybook job: builds via `npm run build-storybook` and deploys/publishes the static bundle.

## Verification Checklist
Run these commands (in order) to verify the entire system:

```bash
cd backend && php artisan test
cd frontend && npm run lint
cd frontend && npm run test
cd frontend && npm run e2e
cd frontend && npm run build-storybook
```

## 🔐 Roles and login
Authentication now uses Sanctum personal-access tokens (no dropdown). Use the seeded accounts above to obtain a token via `/api/login`; the SPA stores it and attaches `Authorization: Bearer …` to every request.

The role goes into:
- `localStorage.userRole`

The Angular Interceptor adds:
- `X-USER-ROLE: <role>`

Missing role → redirect to `/login`.

## 🗄 Git workflow (professional, used in the project)
The project uses a simple, clear workflow:

**Branches**

- `main` → stable, final version of the task
- `dev` → current work
- `feat/*` → feature branches

**Accepted commit types**

- `chore`: configs, structure
- `feat`: functionality
- `fix`: bug fixes
- `docs`: documentation
- `refactor`: refactoring

**Examples:**
```
chore: initial project structure (backend + frontend)
feat(backend): add Ticket model and migrations
feat(frontend): implement login flow
docs: describe LLM Flow in README
```

## 📚 Definition of Done (DoD) – according to specification
**Backend**

- ✔ CRUD tickets
- ✔ filtering
- ✔ roles (reporter sees only their own)
- ✔ triage mock
- ✔ API integration + cache
- ✔ seeds

**Frontend**

- ✔ login & role
- ✔ redirect on missing role
- ✔ interceptor
- ✔ list
- ✔ details + triage + userInfo

**Storybook**

- ✔ PriorityBadge – 3 stories
- ✔ TicketCard – 3 stories

**LLM Flow**

- ✔ `.gemini/commands.yaml`
- ✔ full logs in `notes/llm/`
- ✔ README describes the process


## 🧩 LLMs used in the project

- **Google Gemini CLI** – generating prompts, reflection, iteration
- **OpenAI Codex (gpt-5.1-codex)** – generating backend, frontend, and Storybook code
- **project_spec.md** – single source of truth, included in all commands

## ✔ Summary
The repository contains:

- complete backend + frontend + Storybook,
- full PDD process used in practice,
- clear Git workflow,
- complete project specification,
- full LLM logs (proof of work).
