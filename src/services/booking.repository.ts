import { Booking } from '../types/booking.js';
import { InMemoryBookingStore } from './bookingStore.js';

export interface BookingRepository {
  save(booking: Booking): Booking;
  findById(id: string): Booking | undefined;
  findByLaunchId(launchId: string): Booking[];
  findByCustomerId(customerId: string): Booking[];
  findAll(): Booking[];
  update(booking: Booking): Booking;
  deleteById(id: string): boolean;
  calculateTotalBookedSeats(launchId: string): number;
}

export class InMemoryBookingRepository implements BookingRepository {
  private store: InMemoryBookingStore;

  constructor() {
    this.store = new InMemoryBookingStore();
  }

  generateId(): string {
    return this.store.generateId();
  }

  save(booking: Booking): Booking {
    this.store.addBooking(booking);
    return booking;
  }

  findById(id: string): Booking | undefined {
    return this.store.getBookingById(id);
  }

  findByLaunchId(launchId: string): Booking[] {
    return this.store
      .getBookingsByLaunchId(launchId)
      .filter((b) => b.status !== 'cancelled');
  }

  findByCustomerId(customerId: string): Booking[] {
    return this.store.getBookingsByCustomerId(customerId);
  }

  findAll(): Booking[] {
    return this.store.getAllBookings();
  }

  update(booking: Booking): Booking {
    this.store.updateBooking(booking);
    return booking;
  }

  deleteById(id: string): boolean {
    return this.store.deleteBooking(id);
  }

  calculateTotalBookedSeats(launchId: string): number {
    return this.findByLaunchId(launchId).reduce((sum, b) => sum + b.seatCount, 0);
  }
}

export const bookingRepository = new InMemoryBookingRepository();
