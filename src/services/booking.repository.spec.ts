import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Booking } from '../types/booking.js';
import { InMemoryBookingRepository } from './booking.repository.js';

describe('InMemoryBookingRepository', () => {
  let repository: InMemoryBookingRepository;

  beforeEach(() => {
    repository = new InMemoryBookingRepository();
  });

  describe('save and findById', () => {
    it('should save and retrieve a booking', () => {
      const booking: Booking = {
        id: 'booking-1',
        launchId: 'launch-1',
        customerId: 'customer-1',
        seatCount: 2,
        totalPrice: 500,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const saved = repository.save(booking);

      expect(saved).toEqual(booking);

      const found = repository.findById('booking-1');
      expect(found).toEqual(booking);
    });

    it('should return undefined for non-existent booking', () => {
      const found = repository.findById('non-existent');
      expect(found).toBeUndefined();
    });
  });

  describe('findByLaunchId', () => {
    it('should find all non-cancelled bookings for a launch', () => {
      const booking1: Booking = {
        id: 'booking-1',
        launchId: 'launch-1',
        customerId: 'customer-1',
        seatCount: 2,
        totalPrice: 500,
        status: 'confirmed',
        paymentStatus: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const booking2: Booking = {
        id: 'booking-2',
        launchId: 'launch-1',
        customerId: 'customer-2',
        seatCount: 1,
        totalPrice: 250,
        status: 'cancelled',
        paymentStatus: 'failed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.save(booking1);
      repository.save(booking2);

      const bookings = repository.findByLaunchId('launch-1');

      expect(bookings).toHaveLength(1);
      expect(bookings[0].id).toBe('booking-1');
    });

    it('should return empty array for launch with no bookings', () => {
      const bookings = repository.findByLaunchId('non-existent-launch');
      expect(bookings).toHaveLength(0);
    });
  });

  describe('findByCustomerId', () => {
    it('should find all bookings for a customer', () => {
      const booking1: Booking = {
        id: 'booking-1',
        launchId: 'launch-1',
        customerId: 'customer-1',
        seatCount: 2,
        totalPrice: 500,
        status: 'confirmed',
        paymentStatus: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const booking2: Booking = {
        id: 'booking-2',
        launchId: 'launch-2',
        customerId: 'customer-1',
        seatCount: 1,
        totalPrice: 250,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.save(booking1);
      repository.save(booking2);

      const bookings = repository.findByCustomerId('customer-1');

      expect(bookings).toHaveLength(2);
    });

    it('should return empty array for customer with no bookings', () => {
      const bookings = repository.findByCustomerId('non-existent-customer');
      expect(bookings).toHaveLength(0);
    });
  });

  describe('calculateTotalBookedSeats', () => {
    it('should sum seat counts for non-cancelled bookings', () => {
      const booking1: Booking = {
        id: 'booking-1',
        launchId: 'launch-1',
        customerId: 'customer-1',
        seatCount: 3,
        totalPrice: 750,
        status: 'confirmed',
        paymentStatus: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const booking2: Booking = {
        id: 'booking-2',
        launchId: 'launch-1',
        customerId: 'customer-2',
        seatCount: 2,
        totalPrice: 500,
        status: 'confirmed',
        paymentStatus: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const booking3: Booking = {
        id: 'booking-3',
        launchId: 'launch-1',
        customerId: 'customer-3',
        seatCount: 5,
        totalPrice: 1250,
        status: 'cancelled',
        paymentStatus: 'failed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.save(booking1);
      repository.save(booking2);
      repository.save(booking3);

      const total = repository.calculateTotalBookedSeats('launch-1');

      expect(total).toBe(5); // 3 + 2, cancelled booking not counted
    });

    it('should return 0 for launch with no bookings', () => {
      const total = repository.calculateTotalBookedSeats('non-existent-launch');
      expect(total).toBe(0);
    });
  });

  describe('update', () => {
    it('should update a booking', () => {
      const booking: Booking = {
        id: 'booking-1',
        launchId: 'launch-1',
        customerId: 'customer-1',
        seatCount: 2,
        totalPrice: 500,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.save(booking);

      const updated: Booking = {
        ...booking,
        status: 'confirmed',
        paymentStatus: 'completed',
      };

      repository.update(updated);

      const found = repository.findById('booking-1');
      expect(found?.status).toBe('confirmed');
      expect(found?.paymentStatus).toBe('completed');
    });
  });

  describe('deleteById', () => {
    it('should delete a booking', () => {
      const booking: Booking = {
        id: 'booking-1',
        launchId: 'launch-1',
        customerId: 'customer-1',
        seatCount: 2,
        totalPrice: 500,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.save(booking);

      const deleted = repository.deleteById('booking-1');

      expect(deleted).toBe(true);
      expect(repository.findById('booking-1')).toBeUndefined();
    });

    it('should return false when deleting non-existent booking', () => {
      const deleted = repository.deleteById('non-existent');
      expect(deleted).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should return all bookings', () => {
      const booking1: Booking = {
        id: 'booking-1',
        launchId: 'launch-1',
        customerId: 'customer-1',
        seatCount: 2,
        totalPrice: 500,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const booking2: Booking = {
        id: 'booking-2',
        launchId: 'launch-2',
        customerId: 'customer-2',
        seatCount: 1,
        totalPrice: 250,
        status: 'confirmed',
        paymentStatus: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.save(booking1);
      repository.save(booking2);

      const all = repository.findAll();

      expect(all).toHaveLength(2);
    });

    it('should return empty array when no bookings', () => {
      const all = repository.findAll();
      expect(all).toHaveLength(0);
    });
  });
});
