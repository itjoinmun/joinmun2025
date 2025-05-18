# Project constants
PROJECT_NAME=joinmun2025
COMPOSE_DEV_FILE=compose.dev.yaml
COMPOSE_PROD_FILE=compose.prod.yaml
DB_USERNAME=joinmun
DB_DATABASE=joinmun_backend_db

# Mode selection (default: dev)
MODE ?= dev
ifeq ($(MODE),dev)
	COMPOSE_FILE=$(COMPOSE_DEV_FILE)
	BACKEND_SERVICE=$(PROJECT_NAME)-backend-api-1
	BACKEND_DB=$(PROJECT_NAME)-backend-db-1
else ifeq ($(MODE),prod)
	COMPOSE_FILE=$(COMPOSE_PROD_FILE)
	BACKEND_SERVICE=$(PROJECT_NAME)-backend-api-1
	BACKEND_DB=$(PROJECT_NAME)-backend-db-1
else
$(error MODE must be either 'dev' or 'prod')
endif

DOCKER_COMPOSE=docker compose -f $(COMPOSE_FILE)

# Commands
.PHONY: up down downv restart restartv logs build stop ps shell db

# Start containers
up:
	$(DOCKER_COMPOSE) up

upb:
	$(DOCKER_COMPOSE) up --build

# Stop and remove containers
down:
	$(DOCKER_COMPOSE) down

# Stop and remove containers and volumes
downv:
	$(DOCKER_COMPOSE) down -v

# Restart containers
restart: down upb

# Restart containers with volume removal
restartv: downv up

# Build containers
build:
	$(DOCKER_COMPOSE) build

# View logs
logs:
	$(DOCKER_COMPOSE) logs -f

# Stop containers
stop:
	$(DOCKER_COMPOSE) stop

# List all containers
ps:
	$(DOCKER_COMPOSE) ps

# Open a shell in the backend container
shell:
	$(DOCKER_COMPOSE) exec -it $(BACKEND_SERVICE) sh

# Connect to the database
db:
	docker exec -it $(BACKEND_DB) psql -U $(DB_USERNAME) -d $(DB_DATABASE)
