# Internal Operations Dashboard — Day 7

A full-stack internal tool for HR and Operations teams to monitor, manage, and automate employee engagement workflows.

---

## What It Does

- View real-time engagement metrics — employees, forms, pending, submitted, overdue
- Browse and filter form assignments by status (All, Pending, Submitted, Overdue)
- View individual employee form responses
- Trigger reminder emails to pending employees via UI button
- Cron job runs once daily at 9am to auto-send reminders
- Make.com webhook notifies Slack after every reminder execution (manual or cron)

---

## Folder Structure

```
Internal-Operations-Dashboard/
  backend/src/routes/       — dashboard.js, assignments.js, reminders.js, responses.js
  backend/src/config/       — supabase.js client
  backend/src/index.js      — Express server + node-cron job
  frontend/src/components/  — Metrics, Assignments, ResponseViewer, ReminderPanel
  frontend/src/App.jsx      — Main layout and tab navigation
  frontend/src/App.css      — Global styles
  README.md                 — This file
```

---

## Tech Stack

- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express
- **Database:** Supabase (PostgreSQL)
- **Scheduling:** node-cron (daily at 9am, inside Express)
- **Email:** Nodemailer + Gmail SMTP
- **Automation:** Make.com webhook + Slack notification
- **Version Control:** GitHub

---

## Database Requirements

Tables required in Supabase:

- `employees`
- `engagement_forms`
- `form_assignments` (with `reminder_count`, `last_reminder_sent_at`)
- `form_fields`
- `form_responses`
- `reminder_logs`

SQL to extend form_assignments and create reminder_logs:

```sql
ALTER TABLE form_assignments
  ADD COLUMN IF NOT EXISTS last_reminder_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reminder_count INTEGER DEFAULT 0;

CREATE TABLE IF NOT EXISTS reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES form_assignments(id),
  employee_id UUID REFERENCES employees(id),
  email TEXT,
  status TEXT CHECK (status IN ('sent', 'failed', 'skipped')),
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);
```

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
MAKE_WEBHOOK_URL=your_make_webhook_url
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
| GET | `/dashboard/metrics` | Returns total employees, forms, pending, submitted, overdue |
| GET | `/assignments?status=` | List assignments — filter by Pending / Submitted / overdue |
| GET | `/employee/:id/responses` | All form responses for a specific employee |
| POST | `/assignments/send-reminders` | Trigger reminder emails + Make webhook for due/overdue pending assignments |

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Reminder Logic

When triggered (manually or via cron):

1. Fetch all Pending assignments from Supabase
2. Filter to those due within 24 hours or already overdue
3. Send reminder email via Gmail SMTP
4. Log attempt to `reminder_logs` table
5. Update `reminder_count` and `last_reminder_sent_at` on the assignment
6. Fire Make.com webhook with summary
7. Make.com posts Slack notification to HR channel

---

## Cron Job

Runs automatically every day at 9am inside the Express server.

```
0 9 * * *
```

Calls the same `runReminderLogic()` function as the manual button — emails + Slack notification both fire.

---

## Make.com + Slack Integration

Scenario: **Integration Webhooks**

- Module 1 — Custom Webhook receives summary payload from backend
- Module 2 — Slack posts notification to HR channel

Fires on both manual UI button trigger and daily cron execution.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon or service key |
| `GMAIL_USER` | Gmail address for sending reminders |
| `GMAIL_APP_PASSWORD` | 16-character Gmail app password |
| `MAKE_WEBHOOK_URL` | Make.com custom webhook URL |
| `PORT` | Backend server port (default 3001) |

---

## GitHub

[github.com/NIRANJAN-R062007/Internal-Operations-Dashboard](https://github.com/NIRANJAN-R062007/Internal-Operations-Dashboard)
