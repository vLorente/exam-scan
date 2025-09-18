# ExamScan Frontend

Aplicación frontend desarrollada en Angular 20.1 para la gestión de exámenes tipo test con procesamiento automático mediante IA.

## � Documentación

### Estructura de Documentación
- [**Shared Components**](./docs/SHARED_COMPONENTS.md) - Sistema de componentes reutilizables
- [**Shared Directory**](./src/app/shared/README.md) - Guía del directorio shared
- [**Submit Button Component**](./src/app/shared/components/submit-button/README.md) - Documentación específica del componente

### Estándares
- Cada componente compartido incluye su propia documentación
- READMEs co-ubicados con el código
- Ejemplos de uso y guías de migración
- Documentación de accesibilidad y testing

## �🚀 Desarrollo Completado

### Funcionalidades Implementadas

#### ✅ Sistema de Componentes Compartidos
- **SubmitButtonComponent** reutilizable con estilos encapsulados
- **Documentación completa** por componente con APIs y ejemplos
- **Testing integrado** con cobertura de accesibilidad
- **Design system** con variables CSS centralizadas
- **Arquitectura escalable** para nuevos componentes

#### ✅ Sistema de Autenticación
- **Páginas de Login y Registro** con formularios reactivos
- **AuthService** integrado con backend real en puerto 8000
- **Guards de autenticación** para proteger rutas
- **Gestión de sesión** con localStorage
- **Dashboard básico** con navegación por roles
- **Interceptor HTTP** para tokens de autenticación
- **Manejo de errores** del backend con mensajes específicos

#### ✅ Estructura del Proyecto
```
src/app/
├── core/
│   ├── models/user.model.ts         # Interfaces User, LoginRequest, etc.
│   ├── services/auth.service.ts     # Servicio de autenticación
│   └── guards/auth.guard.ts         # Guards para rutas protegidas
├── features/
│   ├── auth/
│   │   ├── login/login.component.ts     # Página de login
│   │   └── register/register.component.ts # Página de registro
│   └── dashboard/dashboard.component.ts  # Dashboard principal
├── app.routes.ts                    # Configuración de rutas
└── app.config.ts                    # Configuración de la app
```

## 🔧 Instalación y Uso

### Prerrequisitos
- Node.js 18+
- Angular CLI 20.1+

### Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
# La aplicación estará disponible en http://localhost:4200

# Ejecutar tests
npm test

# Build para producción
npm run build
```

## 👤 Credenciales de Prueba

La aplicación ahora se conecta al backend real en `http://localhost:8000/api`.
Puedes registrar nuevos usuarios o usar las credenciales que tengas configuradas en el backend.

Para crear un usuario administrador, utiliza el endpoint de registro con `role: "admin"`.

## 🛣️ Navegación

### Rutas Públicas
- `/login` - Página de inicio de sesión
- `/register` - Página de registro de usuario

### Rutas Protegidas (requieren autenticación)
- `/dashboard` - Panel principal del usuario
- `/` - Redirige al dashboard si está autenticado

### Guards Implementados
- **authGuard**: Protege rutas que requieren autenticación
- **guestGuard**: Redirige usuarios autenticados fuera de login/register

## 🔐 Sistema de Autenticación

### Funcionalidades
- **Login**: Validación de credenciales contra backend real
- **Registro**: Creación de nuevos usuarios en el backend
- **Logout**: Limpieza de sesión y redirección
- **Persistencia**: Mantiene sesión en localStorage
- **Roles**: Diferenciación entre admin, teacher, student
- **Interceptor**: Envío automático de tokens de autenticación
- **Error Handling**: Manejo específico de errores del backend

### Integración Backend
- **API Base URL**: `http://localhost:8000/api`
- **Endpoints utilizados**:
  - `POST /auth/login` - Autenticación de usuarios
  - `POST /auth/register` - Registro de nuevos usuarios
- **Headers**: Authorization Bearer token automático
- **Error Mapping**: Códigos HTTP 400, 401, 409, 422, 500

### Validaciones del Formulario
- **Email**: Formato válido requerido
- **Contraseña**: Mínimo 6 caracteres en registro
- **Confirmación**: Las contraseñas deben coincidir
- **Rol**: Selección obligatoria en registro

## 🧪 Testing

### Tests Implementados
- `AuthService.spec.ts`: Tests unitarios completos del servicio
  - Inicialización del servicio
  - Login con credenciales válidas/inválidas
  - Registro de usuarios nuevos/existentes
  - Gestión de sesión (set/logout)
  - Restauración desde localStorage

### Ejecutar Tests
```bash
# Tests con watch mode
npm test

# Tests headless (CI)
npm test -- --browsers=ChromeHeadless --watch=false
```

## 🎨 UI/UX

### Características de Diseño
- **Responsive**: Adaptado para escritorio y tablet
- **Formularios Reactivos**: Validación en tiempo real
- **Feedback Visual**: Estados loading, errores y éxito
- **Accesibilidad**: Labels, ARIA attributes, navegación por teclado
- **Consistencia**: Paleta de colores y tipografía uniforme

### Componentes Estilizados
- Formularios con validación visual
- Botones con estados hover/disabled
- Cards con sombras y bordes redondeados
- Alertas de error y éxito
- Credenciales de demo visibles en login

## 📋 Próximos Pasos

### Funcionalidades Pendientes
1. **Módulo de Exámenes**: CRUD de exámenes y preguntas
2. **Procesamiento IA**: Subida y análisis de PDFs
3. **Gestión de Usuarios**: Panel admin para usuarios
4. **Módulo de Estadísticas**: Reportes y análisis
5. **Tests E2E**: Cypress para flujos completos

### Mejoras Técnicas
- Implementación de interceptors HTTP
- Estado global con señales
- Optimización de bundle size
- PWA capabilities
- Internacionalización (i18n)

## 🏗️ Arquitectura

### Patrones Implementados
- **Standalone Components**: Sin NgModules, carga lazy
- **Reactive Forms**: Validación robusta y tipada
- **Signals**: Estado reactivo moderno
- **Services con providedIn**: Inyección de dependencias optimizada
- **Guard Functions**: Protección de rutas funcional

### Mejores Prácticas Seguidas
- TypeScript strict mode
- Componentes pequeños y enfocados
- Separación de responsabilidades
- Código reutilizable y mantenible
- Tests unitarios comprehensivos

---

## 📝 Notas de Desarrollo

Este proyecto sigue las mejores prácticas de Angular 20.1:
- Componentes standalone por defecto
- Control flow nativo (`@if`, `@for`)
- Signals para estado reactivo
- Formularios tipados y reactivos
- Guards funcionales
- Lazy loading de rutas

La aplicación está lista para integrar con un backend real reemplazando los mocks del `AuthService`.
