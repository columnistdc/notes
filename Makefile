.PHONY: help build run stop clean logs

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker image
	docker build -t voice-memos:latest .

run: ## Run container with docker-compose
	docker-compose up -d

stop: ## Stop container
	docker-compose down

clean: ## Remove container and image
	docker-compose down --rmi all
	docker rmi voice-memos:latest 2>/dev/null || true

logs: ## View container logs
	docker-compose logs -f

shell: ## Access container shell
	docker-compose exec voice-memos sh

restart: ## Restart container
	docker-compose restart

status: ## Show container status
	docker-compose ps
