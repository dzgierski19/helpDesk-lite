# Helpdesk Lite — Project Specification

---

# 1. Cel systemu

Celem jest stworzenie MVP systemu **Helpdesk Lite**, które umożliwia:

- tworzenie i przeglądanie ticketów,
- filtrowanie listy ticketów,
- podstawowy triage (mock),
- pobranie danych z zewnętrznego API,
- prezentację komponentów w Storybooku,
- pracę w podejściu Prompt-Driven Development (PDD).

---

# 2. Model danych (Backend)

System zawiera **dokładnie trzy modele**:

- `Ticket`
- `User`
- `TicketStatusChange`

Nie wolno dodawać innych modeli bez zmian w tym dokumencie.

---

## 2.1 `Ticket`

| Pole        | Typ             | Uwagi                            |
|-------------|-----------------|----------------------------------|
| id          | int, PK         | auto-increment                   |
| title       | string(255)     | wymagane                         |
| description | text            | wymagane                         |
| priority    | enum            | `low`, `medium`, `high`          |
| status      | enum            | `new`, `in_progress`, `resolved` |
| assignee_id | int, nullable   | FK do `users.id`                 |
| creator_id  | int             | FK do `users.id`, wymagane       |
| tags        | json            | tablica stringów                 |
| created_at  | timestamp       |                                  |
| updated_at  | timestamp       |                                  |

---

## 2.2 `User`

| Pole | Typ     | Uwagi                           |
|------|---------|---------------------------------|
| id   | int, PK |                                 |
| name | string  |                                 |
| role | enum    | `admin`, `agent`, `reporter`    |

Użytkownicy są seedowani i używani bez logowania.

---

## 2.3 `TicketStatusChange`

Historia zmian statusów ticketu.

| Pole       | Typ      |
|------------|----------|
| id         | int, PK  |
| ticket_id  | FK       |
| old_status | enum     | `new`, `in_progress`, `resolved` |
| new_status | enum     | `new`, `in_progress`, `resolved` |
| changed_at | timestamp |

### Logika biznesowa:
Rekord `TicketStatusChange` tworzony jest **automatycznie przy każdej zmianie `status`** w modelu `Ticket`, wywołanej przez:

PUT /tickets/{id}

# 3. Backend — API

Backend: **Laravel 10+**  
Wszystkie endpointy zwracają **JSON**.

---

## 3.1 Tickets CRUD

| Metoda | Endpoint        | Opis          |
|--------|-----------------|---------------|
| GET    | /tickets        | lista + filtry|
| POST   | /tickets        | tworzenie     |
| GET    | /tickets/{id}   | szczegóły     |
| PUT    | /tickets/{id}   | edycja        |
| DELETE | /tickets/{id}   | usunięcie     |

### Format odpowiedzi GET /tickets/{id}

Odpowiedź **zawiera zagnieżdżony obiekt `assignee`**, jeśli `assignee_id` ≠ null:

```json
{
  "id": 1,
  "title": "...",
  "priority": "medium",
  "status": "in_progress",
  "assignee": {
    "id": 3,
    "name": "John Doe"
  }
}
```

### Filtrowanie listy ticketów
Obsługiwane parametry:

- `status`
- `priority`
- `assignee_id`
- `tag` → dopasowanie do tags (json-array)

### Logika autoryzacji dla GET /tickets
- Jeśli nagłówek `X-USER-ROLE` ma wartość `reporter`, endpoint zwraca tylko te tickety, gdzie `creator_id` odpowiada ID użytkownika z roli `reporter` (np. `users.id = 1`).
- Dla ról `admin` i `agent` endpoint zwraca wszystkie tickety.

## 3.2 Triage (mock)
Endpoint:

POST /tickets/{id}/triage-suggest
Zawsze zwraca deterministyczny mock:

```json
{
  "suggested_status": "in_progress",
  "suggested_priority": "high",
  "suggested_tags": ["triage", "auto"]
}
```

## 3.3 Integracja z zewnętrznym API
Endpoint:

GET /external/user-info
Backend wykonuje zapytanie:

https://jsonplaceholder.typicode.com/users/1
Aby ograniczyć liczbę zapytań, wynik powinien być cache’owany przez ok. 10 minut.

Sukces:
Zwraca przetworzony JSON zawierający:

- `name`

Błąd:
```json
{ "error": "external_api_failed" }
```

# 4. Frontend (Angular)
Framework: Angular 16+

Aplikacja ma trzy sekcje:

- Fake Login
- Ticket List
- Ticket Details

## 4.1 Fake Login
Route: /login

Dropdown z rolami: admin, agent, reporter

Po kliknięciu:

- zapis roli w localStorage.userRole
- redirect na /tickets

### Zachowanie przy braku roli
Jeśli localStorage.userRole nie istnieje:

- interceptor nie dodaje nagłówka,
- aplikacja przekierowuje automatycznie na /login.

### Interceptor HTTP
Dodaje nagłówek:

`X-USER-ROLE: <rola>`
o ile rola istnieje.

## 4.2 Ticket List
Route: /tickets

Pobiera listę ticketów (GET /tickets)

Wyświetla:

- `title`
- `priority`
- `status`

Kliknięcie elementu → /tickets/:id

## 4.3 Ticket Details
Route: /tickets/:id

Pobiera dane (GET /tickets/{id})

Wyświetla:

- `title`
- `description`
- `priority`
- `status`
- `tags`
- `assignee` (jeśli istnieje)

### Sekcja Triage
- przycisk: „Zasugeruj triage”
- wywołuje: `POST /tickets/{id}/triage-suggest`
- wyświetla wynik w UI

### Sekcja User Info
- wywołuje: `GET /external/user-info`
- wyświetla `name`

# 5. Storybook
System posiada dwa własne komponenty do przedstawienia w Storybooku.

## 5.1 PriorityBadge
Props:

- `priority: 'low' | 'medium' | 'high'`

Wyświetlanie:

- `low` → zielony
- `medium` → żółty
- `high` → czerwony

Stories:

- Low
- Medium
- High

## 5.2 TicketCard
Props:

- `title: string`
- `priority: 'low' | 'medium' | 'high'`
- `status: string`

Stories:

- Default
- Loading
- Error

# 6. LLM Flow — założenia
Projekt jest tworzony w podejściu Prompt-Driven Development (PDD).

- `project_spec.md` → jedyne źródło prawdy, ładowane w każdej komendzie.
- `Gemini CLI` → tworzy prompty oraz sekcje `.gemini/commands.yaml`.
- `Codex CLI (gpt-5.1-codex)` → generuje kod backendu, frontendu i Storybooka.
- `notes/llm/` → logi z iteracji promptów i outputów.
- `Rola człowieka` → integracja plików, testowanie, refleksja.

Każda komenda w `.gemini/commands.yaml` zawiera:

`{{file "project_spec.md"}}`

# 7. Definition of Done (DoD)

### Backend
- CRUD tickets działa
- filtrowanie działa
- triage działa (mock)
- integracja z API działa
- cache działa
- seedery obecne

### Frontend
- routing działa
- login zapisuje rolę
- redirect działa
- interceptor dodaje nagłówek
- lista ticketów działa
- szczegóły działają
- triage i user info działają

### Storybook
- PriorityBadge: 3 stories
- TicketCard: 3 stories

### LLM Flow
- `.gemini/commands.yaml` 
- logi w `notes/llm/`
- `README` opisuje uruchamianie i workflow