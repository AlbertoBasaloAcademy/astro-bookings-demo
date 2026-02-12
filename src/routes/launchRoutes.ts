import { Request, Response, Router } from 'express';
import { bookingService } from '../services/booking.service.js';
import { launchService } from '../services/launch.service.js';
import { rocketStore } from '../services/rocketStore.js';
import type { CreateLaunchInput } from '../types/launch.js';
import { handleError, parseStringParam } from '../utils/error-handler.js';
import { info } from '../utils/logger.js';

export const launchRouter = Router();

// POST /api/launches - Create a new launch
launchRouter.post('/', (req: Request, res: Response) => {
  try {
    const input: CreateLaunchInput = req.body;
    const launch = launchService.create(input);
    info('Launch created successfully', { launchId: launch.id });
    res.status(201).json(launch);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/launches/:id - Get launch by ID with availability
launchRouter.get('/:id', (req: Request, res: Response) => {
  const id = parseStringParam(req.params.id);
  if (!id) {
    res.status(400).json({ error: 'Launch ID is required' });
    return;
  }

  const launch = launchService.getById(id);
  if (!launch) {
    res.status(404).json({ error: 'Launch not found' });
    return;
  }

  const rocket = rocketStore.getById(launch.rocketId);
  if (!rocket) {
    res.status(500).json({ error: 'Associated rocket not found' });
    return;
  }

  // TODO: Get booked passengers from booking service (step 7)
  const bookedPassengers = 0;
  const availableSeats = rocket.capacity - bookedPassengers;

  const response = {
    ...launch,
    rocketName: rocket.name,
    totalSeats: rocket.capacity,
    bookedPassengers,
    availableSeats,
  };

  res.status(200).json(response);
});

// GET /api/launches - Get all launches with availability
launchRouter.get('/', (req: Request, res: Response) => {
  const launches = launchService.getAll();

  const launchesWithAvailability = launches.map((launch) => {
    const rocket = rocketStore.getById(launch.rocketId);
    if (!rocket) {
      return launch;
    }

    // TODO: Get booked passengers from booking service (step 7)
    const bookedPassengers = 0;
    const availableSeats = rocket.capacity - bookedPassengers;

    return {
      ...launch,
      rocketName: rocket.name,
      totalSeats: rocket.capacity,
      bookedPassengers,
      availableSeats,
    };
  });

  res.status(200).json(launchesWithAvailability);
});

// PUT /api/launches/:id - Update launch
launchRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseStringParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Launch ID is required' });
      return;
    }

    const launch = launchService.update(id, req.body);
    if (!launch) {
      res.status(404).json({ error: 'Launch not found' });
      return;
    }

    const rocket = rocketStore.getById(launch.rocketId);
    const bookedPassengers = 0;
    const availableSeats = rocket ? rocket.capacity - bookedPassengers : 0;

    const response = {
      ...launch,
      rocketName: rocket?.name,
      totalSeats: rocket?.capacity,
      bookedPassengers,
      availableSeats,
    };

    res.status(200).json(response);
  } catch (error) {
    handleError(error, res);
  }
});

// DELETE /api/launches/:id - Delete launch
launchRouter.delete('/:id', (req: Request, res: Response) => {
  const id = parseStringParam(req.params.id);
  if (!id) {
    res.status(400).json({ error: 'Launch ID is required' });
    return;
  }

  const deleted = launchService.delete(id);
  if (!deleted) {
    res.status(404).json({ error: 'Launch not found' });
    return;
  }

  info('Launch deleted', { launchId: id });
  res.status(204).send();
});

// GET /api/launches/:launchId/availability - Get available seats for a launch
launchRouter.get('/:launchId/availability', (req: Request, res: Response) => {
  try {
    const launchId = parseStringParam(req.params.launchId);
    if (!launchId) {
      res.status(400).json({ error: 'Launch ID is required' });
      return;
    }

    const availability = bookingService.getAvailability(launchId);
    res.status(200).json(availability);
  } catch (error) {
    handleError(error, res);
  }
});
