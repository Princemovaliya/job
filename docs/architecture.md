# Architecture

## Overview

The system imports jobs from multiple XML feeds, queues each feed import using
Redis (BullMQ), processes imports in workers with configurable concurrency, and
stores jobs + import history in MongoDB. The Next.js admin UI reads import logs
through the API and displays totals and failures.

## Components

- **API Server (`server`)**
  - Express routes for authentication, import logs, and import triggers
  - Cron scheduler enqueues imports every hour
- **Worker (`server/src/queues/job.worker.js`)**
  - BullMQ worker consumes queued imports
  - Batch upserts jobs and logs results
- **MongoDB**
  - `jobs` collection stores normalized job records
  - `sourcejobs` collection stores raw feed payloads
  - `import_logs` collection tracks each run (totals + failures)
- **Redis**
  - Queue backend for job import tasks
- **Frontend (`client`)**
  - Admin UI for history, detail view, and manual run

## Data Flow

1. Cron or manual trigger enqueues a feed import.
2. Worker fetches XML, parses to JSON, normalizes fields.
3. Jobs are bulk upserted in batches with `source + externalId` keys.
4. Import log captures totals and failures with reasons.
5. UI displays the logs with pagination and detail view.

## Scalability Notes

- Worker concurrency is configurable (`QUEUE_CONCURRENCY`).
- Batch size is configurable (`BATCH_SIZE`).
- Queue retry uses exponential backoff (`IMPORT_ATTEMPTS`, `IMPORT_BACKOFF_MS`).
- Indexes are applied on `source + externalId` for deduping and fast upserts.

