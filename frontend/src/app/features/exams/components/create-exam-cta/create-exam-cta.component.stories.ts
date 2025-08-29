import type { Meta, StoryObj } from '@storybook/angular';
import { CreateExamCtaComponent } from './create-exam-cta.component';

const meta: Meta<CreateExamCtaComponent> = {
  title: 'Features/Exams/CreateExamCta',
  component: CreateExamCtaComponent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Call-to-action component that encourages users to create new exams. Features an attractive gradient design with animations and proper accessibility.',
      },
    },
  },
  argTypes: {},
  decorators: [
    (story) => ({
      template: `<div style="max-width: 800px; margin: 0 auto;"><app-create-exam-cta></app-create-exam-cta></div>`,
    }),
  ],
};

export default meta;
type Story = StoryObj<CreateExamCtaComponent>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default appearance of the create exam CTA component with gradient background and floating animations.',
      },
    },
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive version showing hover and focus states. Click the button to see the navigation action.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement as HTMLElement;
    const button = canvas.querySelector('button');

    if (button) {
      // Simulate hover
      button.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      // Focus the button
      setTimeout(() => {
        button.focus();
      }, 500);
    }
  },
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile responsive view with stacked layout and full-width button.',
      },
    },
  },
};

export const HighContrast: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'High contrast mode version with enhanced visibility for accessibility.',
      },
    },
  },
  decorators: [
    (story) => ({
      template: `
        <div style="max-width: 800px; margin: 0 auto; filter: contrast(150%);">
          <app-create-exam-cta></app-create-exam-cta>
        </div>
      `,
    }),
  ],
};

export const ReducedMotion: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Version with reduced motion for users who prefer minimal animations.',
      },
    },
  },
  decorators: [
    (story) => ({
      template: `
        <div style="max-width: 800px; margin: 0 auto;" class="reduced-motion">
          <style>
            .reduced-motion * {
              animation: none !important;
              transition: none !important;
            }
          </style>
          <app-create-exam-cta></app-create-exam-cta>
        </div>
      `,
    }),
  ],
};
