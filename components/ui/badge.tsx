import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:scale-[1.05]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/20 text-primary hover:bg-primary/30",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/40",
        destructive:
          "border-transparent bg-destructive/15 text-destructive hover:bg-destructive/20",
        outline: "text-foreground border-border/50 bg-background/50 backdrop-blur-sm",
        success: "border-transparent bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/20 shadow-sm shadow-emerald-500/10",
        warning: "border-transparent bg-amber-500/15 text-amber-500 hover:bg-amber-500/20 shadow-sm shadow-amber-500/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
