import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { signal, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutComponent } from './layout';
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

// Mock AuthService para Storybook
@Injectable()
class MockAuthService {
  user = signal<User | null>(mockStudentUser);

  logout(): void {
    this.user.set(null);
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

const meta: Meta<LayoutComponent> = {
  title: 'Components/Layout/Layout',
  component: LayoutComponent,
  decorators: [
    moduleMetadata({
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    })
  ],
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Título principal de la aplicación que aparece en el header'
    },
    subtitle: {
      control: 'text',
      description: 'Subtítulo que indica la sección actual'
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<LayoutComponent>;

export const Dashboard: Story = {
  args: {
    title: 'ExamScan',
    subtitle: 'Dashboard'
  },
  render: (args) => ({
    props: args,
    template: `
      <app-layout [title]="title" [subtitle]="subtitle">
        <div style="padding: var(--spacing-lg);">
          <h1>Panel de Control</h1>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-lg); margin: var(--spacing-lg) 0;">
            <div style="background: var(--glass-bg); border: var(--glass-border); border-radius: var(--radius-lg); padding: var(--spacing-lg);">
              <h3>Exámenes Recientes</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div style="background: var(--glass-bg); border: var(--glass-border); border-radius: var(--radius-lg); padding: var(--spacing-lg);">
              <h3>Estadísticas</h3>
              <p>Ut enim ad minim veniam, quis nostrud exercitation.</p>
            </div>
          </div>
        </div>
      </app-layout>
    `
  })
};

export const MobileView: Story = {
  args: {
    title: 'ExamScan',
    subtitle: 'Vista Móvil'
  },
  render: (args) => ({
    props: args,
    template: `
      <app-layout [title]="title" [subtitle]="subtitle">
        <div style="padding: var(--spacing-lg);">
          <h1>Diseño Móvil</h1>
          <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
            <div style="background: var(--glass-bg); border: var(--glass-border); border-radius: var(--radius-lg); padding: var(--spacing-lg);">
              <h3>Contenido Responsivo</h3>
              <p>El layout se adapta automáticamente a dispositivos móviles.</p>
            </div>
          </div>
        </div>
      </app-layout>
    `
  }),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
};
