# Project: RMC - Restaurant Management Controller

## Overview

RMC is a backend system designed for restaurant management with three main models: **Product**, **Ingredient**, and **Order**.

### Prerequisites

- Docker and Docker Compose
- Node.js v20+
- PostgreSQL
- Redis

---

### Running with Docker

#### Build the Docker Images

```bash
docker-compose build
```

#### Start the Containers

```bash
docker-compose up
```

The following services will start:

- **App:** Accessible at [http://localhost:3000](http://localhost:3000)
- **Worker:** Processes background jobs for stock updates and email notifications.

#### Stop the Containers

```bash
docker-compose down
```

---

### Local Development

#### Clone the Repository

```bash
git clone <repository_url>
cd RMC
```

#### Install Dependencies

```bash
yarn install
```

#### Seed the Database

```bash
yarn seed
```

#### Start the Application

```bash
yarn dev
```

The application will run on [http://localhost:3000](http://localhost:3000).

### Manual Deployment

1. **Environment Variables:**
   Create a `.env` file in the root directory with the following variables:

2. **Install Dependencies:**

   ```bash
   yarn install
   ```

3. **Start the Server:**

   ```bash
   yarn start
   ```

4. **Seed the Database:**
   ```bash
   yarn seed
   ```

---

## Unit Tests

RMC includes comprehensive unit tests to ensure the functionality of the system. The tests cover:

1. Order persistence in the database.
2. Stock updates based on order quantities.
3. Email notifications for low stock levels.

### Running Unit Tests

#### Execute All Tests

```bash
yarn build
yarn test
```

#### Output Example

```bash
 PASS  dist/src/controllers/ordersController.test.js
 PASS  dist/src/services/ingredientsService.test.js
 PASS  dist/src/services/ordersService.test.js

Test Suites: 3 passed, 3 total
Tests:       10 passed, 10 total
```

---

## Seed Data

The database is seeded with the following initial data:

- **Ingredients:**
  - Beef: 20kg
  - Cheese: 5kg
  - Onion: 1kg
- **Products:**
  - Burger: Requires 150g Beef, 30g Cheese, and 20g Onion.

---

## Docker Compose

### Overview

The `docker-compose.yml` file defines the following services:

1. **App:** The primary backend server.
2. **Worker:** A background job processor for stock updates and notifications.
3. **Postgres:** The database for storing application data.
4. **Redis:** The in-memory data store for background jobs.

### Commands

#### Build and Start

```bash
docker-compose up --build
```

#### Stop Containers

```bash
docker-compose down
```

---

## Technology Stack

- **Backend Framework:** Express.js
- **Database:** PostgreSQL
- **Caching & Background Jobs:** Redis, BullMQ
- **ORM:** Prisma
- **Email Notifications:** Nodemailer
- **Testing:** Jest
- **Logging:** Winston
- **Containerization:** Docker

---

## File Structure

```
RMC
├── src/
│   ├── index.ts
│   ├── worker.ts
│   ├── repos/
│       ├── productsRepository.ts
│       ├── productsRepository.test.ts
│       ├── index.ts
│   ├── types/
│       ├── orders.ts
│       ├── index.ts
│   ├── middlewares/
│       ├── errorHandler.ts
│       ├── index.ts
│   ├── utils/
│       ├── sharedUtils.ts
│       ├── prismaClient.ts
│       ├── index.ts
│       ├── nodemailer.ts
│   ├── integrations/
│       ├── types.ts
│       ├── email/
│           ├── smtpEmailClient.ts
│           ├── emailFactory.ts
│   ├── queues/
│       ├── emailQueue.ts
│   ├── workers/
│       ├── emailWorker.ts
│   ├── jobs/
│       ├── sendingEmailJob.ts
│   ├── controllers/
│       ├── ordersController.ts
│       ├── index.ts
│   ├── routes/
│       ├── ordersRoutes.ts
│   ├── services/
│       ├── ordersService.ts
│       ├── index.ts
├── prisma
│   ├── schema.prisma
│   └── seed.ts
├── Dockerfile
├── docker-compose.yml
```

## License

MIT License.
