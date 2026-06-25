# Internal Operations Dashboard — Day 7

A full-stack internal tool for HR and Operations teams to monitor, manage, and automate employee engagement workflows.

---

## What It Does

- View real-time engagement metrics (employees, forms, pending, submitted, overdue)
- Browse and filter form assignments by status
- View individual employee form responses
- Trigger reminder emails to pending employees
- Cron job runs every minute to auto-send reminders for due/overdue assignments

---

## Folder Structure

```
Internal-Operations-Dashboard/
  backend/      Node.js + Express API
  frontend/     React + Vite dashboard
```

---

## Tech Stack

- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express, node-cron, Nodemailer
- **Database:** Supabase (PostgreSQL)
- **Email:** Gmail SMTP (App Password)

---

## Database Requirements

Tables required in Supabase:

- `employees`
- `engagement_forms`
- `form_assignments` (with `reminder_count`, `last_reminder_sent_at`)
- `form_responses`
- `form_fields`
- `reminder_logs`

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password
PORT=3001
```

Start the server:

```bash
node src/index.js
```

---

## API List

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/metrics` | Summary counts |
| GET | `/assignments?status=` | List assignments with filter |
| GET | `/employee/:id/responses` | Employee form responses |
| POST | `/assignments/send-reminders` | Trigger reminder emails |

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Cron Job

Runs automatically every minute inside the Express server.

Checks for:
- Pending assignments with due date within 24 hours
- Overdue pending assignments

Then sends reminder emails and logs results to `reminder_logs` table.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon/service key |
| `GMAIL_USER` | Gmail address for sending |
| `GMAIL_APP_PASSWORD` | Gmail app password (16 chars) |
| `PORT` | Backend port (default 3001) |
