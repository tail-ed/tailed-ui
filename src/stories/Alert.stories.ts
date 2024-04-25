import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AlertDialogDemo } from './Alertdialog';




const meta : Meta<typeof AlertDialogDemo> = {
    title: 'Example/AlertDialog',
    component: AlertDialogDemo,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],

} satisfies Meta<typeof AlertDialogDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {

}



