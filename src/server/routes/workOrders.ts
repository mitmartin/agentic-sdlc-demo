import { Router } from 'express';
import type { FleetData } from '../domain/types.js';
import { createWorkOrder, updateWorkOrder } from '../services/workOrders.js';

export function workOrdersRouter(data: FleetData, now: () => Date) {
  const router = Router();
  router.get('/', (_req, res) => res.json(data.workOrders));
  router.post('/', (req, res) => {
    const value: unknown = req.body;
    res.status(201).json(createWorkOrder(data, value, now()));
  });
  router.patch('/:id', (req, res) => {
    const value: unknown = req.body;
    res.json(updateWorkOrder(data, req.params.id, value));
  });
  return router;
}
