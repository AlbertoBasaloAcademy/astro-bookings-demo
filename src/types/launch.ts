export type LaunchStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';

export type Launch = {
  id: string;
  rocketId: string;
  scheduledDate: Date;
  price: number;
  minimumPassengers: number;
  status: LaunchStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateLaunchInput = Omit<Launch, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: LaunchStatus;
};

export type UpdateLaunchInput = Partial<Omit<Launch, 'id' | 'createdAt' | 'updatedAt'>>;

export type LaunchWithAvailability = Launch & {
  rocketName: string;
  totalSeats: number;
  bookedPassengers: number;
  availableSeats: number;
};
