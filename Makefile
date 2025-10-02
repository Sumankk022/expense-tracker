# Expense Tracker Makefile
# Provides convenient commands to manage the application

.PHONY: help install setup dev dev-backend dev-frontend build start stop clean db-setup db-reset db-seed db-studio logs test lint format

# Default target
help: ## Show this help message
	@echo "Expense Tracker - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Installation and Setup
install: ## Install all dependencies (root, backend, frontend)
	@echo "Installing root dependencies..."
	npm install
	@echo "Installing backend dependencies..."
	cd backend && npm install
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✅ All dependencies installed!"

setup: install ## Complete setup (install + database setup)
	@echo "Setting up database..."
	$(MAKE) db-setup
	@echo "✅ Setup complete! Run 'make dev' to start the application."

# Development
dev: ## Start both frontend and backend in development mode
	@echo "Starting development servers..."
	npm run dev

dev-backend: ## Start only backend server
	@echo "Starting backend server..."
	cd backend && npm run dev

dev-frontend: ## Start only frontend server
	@echo "Starting frontend server..."
	cd frontend && npm run dev

# Production
build: ## Build frontend for production
	@echo "Building frontend..."
	cd frontend && npm run build
	@echo "✅ Frontend built successfully!"

start: ## Start production server
	@echo "Starting production server..."
	cd backend && npm start

# Database Management
db-setup: ## Setup database (push schema + seed)
	@echo "Setting up SQLite database..."
	@echo "Creating .env file..."
	@echo 'PORT=3001' > backend/.env
	@echo 'NODE_ENV=development' >> backend/.env
	cd backend && npx prisma db push
	cd backend && npx prisma db seed
	@echo "✅ Database setup complete!"

db-reset: ## Reset database (drop + recreate + seed)
	@echo "Resetting SQLite database..."
	@echo "Creating .env file..."
	@echo 'PORT=3001' > backend/.env
	@echo 'NODE_ENV=development' >> backend/.env
	cd backend && rm -f dev.db
	cd backend && npx prisma db push
	cd backend && npx prisma db seed
	@echo "✅ Database reset complete!"

db-seed: ## Seed database with sample data
	@echo "Seeding database..."
	cd backend && npx prisma db seed
	@echo "✅ Database seeded!"

db-studio: ## Open Prisma Studio (database GUI)
	@echo "Opening Prisma Studio..."
	cd backend && npx prisma studio

db-migrate: ## Run database migrations
	@echo "Running database migrations..."
	cd backend && npx prisma migrate dev

db-generate: ## Generate Prisma client
	@echo "Generating Prisma client..."
	cd backend && npx prisma generate

# Docker Management
docker-up: ## Start PostgreSQL container
	@echo "Starting PostgreSQL container..."
	docker-compose up -d
	@echo "✅ PostgreSQL container started!"

docker-down: ## Stop PostgreSQL container
	@echo "Stopping PostgreSQL container..."
	docker-compose down
	@echo "✅ PostgreSQL container stopped!"

docker-logs: ## Show PostgreSQL container logs
	docker-compose logs -f postgres

docker-status: ## Check container status
	docker ps

# Application Management
stop: docker-down ## Stop all services
	@echo "All services stopped!"

restart: stop dev ## Restart all services

# Cleanup
clean: ## Clean up node_modules and build files
	@echo "Cleaning up..."
	rm -rf node_modules
	rm -rf backend/node_modules
	rm -rf frontend/node_modules
	rm -rf frontend/dist
	rm -rf frontend/build
	@echo "✅ Cleanup complete!"

clean-docker: ## Clean up Docker containers and volumes
	@echo "Cleaning up Docker..."
	docker-compose down -v
	docker system prune -f
	@echo "✅ Docker cleanup complete!"

# Development Tools
logs: ## Show application logs
	@echo "Showing logs (Ctrl+C to exit)..."
	tail -f backend/logs/*.log 2>/dev/null || echo "No log files found"

test: ## Run tests
	@echo "Running tests..."
	cd backend && npm test || echo "No tests configured"

lint: ## Run linting
	@echo "Running linter..."
	cd frontend && npm run lint || echo "Linting not configured"

format: ## Format code
	@echo "Formatting code..."
	cd frontend && npm run format || echo "Formatting not configured"

# Quick Commands
quick-start: ## Quick start (setup + dev)
	@echo "🚀 Quick starting the application..."
	$(MAKE) setup
	@echo "Starting development servers..."
	$(MAKE) dev

fresh-start: ## Fresh start (clean + setup + dev)
	@echo "🔄 Fresh start - cleaning and setting up..."
	$(MAKE) clean
	$(MAKE) clean-docker
	$(MAKE) setup
	@echo "Starting development servers..."
	$(MAKE) dev

# Status and Info
status: ## Show application status
	@echo "📊 Application Status:"
	@echo "===================="
	@echo "Docker containers:"
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(postgres|expense)" || echo "No containers running"
	@echo ""
	@echo "Ports in use:"
	@lsof -i :3001 -i :5173 -i :5432 2>/dev/null || echo "No processes found on target ports"
	@echo ""
	@echo "Frontend: http://localhost:5173"
	@echo "Backend:  http://localhost:3001"
	@echo "Database: localhost:5432"

info: ## Show project information
	@echo "📱 Expense Tracker Application"
	@echo "============================="
	@echo "Frontend: React + Vite + Tailwind CSS"
	@echo "Backend:  Node.js + Express + Prisma"
	@echo "Database: PostgreSQL"
	@echo ""
	@echo "Available commands:"
	@echo "  make help          - Show this help"
	@echo "  make setup         - Complete setup"
	@echo "  make dev           - Start development"
	@echo "  make quick-start   - Quick start"
	@echo "  make fresh-start   - Clean fresh start"
	@echo "  make status        - Show status"
	@echo ""
	@echo "For more commands, run: make help"
