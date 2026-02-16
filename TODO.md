[x] add graphql support
[x] config database connection and drizzle orm
[] add role guards
[x] set up basic folder structure for packages and apps
[x] configure eslint and prettier
[] set up husky and lint-staged for pre-commit hooks
[x] implement anonymous user functionality
[x] add docker-compose for local development
[x] add migrations and seed data scripts
[x] add dockerfiles for services
[x] configure CI/CD pipeline for automated testing and deployment
[x] add ci/cd pipeline configuration files
[x] integrate remote build cache to ci pipeline and docker builds
[x] config proxy server for api requests in frontend
[] create a shared UI component library
[] create a shared utility library
[] create a shared types library
[x] implement authentication and authorization
[] set up testing framework and write initial tests
[] document project setup and contribution guidelines
[] integrate remote build cache to ci pipeline and docker builds
[] validar .env variables con zod en frontend
[] add group user in docker files to avoid root permission issues
[x] set up environment variable management
[x] optimize Dockerfiles for smaller image sizes
[x] add graphql support
[x] config database connection and drizzle orm
[x] implement anonymous user functionality
[x] add migrations and seed data scripts

# For Local Development with Docker Compose--------------------------------------------------------------------------------

docker compose build --no-cache
docker compose up --build

docker compose exec app pnpm add dotenv -D --filter=api-gql
docker compose exec app pnpm --filter=api-gql db:push

# To stop and remove containers, networks

docker compose down

# To view logs

docker compose logs -f

# To run database migrations---------------

docker compose exec app pnpm --filter=api-gql db:generate
docker compose exec app pnpm --filter=api-gql db:migrate
docker compose exec app pnpm --filter=api-gql db:push

# To access the database container

docker compose exec db psql -U postgres -d parallel_app_db

# To access the app container

docker compose exec app sh

# For Production Deployment--------------------------------------------------------------------------------------------

# Build Docker Image for API Service

docker build -t alexfloresdev/parallel-api:1.0 -f apps/api/Dockerfile .

# Test and Run Docker Container for API Service-------

# add -e DATABASE_URL='your_production_database_url' -e COOKIE_SECRET="gql-parallel-session" -e JWT_SECRET="parallel-secret" -e UPLOADING_API_TOKEN="your_uploading_api_token" for env variables

docker run -p 4000:4000 alexfloresdev/parallel-api:1.0

# Build Docker Image for Web Service---------

docker build -t parallel-app -f apps/parallel/Dockerfile .

# Test and Run Docker Container for Web Service--------

# add -e NEXT_PUBLIC_API_URL='http://localhost:4000/graphql' -e AUTH_COOKIE="gql-parallel-session" for env variables

docker run -p 3000:3000 parallel-app

# config your Docker Hub credentials--------------

docker login -u your_dockerhub_username -p your_dockerhub_password

# Push Docker Image to Docker Hub-------------

docker push alexfloresdev/parallel-api:1.0

# Github Actions CI/CD Pipeline Setup-----------------------------------------------------------------------------

- :${{ env.DOCKER_TAG }}

# Turbo Repo Remote Cache Setup-------

pnpm dlx turbo login
pnpm dlx turbo link

env.example frontend file:
path: apps/parallel/.env.example
AUTH_COOKIE="gql-parallel-session"
NEXT_PUBLIC_APP_URL=http://localhost:3000

env.example backend file:
path: apps/api/.env.example
DATABASE_URL='postgresql://admin:admin@parallel-db:5432/parallel'
COOKIE_SECRET="gql-parallel-session"
JWT_SECRET="parallel-secret"
UPLOADING_API_TOKEN='your-uploading-api-token-here'
