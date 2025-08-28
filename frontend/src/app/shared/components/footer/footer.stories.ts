import { Meta, StoryObj } from '@storybook/angular';
import { FooterComponent } from './footer';

const meta: Meta<FooterComponent> = {
  title: 'Components/Layout/Footer',
  component: FooterComponent,
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    appName: {
      control: 'text',
      description: 'Nombre de la aplicación'
    },
    version: {
      control: 'text',
      description: 'Versión de la aplicación'
    },
    companyName: {
      control: 'text',
      description: 'Nombre de la compañía o institución'
    },
    showLinks: {
      control: 'boolean',
      description: 'Mostrar enlaces de navegación'
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<FooterComponent>;

export const Default: Story = {
  args: {
    appName: 'ExamScan',
    version: 'v1.0.0',
    companyName: 'Tu Institución',
    showLinks: true
  }
};

export const WithoutLinks: Story = {
  args: {
    appName: 'ExamScan',
    version: 'v1.0.0',
    companyName: 'Tu Institución',
    showLinks: false
  }
};

export const CustomBranding: Story = {
  args: {
    appName: 'Universidad ABC',
    version: 'v2.1.0',
    companyName: 'Universidad ABC',
    showLinks: true
  }
};

export const MinimalFooter: Story = {
  args: {
    appName: 'MyApp',
    version: 'v1.0.0',
    companyName: 'Mi Empresa',
    showLinks: false
  }
};
