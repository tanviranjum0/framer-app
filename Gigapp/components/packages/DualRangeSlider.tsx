"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";

interface DualRangeSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  labelPosition?: "top" | "bottom" | "static";
  lableContenPos?: "left" | "right";
  label?: React.ReactNode | ((value: number | undefined) => React.ReactNode);
}

const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualRangeSliderProps
>(
  (
    {
      className,
      label,
      labelPosition = "top",
      lableContenPos = "right",
      ...props
    },
    ref
  ) => {
    const initialValue = Array.isArray(props.value)
      ? props.value
      : [props.min, props.max];

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full dark:bg-gray-800 bg-gray-300">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <>
          {initialValue.map((value, index) => (
            <React.Fragment key={index}>
              <SliderPrimitive.Thumb className="relative block h-4 w-4 rounded-full border-2 border-primary dark:bg-neutral-800 bg-neutral-50 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                {label && labelPosition !== "static" && (
                  <div
                    className={cn(
                      "absolute flex w-full justify-center items-start gap-0.5",
                      labelPosition === "top" && "-top-7",
                      labelPosition === "bottom" && "top-4"
                    )}
                  >
                    {lableContenPos === "left" && (
                      <>
                        {typeof label === "function" ? (
                          <span className="inline-block  -translate-y-0.5">
                            {label(value)}
                          </span>
                        ) : (
                          label && (
                            <span className="inline-block ">{label}</span>
                          )
                        )}
                      </>
                    )}
                    <NumberFlow
                      willChange
                      // @ts-ignore
                      value={value}
                      isolate
                      opacityTiming={{
                        duration: 250,
                        easing: "ease-out",
                      }}
                      transformTiming={{
                        easing: `linear(0, 0.0033 0.8%, 0.0263 2.39%, 0.0896 4.77%, 0.4676 15.12%, 0.5688, 0.6553, 0.7274, 0.7862, 0.8336 31.04%, 0.8793, 0.9132 38.99%, 0.9421 43.77%, 0.9642 49.34%, 0.9796 55.71%, 0.9893 62.87%, 0.9952 71.62%, 0.9983 82.76%, 0.9996 99.47%)`,
                        duration: 500,
                      }}
                    />
                    {lableContenPos === "right" && (
                      <>
                        {typeof label === "function" ? (
                          <span className="inline-block  -translate-y-1">
                            {label(value)}
                          </span>
                        ) : (
                          label && (
                            <span className="inline-block ">{label}</span>
                          )
                        )}
                      </>
                    )}
                  </div>
                )}
              </SliderPrimitive.Thumb>
            </React.Fragment>
          ))}
        </>

        {label && labelPosition === "static" && (
          <>
            {initialValue.map((value, index) => (
              <div
                key={index}
                className={cn(
                  "absolute -top-7 w-fit right-0 flex  justify-center items-start gap-0.5"
                )}
              >
                {lableContenPos === "left" && (
                  <>
                    {typeof label === "function" ? (
                      <span className="inline-block  -translate-y-0.5">
                        {label(value)}
                      </span>
                    ) : (
                      label && <span className="inline-block ">{label}</span>
                    )}
                  </>
                )}
                <NumberFlow
                  willChange
                  // @ts-ignore
                  value={value}
                  isolate
                  opacityTiming={{
                    duration: 250,
                    easing: "ease-out",
                  }}
                  transformTiming={{
                    easing: `linear(0, 0.0033 0.8%, 0.0263 2.39%, 0.0896 4.77%, 0.4676 15.12%, 0.5688, 0.6553, 0.7274, 0.7862, 0.8336 31.04%, 0.8793, 0.9132 38.99%, 0.9421 43.77%, 0.9642 49.34%, 0.9796 55.71%, 0.9893 62.87%, 0.9952 71.62%, 0.9983 82.76%, 0.9996 99.47%)`,
                    duration: 500,
                  }}
                />
                {lableContenPos === "right" && (
                  <>
                    {typeof label === "function" ? (
                      <span className="inline-block  -translate-y-1">
                        {label(value)}
                      </span>
                    ) : (
                      label && <span className="inline-block ">{label}</span>
                    )}
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </SliderPrimitive.Root>
    );
  }
);
DualRangeSlider.displayName = "DualRangeSlider";

export { DualRangeSlider };
