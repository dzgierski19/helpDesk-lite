📌 Helpdesk Lite — Prompt-Driven Development (PDD)

Helpdesk Lite is a complete, two-tier system (Laravel + Angular) with triage, API integration, and a UI Storybook — built using a Prompt-Driven Development (PDD) approach with:

- **Gemini CLI** → generating prompts and commands
- **Codex (gpt-5.1-codex)** → generating code
- **project_spec.md** → single source of truth
- **notes/llm/** → LLM iteration logs

The repository contains a complete backend, frontend, Storybook, and a full LLM workflow.

---

### 🏗 Project Structure (monorepo)
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

---

### 🧠 Prompt-Driven Development (PDD)

In this project, code is not written manually.
Each major step:

1.  starts as a prompt for Gemini,
2.  Gemini generates a command → goes into `.gemini/commands.yaml`,
3.  `codex run` generates code,
4.  the result is saved in `notes/llm/`.

The entire process is transparent and reproducible.

To keep both CLIs in sync we mirror the slash commands into `.codex/codex.toml`.  
After editing `.gemini/commands.yaml`, run:

```
npm run sync:commands
```

This script regenerates the Codex config so `codex run <command>` and Gemini slash commands stay identical.

For a one-off run directly from the terminal (without the interactive Codex prompt), use:

```
npm run codex -- backend:make-migrations
```

That command reads the prompt from `.gemini/commands.yaml`, forwards it to `codex exec`, and automatically stores the full Markdown log in `notes/llm/`.

---

### 🧰 How to run the project
**Backend (Laravel)**
```bash
cd backend
composer install
php artisan migrate --seed
php artisan serve
```

Or in a Dockerized version (if using Docker Compose):
```bash
docker compose up --build
```

**Frontend (Angular)**
```bash
cd frontend
npm install
npm start
```

**Storybook**
```bash
cd frontend
npm run storybook
```

---

### 🔐 Roles and login

Login is "fake" — role selection from a dropdown:

- `admin`
- `agent`
- `reporter`

The role goes into:
- `localStorage.userRole`

The Angular Interceptor adds:
- `X-USER-ROLE: <role>`

Missing role → redirect to `/login`.

---

### 🗄 Git workflow (professional, used in the project)

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

---

### 📚 Definition of Done (DoD) – according to specification
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

---

### 🧩 LLMs used in the project

- **Google Gemini CLI** – generating prompts, reflection, iteration
- **OpenAI Codex (gpt-5.1-codex)** – generating backend, frontend, and Storybook code
- **project_spec.md** – single source of truth, included in all commands

---

### ✔ Summary

The repository contains:

- complete backend + frontend + Storybook,
- full PDD process used in practice,
- clear Git workflow,
- complete project specification,
- full LLM logs (proof of work).
