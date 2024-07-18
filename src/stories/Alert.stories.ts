import type { Meta, StoryObj } from "@storybook/react";
import { AlertDialog } from "../components/ui/alert-dialog";

const meta: Meta<typeof AlertDialog> = {
  title: "Example/AlertDialog",
  component: AlertDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
