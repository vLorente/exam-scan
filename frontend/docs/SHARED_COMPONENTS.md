# Frontend Architecture Documentation

## Shared Components System

### Overview
Este proyecto utiliza un sistema de componentes compartidos para mantener consistencia, reutilización y facilidad de mantenimiento.

### Estructura de documentación

```
src/app/shared/
├── README.md                           # Índice general de shared
├── components/
│   ├── README.md                       # Guía de componentes
│   ├── submit-button/
│   │   ├── README.md                   # Documentación específica
│   │   ├── submit-button.stories.ts    # Storybook stories
│   │   └── ...
│   └── ...
├── services/
│   ├── README.md
│   └── ...
└── ...
```

### Estándares de documentación

#### 1. **README por componente**
Cada componente debe incluir:
- **API completa** (inputs, outputs, métodos)
- **Ejemplos de uso** básicos y avanzados
- **Guías de migración** desde versiones anteriores
- **Información de accesibilidad**
- **Variables CSS utilizadas**
- **Testing guidelines**

#### 2. **README por directorio**
Cada directorio shared debe incluir:
- **Índice de contenidos**
- **Estándares de desarrollo**
- **Guidelines de contribución**
- **Estructura de archivos**

#### 3. **Storybook (recomendado)**
Para design systems robustos:
- **Visual documentation** de componentes
- **Interactive playground** para props
- **Accessibility testing** integrado
- **Design tokens** visualization

### Beneficios del sistema actual

✅ **Co-ubicación**: Documentación junto al código
✅ **Descubribilidad**: README en cada nivel
✅ **Mantenibilidad**: Actualizaciones localizadas
✅ **Onboarding**: Fácil para nuevos desarrolladores
✅ **Estándares**: Estructura consistente

### Herramientas recomendadas para empresas

1. **Storybook**: Para design system visual
2. **Compodoc**: Para documentación automática de Angular
3. **Chromatic**: Para visual regression testing
4. **ADRs** (Architecture Decision Records): Para decisiones importantes

### Próximos pasos

1. [ ] Instalar Storybook para documentación visual
2. [ ] Configurar Compodoc para documentación automática
3. [ ] Crear más componentes compartidos siguiendo este patrón
4. [ ] Establecer proceso de review para nuevos componentes
