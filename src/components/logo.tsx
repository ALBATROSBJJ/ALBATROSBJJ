import { cn } from "@/lib/utils"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export function Logo({ className }: { className?: string }) {
  const logoImage = PlaceHolderImages.find(img => img.id === 'albatros-logo');
  
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {logoImage && (
        <Image
            src={logoImage.imageUrl}
            alt={logoImage.description}
            data-ai-hint={logoImage.imageHint}
            width={32}
            height={32}
            className="h-8 w-8"
        />
      )}
      <h1 className="font-headline text-2xl uppercase tracking-wider text-primary">
        ALBATROS
      </h1>
    </div>
  )
}
