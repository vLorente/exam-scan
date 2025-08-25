You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.
## TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
## Angular Best Practices
- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.
## Components
- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- DO NOT use `ngStyle`, use `style` bindings instead
## State Management
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead
## Templates
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
## Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
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
      - `src/app/features/exams/components/exam-card/exam-card.ts`: Componente de tarjeta de examen.
      - `src/app/features/exams/components/exam-card/exam-card.html`: Plantilla de la tarjeta de examen.
      - `src/app/features/exams/components/exam-card/exam-card.css`: Estilos de la tarjeta de examen.
      - `src/app/features/exams/components/exam-card/exam-card.spec.ts`: Pruebas del componente de tarjeta de examen.
    - `src/app/features/exams/pages`: Contiene los componentes de contenedor (con lógica de negocio) que actúan como "páginas" dentro de la aplicación.
    - `src/app/features/exams/services`: Contiene los servicios específicos para la funcionalidad de exámenes (por ejemplo, ExamsService para llamadas a la API).
- `public`: Contiene activos estáticos como imágenes y fuentes.
- `src/environments`: Almacena la configuración específica para cada entorno (desarrollo, producción, etc.).
- `src/assets`: Contiene archivos estáticos como imágenes, iconos, fuentes y otros recursos.
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
