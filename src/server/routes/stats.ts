import { Router } from 'express';
import type { FleetData } from '../domain/types.js';
import { getStats } from '../services/stats.js';

export function statsRouter(data: FleetData, now: () => Date) {
  const router = Router();
  router.get('/', (_req, res) => res.json(getStats(data.workOrders, now())));
  return router;
}
