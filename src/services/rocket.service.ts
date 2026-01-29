import { CreateRocketInput, Rocket, RocketRange, UpdateRocketInput } from '../types/rocket.js';
import { ValidationError } from '../utils/error-handler.js';
import { debug } from '../utils/logger.js';
import { validateRocketInput } from '../utils/validation.js';
import { RocketRepository } from './rocket.repository.js';

export class RocketService {
  private nextId: number = 1;

  constructor(private repository: RocketRepository) {}

  create(input: CreateRocketInput): Rocket {
    const errors = validateRocketInput(input);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    const id = String(this.nextId++);
    const now = new Date();
    const rocket: Rocket = {
      id,
      name: input.name,
      range: input.range,
      capacity: input.capacity,
      createdAt: now,
      updatedAt: now,
    };

    this.repository.save(rocket);
    debug('Rocket created', {
      id,
      name: rocket.name,
      range: rocket.range,
      capacity: rocket.capacity,
    });
    return rocket;
  }

  getById(id: string): Rocket | undefined {
    return this.repository.findById(id);
  }

  getAll(
    page: number = 1,
    pageSize: number = 10,
    range?: RocketRange,
    minCapacity?: number
  ) {
    let results = this.repository.findAll();

    if (range) {
      results = results.filter((r) => r.range === range);
    }

    if (minCapacity !== undefined) {
      results = results.filter((r) => r.capacity >= minCapacity);
    }

    const total = results.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = results.slice(startIndex, endIndex);

    return {
      data: paginatedResults,
      total,
      page,
      pageSize,
      hasMore: endIndex < total,
    };
  }

  update(id: string, input: UpdateRocketInput): Rocket | undefined {
    const rocket = this.repository.findById(id);
    if (!rocket) {
      return undefined;
    }

    const validation = validateRocketInput({
      name: input.name ?? rocket.name,
      range: input.range ?? rocket.range,
      capacity: input.capacity ?? rocket.capacity,
    });

    if (validation.length > 0) {
      throw new ValidationError(validation);
    }

    const updated: Rocket = {
      ...rocket,
      ...input,
      updatedAt: new Date(),
    };

    this.repository.update(updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.repository.deleteById(id);
  }
}
