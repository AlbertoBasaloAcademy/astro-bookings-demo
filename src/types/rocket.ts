export type RocketRange = 'suborbital' | 'orbital' | 'moon' | 'mars';

export type Rocket = {
  id: string;
  name: string;
  range: RocketRange;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateRocketInput = Omit<Rocket, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRocketInput = Partial<Omit<Rocket, 'id' | 'createdAt' | 'updatedAt'>>;

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type ValidationError = {
  field: string;
  message: string;
};

export type ErrorResponse = {
  error: string;
  details?: ValidationError[];
};
