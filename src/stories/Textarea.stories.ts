import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import {Textarea} from '../components/ui/textarea'


const meta : Meta<typeof Textarea> = { 
    title: 'Example/Textarea',
    component: Textarea,
    parameters: {
      layout: 'centered',
    },
    tags: ['autodocs'],




} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        "variant": "default",
    }
}

export const Secondary: Story = {
    args: {
        "variant": "classic",
    }
}