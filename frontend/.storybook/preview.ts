import type { Preview } from '@storybook/angular';

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
      default: 'Surface',
      values: [
        { name: 'Surface', value: '#f5f5f5' },
        { name: 'Pure White', value: '#ffffff' },
        { name: 'Dark Overlay', value: '#1f1f1f' },
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
