# SubmitButtonComponent

Componente reutilizable para botones de submit que encapsula estilos, comportamiento y accesibilidad.

## Características

- ✅ **Encapsulación completa**: Estilos aislados dentro del componente
- ✅ **Accesibilidad**: WCAG 2.1 AA compliant con ARIA attributes
- ✅ **Responsive**: Adaptación automática a mobile y desktop
- ✅ **Estados interactivos**: hover, focus, disabled, loading
- ✅ **Design System**: Utiliza tokens CSS centralizados
- ✅ **Testing**: Cobertura completa de pruebas unitarias

## API

### Inputs (Propiedades)

| Propiedad | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `text` | `string` | ✅ | - | Texto mostrado en el botón |
| `disabled` | `boolean` | ❌ | `false` | Si el botón está deshabilitado |
| `loading` | `boolean` | ❌ | `false` | Si muestra estado de carga |
| `icon` | `string` | ❌ | `''` | Icono de Material Icons |
| `loadingText` | `string` | ❌ | `'Procesando...'` | Texto durante la carga |
| `description` | `string` | ❌ | `''` | Descripción para accesibilidad |
| `descriptionId` | `string` | ❌ | `''` | ID del elemento de descripción |
| `loadingDescription` | `string` | ❌ | `''` | Descripción durante la carga |
| `loadingDescriptionId` | `string` | ❌ | `''` | ID del elemento de descripción durante carga |

### Outputs (Eventos)

| Evento | Tipo | Descripción |
|--------|------|-------------|
| `onClick` | `void` | Emitido cuando se hace clic en el botón |

## Uso

### Importación

```typescript
import { SubmitButtonComponent } from '@shared/components/submit-button';

@Component({
  // ...
  imports: [
    // ... otros imports
    SubmitButtonComponent
  ]
})
```

### Ejemplos

#### Básico
```html
<app-submit-button 
  text="Guardar" 
  (onClick)="save()">
</app-submit-button>
```

#### Con icono y validación
```html
<app-submit-button
  text="Iniciar Sesión"
  icon="login"
  [disabled]="loginForm.invalid"
  (onClick)="login()">
</app-submit-button>
```

#### Con estado de carga
```html
<app-submit-button
  text="Procesar"
  icon="send"
  [loading]="isProcessing"
  loadingText="Procesando datos..."
  (onClick)="process()">
</app-submit-button>
```

#### Accesibilidad completa
```html
<app-submit-button
  text="Registrarse"
  icon="person_add"
  [disabled]="registerForm.invalid"
  [loading]="isRegistering"
  loadingText="Creando cuenta..."
  description="Crear nueva cuenta en ExamScan"
  descriptionId="register-desc"
  loadingDescription="Validando datos y creando cuenta"
  loadingDescriptionId="register-loading-desc"
  (onClick)="register()">
</app-submit-button>
```

## Styling

El componente utiliza las siguientes variables CSS del design system:

```css
--button-submit-bg
--button-submit-text
--button-submit-hover
--button-submit-focus
--button-submit-focus-text
--button-submit-disabled
--button-submit-disabled-text
--spacing-sm
--font-size-lg, --font-size-base
--radius-lg
--shadow-sm, --shadow-md
--accent-gold
--transition-normal
```

## Accesibilidad

- **Keyboard navigation**: Totalmente navegable con teclado
- **Screen readers**: Soporte completo con ARIA labels
- **Focus management**: Indicadores visuales claros
- **High contrast**: Soporte para modo de alto contraste
- **Reduced motion**: Respeta preferencias de movimiento reducido

## Testing

Para probar el componente en tus tests:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmitButtonComponent } from './submit-button';

describe('MyComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitButtonComponent]
    }).compileComponents();
  });

  it('should emit onClick when clicked', () => {
    // Test implementation
  });
});
```

## Migración

Para migrar desde botones manuales:

1. **Antes**:
```html
<button type="submit" class="submit-button" [disabled]="form.invalid">
  <mat-icon>save</mat-icon>
  Guardar
</button>
```

2. **Después**:
```html
<app-submit-button
  text="Guardar"
  icon="save"
  [disabled]="form.invalid"
  (onClick)="onSubmit()">
</app-submit-button>
```

## Mantenimiento

- **Ubicación**: `/src/app/shared/components/submit-button/`
- **Responsable**: Team Frontend
- **Última actualización**: Agosto 2025
- **Versión**: 1.0.0

## Notas de desarrollo

- El componente emite `onClick` en lugar de manejar el submit directamente para mayor flexibilidad
- Los estilos están completamente encapsulados usando View Encapsulation
- Se mantiene compatibilidad con todas las versiones de Angular 17+
