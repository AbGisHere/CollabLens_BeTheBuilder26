"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { CarouselItemData } from "@/data/carousel-items"

type RoleType = "forge" | "compass" | "sentinel" | "catalyst" | "anchor" | "parasite" | "common"

interface CarouselCardProps {
  item: CarouselItemData
  index: number
  isSettling: boolean
  isInFront: boolean
  width: number
  height: number
  translateZ: number
  quantity: number
  role?: RoleType
}

// Role color mappings
const roleColors = {
  forge: {
    primary: "#Bd7120", // Orange
    secondary: "#D4842a",
    accent: "#E6a050",
    gradient: "from-[#Bd7120] to-[#D4842a]"
  },
  compass: {
    primary: "#36ae96", // Blue-Green
    secondary: "#2e9b85",
    accent: "#4fc0a8",
    gradient: "from-[#36ae96] to-[#2e9b85]"
  },
  sentinel: {
    primary: "#643973", // Purple
    secondary: "#7a4a8a",
    accent: "#8e5ca0",
    gradient: "from-[#643973] to-[#7a4a8a]"
  },
  catalyst: {
    primary: "#56a13e", // Green
    secondary: "#4a8f35",
    accent: "#68b554",
    gradient: "from-[#56a13e] to-[#4a8f35]"
  },
  anchor: {
    primary: "#Aeaeae", // Silver
    secondary: "#9a9a9a",
    accent: "#c2c2c2",
    gradient: "from-[#Aeaeae] to-[#9a9a9a]"
  },
  parasite: {
    primary: "#a7373c", // Red
    secondary: "#912f34",
    accent: "#b8464c",
    gradient: "from-[#a7373c] to-[#912f34]"
  },
  common: {
    primary: "#808080", // Grey
    secondary: "#6b6b6b",
    accent: "#999999",
    gradient: "from-[#808080] to-[#6b6b6b]"
  }
}

// Role image mappings
const roleImages = {
  forge: "/images/Forge.png",
  compass: "/images/Compass.png",
  sentinel: "/images/Sentinel.png",
  catalyst: "/images/Catalyst.png",
  anchor: "/images/Anchor.png",
  parasite: "/images/Parasite.png",
  common: "/images/Common.png"
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
  role = "common"
}: CarouselCardProps) {
  const canFlip = isSettling && isInFront
  const colors = roleColors[role]
  const [isFlipped, setIsFlipped] = useState(false)

  const handleClick = () => {
    if (canFlip) {
      setIsFlipped(!isFlipped)
    }
  }

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
      onClick={handleClick}
    >
      {/* Card content wrapper - handles the flip when settling and card is in front */}
      <div
        className={cn(
          "card-content relative h-full w-full rounded-md border border-white/20 transition-all duration-300",
          canFlip &&
            "group-hover:[transform:rotateY(180deg)] group-hover:shadow-[0px_0px_20px_1px_#ffbb763f] group-hover:border-white/45",
          isFlipped && canFlip && "[transform:rotateY(180deg)] shadow-[0px_0px_20px_1px_#ffbb763f] border-white/45"
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front face (default visible state - shows image) */}
        <CardFrontFace item={item} index={index} colors={colors} roleImage={roleImages[role]} />

        {/* Back face - simple animated gradient (visible when rotating/in back) */}
        <CardBackSimple canFlip={canFlip} colors={colors} isFlipped={isFlipped} />

        {/* Detailed back face - only for front cards on hover */}
        <CardBackDetailed item={item} canFlip={canFlip} colors={colors} isFlipped={isFlipped} />
      </div>
    </div>
  )
}

// Front face component - shows the image and basic info
function CardFrontFace({
  item,
  index,
  colors,
  roleImage
}: {
  item: CarouselItemData
  index: number
  colors: typeof roleColors.forge
  roleImage: string
}) {
  return (
    <div
      className="card-front absolute h-full w-full overflow-hidden rounded-md"
      style={{
        backgroundColor: colors.primary,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
      }}
    >
      <img
        src={roleImage}
        alt={item.title || `Carousel image ${index + 1}`}
        className="absolute h-full w-full object-cover object-center"
        crossOrigin="anonymous"
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
function CardBackSimple({ canFlip, colors, isFlipped }: { canFlip: boolean; colors: typeof roleColors.forge; isFlipped?: boolean }) {
  return (
    <div
      className={cn(
        "card-back absolute flex h-full w-full items-center justify-center overflow-hidden rounded-md",
        canFlip && "group-hover:opacity-0",
        isFlipped && canFlip && "opacity-0"
      )}
      style={{
        backgroundColor: colors.primary,
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        transition: "opacity 0.3s ease",
      }}
    >
      {/* Animated gradient border */}
      <div className={`absolute h-[160%] w-40 animate-[border-spin_5s_linear_infinite] bg-gradient-to-r ${colors.gradient}`} />

      {/* Simple animated gradient with circles */}
      <div className="absolute flex h-[99%] w-[99%] flex-col items-center justify-center gap-6 rounded-md" style={{ backgroundColor: colors.primary }}>
        <div className="circle absolute left-2 top-4 h-[90px] w-[90px] animate-[floating_2.6s_linear_infinite] rounded-full blur-[15px]" style={{ backgroundColor: colors.accent }} />
        <div className="circle absolute left-[50px] top-0 h-[150px] w-[150px] animate-[floating_2.6s_linear_infinite_-800ms] rounded-full blur-[15px]" style={{ backgroundColor: colors.secondary }} />
        <div className="circle absolute left-[160px] top-[-80px] h-[30px] w-[30px] animate-[floating_2.6s_linear_infinite_-1800ms] rounded-full blur-[15px]" style={{ backgroundColor: colors.primary }} />
      </div>
    </div>
  )
}

// Detailed back face - shows content when front card flips
function CardBackDetailed({
  item,
  canFlip,
  colors,
  isFlipped
}: {
  item: CarouselItemData
  canFlip: boolean
  colors: typeof roleColors.forge
  isFlipped?: boolean
}) {
  return (
    <div
      className={cn(
        "card-back-detail absolute flex h-full w-full items-center justify-center overflow-hidden rounded-md opacity-0",
        canFlip && "group-hover:opacity-100",
        isFlipped && canFlip && "opacity-100"
      )}
      style={{
        backgroundColor: colors.primary,
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        transition: "opacity 0.3s ease",
      }}
    >
      {/* Animated gradient border */}
      <div className={`absolute h-[160%] w-40 animate-[border-spin_5s_linear_infinite] bg-gradient-to-r ${colors.gradient}`} />

      <div className="absolute flex h-[99%] w-[99%] flex-col justify-between overflow-hidden rounded-md p-4" style={{ backgroundColor: colors.primary }}>
        {/* Floating circles (background) */}
        <div className="circle absolute left-2 top-4 h-[90px] w-[90px] animate-[floating_2.6s_linear_infinite] rounded-full opacity-30 blur-[15px]" style={{ backgroundColor: colors.accent }} />
        <div className="circle absolute right-0 top-0 h-[150px] w-[150px] animate-[floating_2.6s_linear_infinite_-800ms] rounded-full opacity-30 blur-[15px]" style={{ backgroundColor: colors.secondary }} />

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
                  <span className="text-xs font-bold" style={{ color: colors.accent }}>
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
          <button 
            onClick={(e) => {
              e.stopPropagation()
              if (typeof window !== 'undefined') {
                window.location.href = `/contributor/${item.title}`
              }
            }}
            className={`w-full rounded-md bg-gradient-to-r ${colors.gradient} py-1.5 text-[10px] font-medium text-white transition-opacity hover:opacity-90`}
          >
            {item.backContent?.ctaText || "Learn More"}
          </button>
        </div>
      </div>
    </div>
  )
}
