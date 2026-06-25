const express = require('express');
const cron = require('node-cron');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const responsesRouter = require('./routes/responses');
const submitRouter = require('./routes/submit');
const dashboardRouter = require('./routes/dashboard');
const assignmentsRouter = require('./routes/assignments');
const { router: remindersRouter, runReminderLogic } = require('./routes/reminders');

app.use('/employee', responsesRouter);
app.use('/form-response', submitRouter);
app.use('/dashboard', dashboardRouter);
app.use('/assignments', assignmentsRouter);
app.use('/assignments', remindersRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Employee Engagement API is running' });
});

// Cron job — every minute for testing
cron.schedule('* * * * *', async () => {
  console.log('[CRON] Running reminder check...');
  try {
    const summary = await runReminderLogic();
    console.log('[CRON] Done:', summary);
  } catch (err) {
    console.error('[CRON] Error:', err.message);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
