import type { Preview } from "@storybook/react";
import '../src/styles/globals.css'
import { useEffect } from 'react';
import { StoryFn } from '@storybook/react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};
export const parameters = {
  // ...
  backgrounds: {
    default: 'light',
    values: [
      { 
        name: 'light', 
        value: '#ffffff' 
      },
      { 
        name: 'dark', 
        value: '#000000' 
      },
    ],
  },
  // ...
};
export const decorators = [
  (Story: StoryFn, context) => {
    useEffect(() => {
      document.documentElement.classList.toggle('dark', context.globals.backgrounds.value === '#000000');
    }, [context.globals.backgrounds.value]);

    return <Story />;
  },
];
export default preview;
