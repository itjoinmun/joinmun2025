# Project constants
PROJECT_NAME=joinmun2025
COMPOSE_FILE=compose.dev.yaml
DOCKER_COMPOSE=docker compose -f $(COMPOSE_FILE)
BACKEND_SERVICE=joinmun2025-backend-api-1
BACKEND_DB=joinmun2025-backend-db-1
DB_USERNAME=joinmun
DB_DATABASE=joinmun_backend_db

# Commands
.PHONY: up down downv restart logs build stop ps shell db

# Start container (default when u type make)
up:
	$(DOCKER_COMPOSE) up --build

# stop and remove containers
down:
	$(DOCKER_COMPOSE) down

# stop and remove containers and volumes
downv:
	$(DOCKER_COMPOSE) down -v

# restart containers
restart: down up

# build containers
build:
	$(DOCKER_COMPOSE) build

# view logs
logs:
	$(DOCKER_COMPOSE) logs -f

# stop containers
stop:
	$(DOCKER_COMPOSE) stop

# list all containers
ps:
	$(DOCKER_COMPOSE) ps

# ssh into the backend container
shell:
	$(DOCKER_COMPOSE) exec -it $(BACKEND_SERVICE) sh

# ssh into the database container
db:
	$(DOCKER_COMPOSE) exec -it $(BACKEND_DB) psql -U $(DB_USERNAME) -d $(DB_DATABASE)
