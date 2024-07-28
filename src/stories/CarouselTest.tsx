import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../components/ui/carousel";

//Used to pass in a class name relative to the story arguments.
//Ex: the 'Primary' style has nothing in argsClassName, but the 'ThreeItems' style has 'basis-1/3' to fit 3 carousel items.
interface CarouselComponentProps {
  argsClassName: string;
}

export function CarouselComponent({ argsClassName }: CarouselComponentProps) {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        <CarouselItem className={argsClassName}>
          <img src="https://placehold.co/400" alt="placeholder" />
        </CarouselItem>
        <CarouselItem className={argsClassName}>
          <img src="https://placehold.co/400" alt="placeholder" />
        </CarouselItem>
        <CarouselItem className={argsClassName}>
          <img src="https://placehold.co/400" alt="placeholder" />
        </CarouselItem>
        <CarouselItem className={argsClassName}>
          <img src="https://placehold.co/400" alt="placeholder" />
        </CarouselItem>
        <CarouselItem className={argsClassName}>
          <img src="https://placehold.co/400" alt="placeholder" />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
