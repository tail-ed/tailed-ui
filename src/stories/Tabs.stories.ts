import type { Meta, StoryObj } from "@storybook/react";
import { TabsDemo } from "./Tabs";

const meta: Meta<typeof TabsDemo> = {
  title: "Example/TabsDemo",
  component: TabsDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TabsDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const BadgeList: Story = {};
