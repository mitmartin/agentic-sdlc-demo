import { describe, expect, it } from 'vitest';
import { createSeedData } from '../src/server/data/seed.js';
import { getStats } from '../src/server/services/stats.js';
import type { WorkOrder } from '../src/server/domain/types.js';

describe('fleet stats', () => {
  const now = new Date('2026-03-16T12:00:00Z');

  it('returns zero counts for an empty work list', () => {
    expect(getStats([], now)).toEqual({
      open: 0,
      inProgress: 0,
      blocked: 0,
      overdue: 0,
      critical: 0,
    });
  });

  it('counts workflow states and unfinished critical orders independently', () => {
    const base = createSeedData(now).workOrders[0]!;
    const orders: WorkOrder[] = [
      { ...base, status: 'open', priority: 'critical', dueDate: '2026-03-15' },
      {
        ...base,
        status: 'in_progress',
        priority: 'high',
        dueDate: '2026-03-17',
      },
      {
        ...base,
        status: 'blocked',
        priority: 'critical',
        dueDate: '2026-03-14',
      },
      { ...base, status: 'done', priority: 'critical', dueDate: '2026-03-13' },
    ];
    expect(getStats(orders, now)).toEqual({
      open: 1,
      inProgress: 1,
      blocked: 1,
      overdue: 2,
      critical: 2,
    });
  });

  it('keeps fictional seed dates relative to startup and stores isolated', () => {
    const first = createSeedData(now);
    const second = createSeedData(new Date('2026-04-16T12:00:00Z'));
    expect(first.assets).toHaveLength(12);
    expect(new Set(first.assets.map((asset) => asset.type)).size).toBe(4);
    expect(first.workOrders).toHaveLength(25);
    expect(first.workOrders[0]!.dueDate).toBe('2026-03-10');
    expect(second.workOrders[0]!.dueDate).toBe('2026-04-10');
    first.workOrders.pop();
    expect(second.workOrders).toHaveLength(25);
  });
});
