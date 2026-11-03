# Fleet Ops API

Demo-only, in-memory HTTP API. The store is recreated when the server starts.
Seed dates are generated relative to the current UTC date.

## Routes

| Method | Path                   | Success | Behavior                                                       |
| ------ | ---------------------- | ------- | -------------------------------------------------------------- |
| GET    | `/api/health`          | 200     | `{ "status": "ok", "version": "0.1.0" }`                       |
| GET    | `/api/assets`          | 200     | All 12 fictional assets                                        |
| GET    | `/api/assets/:id`      | 200     | One asset; 404 when missing                                    |
| GET    | `/api/work-orders`     | 200     | All work orders; filtering is not implemented                  |
| POST   | `/api/work-orders`     | 201     | Create an open work order                                      |
| PATCH  | `/api/work-orders/:id` | 200     | Update status and/or assignee                                  |
| GET    | `/api/stats`           | 200     | Counts: `open`, `inProgress`, `blocked`, `overdue`, `critical` |

## Create a work order

```json
{
  "assetId": "truck-1",
  "title": "Replace intake filter",
  "priority": "high",
  "dueDate": "2026-12-01",
  "assignee": "Casey Park"
}
```

`assetId`, `title`, `priority` and `dueDate` are required. `assignee` defaults to
`Unassigned`. Priorities are `low`, `medium`, `high`, `critical`. Status starts
as `open`; a patch accepts `open`, `in_progress`, `blocked` or `done`.
Dates are valid calendar dates in `YYYY-MM-DD` form. Creation timestamps use UTC.
Titles are limited to 140 characters and assignees to 80.

## Errors

Routes return `{ "error": { "code": "...", "message": "..." } }`.
Invalid payloads use 400 (`INVALID_INPUT`); missing assets, work orders or
routes use 404 (`NOT_FOUND`). Unexpected failures use 500 (`INTERNAL_ERROR`).

## Deliberate baseline limitations

- Due-today unfinished work is incorrectly included in overdue counts.
- No authentication, persistence or concurrent-update protection is provided.
- Never expose this demonstration to untrusted users or use real data.
