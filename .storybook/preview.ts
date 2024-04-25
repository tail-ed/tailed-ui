import type { Preview } from "@storybook/react";
import '../src/styles/globals.css'
import {withThemeByClassName} from '@storybook/addon-themes'


const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes:{
        light:'',
        dark:'dark',
      },
      defaultTheme:'light'
    })

  ],
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

export default preview;
