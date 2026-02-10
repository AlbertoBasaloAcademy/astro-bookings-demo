import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateRocketInput, Rocket, UpdateRocketInput } from '../types/rocket.js';
import { ValidationError } from '../utils/error-handler.js';
import { RocketRepository } from './rocket.repository.js';
import { RocketService } from './rocket.service.js';

describe('RocketService', () => {
  let service: RocketService;
  let mockRepository: RocketRepository;

  beforeEach(() => {
    mockRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      deleteById: vi.fn(),
    };
    service = new RocketService(mockRepository);
  });

  describe('create', () => {
    it('should create a rocket with valid input', () => {
      const input: CreateRocketInput = {
        name: 'Falcon 9',
        range: 'orbital',
        capacity: 7,
      };

      const rocket = service.create(input);

      expect(rocket.id).toBe('1');
      expect(rocket.name).toBe('Falcon 9');
      expect(rocket.range).toBe('orbital');
      expect(rocket.capacity).toBe(7);
      expect(rocket.createdAt).toBeInstanceOf(Date);
      expect(rocket.updatedAt).toBeInstanceOf(Date);
      expect(mockRepository.save).toHaveBeenCalledWith(rocket);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should generate incremental IDs', () => {
      const input: CreateRocketInput = { name: 'Test', range: 'orbital', capacity: 5 };

      const rocket1 = service.create(input);
      const rocket2 = service.create(input);

      expect(rocket1.id).toBe('1');
      expect(rocket2.id).toBe('2');
    });

    it('should throw ValidationError for invalid input', () => {
      const invalidInput: CreateRocketInput = {
        name: '',
        range: 'orbital',
        capacity: 0,
      };

      expect(() => service.create(invalidInput)).toThrow(ValidationError);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should set createdAt and updatedAt timestamps', () => {
      const beforeCreate = Date.now();
      const input: CreateRocketInput = { name: 'Test', range: 'orbital', capacity: 5 };

      const rocket = service.create(input);
      const afterCreate = Date.now();

      expect(rocket.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate);
      expect(rocket.createdAt.getTime()).toBeLessThanOrEqual(afterCreate);
      expect(rocket.updatedAt.getTime()).toBe(rocket.createdAt.getTime());
    });
  });

  describe('getById', () => {
    it('should return rocket when found', () => {
      const mockRocket: Rocket = {
        id: '1',
        name: 'Test',
        range: 'orbital',
        capacity: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(mockRepository.findById).mockReturnValue(mockRocket);

      const result = service.getById('1');

      expect(result).toEqual(mockRocket);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return undefined when not found', () => {
      vi.mocked(mockRepository.findById).mockReturnValue(undefined);

      const result = service.getById('999');

      expect(result).toBeUndefined();
    });
  });

  describe('getAll', () => {
    const mockRockets: Rocket[] = [
      {
        id: '1',
        name: 'Falcon 9',
        range: 'orbital',
        capacity: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Starship',
        range: 'mars',
        capacity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        name: 'New Shepard',
        range: 'suborbital',
        capacity: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    beforeEach(() => {
      vi.mocked(mockRepository.findAll).mockReturnValue(mockRockets);
    });

    it('should return paginated results with default params', () => {
      const result = service.getAll();

      expect(result.data).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.hasMore).toBe(false);
    });

    it('should handle pagination correctly', () => {
      const result = service.getAll(1, 2);

      expect(result.data).toHaveLength(2);
      expect(result.data[0].id).toBe('1');
      expect(result.data[1].id).toBe('2');
      expect(result.hasMore).toBe(true);

      const page2 = service.getAll(2, 2);
      expect(page2.data).toHaveLength(1);
      expect(page2.data[0].id).toBe('3');
      expect(page2.hasMore).toBe(false);
    });

    it('should filter by range', () => {
      const result = service.getAll(1, 10, 'orbital');

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Falcon 9');
      expect(result.total).toBe(1);
    });

    it('should filter by minimum capacity', () => {
      const result = service.getAll(1, 10, undefined, 7);

      expect(result.data).toHaveLength(2);
      expect(result.data.every((r) => r.capacity >= 7)).toBe(true);
      expect(result.total).toBe(2);
    });

    it('should apply both range and capacity filters', () => {
      const result = service.getAll(1, 10, 'mars', 10);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Starship');
    });
  });

  describe('update', () => {
    const existingRocket: Rocket = {
      id: '1',
      name: 'Test',
      range: 'orbital',
      capacity: 5,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    };

    it('should update rocket with valid input', () => {
      vi.mocked(mockRepository.findById).mockReturnValue(existingRocket);
      const updateInput: UpdateRocketInput = { name: 'Updated Name' };

      const result = service.update('1', updateInput);

      expect(result).toBeDefined();
      expect(result?.name).toBe('Updated Name');
      expect(result?.range).toBe('orbital');
      expect(result?.capacity).toBe(5);
      expect(result?.updatedAt).not.toEqual(existingRocket.updatedAt);
      expect(mockRepository.update).toHaveBeenCalledWith(result);
    });

    it('should return undefined when rocket not found', () => {
      vi.mocked(mockRepository.findById).mockReturnValue(undefined);

      const result = service.update('999', { name: 'Test' });

      expect(result).toBeUndefined();
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid update', () => {
      vi.mocked(mockRepository.findById).mockReturnValue(existingRocket);
      const invalidUpdate: UpdateRocketInput = { capacity: 99 };

      expect(() => service.update('1', invalidUpdate)).toThrow(ValidationError);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete rocket and return true when found', () => {
      vi.mocked(mockRepository.deleteById).mockReturnValue(true);

      const result = service.delete('1');

      expect(result).toBe(true);
      expect(mockRepository.deleteById).toHaveBeenCalledWith('1');
    });

    it('should return false when rocket not found', () => {
      vi.mocked(mockRepository.deleteById).mockReturnValue(false);

      const result = service.delete('999');

      expect(result).toBe(false);
    });
  });
});
