import type { Booking, BookingAvailability, BookingResponse, CreateBookingInput, UpdateBookingInput } from '../types/booking.js';
import { AppError, ValidationError, type ValidationErrorDetail } from '../utils/error-handler.js';
import { debug } from '../utils/logger.js';
import { normalizeEmail, validateBookingInput } from '../utils/validation.js';
import type { BookingRepository } from './booking.repository.js';
import { bookingRepository } from './booking.repository.js';
import { customerService } from './customer.service.js';
import { launchService } from './launch.service.js';
import { rocketStore } from './rocketStore.js';

export class BookingService {
  constructor(private repository: BookingRepository) {}

  create(input: CreateBookingInput): BookingResponse {
    const errors = this.validateBookingInput(input);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    // Normalize email for consistent lookup
    const normalizedEmail = normalizeEmail(input.customerEmail);

    // Verify customer exists
    const customer = customerService.getByEmail(normalizedEmail);
    if (!customer) {
      throw new ValidationError([
        { field: 'customerEmail', message: 'Customer not found' },
      ]);
    }

    // Verify launch exists
    const launch = launchService.getById(input.launchId);
    if (!launch) {
      throw new ValidationError([
        { field: 'launchId', message: 'Launch not found' },
      ]);
    }

    // Verify launch status is active
    if (launch.status !== 'active') {
      throw new AppError(400, 'Launch is not available for booking');
    }

    // Get rocket to check capacity
    const rocket = rocketStore.getById(launch.rocketId);
    if (!rocket) {
      throw new AppError(500, 'Rocket not found for launch');
    }

    // Calculate availability
    const totalBooked = this.repository.calculateTotalBookedSeats(input.launchId);
    const availableSeats = rocket.capacity - totalBooked;

    // Verify sufficient seats available
    if (input.seatCount > availableSeats) {
      throw new AppError(400, 'Insufficient seats available');
    }

    // Create booking
    const now = new Date();
    const totalPrice = input.seatCount * launch.price;
    const booking: Booking = {
      id: (this.repository as any).generateId(),
      launchId: input.launchId,
      customerId: customer.id,
      seatCount: input.seatCount,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    const saved = this.repository.save(booking);

    debug('Booking created', {
      id: saved.id,
      launchId: saved.launchId,
      customerId: saved.customerId,
      seatCount: saved.seatCount,
      totalPrice: saved.totalPrice,
    });

    return this.buildBookingResponse(saved, customer.email, rocket.name, launch.price);
  }

  getById(id: string): BookingResponse | undefined {
    const booking = this.repository.findById(id);
    if (!booking) {
      return undefined;
    }

    const customer = customerService.getById(booking.customerId);
    const launch = launchService.getById(booking.launchId);
    const rocket = rocketStore.getById(launch?.rocketId || '');

    if (!customer || !launch || !rocket) {
      return undefined;
    }

    return this.buildBookingResponse(booking, customer.email, rocket.name, launch.price);
  }

  getByLaunchId(launchId: string): BookingResponse[] {
    const bookings = this.repository.findByLaunchId(launchId);
    return bookings.map((b) => {
      const customer = customerService.getById(b.customerId);
      const launch = launchService.getById(b.launchId);
      const rocket = rocketStore.getById(launch?.rocketId || '');

      if (!customer || !launch || !rocket) {
        throw new Error('Missing dependent data');
      }

      return this.buildBookingResponse(b, customer.email, rocket.name, launch.price);
    });
  }

  getByCustomerEmail(email: string): BookingResponse[] {
    const normalizedEmail = normalizeEmail(email);
    const customer = customerService.getByEmail(normalizedEmail);

    if (!customer) {
      return [];
    }

    const bookings = this.repository.findByCustomerId(customer.id);
    return bookings.map((b) => {
      const launch = launchService.getById(b.launchId);
      const rocket = rocketStore.getById(launch?.rocketId || '');

      if (!launch || !rocket) {
        throw new Error('Missing dependent data');
      }

      return this.buildBookingResponse(b, customer.email, rocket.name, launch.price);
    });
  }

  getAvailableSeats(launchId: string): number {
    const launch = launchService.getById(launchId);
    if (!launch) {
      throw new AppError(404, 'Launch not found');
    }

    const rocket = rocketStore.getById(launch.rocketId);
    if (!rocket) {
      throw new AppError(500, 'Rocket not found');
    }

    const totalBooked = this.repository.calculateTotalBookedSeats(launchId);
    return rocket.capacity - totalBooked;
  }

  getAvailability(launchId: string): BookingAvailability {
    const launch = launchService.getById(launchId);
    if (!launch) {
      throw new AppError(404, 'Launch not found');
    }

    const rocket = rocketStore.getById(launch.rocketId);
    if (!rocket) {
      throw new AppError(500, 'Rocket not found');
    }

    const totalBooked = this.repository.calculateTotalBookedSeats(launchId);
    return {
      launchId,
      totalSeats: rocket.capacity,
      bookedSeats: totalBooked,
      availableSeats: rocket.capacity - totalBooked,
    };
  }

  update(id: string, input: UpdateBookingInput): BookingResponse | undefined {
    const existing = this.repository.findById(id);
    if (!existing) {
      return undefined;
    }

    const updated: Booking = {
      ...existing,
      ...input,
      updatedAt: new Date(),
    };

    const saved = this.repository.update(updated);

    const customer = customerService.getById(saved.customerId);
    const launch = launchService.getById(saved.launchId);
    const rocket = rocketStore.getById(launch?.rocketId || '');

    if (!customer || !launch || !rocket) {
      return undefined;
    }

    return this.buildBookingResponse(saved, customer.email, rocket.name, launch.price);
  }

  delete(id: string): boolean {
    return this.repository.deleteById(id);
  }

  private validateBookingInput(input: CreateBookingInput): ValidationErrorDetail[] {
    return validateBookingInput(input);
  }

  private buildBookingResponse(
    booking: Booking,
    customerEmail: string,
    rocketName: string,
    launchPrice: number
  ): BookingResponse {
    return {
      ...booking,
      customerEmail,
      rocketName,
      launchPrice,
    };
  }
}

export const bookingService = new BookingService(bookingRepository);
