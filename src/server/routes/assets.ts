import { Router } from 'express';
import { HttpError } from '../domain/errors.js';
import type { FleetData } from '../domain/types.js';

export function assetsRouter(data: FleetData) {
  const router = Router();
  router.get('/', (_req, res) => res.json(data.assets));
  router.get('/:id', (req, res) => {
    const asset = data.assets.find((item) => item.id === req.params.id);
    if (!asset) {
      throw new HttpError(404, 'NOT_FOUND', 'Asset not found.');
    }
    res.json(asset);
  });
  return router;
}
