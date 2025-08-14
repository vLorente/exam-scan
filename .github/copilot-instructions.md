# GitHub Copilot Instructions for Exam Scan Project

Este proyecto tiene como objetivo facilitar la creación y gestión de exámenes tipo test mediante el uso de inteligencia artificial y herramientas colaborativas.

- Subir archivos PDF de exámenes tipo test.  
- Extraer y estructurar preguntas mediante IA.  
- Crear y editar exámenes y preguntas de forma manual.  
- Colaborar en revisión, comentarios y versiones.  
- Realizar exámenes interactivos y consultar resultados.  
- Almacenar y gestionar todo en una base de datos centralizada.

## Folder Structure

- `/backend`: Contains the source code for the backend.
- `/frontend`: Contains the source code for the frontend.
- `.devcontainer`: Contains the configuration files for the development container.
- `README.md`: Contains the documentation for the project.
- `prometheus`: Contains the configuration files for Prometheus monitoring.
- `grafana`: Contains the configuration files for Grafana dashboards.

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

## High Level Repository Information
- **Type**: Full-stack web application (educational/exam management)
- **Languages**: Python 3.12 (backend), TypeScript/Angular 20+ (frontend)
- **Frameworks**: FastAPI, SQLModel, Angular with standalone components
- **Database**: PostgreSQL with Alembic migrations, Redis for caching
- **Infrastructure**: Docker Compose, Dev Containers, Prometheus/Grafana monitoring
- **Package Managers**: uv (Python), pnpm (Node.js)

## Autenticación y Seguridad

La autenticación y seguridad son aspectos críticos de esta aplicación. Se implementarán las siguientes medidas:

- **Autenticación de Usuarios**: Se utilizará JWT (JSON Web Tokens) para la autenticación de usuarios. Los usuarios deberán iniciar sesión para obtener un token que se incluirá en las cabeceras de las solicitudes a los endpoints protegidos.
- **Autorización**: Se implementarán roles y permisos para controlar el acceso a diferentes partes de la aplicación. Solo los usuarios con los permisos adecuados podrán realizar ciertas acciones (por ejemplo, crear o eliminar exámenes).
- **Validación de Datos**: Se realizarán validaciones exhaustivas de los datos de entrada en todos los endpoints para prevenir ataques de inyección y garantizar la integridad de los datos.
- **Cifrado de Contraseñas**: Las contraseñas de los usuarios se almacenarán de forma segura utilizando un algoritmo de hash (por ejemplo, passlib.context) para protegerlas en caso de que la base de datos sea comprometida.
- **Protección contra CSRF**: Se implementarán medidas para proteger la aplicación contra ataques de falsificación de solicitudes entre sitios (CSRF).
- **Registro y Monitoreo**: Se registrarán todas las actividades de los usuarios y se monitorearán en busca de comportamientos sospechosos.

## Backend Instructions

Esta sección proporciona instrucciones para el desarrollo del backend de la aplicación.

### Folder Structure

- `app`: Contains the source code for the backend application.
- `app/api`: Contains the API routes for the backend.
- `app/models`: Contains the data models for the backend.
- `app/services`: Contains the business logic for the backend.
- `app/db`: Contains the database configuration and models.
- `app/tests`: Contains the unit tests for the backend.
- `alembic`: Contains the database migration scripts.
- `scripts`: Contains utility scripts for database seeding, data migration, etc.

### Coding Standards

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

### Endpoints

#### Auth

##### Authentication Operations
- `POST /register`: Registrar un nuevo usuario en el sistema.
- `POST /login`: Autenticar un usuario y obtener un token de acceso.
- `GET /me`: Obtener información del usuario actualmente autenticado (endpoint protegido).

#### Users

##### CRUD Operations
- `GET /users`: List all users.
- `POST /users`: Create a new user.
- `GET /users/{user_id}`: Get a specific user by ID.
- `PUT /users/{user_id}`: Update an existing user by ID.
- `DELETE /users/{user_id}`: Delete a user by ID.

#### Exams

##### CRUD Operations
- `GET /exams`: Obtener la lista de todos los exámenes.
- `POST /exams`: Crear un nuevo examen.
- `GET /exams/{exam_id}`: Obtener un examen específico por su ID.
- `PUT /exams/{exam_id}`: Actualizar un examen existente por su ID.
- `DELETE /exams/{exam_id}`: Eliminar un examen por su ID.

##### Business Logic Operations
- `POST /exams/{exam_id}/publish`: Publicar un examen después de validar que cumple los requisitos.
- `POST /exams/{exam_id}/archive`: Archivar un examen.
- `GET /exams/{exam_id}/statistics`: Obtener estadísticas detalladas de un examen.
- `GET /exams/{exam_id}/validate`: Validar si un examen puede ser publicado sin publicarlo.

#### Questions

##### CRUD Operations for Questions
- `GET /questions`: Listar preguntas, opcionalmente filtradas por examen (`?exam_id={id}`).
- `POST /questions?exam_id={exam_id}`: Crear una nueva pregunta asociada a un examen.
- `GET /questions/{question_id}`: Obtener una pregunta específica con sus opciones.
- `PUT /questions/{question_id}`: Actualizar una pregunta existente.
- `DELETE /questions/{question_id}`: Eliminar una pregunta.

##### CRUD Operations for Options
- `GET /questions/{question_id}/options`: Listar todas las opciones de una pregunta.
- `POST /questions/{question_id}/options`: Crear una nueva opción para una pregunta.
- `GET /questions/options/{option_id}`: Obtener una opción específica.
- `PUT /questions/options/{option_id}`: Actualizar una opción existente.
- `DELETE /questions/options/{option_id}`: Eliminar una opción.

##### Business Logic Operations for Questions
- `POST /questions/{question_id}/validate`: Validar la estructura completa de una pregunta.
- `POST /questions/{question_id}/auto-fix`: Intentar corregir automáticamente problemas comunes en una pregunta.
- `GET /questions/exam/{exam_id}/validate-all`: Validar todas las preguntas de un examen.
- `POST /questions/exam/{exam_id}/reorder`: Reordenar las preguntas de un examen según una lista de IDs.

### Guidelines

- Use FastAPI for building APIs.
- Follow RESTful principles for API design.
- Use SQLModel for database models.
- Write unit tests for all API endpoints.
- Use environment variables for configuration.

## Frontend Instructions

Esta sección proporciona instrucciones para el desarrollo del frontend de la aplicación.

### Folder Structure

- `src`: Contains the source code for the frontend application.
- `src/app`: Contiene el módulo principal de la aplicación (AppModule) y el componente raíz (AppComponent).
- `src/app/core`: Aloja servicios singleton y módulos que solo se importan una vez en el AppModule.
- `src/app/shared`: Incluye componentes, directivas, pipes y módulos que se reutilizan en toda la aplicación.
- `src/app/features`: Directorio principal para los módulos de característica. Cada subcarpeta representa una funcionalidad principal de la aplicación.
  - `src/app/features/auth`: Contiene todos los archivos del módulo de característica de autenticación.
  - `src/app/features/users`: Contiene todos los archivos del módulo de característica de usuarios.
  - `src/app/features/exams`: Contiene todos los archivos del módulo de característica de exámenes.
    - `src/app/features/exams/components`: Contiene los componentes de presentación (sin lógica de negocio) específicos de la funcionalidad de exámenes.
    - `src/app/features/exams/pages`: Contiene los componentes de contenedor (con lógica de negocio) que actúan como "páginas" dentro de la aplicación.
    - `src/app/features/exams/services`: Contiene los servicios específicos para la funcionalidad de exámenes (por ejemplo, ExamsService para llamadas a la API).
- `public`: Contiene activos estáticos como imágenes y fuentes.
- `src/environments`: Almacena la configuración específica para cada entorno (desarrollo, producción, etc.).
- `src/assets`: Contiene archivos estáticos como imágenes, iconos, fuentes y otros recursos.

### Libraries and Frameworks

- Angular 20
- TypeScript

### Coding Standards

- Follow the Angular style guide for coding standards.
- Use descriptive variable and function names.
- Write clean and maintainable code.
- Follow best practices for state management.
- Write unit tests for all components and services.
- Use environment variables for configuration.

### UI Guidelines

- Use Angular Material for UI components.
- Follow the BEM (Block Element Modifier) naming convention for CSS.
- Ensure responsive design using Flexbox and Grid.