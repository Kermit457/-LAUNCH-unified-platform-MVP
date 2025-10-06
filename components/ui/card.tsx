import * as React from "react"
import { cn } from "@/lib/cn"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'gradient' | 'glass'
    glow?: boolean
    hover?: boolean
  }
>(({ className, variant = 'default', glow = false, hover = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Base styles - Design System v2.0
      "rounded-2xl border transition-all duration-150",

      // Variants
      variant === 'default' && "bg-white/5 border-zinc-800",
      variant === 'gradient' && "bg-gradient-to-br from-white/[0.07] to-white/[0.02] border-white/10",
      variant === 'glass' && "bg-white/5 backdrop-blur-xl border-white/10",

      // Glow effect
      glow && "shadow-[0_0_20px_rgba(168,85,247,0.1)]",

      // Hover state
      hover && "hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:border-white/20",

      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-white/60", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
