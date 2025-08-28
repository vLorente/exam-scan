# Layout Component

El componente `LayoutComponent` proporciona una estructura base consistente para todas las páginas que requieren header y footer. Es completamente autónomo y no requiere pasar información del usuario.

## Características

- ✅ **Header fijo autónomo**: Obtiene automáticamente la información del usuario
- ✅ **Efecto scroll**: Header semitransparente al hacer scroll
- ✅ **Footer consistente**: Pie de página uniforme
- ✅ **Espaciado automático**: Gestión automática del contenido principal
- ✅ **Responsive design**: Adaptación automática a dispositivos móviles
- ✅ **Logout integrado**: Manejo automático del cierre de sesión
- ✅ **Badges de rol**: Visualización automática del rol del usuario (P/E/A)

## Uso Simplificado

### Importación
```typescript
import { LayoutComponent } from '@shared/components';

@Component({
  imports: [LayoutComponent, /* otros imports */]
})
```

### Template (Nueva API Simplificada)
```html
<app-layout
  [title]="'ExamScan'"
  [subtitle]="'Dashboard'"
>
  <!-- Tu contenido de página aquí -->
  <h1>Contenido de la página</h1>
  <p>Este contenido se mostrará en el área principal.</p>
</app-layout>
```

## Inputs (Simplificados)

### Requeridos
- `title` (string): Título de la aplicación para la pestaña del navegador
- `subtitle` (string): Subtítulo/página actual para contexto

### ⚠️ Cambios de API

**REMOVIDO**: Ya no es necesario pasar `user` - el header obtiene automáticamente la información del usuario desde `AuthService`

## Funcionalidades Automáticas

### Header Autónomo
El header ahora es completamente autónomo:
- ✅ Obtiene automáticamente los datos del usuario desde `AuthService`
- ✅ Muestra el nombre del usuario y badge del rol
- ✅ Maneja el logout automáticamente con confirmación
- ✅ Aplica efectos de transparencia en scroll
- ✅ Responsive design para móviles

### Logout Automático
- Cuando el usuario hace click en "Cerrar Sesión", muestra confirmación
- Se ejecuta automáticamente `authService.logout()`
- Redirige automáticamente a `/login`
- No requiere manejo de eventos en las páginas padre

### Badges de Rol
- **P**: Profesor (círculo con P)
- **E**: Estudiante (círculo con E) 
- **A**: Administrador (círculo con A)

## Ejemplos de Uso

### Dashboard Page
```typescript
@Component({
  selector: 'app-dashboard-page',
  imports: [LayoutComponent, DashboardCardComponent],
  template: `
    <app-layout
      [title]="'ExamScan'"
      [subtitle]="'Dashboard'"
    >
      <div class="dashboard-welcome">
        <h1>Panel de Control</h1>
        <p>Gestiona tus exámenes y estadísticas</p>
      </div>
    </app-layout>
  `
})
export class DashboardPageComponent {
  // ✅ Ya no necesitas gestionar usuario o logout manualmente
  // ✅ El layout es completamente autónomo
}
```

### Login Page
```typescript
@Component({
  selector: 'app-login-page',
  imports: [LayoutComponent, LoginFormComponent],
  template: `
    <app-layout
      [title]="'ExamScan'"
      [subtitle]="'Iniciar Sesión'"
    >
      <app-login-form />
    </app-layout>
  `
})
export class LoginPageComponent {}
```

## Migración de API Anterior

### ❌ Antes (API Compleja)
```html
<app-layout
  [user]="currentUser()"
  [title]="'ExamScan'"
  [subtitle]="'Dashboard'"
  [appName]="'ExamScan'"
  [version]="'v1.0.0'"
  [companyName]="'Tu Institución'"
  [showFooterLinks]="true"
  (logout)="handleLogout()"
>
```

### ✅ Ahora (API Simplificada)
```html
<app-layout
  [title]="'ExamScan'"
  [subtitle]="'Dashboard'"
>
```

### Cambios en el Componente TypeScript

**❌ Antes:**
```typescript
export class DashboardPageComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.user;

  handleLogout(): void {
    // Lógica de logout manual
  }
}
```

**✅ Ahora:**
```typescript
export class DashboardPageComponent {
  // ✅ Nada más que hacer - el layout es autónomo
}
```

## Estructura del Layout

```
┌─────────────────────────────────┐
│     Header (Autónomo)           │  ← Fijo, obtiene usuario automáticamente
│  [Logo] [Usuario] [Role] [⚡]   │  ← Badge rol, logout automático
├─────────────────────────────────┤
│                                 │
│     Contenido Principal         │  ← Tu contenido proyectado
│     (ng-content)                │
│                                 │
├─────────────────────────────────┤
│        Footer                   │  ← Información de la empresa
└─────────────────────────────────┘
```

## Ventajas de la Nueva API

1. **🚀 Simplicidad**: Solo 2 props requeridas vs múltiples props anteriores
2. **🔒 Autonomía**: El header gestiona su propio estado y datos
3. **📱 Menos Código**: No necesitas gestionar usuario o logout en cada página
4. **🔄 Reutilizable**: API consistente entre todas las páginas
5. **🐛 Menos Errores**: Menor superficie de API reduce bugs
6. **⚡ Performance**: Menos prop drilling mejora el rendimiento

## Accesibilidad

- ✅ Estructura semántica HTML5 (`<header>`, `<main>`, `<footer>`)
- ✅ ARIA labels para lectores de pantalla
- ✅ Navegación por teclado
- ✅ Indicadores de foco visibles
- ✅ Soporte para modo alto contraste

## Troubleshooting

### Problemas Comunes

1. **Usuario no se muestra**: Verificar que `AuthService` esté configurado
2. **Logout no funciona**: Verificar rutas de autenticación
3. **Efectos scroll no aplican**: Verificar que el contenido sea scrolleable

### Debug
```typescript
// Verificar estado del usuario
console.log('Usuario actual:', inject(AuthService).user());
```
