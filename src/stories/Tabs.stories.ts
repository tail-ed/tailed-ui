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

export const Primary: Story = {
  args: {},
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Vertical: Story = {
  args: {
    tabs: {
      orientation: "vertical",
    },
    tabslist: {
      orientation: "horizontal",
    },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Horizontal: Story = {
  args: {
    tabs: {
      orientation: "horizontal",
    },
    tabslist: {
      orientation: "vertical",
    },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const BadgeList: Story = {
  args: {
    tabstrigger: {
      variant: "badge",
    },
  },
};
