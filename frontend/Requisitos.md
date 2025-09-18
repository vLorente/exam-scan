# Documento de Requisitos para la Aplicación de Procesamiento de Exámenes Tipo Test

---

## 1. Introducción

Este documento detalla los requisitos para el desarrollo de una aplicación que:

- Subir archivos PDF de exámenes tipo test.  
- Extraer y estructurar preguntas mediante IA.  
- Crear y editar exámenes y preguntas de forma manual.  
- Colaborar en revisión, comentarios y versiones.  
- Realizar exámenes interactivos y consultar resultados.  
- Almacenar y gestionar todo en una base de datos centralizada.

---

## 2. Objetivos

- Automatizar la extracción de preguntas y respuestas desde PDFs.  
- Facilitar la creación manual y colaborativa de contenido.  
- Implementar control de versiones y flujos de revisión.  
- Ofrecer interfaz intuitiva para realizar y calificar exámenes.  
- Organizar un repositorio de exámenes y preguntas con etiquetas y permisos

---

## 3. Alcance

La aplicación cubrirá:

- Procesamiento de PDFs y extracción con IA.
- Edición y creación manual de preguntas y exámenes.
- Gestión colaborativa: comentarios, versiones y valoraciones.
- Publicación y compartición de exámenes (públicos o privados).
- Realización de exámenes con navegación y temporizador.
- Búsqueda, filtrado y exportación de datos (CSV/JSON).

---

## 4. Roles y Permisos

- **Administrador**  
  - Gestionar usuarios y roles.
  - Configurar parámetros IA y políticas de seguridad.
  - Acceder a métricas, logs y auditorías.

- **Usuario**  
  - Subir y procesar PDFs.
  - Crear, editar, comentar y puntuar exámenes y preguntas.
  - Publicar, despublicar y compartir contenido.
  - Realizar exámenes y recibir feedback. 

---

## 5. Requisitos Funcionales

1. **Carga y procesamiento de PDF**  
   - Aceptar archivos de hasta 20 MB y 200 páginas.
   - Validar legibilidad, extraer texto con OCR/parseo.

2. **Extracción con IA**  
   - Modelo de lenguaje identifica enunciados y opciones.
   - Devuelve JSON tipado con estructura de preguntas.

3. **Creación y edición colaborativa**  
   - Formulario WYSIWYG para añadir o editar preguntas/opciones.
   - Control de versiones: historial, comparación y reversión.
   - Comentarios en línea y valoraciones (estrellas o votos).

4. **Gestión de exámenes**  
   - Definir metadatos: título, descripción, etiquetas, visibilidad.
   - Configurar temporizador global o por pregunta.
   - Publicar o despublicar exámenes.

5. **Realización de exámenes**  
   - Navegación entre preguntas (anterior/siguiente).
   - Marcado provisional y edición antes de envío.
   - Almacenamiento de respuestas en tiempo real.
   - Cálculo automático de puntuación y feedback inmediato.

6. **Búsqueda y filtrado**
   - Filtrar exámenes/preguntas por etiquetas, autor, fecha o valoraciones.
   - Buscador de texto completo.

7. **Exportación e informes**
   - Generar CSV/JSON de preguntas o sesiones de examen.
   - Estadísticas de uso: intentos, tasas de acierto y valoraciones.

---

## 6. Requisitos No Funcionales

- **Rendimiento**
  - Procesar un PDF de 50 preguntas en menos de 30 segundos.

- **Escalabilidad**
  - Soportar concurrencia de hasta 10 editores y 100 alumnos simultáneos.

- **Disponibilidad**
  - 99,5 % uptime en horario laboral.

- **Seguridad**
  - Autenticación y autorización JWT con roles.
  - Comunicaciones cifradas con TLS 1.2 o superior.
  - Almacenamiento cifrado de datos sensibles.

- **Usabilidad**
  - Interfaz intuitiva con curva de aprendizaje menor a 15 minutos.
  - Diseño responsive para escritorio y tablet.

---

## 7. Modelo de Datos

| Entidad           | Atributos                                                          | Descripción                                            |
|-------------------|--------------------------------------------------------------------|--------------------------------------------------------|
| Usuario           | id, nombre, email, rol, fecha_registro                             | Perfil y permisos                                      |
| Examen            | id, título, descripción, autor_id, estado, visibilidad, temporizado| Metadatos del examen                                   |
| Pregunta          | id, examen_id, enunciado, orden, tipo (simple/múltiple)            | Texto y posición de la pregunta                        |
| Opción            | id, pregunta_id, texto, es_correcta (bool)                         | Texto de la opción y su corrección                     |
| SesiónExamen      | id, examen_id, usuario_id, fecha_inicio, fecha_fin, puntuación     | Registro de cada intento                               |
| RespuestaAlumno   | id, sesión_id, pregunta_id, opción_id, timestamp                   | Selecciones del usuario en la sesión                   |
| Comentario        | id, entidad (pregunta/examen), entidad_id, autor_id, texto, fecha  | Comentarios colaborativos                              |
| Versión           | id, entidad, entidad_id, autor_id, cambios (JSON), fecha           | Historial de modificaciones                            |
| Etiqueta          | id, nombre                                                          | Categorías para exámenes y preguntas                   |

---

## 8. Diagrama de Flujo Simplificado

```text
[Inicio]
   ↓
[Usuario sube PDF] ──> [Extracción IA] ──> [Revisión/Edición]
                                           ↓
                                [Control de versiones]
                                           ↓
                              [Usuario publica examen]
                                           ↓
                   ┌───────────────┴───────────────┐
                   ↓                               ↓
            [Usuario realiza examen]    [Exportar CSV/JSON]
                   ↓
           [Guardar respuestas & calcular]
                   ↓
            [Mostrar resultados y feedback]
                   ↓
                 [Fin]
```

---

## 9. Casos de Uso Clave

- UC1: Gestión de usuarios y parámetros (Administrador)
- UC2: Subir y procesar PDF (Usuario)
- UC3: Crear/editar preguntas y exámenes (Usuario)
- UC4: Comentar y puntuar contenido (Usuario)
- UC5: Publicar o despublicar examen (Usuario)
- UC6: Realizar examen y guardar sesión (Usuario)
- UC7: Exportar preguntas y reportes (Usuario/Administrador)

---

## 10. Criterios de Aceptación

- Un usuario puede subir y revisar preguntas extraídas.
- Cualquier usuario crea, edita, comenta y valora exámenes/preguntas.
- Solo el administrador gestiona roles, logs y métricas.
- Los exámenes ofrecen navegación, temporizador y feedback de puntuación.
- El sistema mantiene historial de versiones y registros de auditoría.

---

## 11. Tecnologías
- Backend: Python (FastAPI)
- IA/Text Parsing: OpenAI GPT, Hugging Face, PDFMiner/Tesseract (Por decidir)
- Frontend: Angular
- Base de Datos: PostgreSQL + Redis (cache)
- Infraestructura: Docker, Kubernetes
- Monitorización: Prometheus, Grafana