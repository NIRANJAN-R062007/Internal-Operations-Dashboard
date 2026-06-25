const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /assignments?status=pending|submitted|overdue
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const now = new Date().toISOString();

    let query = supabase
      .from('form_assignments')
      .select(`
        id,
        status,
        due_date,
        submitted_at,
        reminder_count,
        last_reminder_sent_at,
        employees (
          id,
          employee_name,
          employee_email
        ),
        engagement_forms (
          id,
          name
        )
      `)
      .order('due_date', { ascending: true });

    if (status === 'overdue') {
      query = query.eq('status', 'pending').lt('due_date', now);
    } else if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) return res.status(500).json({ error: error.message });

    return res.json({ assignments: data });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
