export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export type Booking = {
  id: string;
  launchId: string;
  customerId: string;
  seatCount: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateBookingInput = {
  launchId: string;
  customerEmail: string;
  seatCount: number;
};

export type UpdateBookingInput = Partial<Omit<Booking, 'id' | 'launchId' | 'customerId' | 'createdAt'>>;

export type BookingResponse = Booking & {
  customerEmail: string;
  rocketName: string;
  launchPrice: number;
};

export type BookingAvailability = {
  launchId: string;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
};
