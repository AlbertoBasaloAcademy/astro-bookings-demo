import { Request, Response, Router } from 'express';
import { ResourceService } from '../services/resource.service';
import { logger } from '../utils/logger';

const router = Router();
const service = new ResourceService();

/**
 * GET /resources
 * Retrieves all resources
 */
router.get('/', (req: Request, res: Response) => {
  const resources = service.getAll();
  res.status(200).json(resources);
});

/**
 * GET /resources/:id
 * Retrieves a single resource by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  const resource = service.getById(req.params.id);
  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  res.status(200).json(resource);
});

/**
 * POST /resources
 * Creates a new resource
 * Returns 201 on success, 400 on validation error
 */
router.post('/', (req: Request, res: Response) => {
  const errors = service.validate(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const created = service.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    logger.error('ResourceRoute', 'Failed to create resource', error);
    res.status(400).json({ error: 'Failed to create resource' });
  }
});

/**
 * PUT /resources/:id
 * Updates an existing resource
 * Returns 200 on success, 400 on validation error, 404 if not found
 */
router.put('/:id', (req: Request, res: Response) => {
  const errors = service.validateUpdate(req.params.id, req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const updated = service.update(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    logger.error('ResourceRoute', 'Failed to update resource', error);
    res.status(400).json({ error: 'Failed to update resource' });
  }
});

/**
 * DELETE /resources/:id
 * Deletes a resource
 * Returns 204 No Content on success, 404 if not found
 */
router.delete('/:id', (req: Request, res: Response) => {
  try {
    service.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    logger.error('ResourceRoute', 'Failed to delete resource', error);
    res.status(404).json({ error: 'Resource not found' });
  }
});

export default router;
