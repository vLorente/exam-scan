// Ejemplo de uso del componente PageTitleComponent

// En cualquier página donde necesites un header con título y botón de volver:

// 1. Importar el componente
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';

// 2. Agregarlo a los imports del componente
@Component({
  // ...
  imports: [
    // ... otros imports
    PageTitleComponent
  ]
})

// 3. Usarlo en el template
<app-page-title
  title="Mi Página"
  description="Esta es una descripción opcional de la página"
  backButtonText="Regresar"
  backButtonAriaLabel="Regresar a la página anterior"
  (backClick)="goBack()">
</app-page-title>

// 4. Manejar el evento en el componente TypeScript
goBack() {
  // Lógica para navegar hacia atrás
  this.router.navigate(['/previous-page']);
}

// Propiedades disponibles:
// - title: string (requerido) - El título principal
// - description: string (opcional) - Descripción debajo del título
// - showBackButton: boolean (opcional, default: true) - Mostrar/ocultar botón de volver
// - backButtonText: string (opcional, default: 'Volver') - Texto del botón
// - backButtonAriaLabel: string (opcional, default: 'Volver') - Etiqueta de accesibilidad
// - backClick: EventEmitter<void> - Evento emitido al hacer clic en volver
