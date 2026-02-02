import express from 'express';
import { rocketRouter } from './routes/rocketRoutes.js';
import { launchRouter } from './routes/launchRoutes.js';
import { info } from './utils/logger.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/rockets', rocketRouter);
app.use('/api/launches', launchRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    info(`Server is running on http://localhost:${PORT}`);
    info(`Health endpoint http://localhost:${PORT}/health`);
  });
}

export { app };

