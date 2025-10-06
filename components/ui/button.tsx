import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white hover:from-fuchsia-600 hover:via-purple-600 hover:to-cyan-600",
        boost:
          "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white hover:from-fuchsia-600 hover:via-purple-600 hover:to-cyan-600 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]",
        destructive:
          "bg-red-500 text-white hover:bg-red-600",
        outline:
          "border border-white/10 bg-transparent text-white hover:bg-white/5 hover:border-white/20",
        secondary:
          "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
        ghost: "text-white/70 hover:text-white hover:bg-white/5",
        link: "text-purple-500 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        default: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
