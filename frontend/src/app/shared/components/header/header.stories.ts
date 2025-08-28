import { Meta, StoryObj } from '@storybook/angular';
import { HeaderComponent } from './header';
import { User } from '@core/models/user.model';

// Mock users para los stories
const mockStudentUser: User = {
  id: 1,
  email: 'estudiante@example.com',
  username: 'estudiante123',
  fullName: 'María González',
  role: 'student',
  isActive: true,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20')
};

const mockTeacherUser: User = {
  id: 2,
  email: 'profesor@example.com',
  username: 'profesor123',
  fullName: 'Dr. Carlos Martínez',
  role: 'teacher',
  isActive: true,
  createdAt: new Date('2023-09-01'),
  updatedAt: new Date('2024-01-20')
};

const mockAdminUser: User = {
  id: 3,
  email: 'admin@example.com',
  username: 'admin123',
  fullName: 'Ana Rodríguez',
  role: 'admin',
  isActive: true,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2024-01-20')
};

const meta: Meta<HeaderComponent> = {
  title: 'Components/Layout/Header',
  component: HeaderComponent,
  parameters: {
    docs: {
      description: {
        component: `
# Header Component

Componente de encabezado compartido que muestra información del usuario, navegación y funciones de autenticación.

## Características

- **Responsive**: Se adapta automáticamente a diferentes tamaños de pantalla
- **Accesible**: Implementa estándares WCAG 2.1 AA con ARIA labels
- **Reutilizable**: Puede usarse en cualquier página de la aplicación
- **Personalizable**: Permite cambiar título y subtítulo según la página
- **Roles**: Soporte visual para diferentes tipos de usuario (admin, teacher, student)

## Uso en el Código

\`\`\`typescript
import { HeaderComponent } from '@shared/components';

@Component({
  imports: [HeaderComponent],
  template: \`
    <app-header
      [user]="currentUser()"
      [title]="'Mi App'"
      [subtitle]="'Mi Sección'"
      (logout)="handleLogout()"
    />
  \`
})
\`\`\`
        `
      }
    },
    layout: 'fullscreen'
  },
  argTypes: {
    user: {
      description: 'Usuario actual de la sesión (null si no está autenticado)',
      control: false
    },
    title: {
      control: 'text',
      description: 'Título principal de la aplicación'
    },
    subtitle: {
      control: 'text',
      description: 'Subtítulo que indica la sección actual'
    },
    logout: {
      action: 'logout-clicked',
      description: 'Evento emitido cuando el usuario hace clic en cerrar sesión'
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<HeaderComponent>;

export const Dashboard: Story = {
  args: {
    user: mockStudentUser,
    title: 'ExamScan',
    subtitle: 'Dashboard'
  }
};

export const StudentView: Story = {
  args: {
    user: mockStudentUser,
    title: 'ExamScan',
    subtitle: 'Mis Exámenes'
  }
};

export const TeacherView: Story = {
  args: {
    user: mockTeacherUser,
    title: 'ExamScan',
    subtitle: 'Gestión de Exámenes'
  }
};

export const AdminView: Story = {
  args: {
    user: mockAdminUser,
    title: 'ExamScan',
    subtitle: 'Administración del Sistema'
  }
};

export const CustomBranding: Story = {
  args: {
    user: mockTeacherUser,
    title: 'Universidad ABC',
    subtitle: 'Portal Académico'
  }
};

export const Statistics: Story = {
  args: {
    user: mockAdminUser,
    title: 'ExamScan',
    subtitle: 'Estadísticas y Reportes'
  }
};

export const UserManagement: Story = {
  args: {
    user: mockAdminUser,
    title: 'ExamScan',
    subtitle: 'Gestión de Usuarios'
  }
};

export const NoUser: Story = {
  args: {
    user: null,
    title: 'ExamScan',
    subtitle: 'Sistema de Exámenes'
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado cuando no hay usuario autenticado (no debería ocurrir en uso normal, pero útil para testing).'
      }
    }
  }
};

export const LongUserName: Story = {
  args: {
    user: {
      ...mockStudentUser,
      fullName: 'María Fernanda González de la Torre y Martínez'
    },
    title: 'ExamScan',
    subtitle: 'Dashboard'
  },
  parameters: {
    docs: {
      description: {
        story: 'Prueba con nombres de usuario muy largos para verificar el comportamiento responsive.'
      }
    }
  }
};

export const MobileView: Story = {
  args: {
    user: mockStudentUser,
    title: 'ExamScan',
    subtitle: 'Dashboard'
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Vista optimizada para dispositivos móviles. El componente oculta elementos automáticamente para ahorrar espacio.'
      }
    }
  }
};

export const TabletView: Story = {
  args: {
    user: mockTeacherUser,
    title: 'ExamScan',
    subtitle: 'Gestión de Exámenes'
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Vista optimizada para tablets. Muestra una versión intermedia del diseño.'
      }
    }
  }
};

export const AllRoles: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <h3>Estudiante</h3>
        <app-header [user]="studentUser" title="ExamScan" subtitle="Área de Estudiantes" />

        <h3>Profesor</h3>
        <app-header [user]="teacherUser" title="ExamScan" subtitle="Portal de Profesores" />

        <h3>Administrador</h3>
        <app-header [user]="adminUser" title="ExamScan" subtitle="Panel de Administración" />
      </div>
    `,
    props: {
      studentUser: mockStudentUser,
      teacherUser: mockTeacherUser,
      adminUser: mockAdminUser
    }
  }),
  parameters: {
    docs: {
      description: {
        story: 'Comparación de cómo se ve el header con diferentes roles de usuario. Cada rol tiene un badge de color diferente.'
      }
    }
  }
};

export const InteractiveDemo: Story = {
  args: {
    user: mockAdminUser,
    title: 'ExamScan',
    subtitle: 'Demo Interactivo'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demo completamente interactivo. Haz clic en el botón de cerrar sesión para ver el evento en la pestaña "Actions".'
      }
    }
  }
};
