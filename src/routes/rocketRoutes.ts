import { Request, Response, Router } from 'express';
import { rocketStore } from '../services/rocketStore.js';
import { CreateRocketInput, RocketRange } from '../types/rocket.js';

export const rocketRouter = Router();

// POST /api/rockets - Create a new rocket
rocketRouter.post('/', (req: Request, res: Response) => {
  try {
    const input: CreateRocketInput = req.body;
    const rocket = rocketStore.create(input);
    res.status(201).json(rocket);
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'status' in error && 'errors' in error) {
      const err = error as { status: number; errors: Array<{ field: string; message: string }> };
      res.status(err.status).json({ error: 'Validation error', details: err.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// GET /api/rockets/:id - Get rocket by ID
rocketRouter.get('/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const rocket = rocketStore.getById(id);
  if (!rocket) {
    res.status(404).json({ error: 'Rocket not found' });
    return;
  }
  res.status(200).json(rocket);
});

// GET /api/rockets - Get all rockets with filtering and pagination
rocketRouter.get('/', (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize as string) || 10));
  const range = (req.query.range as RocketRange) || undefined;
  const minCapacity = req.query.minCapacity ? parseInt(req.query.minCapacity as string) : undefined;

  const result = rocketStore.getAll(page, pageSize, range, minCapacity);
  res.status(200).json(result);
});

// PUT /api/rockets/:id - Update rocket
rocketRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const rocket = rocketStore.update(id, req.body);
    if (!rocket) {
      res.status(404).json({ error: 'Rocket not found' });
      return;
    }
    res.status(200).json(rocket);
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'status' in error && 'errors' in error) {
      const err = error as { status: number; errors: Array<{ field: string; message: string }> };
      res.status(err.status).json({ error: 'Validation error', details: err.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// DELETE /api/rockets/:id - Delete rocket
rocketRouter.delete('/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const deleted = rocketStore.delete(id);
  if (!deleted) {
    res.status(404).json({ error: 'Rocket not found' });
    return;
  }
  res.status(204).send();
});
