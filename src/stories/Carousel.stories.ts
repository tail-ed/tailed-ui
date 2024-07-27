import type { Meta, StoryObj } from "@storybook/react";
import { CarouselComponent } from "./CarouselTest";

const meta: Meta<typeof CarouselComponent> = {
  title: "components/ui/carousel",
  component: CarouselComponent,
  parameters: {
    layout: "centered",
  },
  // Defining argTypes to use custom args, such as argsClassName
  argTypes: {
    argsClassName: { control: "text" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CarouselComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    argsClassName: "",
  },
};
export const ThreeItems: Story = {
  args: {
    // Defining a value to apply it in the react component
    argsClassName: "basis-1/3",
  },
};
