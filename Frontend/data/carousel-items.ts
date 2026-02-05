export interface CarouselItemData {
  // Front face content
  image: string
  title?: string
  subtitle?: string
  badge?: string
  footer?: string
  role?: "forge" | "compass" | "sentinel" | "catalyst" | "anchor" | "parasite" | "common"
  
  // Back face content (shown when card flips on hover)
  backContent?: {
    heading?: string
    description?: string
    stats?: { label: string; value: string }[]
    tags?: string[]
    ctaText?: string
  }
}

// Edit this array to customize your carousel items
export const carouselItems: CarouselItemData[] = [
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=300&fit=crop",
    title: "Mountain Peak",
    subtitle: "Nature",
    badge: "Featured",
    footer: "Discover heights",
    role: "forge",
    backContent: {
      heading: "Mountain Peak Expedition",
      description: "Experience breathtaking views from summit. Perfect for experienced hikers seeking adventure.",
      stats: [
        { label: "Altitude", value: "4,200m" },
        { label: "Duration", value: "3 Days" },
      ],
      tags: ["Hiking", "Adventure", "Photography"],
      ctaText: "Book Expedition",
    },
  },
  {
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=300&fit=crop",
    title: "Forest Trail",
    subtitle: "Adventure",
    badge: "Popular",
    footer: "Into the wild",
    role: "compass",
    backContent: {
      heading: "Forest Trail Journey",
      description: "Immerse yourself in ancient woodlands with guided nature walks.",
      stats: [
        { label: "Distance", value: "12km" },
        { label: "Difficulty", value: "Easy" },
      ],
      tags: ["Nature", "Walking", "Wildlife"],
      ctaText: "Explore Trail",
    },
  },
  {
    image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=200&h=300&fit=crop",
    title: "Woodland",
    subtitle: "Calm",
    badge: "New",
    footer: "Find your peace",
    role: "sentinel",
    backContent: {
      heading: "Woodland Retreat",
      description: "A peaceful escape into nature. Perfect for meditation and relaxation.",
      stats: [
        { label: "Area", value: "500 acres" },
        { label: "Rating", value: "4.9" },
      ],
      tags: ["Relaxation", "Meditation", "Quiet"],
      ctaText: "Reserve Spot",
    },
  },
  {
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=200&h=300&fit=crop",
    title: "Waterfall",
    subtitle: "Wonder",
    badge: "Trending",
    footer: "Nature's power",
    role: "catalyst",
    backContent: {
      heading: "Majestic Waterfall",
      description: "Witness raw power of nature at this stunning 200ft cascade.",
      stats: [
        { label: "Height", value: "200ft" },
        { label: "Best Time", value: "Spring" },
      ],
      tags: ["Scenic", "Photography", "Nature"],
      ctaText: "Plan Visit",
    },
  },
  {
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200&h=300&fit=crop",
    title: "Lake View",
    subtitle: "Serenity",
    badge: "Editor's Pick",
    footer: "Peaceful waters",
    role: "anchor",
    backContent: {
      heading: "Serene Lake View",
      description: "Crystal clear waters surrounded by mountains. Ideal for kayaking.",
      stats: [
        { label: "Depth", value: "45m" },
        { label: "Temp", value: "18°C" },
      ],
      tags: ["Water Sports", "Fishing", "Camping"],
      ctaText: "Book Stay",
    },
  },
  {
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200&h=300&fit=crop",
    title: "Misty Hills",
    subtitle: "Mystery",
    badge: "Featured",
    footer: "Beyond the fog",
    role: "parasite",
    backContent: {
      heading: "Misty Hills Trek",
      description: "Explore mysterious landscape shrouded in morning mist.",
      stats: [
        { label: "Elevation", value: "1,800m" },
        { label: "Trail", value: "8km" },
      ],
      tags: ["Mystery", "Trekking", "Sunrise"],
      ctaText: "Join Trek",
    },
  },
  {
    image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=200&h=300&fit=crop",
    title: "Green Valley",
    subtitle: "Fresh",
    badge: "New",
    footer: "Breathe deep",
    role: "common",
    backContent: {
      heading: "Green Valley Paradise",
      description: "Lush meadows and fresh mountain air await your arrival.",
      stats: [
        { label: "Size", value: "2,000 acres" },
        { label: "Climate", value: "Mild" },
      ],
      tags: ["Picnic", "Family", "Nature"],
      ctaText: "Discover More",
    },
  },
  {
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200&h=300&fit=crop",
    title: "Golden Fields",
    subtitle: "Warmth",
    badge: "Popular",
    footer: "Summer dreams",
    role: "common",
    backContent: {
      heading: "Golden Fields Farm",
      description: "Experience rural life among golden wheat fields at sunset.",
      stats: [
        { label: "Season", value: "Summer" },
        { label: "Tours", value: "Daily" },
      ],
      tags: ["Farm", "Sunset", "Rural"],
      ctaText: "Book Tour",
    },
  },
  {
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=300&fit=crop",
    title: "Desert Dunes",
    subtitle: "Adventure",
    badge: "New",
    footer: "Endless sands",
    role: "common",
    backContent: {
      heading: "Desert Dunes Safari",
      description: "Experience the majesty of endless sand dunes under starlit skies.",
      stats: [
        { label: "Area", value: "50km²" },
        { label: "Best Season", value: "Winter" },
      ],
      tags: ["Desert", "Adventure", "Photography"],
      ctaText: "Book Safari",
    },
  },
  {
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=200&h=300&fit=crop",
    title: "Coastal Cliffs",
    subtitle: "Dramatic",
    badge: "Featured",
    footer: "Ocean's edge",
    role: "common",
    backContent: {
      heading: "Coastal Cliffs Adventure",
      description: "Dramatic cliffs meeting the ocean. Perfect for coastal photography and hiking.",
      stats: [
        { label: "Height", value: "300m" },
        { label: "Trail Length", value: "15km" },
      ],
      tags: ["Coastal", "Hiking", "Photography"],
      ctaText: "Explore Cliffs",
    },
  },
]
