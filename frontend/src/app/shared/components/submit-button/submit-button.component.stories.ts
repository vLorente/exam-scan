import { Meta, StoryObj } from '@storybook/angular';
import { SubmitButtonComponent } from './submit-button.component';

const meta: Meta<SubmitButtonComponent> = {
  title: 'Components/Forms/SubmitButton',
  component: SubmitButtonComponent,
  parameters: {
    docs: {
      description: {
        component: 'Botón estandarizado para formularios con estados de carga y accesibilidad completa.'
      }
    }
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'Texto mostrado en el botón'
    },
    disabled: {
      control: 'boolean',
      description: 'Si el botón está deshabilitado'
    },
    loading: {
      control: 'boolean',
      description: 'Si muestra estado de carga'
    },
    icon: {
      control: 'text',
      description: 'Icono de Material Icons'
    },
    loadingText: {
      control: 'text',
      description: 'Texto durante la carga'
    },
    onClick: {
      action: 'clicked',
      description: 'Evento emitido al hacer clic'
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<SubmitButtonComponent>;

export const Default: Story = {
  args: {
    text: 'Submit'
  }
};

export const WithIcon: Story = {
  args: {
    text: 'Save',
    icon: 'save'
  }
};

export const Loading: Story = {
  args: {
    text: 'Process',
    icon: 'send',
    loading: true,
    loadingText: 'Processing...'
  }
};

export const Disabled: Story = {
  args: {
    text: 'Submit',
    disabled: true
  }
};

export const LoginExample: Story = {
  args: {
    text: 'Sign In',
    icon: 'login',
    description: 'Access your account',
    descriptionId: 'login-desc'
  }
};

export const RegisterExample: Story = {
  args: {
    text: 'Create Account',
    icon: 'person_add',
    description: 'Register for ExamScan',
    descriptionId: 'register-desc'
  }
};
