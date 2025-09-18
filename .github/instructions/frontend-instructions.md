---
appplyTo: frontend
---

# GitHub Copilot Instructions for Frontend of Exam Scan Project

Este documento tiene como intención proporcionar directrices y mejores prácticas para el desarrollo del frontend de la aplicación Exam Scan.

## Folder Structure

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

## Libraries and Frameworks

- Angular 20
- TypeScript

## Coding Standards

- Follow the Angular style guide for coding standards.
- Use descriptive variable and function names.
- Write clean and maintainable code.
- Follow best practices for state management.
- Write unit tests for all components and services.
- Use environment variables for configuration.

## UI Guidelines

- Use Angular Material for UI components.
- Follow the BEM (Block Element Modifier) naming convention for CSS.
- Ensure responsive design using Flexbox and Grid.
