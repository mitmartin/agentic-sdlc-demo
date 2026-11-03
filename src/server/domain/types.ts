export const priorities = ['low', 'medium', 'high', 'critical'] as const;
export const workOrderStatuses = [
  'open',
  'in_progress',
  'blocked',
  'done',
] as const;

export interface Asset {
  id: string;
  name: string;
  type: 'aircraft' | 'vessel' | 'truck' | 'machine';
  location: string;
  status: 'active' | 'grounded' | 'maintenance';
}

export interface WorkOrder {
  id: string;
  assetId: string;
  title: string;
  priority: (typeof priorities)[number];
  status: (typeof workOrderStatuses)[number];
  dueDate: string;
  createdAt: string;
  assignee: string;
}

export interface FleetData {
  assets: Asset[];
  workOrders: WorkOrder[];
}
