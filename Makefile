.PHONY: help install dev test clean docker-up docker-down migrate lint format

# Default target
help:
	@echo "Threadz Development Commands"
	@echo ""
	@echo "Setup:"
	@echo "  install      - Install all dependencies and setup environment"
	@echo "  setup        - Same as install"
	@echo ""
	@echo "Development:"
	@echo "  dev          - Start development servers (backend + frontend)"
	@echo "  dev-backend  - Start only backend server"
	@echo "  dev-frontend - Start only frontend server"
	@echo ""
	@echo "Testing:"
	@echo "  test         - Run all tests"
	@echo "  test-backend - Run backend tests"
	@echo "  test-frontend - Run frontend tests"
	@echo ""
	@echo "Database:"
	@echo "  migrate      - Run database migrations"
	@echo "  migrate-gen  - Generate new migration"
	@echo "  seed         - Seed database with sample data"
	@echo ""
	@echo "Code Quality:"
	@echo "  lint         - Run linting for both backend and frontend"
	@echo "  format       - Format code for both backend and frontend"
	@echo ""
	@echo "Docker:"
	@echo "  docker-up    - Start all services with Docker"
	@echo "  docker-down  - Stop all Docker services"
	@echo "  docker-build - Build Docker images"
	@echo ""
	@echo "Maintenance:"
	@echo "  clean        - Clean build artifacts and cache"
	@echo "  deep-clean   - Remove all generated files and dependencies"

# Setup and Installation
install setup:
	@echo "🚀 Setting up Threadz environment..."
	./setup.sh

# Development
dev:
	@echo "🔄 Starting development servers..."
	npm run dev

dev-backend:
	@echo "🔧 Starting backend server..."
	cd Threadz-V1/backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	@echo "🎨 Starting frontend server..."
	cd Threadz-V1/frontend && npm run dev

# Testing
test:
	@echo "🧪 Running all tests..."
	npm run test

test-backend:
	@echo "🐍 Running backend tests..."
	cd Threadz-V1/backend && python -m pytest -v

test-frontend:
	@echo "⚛️ Running frontend tests..."
	cd Threadz-V1/frontend && npm test

# Database
migrate:
	@echo "🗄️ Running database migrations..."
	cd Threadz-V1/backend && alembic upgrade head

migrate-gen:
	@echo "📝 Generating new migration..."
	cd Threadz-V1/backend && alembic revision --autogenerate -m "$(MSG)"

seed:
	@echo "🌱 Seeding database..."
	cd Threadz-V1/backend && python -m app.seed_data || echo "Seed script not found"

# Code Quality
lint:
	@echo "🔍 Running linting..."
	npm run lint

format:
	@echo "✨ Formatting code..."
	cd Threadz-V1/backend && python -m black app/ || echo "Black not installed"
	cd Threadz-V1/frontend && npm run format || echo "Format script not found"

# Docker
docker-up:
	@echo "🐳 Starting Docker services..."
	docker-compose up --build

docker-down:
	@echo "🛑 Stopping Docker services..."
	docker-compose down

docker-build:
	@echo "🏗️ Building Docker images..."
	docker-compose build

# Maintenance
clean:
	@echo "🧹 Cleaning build artifacts..."
	npm run clean

deep-clean:
	@echo "🔥 Deep cleaning..."
	npm run clean
	docker-compose down -v
	docker system prune -f
	conda env remove -n threadz-env -y || echo "Conda env not found"
