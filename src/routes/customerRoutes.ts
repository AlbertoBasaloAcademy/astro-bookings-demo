import { Request, Response, Router } from 'express';
import { customerService } from '../services/customer.service.js';
import type { CreateCustomerInput, UpdateCustomerInput } from '../types/customer.js';
import { handleError, parseIntParam, parseStringParam } from '../utils/error-handler.js';

export const customerRouter = Router();

// POST /api/customers - Register a new customer
customerRouter.post('/', (req: Request, res: Response) => {
  try {
    const input: CreateCustomerInput = req.body;
    const customer = customerService.create(input);
    res.status(201).json(customer);
  } catch (error) {
    handleError(error, res);
  }
});

// GET /api/customers/email/:email - Get customer by email
customerRouter.get('/email/:email', (req: Request, res: Response) => {
  const email = parseStringParam(req.params.email);
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const customer = customerService.getByEmail(email);
  if (!customer) {
    res.status(404).json({ error: 'Customer not found' });
    return;
  }

  res.status(200).json(customer);
});

// GET /api/customers/:id - Get customer by ID
customerRouter.get('/:id', (req: Request, res: Response) => {
  const id = parseStringParam(req.params.id);
  if (!id) {
    res.status(400).json({ error: 'Customer ID is required' });
    return;
  }

  const customer = customerService.getById(id);
  if (!customer) {
    res.status(404).json({ error: 'Customer not found' });
    return;
  }

  res.status(200).json(customer);
});

// GET /api/customers - List customers with pagination
customerRouter.get('/', (req: Request, res: Response) => {
  const page = parseIntParam(req.query.page as string, 1);
  const pageSize = Math.min(100, parseIntParam(req.query.pageSize as string, 10));
  const name = parseStringParam(req.query.name as string | string[] | undefined);
  const email = parseStringParam(req.query.email as string | string[] | undefined);

  const result = customerService.getAll({ page, pageSize, name, email });
  res.status(200).json(result);
});

// PUT /api/customers/:id - Update customer profile
customerRouter.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseStringParam(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'Customer ID is required' });
      return;
    }

    const input: UpdateCustomerInput = req.body;
    const customer = customerService.update(id, input);
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.status(200).json(customer);
  } catch (error) {
    handleError(error, res);
  }
});

// DELETE /api/customers/:id - Delete customer
customerRouter.delete('/:id', (req: Request, res: Response) => {
  const id = parseStringParam(req.params.id);
  if (!id) {
    res.status(400).json({ error: 'Customer ID is required' });
    return;
  }

  const deleted = customerService.delete(id);
  if (!deleted) {
    res.status(404).json({ error: 'Customer not found' });
    return;
  }

  res.status(204).send();
});
