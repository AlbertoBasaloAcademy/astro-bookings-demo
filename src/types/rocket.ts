export type RocketRange = 'suborbital' | 'orbital' | 'moon' | 'mars';

export interface Rocket {
  id: string;
  name: string;
  range: RocketRange;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateRocketInput = Omit<Rocket, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRocketInput = Partial<Omit<Rocket, 'id' | 'createdAt' | 'updatedAt'>>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  error: string;
  details?: ValidationError[];
}
