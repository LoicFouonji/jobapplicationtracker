# Job Application Tracker

I built this API to keep job searching organized without using spreadsheets. It tracks companies, roles, pipeline status, notes, and a date for each application. It is intentionally small, fast to run locally, and easy to extend into a full web app later.

## What it does

You can create, edit, delete, and list applications. You can also filter by status, search by text, and fetch quick pipeline stats.

Supported statuses are `Applied`, `Interview`, `Offer`, and `Rejected`.

## Tech stack

Node.js, Express, Vitest, Supertest

## Local setup

```bash
npm install
npm run dev
```

The API starts on `http://localhost:3000` by default.

## API quick examples

Create an application:

```bash
curl -X POST http://localhost:3000/applications \
  -H "Content-Type: application/json" \
  -d '{"company":"Stripe","role":"Software Engineer","status":"Applied"}'
```

List applications:

```bash
curl http://localhost:3000/applications
```

Get pipeline stats:

```bash
curl http://localhost:3000/applications/stats
```

## Run tests

```bash
npm test
```

## What I would add next

A React frontend, login with per-user data, and a real database with migrations.
