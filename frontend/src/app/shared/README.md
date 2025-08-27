# Shared Components

Directorio que contiene componentes reutilizables utilizados en toda la aplicación.

## Estructura

```
shared/
├── components/           # Componentes reutilizables
│   ├── submit-button/   # Botón de submit estandarizado
│   │   ├── submit-button.ts
│   │   ├── submit-button.css
│   │   ├── submit-button.spec.ts
│   │   ├── README.md    # Documentación específica
│   │   └── index.ts
│   └── index.ts         # Barrel exports
├── directives/          # Directivas reutilizables
├── pipes/              # Pipes reutilizables
├── services/           # Servicios compartidos
├── models/             # Interfaces y tipos compartidos
├── utils/              # Utilidades y helpers
└── README.md           # Este archivo
```

## Componentes disponibles

### [SubmitButtonComponent](./components/submit-button/README.md)
Botón estandarizado para formularios con estados de carga, validación y accesibilidad completa.

```html
<app-submit-button text="Guardar" icon="save" (onClick)="save()"></app-submit-button>
```

## Estándares de desarrollo

### Documentación
- Cada componente debe tener su propio `README.md`
- Incluir ejemplos de uso, API y guías de migración
- Mantener changelog de versiones importantes

### Testing
- Cobertura mínima del 80%
- Tests unitarios obligatorios
- Tests de accesibilidad recomendados

### Naming conventions
- Componentes: `PascalCase` terminados en `Component`
- Archivos: `kebab-case`
- Selectores: `app-` prefix en kebab-case

### Estructura de archivos
```
component-name/
├── component-name.ts       # Lógica del componente
├── component-name.css      # Estilos encapsulados
├── component-name.html     # Template (si es externo)
├── component-name.spec.ts  # Tests unitarios
├── README.md              # Documentación
└── index.ts               # Exportaciones
```

## Contribución

1. Crear componente en el directorio apropiado
2. Agregar documentación completa
3. Escribir tests con buena cobertura
4. Actualizar exports en `index.ts`
5. Crear PR con revisión del equipo

## Guidelines

- **Reutilización**: Solo crear componentes que se usen en 2+ lugares
- **Encapsulación**: Estilos siempre encapsulados, no globales
- **Accesibilidad**: WCAG 2.1 AA compliance obligatorio
- **Performance**: Lazy loading cuando sea posible
- **Dependencies**: Minimizar dependencias externas
