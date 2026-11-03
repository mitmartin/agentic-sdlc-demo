import { randomUUID } from 'node:crypto';
import { HttpError } from '../domain/errors.js';
import {
  priorities,
  workOrderStatuses,
  type FleetData,
  type WorkOrder,
} from '../domain/types.js';

function payload(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new HttpError(400, 'INVALID_INPUT', 'A JSON object is required.');
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, name: string, maxLength: number): string {
  if (
    typeof value !== 'string' ||
    !value.trim() ||
    value.trim().length > maxLength
  ) {
    throw new HttpError(
      400,
      'INVALID_INPUT',
      `${name} must be 1-${maxLength} characters.`,
    );
  }
  return value.trim();
}

export function isOverdue(order: WorkOrder, now = new Date()): boolean {
  // Deliberate demo bug: due-today work should not be overdue.
  return (
    order.status !== 'done' && order.dueDate <= now.toISOString().slice(0, 10)
  );
}

export function createWorkOrder(
  data: FleetData,
  value: unknown,
  now = new Date(),
): WorkOrder {
  const input = payload(value);
  const assetId = text(input.assetId, 'assetId', 80);
  if (!data.assets.some((asset) => asset.id === assetId)) {
    throw new HttpError(
      400,
      'INVALID_INPUT',
      'assetId must identify an asset.',
    );
  }
  const title = text(input.title, 'title', 140);
  if (!priorities.includes(input.priority as WorkOrder['priority'])) {
    throw new HttpError(400, 'INVALID_INPUT', 'A valid priority is required.');
  }
  const dueDate = text(input.dueDate, 'dueDate', 10);
  const date = new Date(`${dueDate}T00:00:00.000Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) ||
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== dueDate
  ) {
    throw new HttpError(
      400,
      'INVALID_INPUT',
      'dueDate must be a YYYY-MM-DD date.',
    );
  }
  const assignee =
    input.assignee === undefined
      ? 'Unassigned'
      : text(input.assignee, 'assignee', 80);
  const order: WorkOrder = {
    id: randomUUID(),
    assetId,
    title,
    priority: input.priority as WorkOrder['priority'],
    status: 'open',
    dueDate,
    createdAt: now.toISOString(),
    assignee,
  };
  data.workOrders.push(order);
  return order;
}

export function updateWorkOrder(
  data: FleetData,
  id: string,
  value: unknown,
): WorkOrder {
  const order = data.workOrders.find((item) => item.id === id);
  if (!order) {
    throw new HttpError(404, 'NOT_FOUND', 'Work order not found.');
  }
  const input = payload(value);
  if (input.status === undefined && input.assignee === undefined) {
    throw new HttpError(400, 'INVALID_INPUT', 'Provide status or assignee.');
  }
  if (
    input.status !== undefined &&
    !workOrderStatuses.includes(input.status as WorkOrder['status'])
  ) {
    throw new HttpError(400, 'INVALID_INPUT', 'A valid status is required.');
  }
  const assignee =
    input.assignee === undefined
      ? order.assignee
      : text(input.assignee, 'assignee', 80);
  order.status =
    (input.status as WorkOrder['status'] | undefined) ?? order.status;
  order.assignee = assignee;
  return order;
}
