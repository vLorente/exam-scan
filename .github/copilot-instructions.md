# GitHub Copilot Instructions for Exam Scan Project

## Project Overview
**Exam Scan** is a web application for processing PDF exams, extracting questions with AI, and managing collaborative exam creation. The project is a full-stack monorepo with FastAPI backend and Angular frontend, designed for educational institutions to digitize and manage exam content.

The repository is medium-sized (~50 files) with a hybrid monorepo structure containing backend (Python/FastAPI), frontend (Angular/TypeScript), and Docker orchestration for both development and production environments.

## High Level Repository Information
- **Type**: Full-stack web application (educational/exam management)
- **Languages**: Python 3.12 (backend), TypeScript/Angular 20+ (frontend)
- **Frameworks**: FastAPI, SQLModel, Angular with standalone components
- **Database**: PostgreSQL with Alembic migrations, Redis for caching
- **Infrastructure**: Docker Compose, Dev Containers, Prometheus/Grafana monitoring
- **Package Managers**: uv (Python), pnpm (Node.js)

## Build Instructions

### Prerequisites
- **Docker & Docker Compose** (required for all environments)
- **uv** (Python package manager, version latest)
- **Node.js 22+** and **pnpm** (for frontend development)
- **Python 3.12** (if running locally without Docker)

### Environment Setup
**ALWAYS** copy and configure environment variables before any build:
```bash
# Backend environment (required)
cp backend/.env.example backend/.env
# Edit backend/.env with appropriate values
```

### Development Setup (Recommended: Docker)

#### Backend Development
```bash
cd backend
# ALWAYS run this first to ensure environment is ready
./scripts/docker.sh dev-up
# This will start: FastAPI (8000), PostgreSQL (5433), Redis (6380)
# Includes automatic migration execution and hot reload
```

#### Frontend Development  
```bash
cd frontend
pnpm install  # ALWAYS run before building
pnpm start    # Starts Angular dev server on port 4200
```

#### Full Stack Development
From project root:
```bash
docker compose up --build
# Starts all services: backend, frontend, db, redis, monitoring
# Backend: http://localhost:8000
# Frontend: http://localhost:4200
# Docs: http://localhost:8000/docs
```

### Testing
**Backend Tests** (must run from backend directory):
```bash
cd backend
# ALWAYS ensure dev environment is running first
./scripts/docker.sh dev-up
uv run pytest                    # All tests
uv run pytest --cov=app        # With coverage
uv run pytest app/tests/test_users.py -v  # Specific module
```

**Frontend Tests**:
```bash
cd frontend
pnpm test       # Unit tests with Karma/Jasmine
```

### Database Migrations
**ALWAYS use the migration script** (not direct alembic commands):
```bash
cd backend
./scripts/migrate.sh status     # Check current state
./scripts/migrate.sh generate "description"  # After model changes
./scripts/migrate.sh apply      # Apply pending migrations
```

### Linting and Formatting
**Backend**:
```bash
cd backend
uv run black .    # Format code
uv run isort .    # Sort imports  
uv run ruff check .  # Lint
```

**Frontend**:
```bash
cd frontend
pnpm lint         # ESLint
```

### Production Build
```bash
# From project root
docker compose -f docker-compose.yml up --build
# ALWAYS ensure .env files are configured for production
```

### Common Build Issues and Workarounds
1. **Migration conflicts**: Always check `./scripts/migrate.sh status` before generating new migrations
2. **Docker build failures**: Ensure both `pyproject.toml` and `uv.lock` exist in backend directory
3. **Permission errors**: Use the provided scripts instead of direct commands
4. **Port conflicts**: Backend dev uses 5433/6380, production uses 5432/6379
5. **Hot reload not working**: Ensure volume mounts are correct in docker-compose files

### Command Timing
- Backend startup (Docker): ~30-60 seconds (includes migrations)
- Frontend build: ~45 seconds
- Test suite (backend): ~15 seconds
- Migration generation: ~5 seconds

## Project Layout

### Root Directory
```
exam_scan/
├── docker-compose.yml              # Production orchestration
├── exam_scan.code-workspace        # Multi-root VS Code workspace
├── README.md                       # Project documentation
├── Requisitos.md                   # Requirements document
├── .github/
│   └── copilot-instructions.md     # This file
└── .devcontainer/                  # Root dev container config
```

### Backend Architecture
```
backend/
├── app/
│   ├── api/v1/routers/            # FastAPI route handlers
│   │   ├── auth.py                # JWT authentication ✅
│   │   ├── users.py               # User CRUD ✅  
│   │   ├── exams.py               # Exam management ✅
│   │   ├── questions.py           # Question/Option CRUD ✅
│   │   └── sessions.py            # Exam sessions (partial)
│   ├── core/
│   │   ├── config.py              # Pydantic settings
│   │   ├── database.py            # SQLModel database setup
│   │   ├── security.py            # JWT utilities
│   │   └── exceptions.py          # Custom exceptions
│   ├── models/                    # SQLModel entities
│   │   ├── user.py                # User model with relationships
│   │   ├── exam.py                # Exam with status management
│   │   ├── question.py            # Question/Option models
│   │   ├── session.py             # Session/Answer models
│   │   └── tag.py                 # Tagging system
│   ├── services/                  # Business logic layer
│   │   ├── exam_service.py        # Exam validations/stats
│   │   ├── question_service.py    # Question type validations
│   │   └── session_service.py     # Session management
│   ├── tests/                     # Pytest test suite (38+ tests)
│   │   ├── conftest.py            # Test configuration
│   │   ├── test_users.py          # User tests (10 tests) ✅
│   │   ├── test_exams.py          # Exam tests ✅
│   │   ├── test_questions.py      # Question tests ✅
│   │   └── test_sessions.py       # Session tests ✅
│   └── main.py                    # FastAPI application entry
├── alembic/                       # Database migrations
│   ├── versions/                  # Migration files
│   │   ├── 1f12d83dbed3_initial_models_migration.py
│   │   └── 4de3509c4210_update_models_structure.py
│   └── env.py                     # Alembic configuration
├── scripts/                       # Utility scripts
│   ├── docker.sh                  # Docker management script
│   └── migrate.sh                 # Migration management script
├── .devcontainer/                 # Backend dev container
├── pyproject.toml                 # uv dependencies
├── uv.lock                        # Dependency lockfile
├── pytest.ini                     # Pytest configuration
├── Dockerfile                     # Backend container
├── docker-compose.yml             # Backend production
└── docker-compose.dev.yml         # Backend development
```

### Frontend Architecture
```
frontend/
├── src/
│   ├── app/
│   │   ├── app.config.ts          # Angular application config
│   │   ├── app.routes.ts          # Route configuration
│   │   └── app.ts                 # Root component
│   ├── index.html                 # Main HTML file
│   ├── main.ts                    # Application bootstrap
│   └── styles.css                 # Global styles
├── .devcontainer/                 # Frontend dev container
├── angular.json                   # Angular CLI configuration
├── package.json                   # npm/pnpm dependencies
├── pnpm-lock.yaml                 # Package lockfile
├── Dockerfile                     # Frontend container
└── README.md                      # Frontend documentation
```

### Configuration Files
- **Linting**: `backend/pytest.ini`, `frontend/angular.json`
- **Compilation**: `backend/pyproject.toml`, `frontend/tsconfig.json`
- **Testing**: `backend/pytest.ini`, `frontend/package.json` scripts
- **Docker**: Multiple `docker-compose.yml` files for different environments
- **Database**: `backend/alembic.ini`, `backend/alembic/env.py`

### Development Workflow
1. **Backend changes**: Edit models → generate migration → apply → test
2. **Frontend changes**: Edit components → build → test
3. **Full stack**: Use multi-root workspace for context across services

### Dependencies and Architecture Notes
- **Backend uses hybrid CRUD + Services pattern** - basic CRUD in routers, complex logic in services
- **Frontend uses standalone components** (Angular 20+) with signals
- **Database migrations are managed through custom scripts** - not direct alembic
- **Authentication is JWT-based** with role-based access (User/Admin)
- **Question types supported**: Multiple Choice, Single Choice, True/False
- **Exam states**: Draft → Published → Archived

### Validation Pipeline
The project uses:
- **Pytest** for backend testing (38+ tests, 70% coverage)
- **Angular testing** with Karma/Jasmine for frontend
- **Docker health checks** for service validation
- **Database migrations** with rollback support

**Trust these instructions** - they have been validated and tested. Only search for additional information if these instructions are incomplete or contain errors.
