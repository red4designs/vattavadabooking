import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../../lib/utils"

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center cursor-pointer", className)}
    {...props}>
    <SliderPrimitive.Track
      className="relative h-3 w-full grow overflow-hidden rounded-full bg-primary/20 transition-all duration-200 cursor-pointer">
      <SliderPrimitive.Range className="absolute h-full bg-primary transition-all duration-200" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block h-6 w-6 rounded-full border-2 border-primary bg-background shadow-lg transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing active:scale-105" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
