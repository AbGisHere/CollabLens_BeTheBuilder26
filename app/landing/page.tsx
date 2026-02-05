import Image from "next/image"
import ElegantButton from "@/components/elegant-button"

export default function LandingPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#E6FAA0]">
      {/* Logo centered in top portion, filling available space */}
      <div className="absolute inset-x-0 top-0 h-[41%] flex items-center justify-center">
        <Image
          src="/images/collablens-logo.png"
          alt="CollabLens logo"
          width={1440}
          height={400}
          priority
          className="w-[70%] h-auto object-contain"
        />
      </div>
      
      {/* Rounded rectangle positioned to show only top half */}
      <div 
        className="absolute inset-x-0 w-full"
        style={{
          top: "41%",
          height: "109%",
          backgroundColor: "#56A13E",
          borderRadius: "200px",
          opacity: 0.75,
        }}
      />

      {/* Dashed Arrow */}
      <div 
        className="absolute"
        style={{
          top: "28%",
          left: "7.5%",
          width: "91.3%",
          height: "176%",
          opacity: 1,
        }}
      >
        <Image
          src="/images/dashed-arrow.png"
          alt="Dashed arrow"
          width={1315}
          height={1860}
          loading="eager"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Enter Dashboard Button */}
      <div 
        className="absolute"
        style={{
          top: "53.0%",
          left: "36.8%",
          width: "26.3%",
          height: "8.2%",
          opacity: 1,
        }}
      >
        <ElegantButton />
      </div>
    </main>
  )
}
