# Guía de Estilos Centralizados - Botones de Submit

## Componente Reutilizable SubmitButtonComponent (Recomendado)

Se ha creado un componente `SubmitButtonComponent` que encapsula toda la lógica y estilos de los botones de submit. Los estilos están **encapsulados dentro del componente**, no en el CSS global.

### Beneficios
1. **Encapsulación**: Los estilos están aislados dentro del componente
2. **Reutilización**: Se puede usar en cualquier formulario
3. **Mantenimiento**: Un solo lugar para modificar estilos de botones submit
4. **Consistencia**: Todos los botones submit lucen y se comportan igual
5. **Accesibilidad**: Incluye todas las mejores prácticas de WCAG 2.1 AA

### Ubicación de archivos
- **Componente**: `/src/app/shared/components/submit-button/submit-button.ts`
- **Estilos**: `/src/app/shared/components/submit-button/submit-button.css`
- **Tests**: `/src/app/shared/components/submit-button/submit-button.spec.ts`
- **Índice**: `/src/app/shared/components/submit-button/index.ts`

### Importación
```typescript
import { SubmitButtonComponent } from '@shared/components/submit-button';
// También debes agregarlo al array de imports del componente
imports: [
  // ... otros imports
  SubmitButtonComponent
]
```

### Uso básico
```html
<app-submit-button
  text="Iniciar Sesión"
  icon="login"
  [disabled]="loginForm.invalid"
  [loading]="isLoading"
  loadingText="Iniciando sesión..."
  description="Acceder a tu cuenta de ExamScan"
  descriptionId="submit-desc"
  loadingDescription="Procesando inicio de sesión, por favor espera"
  loadingDescriptionId="loading-desc"
  (onClick)="onSubmit()">
</app-submit-button>
```

### Propiedades del componente
- `text` (requerido): Texto del botón
- `disabled`: Si el botón está deshabilitado (default: false)
- `loading`: Si muestra estado de carga (default: false)
- `icon`: Icono de Material Icons (opcional)
- `loadingText`: Texto durante la carga (default: "Procesando...")
- `description`: Descripción para accesibilidad (opcional)
- `descriptionId`: ID del elemento de descripción (opcional)
- `loadingDescription`: Descripción durante la carga (opcional)
- `loadingDescriptionId`: ID del elemento de descripción durante carga (opcional)
- `(onClick)`: Evento emitido al hacer clic

### Características incluidas
- **Responsivo**: Se adapta automáticamente a mobile (altura 48px) y desktop (altura 56px)
- **Estados interactivos**: hover, focus, disabled con animaciones suaves
- **Accesibilidad**: outline y box-shadow en focus, soporte para alto contraste, screen reader support
- **Loading state**: Spinner integrado con transiciones
- **Iconos**: Alineación automática de mat-icon
- **Variables CSS**: Usa todas las variables del design system definidas en `styles.css`

### Migración desde botones manuales
Para migrar botones existentes que usan la clase `.submit-button`:

1. **Importar el componente**:
   ```typescript
   import { SubmitButtonComponent } from '@shared/components/submit-button';
   ```

2. **Agregarlo a imports**:
   ```typescript
   imports: [
     // ... otros imports
     SubmitButtonComponent
   ]
   ```

3. **Reemplazar el HTML**:
   ```html
   <!-- Antes -->
   <button type="submit" class="submit-button" [disabled]="form.invalid">
     <mat-icon>save</mat-icon>
     Guardar
   </button>

   <!-- Después -->
   <app-submit-button
     text="Guardar"
     icon="save"
     [disabled]="form.invalid"
     (onClick)="onSubmit()">
   </app-submit-button>
   ```

4. **Remover estilos locales**: Ya no necesitas la clase `.submit-button` ni estilos relacionados en los CSS de componentes individuales.

### Ejemplos de uso
```html
<!-- Botón básico -->
<app-submit-button text="Enviar" (onClick)="submit()"></app-submit-button>

<!-- Con icono -->
<app-submit-button 
  text="Guardar" 
  icon="save" 
  (onClick)="save()">
</app-submit-button>

<!-- Con estado de carga -->
<app-submit-button
  text="Procesar"
  icon="send"
  [loading]="isProcessing"
  loadingText="Procesando..."
  (onClick)="process()">
</app-submit-button>

<!-- Con accesibilidad completa -->
<app-submit-button
  text="Iniciar Sesión"
  icon="login"
  [disabled]="loginForm.invalid"
  [loading]="isLoading"
  loadingText="Iniciando sesión..."
  description="Acceder a tu cuenta"
  descriptionId="login-desc"
  loadingDescription="Validando credenciales"
  loadingDescriptionId="login-loading-desc"
  (onClick)="login()">
</app-submit-button>
```

### Variables CSS utilizadas
El componente utiliza las siguientes variables definidas en `styles.css`:
```css
--button-submit-bg: Color de fondo
--button-submit-text: Color del texto  
--button-submit-hover: Color de fondo en hover
--button-submit-focus: Color de fondo en focus
--button-submit-focus-text: Color del texto en focus
--button-submit-disabled: Color de fondo cuando está deshabilitado
--button-submit-disabled-text: Color del texto cuando está deshabilitado
--spacing-sm: Espaciado entre elementos
--font-size-lg, --font-size-base: Tamaños de fuente
--radius-lg: Border radius
--shadow-sm, --shadow-md: Sombras
--accent-gold: Color de focus outline
--transition-normal: Duración de transiciones
```

### Notas importantes
- El componente emite el evento `onClick` en lugar de manejar el submit directamente
- Los estilos están completamente encapsulados dentro del componente
- Se mantiene la accesibilidad completa con ARIA attributes
- Respeta las preferencias del usuario (motion reducido, alto contraste)
- Es completamente responsivo sin configuración adicional

Los estilos para botones de submit han sido centralizados en `/src/styles.css` para mantener consistencia en toda la aplicación.

#### Uso
```html
<button 
  type="submit" 
  class="submit-button"
  [disabled]="isLoading"
  aria-describedby="submit-desc">
  
  @if (isLoading) {
    <mat-progress-spinner 
      class="inline-spinner" 
      diameter="20" 
      mode="indeterminate">
    </mat-progress-spinner>
    Procesando...
  } @else {
    <mat-icon>send</mat-icon>
    Enviar
  }
</button>
```

#### Características incluidas
- **Responsivo**: Se adapta automáticamente a mobile (altura 48px) y desktop (altura 56px)
- **Estados interactivos**: hover, focus, disabled
- **Accesibilidad**: outline y box-shadow en focus, soporte para alto contraste
- **Animaciones**: translateY en hover, respeta `prefers-reduced-motion`
- **Loading state**: Soporte para spinner integrado
- **Iconos**: Alineación automática de mat-icon

#### Variables CSS utilizadas
```css
--button-submit-bg: Color de fondo
--button-submit-text: Color del texto
--button-submit-hover: Color de fondo en hover
--button-submit-focus: Color de fondo en focus
--button-submit-focus-text: Color del texto en focus
--button-submit-disabled: Color de fondo cuando está deshabilitado
--button-submit-disabled-text: Color del texto cuando está deshabilitado
```

#### Beneficios
1. **Mantenimiento**: Un solo lugar para modificar estilos de botones submit
2. **Consistencia**: Todos los botones submit lucen y se comportan igual
3. **Accesibilidad**: Incluye todas las mejores prácticas de WCAG 2.1 AA
4. **Performance**: No duplicación de CSS, menor tamaño del bundle

#### Migración
Para migrar botones existentes:
1. Remover estilos locales del botón submit
2. Agregar clase `submit-button` al elemento button
3. Verificar que el HTML tenga la estructura correcta para iconos y spinner

#### Ejemplo completo
```html
<!-- En el template -->
<div class="form-actions">
  <button 
    type="submit" 
    class="submit-button"
    [disabled]="loginForm.invalid || isLoading"
    aria-describedby="login-submit-desc">
    
    @if (isLoading) {
      <mat-progress-spinner 
        class="inline-spinner" 
        diameter="20" 
        mode="indeterminate"
        aria-hidden="true">
      </mat-progress-spinner>
      <span>Iniciando sesión...</span>
    } @else {
      <mat-icon aria-hidden="true">login</mat-icon>
      <span>Iniciar Sesión</span>
    }
  </button>
  
  <span id="login-submit-desc" class="sr-only">
    Envía el formulario para iniciar sesión en tu cuenta
  </span>
</div>
```

#### Notas importantes
- La clase debe aplicarse directamente al elemento `<button>`
- Siempre incluir `type="submit"` para formularios
- Usar `aria-describedby` para mejor accesibilidad
- Los iconos deben tener `aria-hidden="true"`
- El spinner debe tener `aria-hidden="true"`
