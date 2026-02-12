import { Request, Response, Router } from 'express';
import { bookingService } from '../services/booking.service.js';
import type { CreateBookingInput } from '../types/booking.js';
import { handleError, parseStringParam } from '../utils/error-handler.js';
import { info } from '../utils/logger.js';

export const bookingRouter = Router();

// POST /api/bookings - Create a new booking
bookingRouter.post('/', (req: Request, res: Response) => {
  try {
    const input: CreateBookingInput = req.body;
    const booking = bookingService.create(input);
    info('Booking created successfully', { bookingId: booking.id });
    res.status(201).json(booking);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/bookings/launch/:launchId - Get all bookings for a launch (specific route first)
bookingRouter.get('/launch/:launchId', (req: Request, res: Response) => {
  try {
    const launchId = parseStringParam(req.params.launchId);
    if (!launchId) {
      res.status(400).json({ error: 'Launch ID is required' });
      return;
    }

    const bookings = bookingService.getByLaunchId(launchId);
    res.status(200).json(bookings);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/bookings/customer/:email - Get all bookings for a customer (specific route)
bookingRouter.get('/customer/:email', (req: Request, res: Response) => {
  try {
    const email = parseStringParam(req.params.email);
    if (!email) {
      res.status(400).json({ error: 'Customer email is required' });
      return;
    }

    const bookings = bookingService.getByCustomerEmail(email);
    res.status(200).json(bookings);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/bookings/:id - Get booking by ID (general route last)
bookingRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseStringParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Booking ID is required' });
      return;
    }

    const booking = bookingService.getById(id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.status(200).json(booking);
  } catch (error) {
    handleError(error, res);
  }
});
