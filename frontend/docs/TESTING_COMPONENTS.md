# Best Practices y Troubleshooting en Testing de Componentes Angular

## 1. Problema con tests en LoginPageComponent y uso de MatSnackBar
### Descripción del problema
El problema era que el componente LoginPageComponent es un componente standalone que importa MatSnackBarModule directamente. Cuando TestBed creaba el componente, Angular usaba la instancia real de MatSnackBar del módulo importado en lugar del mock que proporcionábamos en los providers.

### Solución implementada
La solución fue usar overrideComponent para agregar los providers (los mocks) directamente al componente, asegurando que cuando el componente use inject(MatSnackBar), obtenga nuestro spy en lugar de la instancia real.

### Detalles técnicos
1. **Agregar ruta del dashboard en el router**: Esto es necesario para evitar errores de navegación en los tests.
2. **Uso de overrideComponent**: Esto permite inyectar los mocks directamente en el componente standalone.
3. **Resetear spies en beforeEach**: Esto asegura que cada test comience con un estado limpio.
4. **Eliminar tests innecesarios**: Algunos tests que verificaban comportamientos negativos no eran necesarios y fueron eliminados para simplificar el suite de tests.
