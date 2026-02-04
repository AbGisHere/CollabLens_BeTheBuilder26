"use client"

import { cn } from "@/lib/utils"
import type { CarouselItemData } from "@/data/carousel-items"

interface CarouselCardProps {
  item: CarouselItemData
  index: number
  isSettling: boolean
  isInFront: boolean
  width: number
  height: number
  translateZ: number
  quantity: number
}

export function CarouselCard({
  item,
  index,
  isSettling,
  isInFront,
  width,
  height,
  translateZ,
  quantity,
}: CarouselCardProps) {
  const canFlip = isSettling && isInFront

  return (
    <div
      className="carousel-card group absolute"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transformStyle: "preserve-3d",
        transform: `rotateY(${(360 / quantity) * index}deg) translateZ(${translateZ}px)`,
        backfaceVisibility: "visible",
      }}
    >
      {/* Card content wrapper - handles the flip when settling and card is in front */}
      <div
        className={cn(
          "card-content relative h-full w-full rounded-md border border-white/20 transition-all duration-300",
          canFlip &&
            "group-hover:[transform:rotateY(180deg)] group-hover:shadow-[0px_0px_20px_1px_#ffbb763f] group-hover:border-white/45"
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front face (default visible state - shows image) */}
        <CardFrontFace item={item} index={index} />

        {/* Back face - simple animated gradient (visible when rotating/in back) */}
        <CardBackSimple canFlip={canFlip} />

        {/* Detailed back face - only for front cards on hover */}
        <CardBackDetailed item={item} canFlip={canFlip} />
      </div>
    </div>
  )
}

// Front face component - shows the image and basic info
function CardFrontFace({
  item,
  index,
}: {
  item: CarouselItemData
  index: number
}) {
  return (
    <div
      className="card-front absolute h-full w-full overflow-hidden rounded-md bg-[#151515]"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
      }}
    >
      <img
        src={item.image || "/placeholder.svg"}
        alt={item.title || `Carousel image ${index + 1}`}
        className="absolute h-full w-full object-cover object-center"
        crossOrigin="anonymous"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      />
      <div
        className="absolute flex h-full w-full flex-col justify-between p-2.5"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {item.badge && (
          <span
            className="w-fit rounded-[10px] bg-black/30 px-2.5 py-0.5 text-xs text-white backdrop-blur-sm"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {item.badge}
          </span>
        )}
        <div
          className="w-full rounded-md bg-black/60 p-2.5 shadow-[0px_0px_10px_5px_rgba(0,0,0,0.5)] backdrop-blur-sm"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="flex justify-between text-[11px] text-white">
            <p className="w-1/2">{item.title || "Title"}</p>
            <p className="w-1/2 text-right">{item.subtitle || "Subtitle"}</p>
          </div>
          {item.footer && (
            <p className="mt-1 text-[8px] text-white/50">{item.footer}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Simple back face - animated gradient with floating circles
function CardBackSimple({ canFlip }: { canFlip: boolean }) {
  return (
    <div
      className={cn(
        "card-back absolute flex h-full w-full items-center justify-center overflow-hidden rounded-md bg-[#151515]",
        canFlip && "group-hover:opacity-0"
      )}
      style={{
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        transition: "opacity 0.3s ease",
      }}
    >
      {/* Animated gradient border */}
      <div className="absolute h-[160%] w-40 animate-[border-spin_5s_linear_infinite] bg-gradient-to-r from-transparent via-[#ff9966] to-transparent" />

      {/* Simple animated gradient with circles */}
      <div className="absolute flex h-[99%] w-[99%] flex-col items-center justify-center gap-6 rounded-md bg-[#151515]">
        <div className="circle absolute left-2 top-4 h-[90px] w-[90px] animate-[floating_2.6s_linear_infinite] rounded-full bg-[#ffbb66] blur-[15px]" />
        <div className="circle absolute left-[50px] top-0 h-[150px] w-[150px] animate-[floating_2.6s_linear_infinite_-800ms] rounded-full bg-[#ff8866] blur-[15px]" />
        <div className="circle absolute left-[160px] top-[-80px] h-[30px] w-[30px] animate-[floating_2.6s_linear_infinite_-1800ms] rounded-full bg-[#ff2233] blur-[15px]" />
      </div>
    </div>
  )
}

// Detailed back face - shows content when front card flips
function CardBackDetailed({
  item,
  canFlip,
}: {
  item: CarouselItemData
  canFlip: boolean
}) {
  return (
    <div
      className={cn(
        "card-back-detail absolute flex h-full w-full items-center justify-center overflow-hidden rounded-md bg-[#151515] opacity-0",
        canFlip && "group-hover:opacity-100"
      )}
      style={{
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        transition: "opacity 0.3s ease",
      }}
    >
      {/* Animated gradient border */}
      <div className="absolute h-[160%] w-40 animate-[border-spin_5s_linear_infinite] bg-gradient-to-r from-transparent via-[#ff9966] to-transparent" />

      <div className="absolute flex h-[99%] w-[99%] flex-col justify-between overflow-hidden rounded-md bg-[#151515] p-4">
        {/* Floating circles (background) */}
        <div className="circle absolute left-2 top-4 h-[90px] w-[90px] animate-[floating_2.6s_linear_infinite] rounded-full bg-[#ffbb66] opacity-30 blur-[15px]" />
        <div className="circle absolute right-0 top-0 h-[150px] w-[150px] animate-[floating_2.6s_linear_infinite_-800ms] rounded-full bg-[#ff8866] opacity-30 blur-[15px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-white">
            {item.backContent?.heading || item.title || "Details"}
          </h3>
          <p className="text-[10px] leading-relaxed text-white/70">
            {item.backContent?.description ||
              "Hover to explore more about this item."}
          </p>

          {/* Stats */}
          {item.backContent?.stats && (
            <div className="mt-1 flex gap-3">
              {item.backContent.stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-xs font-bold text-[#ff9966]">
                    {stat.value}
                  </span>
                  <span className="text-[8px] text-white/50">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        {item.backContent?.tags && (
          <div className="relative z-10 flex flex-wrap gap-1">
            {item.backContent.tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-full bg-white/10 px-2 py-0.5 text-[8px] text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="relative z-10">
          <button className="w-full rounded-md bg-gradient-to-r from-[#ff9966] to-[#ff8866] py-1.5 text-[10px] font-medium text-white transition-opacity hover:opacity-90">
            {item.backContent?.ctaText || "Learn More"}
          </button>
        </div>
      </div>
    </div>
  )
}
