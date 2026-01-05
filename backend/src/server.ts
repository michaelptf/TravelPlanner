import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import tripsRouter from './routes/trips';
import scheduleRouter from './routes/schedule';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api/trips', tripsRouter);
app.use('/api/schedule', scheduleRouter);
import expensesRouter from './routes/expenses';
app.use('/api/expenses', expensesRouter);
app.use('/api/dev', require('./routes/dev').default);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
