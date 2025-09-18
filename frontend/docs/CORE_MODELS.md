# Estructura de Modelos Centralizados

## Ubicación

Todos los modelos de datos están centralizados en `/src/app/core/models/` para facilitar su reutilización entre features.

## Modelos Disponibles

### 1. User Models (`user.model.ts`)
- `User`: Interfaz del usuario en el dominio
- `UserApiResponse`: Interfaz de respuesta de la API
- `UserMapper`: Mappers para conversión entre API y dominio

### 2. Auth Models (`auth.model.ts`)
- `LoginRequest/LoginResponse`: Para autenticación
- `RegisterRequest`: Para registro de usuarios
- `AuthMapper`: Mappers para autenticación

### 3. Exam Models (`exam.model.ts`)
- `Exam`: Interfaz del examen en el dominio
- `ExamApiResponse`: Interfaz de respuesta de la API
- `CreateExamRequest`: Para crear nuevos exámenes
- `ExamAttempt`: Para intentos de examen de estudiantes
- `ExamMapper`: Mappers para conversión entre API y dominio

### 4. Question Models (`question.model.ts`)
- `Question`: Interfaz de pregunta en el dominio
- `QuestionApiResponse`: Interfaz de respuesta de la API
- `CreateQuestionRequest`: Para crear nuevas preguntas
- `QuestionType`: Tipos de preguntas disponibles
- `StudentAnswer`: Para respuestas de estudiantes
- `QuestionMapper`: Mappers para conversión entre API y dominio

## Uso en Features

### Importación
```typescript
import { Exam, Question, User } from '@core/models';
```

### En Servicios
```typescript
import { ExamMapper, QuestionMapper } from '@core/models';
```

## Beneficios de la Centralización

1. **Reutilización**: Los modelos pueden ser usados por múltiples features
2. **Consistencia**: Un solo lugar para definir las estructuras de datos
3. **Mantenimiento**: Fácil actualización de modelos desde un solo lugar
4. **Tipado Fuerte**: TypeScript puede validar tipos entre features
5. **Separación de Responsabilidades**: Core contiene la lógica de negocio base

## Convenciones

- **API Interfaces**: Usan `snake_case` (como viene del backend)
- **Domain Interfaces**: Usan `camelCase` (estándar TypeScript)
- **Mappers**: Clases estáticas para conversión entre formatos
- **Export**: Todos los modelos se exportan desde `@core/models`

## Estructura de Archivos

```
src/app/core/models/
├── index.ts           # Export barrel
├── user.model.ts      # Modelos de usuario
├── auth.model.ts      # Modelos de autenticación
├── exam.model.ts      # Modelos de exámenes
└── question.model.ts  # Modelos de preguntas
```
