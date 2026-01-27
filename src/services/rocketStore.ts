import { CreateRocketInput, Rocket, RocketRange, UpdateRocketInput } from '../types/rocket.js';

const VALID_RANGES: RocketRange[] = ['suborbital', 'orbital', 'moon', 'mars'];
const MIN_CAPACITY = 1;
const MAX_CAPACITY = 10;

export class RocketStore {
  private rockets: Map<string, Rocket> = new Map();
  private nextId: number = 1;

  create(input: CreateRocketInput): Rocket {
    const validation = this.validateInput(input);
    if (validation.length > 0) {
      throw { status: 400, errors: validation };
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

    const validation = this.validateInput({
      name: input.name ?? rocket.name,
      range: input.range ?? rocket.range,
      capacity: input.capacity ?? rocket.capacity,
    });

    if (validation.length > 0) {
      throw { status: 400, errors: validation };
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

  private validateInput(input: CreateRocketInput): Array<{ field: string; message: string }> {
    const errors: Array<{ field: string; message: string }> = [];

    if (!input.name || input.name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Name is required and cannot be empty' });
    }

    if (!VALID_RANGES.includes(input.range)) {
      errors.push({
        field: 'range',
        message: `Range must be one of: ${VALID_RANGES.join(', ')}`,
      });
    }

    if (!Number.isInteger(input.capacity) || input.capacity < MIN_CAPACITY || input.capacity > MAX_CAPACITY) {
      errors.push({
        field: 'capacity',
        message: `Capacity must be an integer between ${MIN_CAPACITY} and ${MAX_CAPACITY}`,
      });
    }

    return errors;
  }
}

export const rocketStore = new RocketStore();
