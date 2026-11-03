const statuses = {
  open: 'Open',
  in_progress: 'In progress',
  blocked: 'Blocked',
  done: 'Done',
};
const notice = document.querySelector('#notice');
const form = document.querySelector('#new-order');
const dueInput = document.querySelector('#due');

function defaultDueDate() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 2);
  dueInput.value = date.toISOString().slice(0, 10);
}

function announce(message, isError = false) {
  notice.textContent = message;
  notice.className = isError ? 'notice error' : 'notice';
}

async function api(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message ?? 'Unable to load fleet data.');
  }
  return data;
}

function cell(text, className = '') {
  const element = document.createElement('td');
  element.textContent = text;
  element.className = className;
  return element;
}

function renderOrders(orders, assets) {
  const tbody = document.querySelector('#work-orders');
  tbody.replaceChildren();
  document.querySelector('#order-count').textContent =
    `${orders.length} work orders`;
  for (const order of orders) {
    const row = document.createElement('tr');
    const title = cell('');
    const name = document.createElement('strong');
    name.textContent = order.title;
    const asset = document.createElement('span');
    asset.className = 'asset-name';
    asset.textContent =
      assets.find((item) => item.id === order.assetId)?.name ?? order.assetId;
    title.append(name, asset);
    const priority = cell('');
    const chip = document.createElement('span');
    chip.className = `chip ${order.priority}`;
    chip.textContent = order.priority;
    priority.append(chip);
    const status = cell('');
    const select = document.createElement('select');
    select.className = `status-select ${order.status}`;
    select.setAttribute('aria-label', `Status for ${order.title}, ${order.id}`);
    for (const [value, label] of Object.entries(statuses)) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      select.append(option);
    }
    select.value = order.status;
    select.addEventListener('change', async () => {
      select.disabled = true;
      try {
        await api(`/api/work-orders/${encodeURIComponent(order.id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: select.value }),
        });
        await load();
        announce(`Updated: ${order.title}`);
      } catch (error) {
        select.value = order.status;
        announce(error.message, true);
      } finally {
        select.disabled = false;
      }
    });
    status.append(select);
    row.append(
      title,
      priority,
      status,
      cell(order.dueDate),
      cell(order.assignee),
    );
    tbody.append(row);
  }
  if (orders.length === 0) {
    const row = document.createElement('tr');
    const empty = cell('No work orders yet. Create one to get started.');
    empty.colSpan = 5;
    row.append(empty);
    tbody.append(row);
  }
}

async function load() {
  const [assets, orders, stats] = await Promise.all([
    api('/api/assets'),
    api('/api/work-orders'),
    api('/api/stats'),
  ]);
  for (const key of ['open', 'overdue', 'critical', 'blocked']) {
    document.querySelector(`#stat-${key}`).textContent = stats[key];
  }
  const assetSelect = document.querySelector('#asset');
  const selected = assetSelect.value;
  assetSelect.replaceChildren(new Option('Choose an asset', ''));
  for (const asset of assets) {
    assetSelect.add(new Option(`${asset.name} / ${asset.location}`, asset.id));
  }
  assetSelect.value = selected;
  renderOrders(orders, assets);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  const data = Object.fromEntries(new FormData(form));
  if (!data.assignee.trim()) data.assignee = 'Unassigned';
  try {
    await api('/api/work-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    form.reset();
    defaultDueDate();
    await load();
    announce('Work order created.');
  } catch (error) {
    announce(error.message, true);
  } finally {
    submit.disabled = false;
  }
});

document.querySelector('#refresh').addEventListener('click', () => {
  load()
    .then(() => announce('Fleet data refreshed.'))
    .catch((error) => announce(error.message, true));
});

defaultDueDate();
load().catch((error) => announce(error.message, true));
