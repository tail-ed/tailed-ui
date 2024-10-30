import React, { useCallback, useState, useEffect } from "react";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import Autoplay from "embla-carousel-autoplay";
import { Clock10 } from "lucide-react";

type EmblaOptionsType = {
  loop?: boolean;
};

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    AutoScroll({ playOnInit: true, speed: 1 }),
  ]);
  useEffect(() => {
    const autoScroll = emblaApi?.plugins()?.autoScroll;
    if (!autoScroll) return;
  }, [emblaApi]);
  return (
    <div className="embla">
      <div className="embla__viewport rounded-lg" ref={emblaRef}>
        <div className="mx-4 embla__container">
          {slides.map((index) => (
            <div className="embla__slide flex flex-col justify-items-center gap-4">
              <img
                src="https://placehold.co/400"
                alt="Test Image"
                className="rounded-lg aspect-square max-w-md"
              />
              <span className="text-center font-semibold text-3xl mt-4">

                Tail'ed
              </span>
              <span className="text-center text-xl">
                Association Tail'ed : réseau de jeunes talents en tech

                Test
              </span>
              <span className="text-center text-xl">
                lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua

              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface CarouselAssociationsProps {
  argsClassName: string;
  carouselStyle: string;
}

export function CarouselAssociations({
  argsClassName,
  carouselStyle,
}: CarouselAssociationsProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <div>
      {carouselStyle === "Primary" ? (
        <Carousel
          className="w-full max-w-xs my-0 mx-auto mt-32"
          setApi={setApi}
          plugins={[plugin.current]}
        >
          <CarouselContent className="">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col justify-items-center gap-4">
                  <img
                    src="https://placehold.co/400"
                    alt="Test Image"
                    className="rounded-lg aspect-square max-w-md"
                  />
                  <span className="text-center font-semibold text-3xl mt-4">

                    Tail'ed
                  </span>
                  <span className="text-center text-xl">
                    Association Tail'ed : réseau de jeunes talents en tech
                    Test
                  </span>
                  <span className="text-center text-xl">
                    lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua

                  </span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        EmblaCarousel({
          slides: [1, 2, 3, 4, 5],
          options: { loop: true },
        })
      )}
    </div>
  );
}
