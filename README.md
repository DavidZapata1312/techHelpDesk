<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  
# TechHelpDesk - API (NestJS)

A ticket management API built with NestJS for managing users, clients, technicians, categories and tickets.

Created by: David Zapata

Clan: Ubuntu

---

## Contents


- Instructions to run the project
- Swagger URL and example endpoints
- Example `.env` file

---

## Requirements

- Node.js >= 18
- pnpm (recommended) or npm
- Docker (optional)

---

## Installation

From the project root:

```bash
# using npm
npm install
# or using pnpm (recommended when pnpm-lock.yaml is present)
pnpm install
```

---

## Run in development

```bash
# start in development (watch)
npm run start:dev
# or with pnpm
pnpm run start:dev
```

Default port: 3000 (configurable via `PORT`).

---

## Build and run (production)

```bash
pnpm run build
pnpm run start:prod
```

---

## Docker (optional)

Build and run the Docker image:

```bash
docker build -t techhelpdesk .
docker run -p 3000:3000 --env-file .env --name techhelpdesk techhelpdesk
# or with docker-compose if present
docker-compose up --build
```

---

## Swagger (API documentation)

The Swagger UI is served at:

```
http://localhost:3000/api
```

(If your project config uses a different path, adjust accordingly.)

Example endpoints and payloads (ready to paste into Swagger "Try it out"):

1) POST /auth/login
Request (JSON):

```json
{
  "username": "admin",
  "password": "P@ssw0rd"
}
```

Response example:

```json
{
  "access_token": "<JWT_TOKEN>",
  "user": {
    "id": 1,
    "username": "admin",
    "roles": ["ADMIN"]
  }
}
```

2) POST /users  (ADMIN only)
Request (JSON):

```json
{
  "username": "davidz",
  "email": "david@example.com",
  "password": "P@ssw0rd",
  "roles": ["CLIENT"]
}
```

Response example (201 Created):

```json
{
  "id": 2,
  "username": "davidz",
  "email": "david@example.com",
  "roles": ["CLIENT"]
}
```

3) POST /tickets  (CLIENT)
Request (JSON):

```json
{
  "title": "Computer won't start",
  "description": "The workstation does not power on since yesterday",
  "clientId": 3,
  "categoryId": 1
}
```

Response example (201 Created):

```json
{
  "id": 45,
  "title": "Computer won't start",
  "status": "OPEN",
  "clientId": 3,
  "categoryId": 1,
  "createdAt": "2025-12-09T10:00:00.000Z"
}
```

4) PATCH /tickets/:id/status  (TECHNICIAN or ADMIN depending on assignment)
Request (JSON):

```json
{
  "newStatus": "IN_PROGRESS"
}
```

Response example (200 OK):

```json
{
  "id": 45,
  "status": "IN_PROGRESS",
  "updatedAt": "2025-12-09T12:00:00.000Z"
}
```

---

## Example `.env` (template)

Create a `.env` file in the project root with these variables (do not commit real secrets):

```
# App
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=YourVerySecretKey
JWT_EXPIRES_IN=3600s

# Database (Postgres)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=techhelpdesk

# Optional TypeORM settings
TYPEORM_SYNCHRONIZE=false
TYPEORM_LOGGING=false
```



## Authentication and roles

- Authentication: JWT
- Guards: `JwtAuthGuard`, `RolesGuard`
- Decorators: `@Roles()`, `@CurrentUser()`
- Roles: `ADMIN`, `TECHNICIAN`, `CLIENT`

Routes should be protected according to the role matrix described in the project.

---

## Author

Created by David Zapata — Clan Ubuntu
