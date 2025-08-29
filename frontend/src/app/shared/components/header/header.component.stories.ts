import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { signal, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { User } from '@core/models/user.model';
import { AuthService } from '@core/services/auth';

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

// Mock AuthService para Storybook
@Injectable()
class MockAuthService {
  user = signal<User | null>(mockStudentUser);

  logout(): void {
    this.user.set(null);
  }

  setMockUser(user: User | null): void {
    this.user.set(user);
  }
}

// Mock Router para Storybook
@Injectable()
class MockRouter {
  navigate(commands: any[]): Promise<boolean> {
    console.log('Navigate to:', commands);
    return Promise.resolve(true);
  }
}

const meta: Meta<HeaderComponent> = {
  title: 'Components/Layout/Header',
  component: HeaderComponent,
  decorators: [
    moduleMetadata({
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    })
  ],
  parameters: {
    docs: {
      description: {
        component: `
# Header Component

Componente de encabezado autónomo que maneja internamente la información del usuario y funciones de autenticación.

## Características

- **Autónomo**: Obtiene automáticamente los datos del usuario del AuthService
- **Responsive**: Se adapta automáticamente a diferentes tamaños de pantalla
- **Accesible**: Implementa estándares WCAG 2.1 AA con ARIA labels
- **Scroll Transparency**: Se vuelve semitransparente al hacer scroll
- **Roles Visuales**: Muestra badges para diferentes tipos de usuario (A/P/E)

## Uso en el Código

\`\`\`typescript
import { HeaderComponent } from '@shared/components';

@Component({
  imports: [HeaderComponent],
  template: \`
    <app-header
      [title]="'Mi App'"
      [subtitle]="'Mi Sección'"
      (logout)="onLogoutComplete()"
    />
  \`
})
\`\`\`

## Manejo de Usuario

El componente obtiene automáticamente la información del usuario del AuthService.
No es necesario pasarle datos de usuario manualmente.
        `
      }
    },
    layout: 'fullscreen'
  },
  argTypes: {
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
    title: 'ExamScan',
    subtitle: 'Dashboard'
  }
};

export const StudentView: Story = {
  args: {
    title: 'ExamScan',
    subtitle: 'Mis Exámenes'
  }
};

export const TeacherView: Story = {
  args: {
    title: 'ExamScan',
    subtitle: 'Gestión de Exámenes'
  }
};

export const AdminView: Story = {
  args: {
    title: 'ExamScan',
    subtitle: 'Administración del Sistema'
  }
};

export const CustomBranding: Story = {
  args: {
    title: 'Universidad ABC',
    subtitle: 'Portal Académico'
  }
};

export const Statistics: Story = {
  args: {
    title: 'ExamScan',
    subtitle: 'Estadísticas y Reportes'
  }
};

export const UserManagement: Story = {
  args: {
    title: 'ExamScan',
    subtitle: 'Gestión de Usuarios'
  }
};

export const MobileView: Story = {
  args: {
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

export const InteractiveDemo: Story = {
  args: {
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
