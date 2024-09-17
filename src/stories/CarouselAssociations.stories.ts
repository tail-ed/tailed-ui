import type { Meta, StoryObj } from "@storybook/react";
import { CarouselAssociations } from "./CarouselAssociations";

const meta: Meta<typeof CarouselAssociations> = {
  title: "components/ui/carousel",
  component: CarouselAssociations,
  parameters: {
    layout: "centered",
  },
  // Defining argTypes to use custom args, such as argsClassName
  argTypes: {
    argsClassName: { control: "text" },
    carouselStyle: { control: "text" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CarouselAssociations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Associations: Story = {
  args: {
    argsClassName: "",
    carouselStyle: "Primary",
  },
};

export const AssociationsSmooth: Story = {
  args: {
    argsClassName: "",
    carouselStyle: "Smooth",
  },
};
