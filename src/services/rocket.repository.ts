import { Rocket } from '../types/rocket.js';

export interface RocketRepository {
  save(rocket: Rocket): void;
  findById(id: string): Rocket | undefined;
  findAll(): Rocket[];
  update(rocket: Rocket): void;
  deleteById(id: string): boolean;
}

export class InMemoryRocketRepository implements RocketRepository {
  private rockets: Map<string, Rocket> = new Map();

  save(rocket: Rocket): void {
    this.rockets.set(rocket.id, rocket);
  }

  findById(id: string): Rocket | undefined {
    return this.rockets.get(id);
  }

  findAll(): Rocket[] {
    return Array.from(this.rockets.values());
  }

  update(rocket: Rocket): void {
    this.rockets.set(rocket.id, rocket);
  }

  deleteById(id: string): boolean {
    return this.rockets.delete(id);
  }
}
