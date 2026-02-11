import { Request, Response, Router } from 'express';
import { rocketStore } from '../services/rocketStore.js';
import { CreateRocketInput, RocketRange } from '../types/rocket.js';
import { handleError, parsePaginationParams, parseIntParam, parseStringParam } from '../utils/error-handler.js';

export const rocketRouter = Router();

// POST /api/rockets - Create a new rocket
rocketRouter.post('/', (req: Request, res: Response) => {
  try {
    const input: CreateRocketInput = req.body;
    const rocket = rocketStore.create(input);
    res.status(201).json(rocket);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/rockets/:id - Get rocket by ID
rocketRouter.get('/:id', (req: Request, res: Response) => {
  const id = parseStringParam(req.params.id);
  if (!id) {
    res.status(400).json({ error: 'Rocket ID is required' });
    return;
  }

  const rocket = rocketStore.getById(id);
  if (!rocket) {
    res.status(404).json({ error: 'Rocket not found' });
    return;
  }
  res.status(200).json(rocket);
});

// GET /api/rockets - Get all rockets with filtering and pagination
rocketRouter.get('/', (req: Request, res: Response) => {
  const { page, pageSize } = parsePaginationParams(req.query.page as string, req.query.pageSize as string);
  const range = (req.query.range as RocketRange) || undefined;
  const minCapacity = req.query.minCapacity ? parseIntParam(req.query.minCapacity as string, 0) : undefined;

  const result = rocketStore.getAll(page, pageSize, range, minCapacity);
  res.status(200).json(result);
});

// PUT /api/rockets/:id - Update rocket
rocketRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseStringParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Rocket ID is required' });
      return;
    }

    const rocket = rocketStore.update(id, req.body);
    if (!rocket) {
      res.status(404).json({ error: 'Rocket not found' });
      return;
    }
    res.status(200).json(rocket);
  } catch (error) {
    handleError(error, res);
  }
});

// DELETE /api/rockets/:id - Delete rocket
rocketRouter.delete('/:id', (req: Request, res: Response) => {
  const id = parseStringParam(req.params.id);
  if (!id) {
    res.status(400).json({ error: 'Rocket ID is required' });
    return;
  }

  const deleted = rocketStore.delete(id);
  if (!deleted) {
    res.status(404).json({ error: 'Rocket not found' });
    return;
  }
  res.status(204).send();
});
