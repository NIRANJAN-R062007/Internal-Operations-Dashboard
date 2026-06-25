const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/metrics', async (req, res) => {
  try {
    const now = new Date().toISOString();

    const [
      { count: totalEmployees },
      { count: totalForms },
      { count: pendingAssignments },
      { count: submittedAssignments },
      { count: overdueAssignments },
    ] = await Promise.all([
      supabase.from('employees').select('*', { count: 'exact', head: true }),
      supabase.from('engagement_forms').select('*', { count: 'exact', head: true }),
      supabase.from('form_assignments').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
      supabase.from('form_assignments').select('*', { count: 'exact', head: true }).eq('status', 'Submitted'),
      supabase.from('form_assignments').select('*', { count: 'exact', head: true }).eq('status', 'Pending').lt('due_date', now),
    ]);

    return res.json({
      totalEmployees,
      totalForms,
      pendingAssignments,
      submittedAssignments,
      overdueAssignments,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
