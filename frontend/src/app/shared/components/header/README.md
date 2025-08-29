# Header Component

Componente de encabezado compartido con navegación dinámica y gestión de usuarios.

## Características Principales

- **Navegación al Dashboard**: El brand del header es clickeable y navega al dashboard
- **Navegación Dinámica**: Los items de navegación se definen en un array y se renderizan dinámicamente
- **Control de Roles**: Los items de navegación pueden ser filtrados por roles de usuario
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Accesible**: Implementa ARIA labels y soporte para lectores de pantalla (WCAG 2.1 AA)
- **Reutilizable**: Puede ser usado en cualquier página que necesite un encabezado

## Uso Básico

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
  [title]="'Mi Aplicación'"
  [subtitle]="'Dashboard'"
  (logout)="handleLogout()"
/>
```

## Propiedades

### Inputs
- `title` (opcional): Título principal, por defecto "ExamScan"
- `subtitle` (opcional): Subtítulo, por defecto "Dashboard"

### Outputs
- `logout`: Evento emitido cuando el usuario hace clic en cerrar sesión

## Navegación Dinámica

### Configuración Actual

El header incluye navegación a "Exámenes" que se adapta automáticamente según el rol del usuario.

### Añadir Nuevos Items de Navegación

Para añadir nuevos items de navegación, edita el array `navigationItems` en `header.component.ts`:

```typescript
export interface NavigationItem {
  label: string;           // Texto visible
  route: string;          // Ruta de navegación
  iconComponent: Type<any>; // Componente de icono
  ariaLabel: string;      // Etiqueta de accesibilidad
  description: string;    // Descripción para lectores de pantalla
  roles?: string[];       // Roles que pueden ver este item (opcional)
}

// Ejemplo de configuración expandida:
private navigationItems: NavigationItem[] = [
  {
    label: 'Exámenes',
    route: '/exams',
    iconComponent: DocumentIconComponent,
    ariaLabel: 'Ir a la página de exámenes',
    description: 'Acceder a la gestión de exámenes'
  },
  {
    label: 'Usuarios',
    route: '/users',
    iconComponent: UsersIconComponent,
    ariaLabel: 'Ir a la gestión de usuarios',
    description: 'Acceder a la administración de usuarios',
    roles: ['admin'] // Solo visible para administradores
  }
];
```

### Control de Roles

- **Sin roles especificados**: Visible para todos los usuarios autenticados
- **Con roles específicos**: Solo visible para usuarios con esos roles

```typescript
// Ejemplos:
roles: ['admin']                    // Solo administradores
roles: ['admin', 'teacher']         // Administradores y profesores
roles: undefined                    // Todos los usuarios (por defecto)
```

## Estructura Visual

- **Brand Clickeable**: Logo y nombre de la aplicación (navega a dashboard)
- **Navegación Dinámica**: Items de navegación basados en roles
- **Información del Usuario**: Nombre y rol con badge visual
- **Botón de Cerrar Sesión**: Con icono y texto descriptivo

## Roles Soportados

- **admin**: Administrador (badge rojo)
- **teacher**: Profesor (badge azul)
- **student**: Estudiante (badge verde)

## Responsive Design

- **Desktop**: Logo + texto + navegación completa + info usuario
- **Tablet (≤768px)**: Logo + iconos de navegación + info usuario resumida
- **Mobile (≤480px)**: Logo compacto + iconos + badge de rol flotante

## Accesibilidad

- Navegación por teclado completa
- Etiquetas ARIA descriptivas
- Foco visible con indicadores claros
- Soporte para `prefers-reduced-motion`
- Descripciones para lectores de pantalla
- Contraste adecuado (WCAG 2.1 AA)

## Componentes de Iconos

La navegación utiliza componentes de iconos dedicados ubicados en `@shared/components/icons`. Esto proporciona:

- **Reutilización**: Los iconos se pueden usar en toda la aplicación
- **Consistencia**: Estilo y tamaño uniformes
- **Rendimiento**: Componentes optimizados y cacheable
- **Mantenibilidad**: Cambios centralizados

### Iconos Disponibles

- `DocumentIconComponent`: Para exámenes y documentos
- `UsersIconComponent`: Para gestión de usuarios  
- `BarChartIconComponent`: Para estadísticas

Ver documentación completa en `/shared/components/icons/README.md`

## Storybook

El componente incluye stories completos en Storybook para:

- Diferentes roles de usuario
- Estados responsive (móvil, tablet, desktop)
- Personalización de títulos
- Navegación dinámica
- Casos edge (nombres largos, sin usuario)

Para ver los stories:

```bash
npm run storybook
```

Navega a `Components/Layout/Header` en Storybook para ver todas las variaciones.
