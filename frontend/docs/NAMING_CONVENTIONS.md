# Convenciones de Naming en TypeScript

## Problema
Las APIs a menudo usan **snake_case** mientras que TypeScript/JavaScript usan **camelCase**. Esto puede causar inconsistencias en el código.

## Solución Implementada

### 1. Interfaces Separadas
- **Interfaces API**: Usan snake_case (`UserApiResponse`, `LoginApiResponse`)
- **Interfaces Dominio**: Usan camelCase (`User`, `LoginResponse`)

### 2. Mappers
Clases que convierten entre formatos:

```typescript
// De API a Dominio
const user = UserMapper.fromApi(apiUserResponse);

// De Dominio a API
const apiRequest = UserMapper.toApi(userDomainObject);
```

### 3. Uso en Servicios

```typescript
// En el servicio HTTP
login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginApiResponse>(`${this.API_URL}/login`, credentials)
    .pipe(
      map(apiResponse => AuthMapper.loginResponseFromApi(apiResponse)),
      catchError(this.handleError)
    );
}
```

## Beneficios

1. **Consistencia**: El código del frontend usa camelCase
2. **Compatibilidad**: Compatible con APIs que usan snake_case
3. **Separación**: Clara separación entre datos de API y dominio
4. **Type Safety**: TypeScript valida ambos formatos
5. **Mantenibilidad**: Cambios en la API solo afectan mappers

## Alternativas

### Opción 1: Interceptor HTTP Global
```typescript
@Injectable()
export class CaseConversionInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Convertir request body a snake_case
    const modifiedReq = req.clone({
      body: this.toSnakeCase(req.body)
    });

    return next.handle(modifiedReq).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          // Convertir response body a camelCase
          return event.clone({
            body: this.toCamelCase(event.body)
          });
        }
        return event;
      })
    );
  }
}
```

### Opción 2: Decoradores
```typescript
class User {
  @JsonProperty('full_name')
  fullName: string;

  @JsonProperty('is_active')
  isActive: boolean;
}
```

### Opción 3: Mantener snake_case
```typescript
// Usar snake_case en todo el frontend
interface User {
  full_name: string;
  is_active: boolean;
  created_at: string;
}
```

## Recomendación
La **solución implementada con mappers** es la más recomendada porque:
- Es explícita y fácil de entender
- Permite control granular sobre la transformación
- No afecta el rendimiento significativamente
- Es compatible con herramientas de desarrollo existentes
