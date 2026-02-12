import { Booking } from '../types/booking.js';

export class InMemoryBookingStore {
  private bookings: Map<string, Booking> = new Map();
  private nextId: number = 1;

  generateId(): string {
    return String(this.nextId++);
  }

  addBooking(booking: Booking): void {
    this.bookings.set(booking.id, booking);
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  getBookingsByLaunchId(launchId: string): Booking[] {
    return Array.from(this.bookings.values()).filter((b) => b.launchId === launchId);
  }

  getBookingsByCustomerId(customerId: string): Booking[] {
    return Array.from(this.bookings.values()).filter((b) => b.customerId === customerId);
  }

  getAllBookings(): Booking[] {
    return Array.from(this.bookings.values());
  }

  updateBooking(booking: Booking): void {
    this.bookings.set(booking.id, booking);
  }

  deleteBooking(id: string): boolean {
    return this.bookings.delete(id);
  }
}
