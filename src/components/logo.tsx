import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <h1 className="font-headline text-2xl uppercase tracking-wider text-primary">
        ALBATROS
      </h1>
    </div>
  )
}
