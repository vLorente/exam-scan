---
applyTo: backend
---

# GitHub Copilot Instructions for Backend of Exam Scan Project

Este documento tiene como finalidad definir las instrucciones para el desarrollo del backend del proyecto Exam Scan.

## Folder Structure

- `app`: Contains the source code for the backend application.
- `app/api`: Contains the API routes for the backend.
- `app/models`: Contains the data models for the backend.
- `app/services`: Contains the business logic for the backend.
- `app/db`: Contains the database configuration and models.
- `app/tests`: Contains the unit tests for the backend.
- `alembic`: Contains the database migration scripts.
- `scripts`: Contains utility scripts for database seeding, data migration, etc.

## Libraries and Frameworks

- Angular and CSS for the frontend.
- FastAPI, SQLModel for the backend.
- PostgreSQL for the database.
- Alembic for database migrations.
- Redis for caching.
- Prometheus for monitoring.
- Grafana for visualization.
- pgAdmin for database management.
- Docker for containerization.

## Coding Standards

- Use PEP 8 style guide for Python code.
- Use descriptive variable and function names.
- Write unit tests for all new features and bug fixes.
- Use snake_case for variable and function names.
- Document all public classes and methods.
- Use type hints for all function signatures.
- Follow the DRY (Don't Repeat Yourself) principle.
- Keep functions small and focused on a single task.
- Apply the Single Responsibility Principle (SRP) to all classes and functions.
- Apply clean code principles throughout the codebase.

## Endpoints

### Auth

#### Authentication Operations
- `POST /register`: Registrar un nuevo usuario en el sistema.
- `POST /login`: Autenticar un usuario y obtener un token de acceso.
- `GET /me`: Obtener información del usuario actualmente autenticado (endpoint protegido).

### Users

#### CRUD Operations
- `GET /users`: List all users.
- `POST /users`: Create a new user.
- `GET /users/{user_id}`: Get a specific user by ID.
- `PUT /users/{user_id}`: Update an existing user by ID.
- `DELETE /users/{user_id}`: Delete a user by ID.

### Exams

#### CRUD Operations
- `GET /exams`: Obtener la lista de todos los exámenes.
- `POST /exams`: Crear un nuevo examen.
- `GET /exams/{exam_id}`: Obtener un examen específico por su ID.
- `PUT /exams/{exam_id}`: Actualizar un examen existente por su ID.
- `DELETE /exams/{exam_id}`: Eliminar un examen por su ID.

#### Business Logic Operations
- `POST /exams/{exam_id}/publish`: Publicar un examen después de validar que cumple los requisitos.
- `POST /exams/{exam_id}/archive`: Archivar un examen.
- `GET /exams/{exam_id}/statistics`: Obtener estadísticas detalladas de un examen.
- `GET /exams/{exam_id}/validate`: Validar si un examen puede ser publicado sin publicarlo.

### Questions

#### CRUD Operations for Questions
- `GET /questions`: Listar preguntas, opcionalmente filtradas por examen (`?exam_id={id}`).
- `POST /questions?exam_id={exam_id}`: Crear una nueva pregunta asociada a un examen.
- `GET /questions/{question_id}`: Obtener una pregunta específica con sus opciones.
- `PUT /questions/{question_id}`: Actualizar una pregunta existente.
- `DELETE /questions/{question_id}`: Eliminar una pregunta.

#### CRUD Operations for Options
- `GET /questions/{question_id}/options`: Listar todas las opciones de una pregunta.
- `POST /questions/{question_id}/options`: Crear una nueva opción para una pregunta.
- `GET /questions/options/{option_id}`: Obtener una opción específica.
- `PUT /questions/options/{option_id}`: Actualizar una opción existente.
- `DELETE /questions/options/{option_id}`: Eliminar una opción.

#### Business Logic Operations for Questions
- `POST /questions/{question_id}/validate`: Validar la estructura completa de una pregunta.
- `POST /questions/{question_id}/auto-fix`: Intentar corregir automáticamente problemas comunes en una pregunta.
- `GET /questions/exam/{exam_id}/validate-all`: Validar todas las preguntas de un examen.
- `POST /questions/exam/{exam_id}/reorder`: Reordenar las preguntas de un examen según una lista de IDs.





