import { CreateRocketInput, Rocket, RocketRange, UpdateRocketInput } from '../types/rocket.js';
import { ValidationError } from '../utils/error-handler.js';
import { validateRocketInput } from '../utils/validation.js';

export class RocketStore {
  private rockets: Map<string, Rocket> = new Map();
  private nextId: number = 1;

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

    this.rockets.set(id, rocket);
    return rocket;
  }

  getById(id: string): Rocket | undefined {
    return this.rockets.get(id);
  }

  getAll(
    page: number = 1,
    pageSize: number = 10,
    range?: RocketRange,
    minCapacity?: number
  ) {
    let results = Array.from(this.rockets.values());

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
    const rocket = this.rockets.get(id);
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

    this.rockets.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.rockets.delete(id);
  }
}

export const rocketStore = new RocketStore();
