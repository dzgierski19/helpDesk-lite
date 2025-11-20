import type { Preview } from '@storybook/angular';
import './storybook-theme.styles';

const customViewports = {
  mobile: {
    name: 'Mobile (375×812)',
    styles: {
      width: '375px',
      height: '812px',
    },
    type: 'mobile',
  },
  tablet: {
    name: 'Tablet (768×1024)',
    styles: {
      width: '768px',
      height: '1024px',
    },
    type: 'tablet',
  },
  desktop: {
    name: 'Desktop (1280×800)',
    styles: {
      width: '1280px',
      height: '800px',
    },
    type: 'desktop',
  },
} as const;

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Design System', 'Components', 'Containers'],
      },
    },
    backgrounds: {
      default: 'Aurora Canvas',
      values: [
        { name: 'Aurora Canvas', value: '#050b16' },
        { name: 'Glass Surface', value: 'rgba(15, 23, 42, 0.85)' },
        { name: 'Pure White', value: '#ffffff' },
      ],
    },
    docs: {
      toc: true,
    },
    viewport: {
      viewports: customViewports,
      defaultViewport: 'desktop',
    },
  },
};

export default preview;
