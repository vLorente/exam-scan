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
  - `src/app/shared/components`: Contiene los componentes de presentación (sin lógica de negocio) específicos de la funcionalidad de exámenes.
      - `src/app/shared/components/shared-component/shared-component.ts`: Componente compartido.
      - `src/app/shared/components/shared-component/shared-component.html`: Plantilla del componente compartido.
      - `src/app/shared/components/shared-component/shared-component.css`: Estilos del componente compartido.
      - `src/app/shared/components/shared-component/shared-component.spec.ts`: Pruebas del componente compartido.
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

## CSS & Styling Standards
### Design Token System
- ALWAYS use CSS custom properties defined in `src/styles.css` instead of hardcoded values
- Use semantic naming: `--primary-gradient`, `--spacing-xl`, `--font-size-2xl`
- Never duplicate color values, spacing, or font sizes across components

### Required CSS Variables Usage
- **Colors**: Use `--primary-gradient`, `--accent-gradient`, `--cta-gradient`, `--accent-gold`, etc.
- **Spacing**: Use `--spacing-xs` to `--spacing-4xl`, `--section-padding` for consistent spacing
- **Typography**: Use `--font-size-xs` to `--font-size-6xl` for font sizes
- **Border Radius**: Use `--radius-sm` to `--radius-2xl`, `--radius-full`
- **Shadows**: Use `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-cta`
- **Glass Effects**: Use `--glass-bg`, `--glass-border`, `--glass-blur`
- **Transitions**: Use `--transition-fast`, `--transition-normal`, `--transition-slow`

### CSS Architecture Rules
- Components should NOT have hardcoded spacing, colors, or font sizes
- Use utility classes: `.primary-gradient-bg`, `.accent-gradient-text`, `.animate-fade-in-up`
- Maintain consistent spacing between sections (no margin gaps showing background)
- All interactive elements must be keyboard accessible and have proper focus styles

### Responsive Design Requirements
- Mobile-first approach using CSS variables
- Use CSS Grid and Flexbox for layouts
- Ensure proper responsive breakpoints: `@media (max-width: 768px)`
- Buttons should stack vertically on mobile and maintain consistent sizing

## Accessibility Standards (WCAG 2.1 AA Compliance)
### Semantic HTML Requirements
- Use proper semantic elements: `<section>`, `<header>`, `<nav>`, `<main>`, `<article>`
- Implement correct heading hierarchy (h1 → h2 → h3)
- Use `<button>` for interactive elements, not `<div>`

### ARIA Attributes (Required)
- Add `aria-label` or `aria-labelledby` to all sections
- Use `aria-describedby` for additional context
- Add `aria-hidden="true"` to decorative elements (icons, background graphics)
- Implement `role` attributes: `role="button"`, `role="list"`, `role="img"`, `role="banner"`
- Use `aria-pressed` for toggle buttons, `aria-expanded` for collapsible content

### Keyboard Navigation
- All interactive elements must be focusable with Tab key
- Implement clear focus indicators with `outline: 2px solid var(--accent-gold)`
- Add focus styles with `box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.3)`
- Provide skip navigation links: `<a href="#main-content" class="skip-link sr-only-focusable">`

### Screen Reader Support
- Use `.sr-only` class for screen reader only content
- Provide descriptive text for buttons: `aria-describedby="button-description"`
- Add unique IDs for form labels and descriptions
- Include context descriptions for visual elements

### Required Accessibility Classes
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### User Preferences Support
- Implement `@media (prefers-reduced-motion: reduce)` for animations
- Support `@media (prefers-contrast: high)` for high contrast mode
- Ensure sufficient color contrast ratios (4.5:1 for normal text)

## Button Styling Standards
- All buttons in the same group must have consistent sizing
- Use `flex: 1` and `min-width` for equal-sized buttons
- Implement proper hover and focus states
- Maintain visual hierarchy (primary vs secondary styles)
- Stack buttons vertically on mobile with full width

## Implementation Best Practices
### Component Development Workflow
1. **Start with semantic HTML**: Use proper elements (`<section>`, `<button>`, `<nav>`)
2. **Apply design tokens**: Use CSS custom properties for all styling values
3. **Add ARIA attributes**: Ensure accessibility from the beginning
4. **Test keyboard navigation**: Tab through all interactive elements
5. **Verify screen reader compatibility**: Test with descriptive labels

### Code Quality Standards
- Never use hardcoded values: `padding: 16px` ❌ → `padding: var(--spacing-sm)` ✅
- Always include focus styles: `button:focus { outline: 2px solid var(--accent-gold); }`
- Use semantic markup: `<div onclick="">` ❌ → `<button>` ✅
- Provide context: `<button>Save</button>` ❌ → `<button aria-describedby="save-desc">Save</button>` ✅

### CSS Variable Reference
```css
/* Colors */
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--accent-gradient: linear-gradient(45deg, #FFD700, #FFA500);
--cta-gradient: linear-gradient(45deg, #FF6B6B, #FF8E53);

/* Spacing */
--spacing-xs: 0.5rem; --spacing-sm: 1rem; --spacing-md: 1.5rem;
--spacing-lg: 2rem; --spacing-xl: 3rem; --spacing-2xl: 4rem;
--spacing-3xl: 6rem; --spacing-4xl: 8rem;

/* Typography */
--font-size-xs: 0.75rem; --font-size-sm: 0.875rem; --font-size-base: 1rem;
--font-size-lg: 1.125rem; --font-size-xl: 1.25rem; --font-size-2xl: 1.5rem;
--font-size-3xl: 2rem; --font-size-4xl: 2.25rem; --font-size-5xl: 3rem;
--font-size-6xl: 3.5rem;
```

### Accessibility Implementation Examples
```html
<!-- Section with proper ARIA -->
<section aria-labelledby="features-title">
  <h2 id="features-title">Platform Features</h2>
</section>

<!-- Button with description -->
<button aria-describedby="btn-desc">Start Free Trial</button>
<span id="btn-desc" class="sr-only">Begin your free 30-day trial</span>

<!-- Interactive list -->
<nav aria-label="Process steps">
  <ol role="list">
    <li><button aria-pressed="true">Step 1</button></li>
  </ol>
</nav>
```

## Animations in Angular
- Define enter animations using CSS classes with either transforms or keyframe animations
- Use animate.enter to animate elements as they enter the DOM
- Use animate.leave to animate elements as they leave the DOM

### Animation Examples
``` html
<h2><code>animate.enter</code> Example</h2>
<div class="enter-container" animate.enter="enter-animation">
  <p>The box is entering.</p>
</div>
```
```css
.enter-animation {
  animation: slide-fade 1s;
}
@keyframes slide-fade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
