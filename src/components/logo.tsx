import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <h1 className="text-xl font-black tracking-tighter text-foreground">
        ALBATROS
      </h1>
    </div>
  )
}
