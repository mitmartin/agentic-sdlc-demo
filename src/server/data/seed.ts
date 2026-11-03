import {
  priorities,
  workOrderStatuses,
  type Asset,
  type FleetData,
} from '../domain/types.js';

export function createSeedData(now = new Date()): FleetData {
  const groups: { type: Asset['type']; names: string[]; location: string }[] = [
    {
      type: 'aircraft',
      names: ['CF-737 N501CF', 'CF-320 N502CF', 'CF-787 N503CF'],
      location: 'North hangar',
    },
    {
      type: 'vessel',
      names: ['MV Contoso Star', 'MV Contoso Dawn', 'MV Contoso Tide'],
      location: 'Harbor dock',
    },
    {
      type: 'truck',
      names: ['Truck 42', 'Truck 57', 'Truck 63'],
      location: 'West depot',
    },
    {
      type: 'machine',
      names: ['CNC Mill 7', 'Press 12', 'Conveyor 3'],
      location: 'Factory floor',
    },
  ];
  const assets: Asset[] = groups.flatMap((group) =>
    group.names.map((name, index) => ({
      id: `${group.type}-${index + 1}`,
      name,
      type: group.type,
      location: group.location,
      status: index === 2 ? 'maintenance' : 'active',
    })),
  );
  const tasks = [
    'Inspect hydraulic lines',
    'Replace intake filter',
    'Check cooling system',
    'Calibrate operating sensors',
    'Complete scheduled inspection',
  ];
  const workOrders = Array.from({ length: 25 }, (_, index) => {
    const asset = assets[index % assets.length]!;
    const due = new Date(now);
    due.setUTCDate(due.getUTCDate() + (index % 13) - 6);
    const created = new Date(now);
    created.setUTCDate(created.getUTCDate() - 10 - (index % 5));
    return {
      id: `wo-${String(index + 1).padStart(3, '0')}`,
      assetId: asset.id,
      title: tasks[index % tasks.length]!,
      priority: priorities[index % priorities.length]!,
      status:
        workOrderStatuses[
          (index + Math.floor(index / 4)) % workOrderStatuses.length
        ]!,
      dueDate: due.toISOString().slice(0, 10),
      createdAt: created.toISOString(),
      assignee: ['Alex Chen', 'Sam Rivera', 'Jordan Lee'][index % 3]!,
    };
  });
  return { assets, workOrders };
}
