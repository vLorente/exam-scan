# Icons Components

Componentes de iconos SVG reutilizables para la aplicación.

## Componentes Disponibles

### DocumentIconComponent
Icono de documento para representar exámenes, archivos, etc.

```html
<app-document-icon [size]="'24'" [ariaHidden]="false" />
```

### UsersIconComponent
Icono de usuarios para gestión de usuarios.

```html
<app-users-icon [size]="'24'" [ariaHidden]="false" />
```

### BarChartIconComponent
Icono de gráfico de barras para estadísticas.

```html
<app-bar-chart-icon [size]="'24'" [ariaHidden]="false" />
```

## Propiedades

Todos los componentes de iconos comparten las mismas propiedades:

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `size` | `string` | `'18'` | Tamaño del icono en píxeles |
| `ariaHidden` | `boolean` | `true` | Si el icono debe estar oculto para lectores de pantalla |

## Uso

### Importación

```typescript
import { DocumentIconComponent, UsersIconComponent, BarChartIconComponent } from '@shared/components/icons';

@Component({
  imports: [DocumentIconComponent, UsersIconComponent, BarChartIconComponent],
  // ...
})
```

### En Templates

```html
<!-- Icono decorativo (aria-hidden=true por defecto) -->
<app-document-icon [size]="'20'" />

<!-- Icono con significado semántico -->
<app-users-icon [size]="'24'" [ariaHidden]="false" />

<!-- En botones -->
<button>
  <app-bar-chart-icon [size]="'18'" />
  <span>Ver Estadísticas</span>
</button>
```

## Características

- **SVG Optimizados**: Iconos vectoriales escalables
- **Consistent Style**: Todos usan el mismo stroke-width y estilo
- **Accesibilidad**: Soporte para `aria-hidden`
- **Customizable**: Tamaño configurable
- **Color Inheritance**: Heredan el color del elemento padre via `currentColor`

## Añadir Nuevos Iconos

Para añadir un nuevo icono:

1. Crear el archivo del componente en `/shared/components/icons/`
2. Seguir la misma estructura que los existentes
3. Añadir la exportación en `index.ts`
4. Documentar en este README

### Template Base

```typescript
import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-[icon-name]-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <svg 
      [attr.width]="size()" 
      [attr.height]="size()" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      [attr.aria-hidden]="ariaHidden()">
      <!-- SVG paths aquí -->
    </svg>
  \`,
  styles: [\`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    svg {
      transition: all var(--transition-normal, 0.2s ease);
    }
  \`]
})
export class [IconName]IconComponent {
  size = input<string>('18');
  ariaHidden = input<boolean>(true);
}
```

## Fuentes de Iconos

Los iconos están basados en [Lucide Icons](https://lucide.dev/) para mantener consistencia visual.
