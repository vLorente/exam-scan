# ExamCardComponent

Componente reutilizable para mostrar tarjetas de examen con un diseño inspirado en la landing page.

## Características

- ✅ Diseño consistente con la tarjeta de examen de la landing page
- ✅ Accesibilidad completa (ARIA, navegación por teclado)
- ✅ Estados visuales (activo/inactivo)
- ✅ Responsivo y adaptativo
- ✅ Animaciones de entrada suaves
- ✅ Efectos hover interactivos

## Uso

```typescript
import { ExamCardComponent } from '@features/exams/components';

// En el template
<app-exam-card
  [exam]="examData"
  [showActions]="true"
  (examClick)="handleExamClick($event)">
</app-exam-card>
```

## Propiedades

### Inputs
- `exam` (required): Objeto de tipo `Exam` con la información del examen
- `showActions` (optional): Booleano para mostrar/ocultar botones de acción (default: true)

### Outputs
- `examClick`: Evento emitido cuando se hace click en una tarjeta de examen activo

## Diseño

El componente sigue el diseño de la tarjeta mostrada en el paso 4 de la demo de la landing page:

1. **Header con gradiente**: Título del examen y estado (Disponible/No disponible)
2. **Cuerpo opcional**: Descripción del examen si está disponible
3. **Estadísticas**: Número de preguntas, duración y porcentaje para aprobar
4. **Footer con acción**: Botón para comenzar el examen (solo si está activo)

## Accesibilidad

- Soporte completo para lectores de pantalla
- Navegación por teclado (Enter/Space)
- Etiquetas ARIA apropiadas
- Contraste alto disponible
- Modo reducido de movimiento

## Estados

- **Activo**: Tarjeta interactiva con efectos hover y botón funcional
- **Inactivo**: Tarjeta con opacidad reducida y botón deshabilitado

## Responsive

- Desktop: Tarjeta de ancho fijo (320px máximo)
- Tablet/Mobile: Se adapta al ancho del contenedor
- Ajustes de padding y tipografía para pantallas pequeñas
