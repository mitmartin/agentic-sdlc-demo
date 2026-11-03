import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import express, { type ErrorRequestHandler } from 'express';
import { createSeedData } from './data/seed.js';
import { HttpError } from './domain/errors.js';
import type { FleetData } from './domain/types.js';
import { assetsRouter } from './routes/assets.js';
import { statsRouter } from './routes/stats.js';
import { workOrdersRouter } from './routes/workOrders.js';

const { version } = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
) as { version: string };

export function createApp(
  options: { data?: FleetData; now?: () => Date } = {},
) {
  const now = options.now ?? (() => new Date());
  const data = options.data ?? createSeedData(now());
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', version }));
  app.use('/api/assets', assetsRouter(data));
  app.use('/api/work-orders', workOrdersRouter(data, now));
  app.use('/api/stats', statsRouter(data, now));
  app.use(
    express.static(fileURLToPath(new URL('../../public/', import.meta.url))),
  );
  app.use((_req, _res, next) => {
    next(new HttpError(404, 'NOT_FOUND', 'Route not found.'));
  });
  const handleError: ErrorRequestHandler = (
    error: unknown,
    _req,
    res,
    _next,
  ) => {
    if (error instanceof HttpError) {
      res.status(error.status).json({
        error: { code: error.code, message: error.message },
      });
    } else if (error instanceof SyntaxError && 'body' in error) {
      res.status(400).json({
        error: { code: 'INVALID_INPUT', message: 'Malformed JSON body.' },
      });
    } else {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred.',
        },
      });
    }
  };
  app.use(handleError);
  return app;
}
