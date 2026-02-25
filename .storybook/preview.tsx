import type { Preview } from '@storybook/nextjs';

import '../src/app/globals.css';
import './storybook.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        // { name: 'dark', value: '#000000' },
        light: { name: 'light', value: 'ffffff' },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [(Story) => <Story />],

  initialGlobals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export default preview;
