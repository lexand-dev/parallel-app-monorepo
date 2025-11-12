# Parallel App Monorepo

This is a Turborepo monorepo example that demonstrates how to set up and manage multiple applications and packages in a single repository. It includes a NestJS API with GraphQL support and a Next.js frontend application, along with shared configurations and utilities.

## Features

- 🚀 **NestJS API** with GraphQL endpoint
- ⚡ **Next.js Frontend** with modern React features
- 📦 **Shared Packages** for code reuse across applications
- 🐳 **Docker Support** with multi-service orchestration
- 🔧 **Development Tools** with hot reloading and type safety
- 🎯 **Turborepo** for efficient builds and caching

## Using this example

To use this example, you can either clone the repository or create a new Turborepo monorepo and copy the files over.

## Structure

This Turborepo includes the following packages/apps:

### Apps and Packages

- `api`: a [NestJS](https://nestjs.com/) app with GraphQL API
- `parallel`: a [Next.js](https://nextjs.org/) frontend application
- `@workspace/ui`: a stub React component library shared by applications
- `@workspace/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@workspace/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Docker](https://docker.com/) for containerization
- [Docker Compose](https://docs.docker.com/compose/) for multi-service orchestration

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later)
- [pnpm](https://pnpm.io/) package manager
- [Docker](https://docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/lexand-dev/parallel-app-monorepo.git
cd parallel-app-monorepo
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

   **Backend (API):**

```bash
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your database and authentication configuration
```

**Frontend (Next.js):**

```bash
cp apps/parallel/.env.example apps/parallel/.env
# Edit apps/parallel/.env with your application URL configuration
```

> **Note:** The default configuration is already set up to work with Docker Compose. You only need to modify the environment variables if you're running outside of Docker or need custom settings.

### Development with Docker Compose

1. Build and start all services:

```bash
docker compose build --no-cache
docker compose up --build
```

2. Install additional dependencies (if needed):

```bash
docker compose exec app pnpm add dotenv -D --filter=api-gql
```

3. Set up the database schema:

```bash
docker compose exec app pnpm --filter=api-gql db:push
```

### Useful Docker Commands

- **Stop and remove containers:**

  ```bash
  docker compose down
  ```

- **View logs:**

  ```bash
  docker compose logs -f
  ```

- **Run database migrations:**

  ```bash
  docker compose exec app pnpm --filter=api-gql db:generate
  docker compose exec app pnpm --filter=api-gql db:migrate
  docker compose exec app pnpm --filter=api-gql db:push
  ```

- **Access the database container:**

  ```bash
  docker compose exec db psql -U postgres -d parallel_app_db
  ```

- **Access the app container:**
  ```bash
  docker compose exec app sh
  ```
