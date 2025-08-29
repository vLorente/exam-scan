# ExamListItemComponent

Componente reutilizable para mostrar exámenes en formato de lista horizontal.

## Características

- ✅ Diseño horizontal optimizado para listas
- ✅ Información condensada pero completa
- ✅ Accesibilidad completa (ARIA, navegación por teclado)
- ✅ Estados visuales (activo/inactivo)
- ✅ Responsivo con layout adaptativo
- ✅ Animaciones de entrada suaves
- ✅ Efectos hover interactivos

## Uso

```typescript
import { ExamListItemComponent } from '@features/exams/components';

// En el template
<app-exam-list-item
  [exam]="examData"
  [showActions]="true"
  (examClick)="handleExamClick($event)">
</app-exam-list-item>
```

## Propiedades

### Inputs
- `exam` (required): Objeto de tipo `Exam` con la información del examen
- `showActions` (optional): Booleano para mostrar/ocultar botones de acción (default: true)

### Outputs
- `examClick`: Evento emitido cuando se hace click en un item de examen activo

## Diseño

El componente utiliza un layout horizontal con las siguientes secciones:

1. **Información principal**: Título, estado y descripción (si está disponible)
2. **Metadatos**: Número de preguntas, duración y porcentaje para aprobar con iconos
3. **Acciones**: Botón para comenzar el examen (solo si está activo)

## Layout Responsivo

- **Desktop (>768px)**: Layout horizontal completo con toda la información visible
- **Tablet (768px)**: Apilado vertical manteniendo la información agrupada
- **Mobile (<480px)**: Layout completamente vertical con botón de ancho completo

## Diferencias con ExamCardComponent

| Aspecto | ExamCard | ExamListItem |
|---------|----------|--------------|
| Layout | Vertical/Tarjeta | Horizontal/Lista |
| Espacio | Más compacto por alto | Más amplio horizontalmente |
| Información | Header con gradiente | Header simple |
| Metadatos | Stats centradas | Metadatos en línea |
| Hover | Movimiento vertical | Movimiento horizontal |
| Uso ideal | Vista de cuadrícula | Vista de lista |

## Accesibilidad

- Soporte completo para lectores de pantalla
- Navegación por teclado (Enter/Space)
- Etiquetas ARIA descriptivas
- Contraste alto disponible
- Modo reducido de movimiento

## Estados

- **Activo**: Item interactivo con efectos hover y botón funcional
- **Inactivo**: Item con opacidad reducida y botón deshabilitado
