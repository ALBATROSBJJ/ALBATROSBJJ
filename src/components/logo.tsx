import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2.5 20.5H4.5L7.5 14.5H16.5L19.5 20.5H21.5L12 2ZM8.5 12.5L12 5.5L15.5 12.5H8.5Z"/>
      </svg>
      <h1 className="text-xl font-black tracking-tighter text-foreground">
        ALBATROS
      </h1>
    </div>
  )
}
