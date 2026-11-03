import type { WorkOrder } from '../domain/types.js';
import { isOverdue } from './workOrders.js';

export function getStats(orders: WorkOrder[], now = new Date()) {
  return {
    open: orders.filter((order) => order.status === 'open').length,
    inProgress: orders.filter((order) => order.status === 'in_progress').length,
    blocked: orders.filter((order) => order.status === 'blocked').length,
    overdue: orders.filter((order) => isOverdue(order, now)).length,
    critical: orders.filter(
      (order) => order.priority === 'critical' && order.status !== 'done',
    ).length,
  };
}
