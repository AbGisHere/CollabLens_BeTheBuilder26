"use client"

import React, { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { CarouselCard } from "./carousel-card"
import type { CarouselItemData } from "@/data/carousel-items"

interface RotatingCarouselProps {
  items: CarouselItemData[]
  width?: number
  height?: number
  sensitivity?: number
  className?: string
}

export function RotatingCarousel({
  items,
  width = 190,
  height = 254,
  sensitivity = 0.15,

  className,
}: RotatingCarouselProps) {
  // Shuffle items on mount
  const [shuffledItems, setShuffledItems] = useState<CarouselItemData[]>(items)
  
  useEffect(() => {
    if (items.length > 0) {
      const shuffled = [...items].sort(() => Math.random() - 0.5)
      setShuffledItems(shuffled)
    }
  }, [items])

  const quantity = shuffledItems.length || 1  ;
  const radiusMultiplier = quantity <= 10 ? 1 : 1 + (quantity - 10) * 0.05  ;
  const translateZ = (width + height) * radiusMultiplier
  const perspective = 1000 + (translateZ * 2.5)
  const containerRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Use refs for animation state to avoid re-renders
  const targetRotation = useRef(0)
  const currentRotation = useRef(0)
  const animationFrame = useRef<number | null>(null)

  // Track if carousel has stopped spinning
  const [isStopped, setIsStopped] = useState(true)
  const [isSettling, setIsSettling] = useState(true)
  const [currentAngle, setCurrentAngle] = useState(0)
  const lastScrollTime = useRef(0)
  const hasSnapped = useRef(false)

  // Calculate the angle per card
  const anglePerCard = 360 / quantity

  // Check if a card is facing the front (within threshold)
  const isCardInFront = (cardIndex: number) => {
    const cardAngle = (360 / quantity) * cardIndex
    let normalizedRotation = currentAngle % 360
    if (normalizedRotation < 0) normalizedRotation += 360

    let effectiveAngle = (cardAngle + normalizedRotation) % 360
    if (effectiveAngle < 0) effectiveAngle += 360

    return effectiveAngle < 45 || effectiveAngle > 315
  }

  // Function to snap to nearest card
  const snapToNearestCard = () => {
    let normalizedRotation = currentRotation.current % 360
    if (normalizedRotation < 0) normalizedRotation += 360

    const closestCardIndex = Math.round(normalizedRotation / anglePerCard)
    const snappedAngle = closestCardIndex * anglePerCard

    const fullTurns = Math.floor(currentRotation.current / 360)
    targetRotation.current = fullTurns * 360 + snappedAngle

    if (Math.abs(targetRotation.current - currentRotation.current) > 180) {
      if (targetRotation.current > currentRotation.current) {
        targetRotation.current -= 360
      } else {
        targetRotation.current += 360
      }
    }
  }

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }

    const animate = () => {
      const prevRotation = currentRotation.current

      currentRotation.current = lerp(
        currentRotation.current,
        targetRotation.current,
        0.08
      )

      const rotationDelta = Math.abs(currentRotation.current - prevRotation)
      const isNearlyStationary = rotationDelta < 0.05
      const timeSinceScroll = Date.now() - lastScrollTime.current

      if (isNearlyStationary && timeSinceScroll > 200 && !hasSnapped.current) {
        hasSnapped.current = true
        snapToNearestCard()
        setIsSettling(true)
      }

      const distanceToTarget = Math.abs(
        currentRotation.current - targetRotation.current
      )
      if (distanceToTarget < 0.1 && timeSinceScroll > 300) {
        setIsStopped(true)
      }

      if (distanceToTarget < 15 && hasSnapped.current) {
        setIsSettling(true)
      }

      setCurrentAngle(currentRotation.current)

      if (carouselRef.current) {
        carouselRef.current.style.transform = `perspective(${perspective}px) rotateX(-3deg) rotateY(${currentRotation.current}deg)`
      }

      animationFrame.current = requestAnimationFrame(animate)
    }

    animationFrame.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [anglePerCard, perspective])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      setIsStopped(false)
      setIsSettling(false)
      lastScrollTime.current = Date.now()
      hasSnapped.current = false

      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY

      targetRotation.current += delta * sensitivity
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [sensitivity])

  // Add touch support for mobile devices
  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0
    let lastTouchX = 0
    let lastTouchTime = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
      lastTouchX = touchStartX
      lastTouchTime = Date.now()
      
      setIsStopped(false)
      setIsSettling(false)
      hasSnapped.current = false
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      
      const touchX = e.touches[0].clientX
      const touchY = e.touches[0].clientY
      
      const deltaX = touchX - lastTouchX
      const deltaY = touchY - touchStartY
      
      // Only rotate if horizontal movement is more dominant
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        lastScrollTime.current = Date.now()
        
        // Adjust sensitivity for touch (negative to match scroll direction)
        targetRotation.current -= deltaX * (sensitivity * 3)
      }
      
      lastTouchX = touchX
    }

    const handleTouchEnd = () => {
      lastScrollTime.current = Date.now()
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: false })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [sensitivity])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-screen w-screen items-center justify-center overflow-hidden",
        className
      )}
    >
      <div
        ref={carouselRef}
        className="absolute z-10 will-change-transform"
        style={
          {
            "--translateZ": `${translateZ}px`,
            width: `${width}px`,
            height: `${height}px`,
            transformStyle: "preserve-3d",
            transform: `perspective(${perspective}px) rotateX(-3deg) rotateY(0deg)`,
          } as React.CSSProperties
        }
      >
        {shuffledItems.map((item, index) => (
          <CarouselCard
            key={`${item.title}-${index}`}
            item={item}
            index={index}
            isSettling={isSettling}
            isInFront={isCardInFront(index)}
            width={width}
            height={height}
            translateZ={translateZ}
            quantity={quantity}
            role={item.role}
          />
        ))}
      </div>
    </div>
  )
}
