const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function runReminderLogic() {
  const now = new Date().toISOString();

  const { data: assignments, error } = await supabase
    .from('form_assignments')
    .select(`
      id,
      due_date,
      employees (
        id,
        employee_name,
        employee_email
      ),
      engagement_forms (
        name
      )
    `)
    .eq('status', 'Pending');

  if (error) throw new Error(error.message);

  let remindersSent = 0;
  let skipped = 0;
  let failed = 0;

  for (const assignment of assignments) {
    const employee = assignment.employees;
    const form = assignment.engagement_forms;
    const dueDate = new Date(assignment.due_date);
    const hoursUntilDue = (dueDate - new Date()) / (1000 * 60 * 60);

    // Only remind if overdue OR due within 24 hours
    if (hoursUntilDue > 24) {
      skipped++;
      continue;
    }

    try {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: employee.employee_email,
        subject: `Reminder: "${form.name}" is due soon`,
        text: `Hi ${employee.employee_name},\n\nThis is a reminder that your form "${form.name}" is due on ${dueDate.toDateString()}.\n\nPlease complete it as soon as possible.\n\nRegards,\nHechaar HR Team`,
      });

      // Log success
      await supabase.from('reminder_logs').insert({
        assignment_id: assignment.id,
        employee_id: employee.id,
        email: employee.employee_email,
        status: 'sent',
        sent_at: now,
      });

      // Update assignment tracking
      await supabase
        .from('form_assignments')
        .update({
          last_reminder_sent_at: now,
          reminder_count: (assignment.reminder_count || 0) + 1,
        })
        .eq('id', assignment.id);

      remindersSent++;

    } catch (emailErr) {
      // Log failure
      await supabase.from('reminder_logs').insert({
        assignment_id: assignment.id,
        employee_id: employee.id,
        email: employee.employee_email,
        status: 'failed',
        error_message: emailErr.message,
        sent_at: now,
      });

      failed++;
    }
  }

  return {
    checked: assignments.length,
    remindersSent,
    skipped,
    failed,
  };
}

// POST /assignments/send-reminders
router.post('/send-reminders', async (req, res) => {
  try {
    const summary = await runReminderLogic();
    return res.json(summary);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = { router, runReminderLogic };
