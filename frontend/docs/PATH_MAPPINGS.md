# Path Mappings Configuration

Este documento explica la configuración de path mappings implementada en el proyecto para hacer los imports más limpios y legibles.

## Configuración

Los path mappings están configurados en `tsconfig.json` con las siguientes rutas:

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@core/*": ["app/core/*"],
      "@features/*": ["app/features/*"],
      "@shared/*": ["app/shared/*"],
      "@environments/*": ["environments/*"]
    }
  }
}
```

## Uso de los Path Mappings

### Antes (paths relativos largos)
```typescript
import { AuthService } from '../../../../core/services/auth';
import { LoginRequest } from '../../../../core/models/user.model';
import { SubmitButtonComponent } from '../../../../shared/components';
```

### Después (paths limpios)
```typescript
import { AuthService } from '@core/services/auth';
import { LoginRequest } from '@core/models/user.model';
import { SubmitButtonComponent } from '@shared/components';
```

## Rutas Disponibles

### @core/*
Para acceder a servicios, modelos, guards, interceptors y otros elementos del core:
- `@core/services/auth` → `src/app/core/services/auth`
- `@core/models/user.model` → `src/app/core/models/user.model`
- `@core/guards/auth.guard` → `src/app/core/guards/auth.guard`
- `@core/interceptors/auth.interceptor` → `src/app/core/interceptors/auth.interceptor`

### @shared/*
Para acceder a componentes, directivas, pipes y otros elementos compartidos:
- `@shared/components` → `src/app/shared/components`
- `@shared/components/submit-button/submit-button` → `src/app/shared/components/submit-button/submit-button`

### @features/*
Para acceder a funcionalidades específicas desde otras partes de la aplicación:
- `@features/auth/components/login-form/login-form` → `src/app/features/auth/components/login-form/login-form`
- `@features/dashboard/pages/dashboard-page/dashboard-page` → `src/app/features/dashboard/pages/dashboard-page/dashboard-page`

### @environments/*
Para acceder a las configuraciones de entorno:
- `@environments/environment` → `src/environments/environment`
- `@environments/environment.prod` → `src/environments/environment.prod`

## Ejemplos Prácticos

### En un componente de autenticación:
```typescript
import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth';
import { LoginRequest } from '@core/models/user.model';
import { SubmitButtonComponent } from '@shared/components';
```

### En un servicio:
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@core/models/user.model';
```

## Beneficios

1. **Legibilidad**: Los imports son más fáciles de leer y entender
2. **Mantenibilidad**: No hay que calcular rutas relativas largas
3. **Refactoring**: Mover archivos es más fácil ya que los imports no dependen de la ubicación relativa
4. **Consistencia**: Todos los desarrolladores usan la misma convención
5. **Autocompletado**: Los IDEs proporcionan mejor autocompletado con paths absolutos

## IDE Support

Los path mappings funcionan automáticamente en:
- Visual Studio Code
- WebStorm/IntelliJ IDEA
- Angular CLI
- TypeScript Compiler

## Notas Importantes

- Los path mappings solo funcionan para archivos TypeScript (.ts)
- El `baseUrl` está configurado como `./src` para que todos los paths sean relativos a la carpeta src
- Los barrel exports (index.ts) siguen funcionando con los path mappings
- Los tests también pueden usar estos path mappings automáticamente
