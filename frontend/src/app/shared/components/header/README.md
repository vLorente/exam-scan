# Header Component

Componente de encabezado compartido que puede ser utilizado en diferentes páginas de la aplicación.

## Uso

```typescript
import { HeaderComponent } from '@shared/components/header/header';

// En el componente
@Component({
  imports: [HeaderComponent],
  // ...
})
```

```html
<app-header
  [user]="currentUser()"
  [title]="'Mi Aplicación'"
  [subtitle]="'Dashboard'"
  (logout)="handleLogout()"
/>
```

## Propiedades

### Inputs
- `user` (requerido): Usuario actual de tipo `User | null`
- `title` (opcional): Título principal, por defecto "ExamScan"
- `subtitle` (opcional): Subtítulo, por defecto "Dashboard"

### Outputs
- `logout`: Evento emitido cuando el usuario hace clic en cerrar sesión

## Características

- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Accesible**: Implementa ARIA labels y soporte para lectores de pantalla
- **Reutilizable**: Puede ser usado en cualquier página que necesite un encabezado
- **Personalizable**: Permite cambiar título y subtítulo según la página

## Estructura Visual

- Logo y nombre de la aplicación
- Información del usuario (nombre y rol)
- Botón de cerrar sesión
- Responsive design para móviles

## Roles Soportados

- **admin**: Administrador
- **teacher**: Profesor  
- **student**: Estudiante

## Storybook

El componente incluye stories completos en Storybook para:

- Diferentes roles de usuario
- Estados responsive (móvil, tablet, desktop)
- Personalización de títulos
- Casos edge (nombres largos, sin usuario)
- Demos interactivos

Para ver los stories:

```bash
npm run storybook
```

Navega a `Components/Layout/Header` en Storybook para ver todas las variaciones.
