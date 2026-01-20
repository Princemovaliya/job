# Job Portal Importer

Scalable job import system with Redis queue processing, MongoDB storage, and a
Next.js admin UI for import history tracking.

## Requirements

- Node.js 18+
- MongoDB
- Redis

## Project Structure

- `client` - Next.js admin UI
- `server` - Express API, worker, and cron

## Setup

### Server

1. `cd server`
2. `npm install`
3. Create `.env` in `server`:

```
MONGO_URI=mongodb://localhost:27017/job_portal
REDIS_URL=redis://localhost:6379
JWT_SECRET=replace-me
ADMIN_API_KEY=replace-me
FRONTEND_ORIGIN=http://localhost:3000
```

Optional env:

- `QUEUE_CONCURRENCY` (default: 5)
- `BATCH_SIZE` (default: 500)
- `CRON_SCHEDULE` (default: `0 * * * *`)
- `ENABLE_CRON` (default: `true`)
- `IMPORT_ATTEMPTS` (default: 3)
- `IMPORT_BACKOFF_MS` (default: 1000)
- `MAX_FAILURE_LOGS` (default: 50)
- `REQUEST_TIMEOUT_MS` (default: 30000)
- `JWT_EXPIRES_IN` (default: `8h`)

Run API (cron starts inside API when enabled):

```
npm run start
```

Run worker in a separate terminal:

```
npm run worker
```

Optional standalone cron:

```
npm run cron
```

### Client

1. `cd client`
2. `npm install`
3. Create `.env.local` in `client`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

Run the UI:

```
npm run dev
```

## Usage

1. Open the UI at `http://localhost:3000`
2. Enter the `ADMIN_API_KEY` to get a JWT token
3. Use **Run Import** to enqueue imports
4. View history and details (totals and failures)

## API Endpoints

- `POST /api/auth/token` - exchange API key for JWT
- `GET /api/import-logs` - paginated logs
- `GET /api/import-logs/:id` - log details
- `GET /api/imports/sources` - available feeds
- `POST /api/imports/run` - enqueue imports

