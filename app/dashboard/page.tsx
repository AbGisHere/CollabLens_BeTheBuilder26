"use client"

import { useState, useMemo } from "react"
import { RotatingCarousel } from "@/components/rotating-carousel"
import { useCollabLensData, type Figure } from "@/components/useCollabLensData"
import type { CarouselItemData } from "@/data/carousel-items"
import { carouselItems } from "@/data/carousel-items"
import { Loader2, Github, AlertCircle, Users, GitCommit, Calendar } from "lucide-react"

// Role descriptions for each contributor type
const roleDescriptions: Record<string, { heading: string; description: string }> = {
  forge: {
    heading: "The Forge",
    description: "The primary builder who adds the most code and commits. They drive the project forward with consistent contributions."
  },
  compass: {
    heading: "The Compass",
    description: "Consistently active over time. They provide stability and direction to the project through steady engagement."
  },
  sentinel: {
    heading: "The Sentinel",
    description: "Focused on code quality and cleanup. They remove more code than they add, refining and optimizing the codebase."
  },
  catalyst: {
    heading: "The Catalyst",
    description: "Makes bursts of high-activity contributions. They spark momentum with concentrated periods of work."
  },
  anchor: {
    heading: "The Anchor",
    description: "Has the longest span of contributions. They provide long-term stability and institutional knowledge."
  },
  parasite: {
    heading: "The Parasite",
    description: "Minimal contribution relative to others. May need more engagement or support to contribute effectively."
  },
  common: {
    heading: "Contributor",
    description: "A valuable team member contributing to the project's success."
  }
}

function transformFiguresToCarouselItems(
  roles: ReturnType<typeof useCollabLensData>["roles"],
  figures: Figure[]
): CarouselItemData[] {
  const items: CarouselItemData[] = []

  const roleOrder: Array<{ key: keyof typeof roles; role: CarouselItemData["role"] }> = [
    { key: "forge", role: "forge" },
    { key: "compass", role: "compass" },
    { key: "sentinel", role: "sentinel" },
    { key: "catalyst", role: "catalyst" },
    { key: "anchor", role: "anchor" },
    { key: "parasite", role: "parasite" }
  ]

  roleOrder.forEach(({ key, role }) => {
    const figure = roles[key] as Figure | undefined
    if (figure && role) {
      const roleInfo = roleDescriptions[role]
      if (!roleInfo) return // Skip if role description not found
      
      items.push({
        image: `https://github.com/${figure.username}.png`,
        title: figure.username,
        subtitle: roleInfo.heading,
        badge: role.charAt(0).toUpperCase() + role.slice(1),
        footer: `${figure.totalCommits} commits`,
        role: role,
        backContent: {
          heading: roleInfo.heading,
          description: roleInfo.description,
          stats: [
            { label: "Commits", value: figure.totalCommits.toString() },
            { label: "Active Weeks", value: figure.activeWeeks.toString() },
            { label: "Additions", value: `+${figure.additions.toLocaleString()}` },
            { label: "Deletions", value: `-${figure.deletions.toLocaleString()}` }
          ],
          tags: ["GitHub", "Contributor"],
          ctaText: `View @${figure.username}`
        }
      })
    }
  })

  // Add common contributors
  if (roles.common && roles.common.length > 0) {
    roles.common.forEach((figure: Figure) => {
      const roleInfo = roleDescriptions.common
      items.push({
        image: `https://github.com/${figure.username}.png`,
        title: figure.username,
        subtitle: roleInfo.heading,
        badge: "Contributor",
        footer: `${figure.totalCommits} commits`,
        role: "common",
        backContent: {
          heading: roleInfo.heading,
          description: roleInfo.description,
          stats: [
            { label: "Commits", value: figure.totalCommits.toString() },
            { label: "Active Weeks", value: figure.activeWeeks.toString() },
            { label: "Additions", value: `+${figure.additions.toLocaleString()}` },
            { label: "Deletions", value: `-${figure.deletions.toLocaleString()}` }
          ],
          tags: ["GitHub", "Contributor"],
          ctaText: `View @${figure.username}`
        }
      })
    })
  }

  return items
}

export default function DashboardPage() {
  const [repoUrl, setRepoUrl] = useState("")
  const [githubToken, setGithubToken] = useState("")
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const { fetchRepoData, figures, timeline, roles, loading, error, repository } = useCollabLensData()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!repoUrl.trim()) return
    setHasSearched(true)
    await fetchRepoData(repoUrl, githubToken || undefined)
  }

  const carouselData = useMemo(() => {
    if (figures.length > 0 && Object.keys(roles).length > 0) {
      // Store timeline and figures data in localStorage for contributor pages
      if (timeline.length > 0) {
        localStorage.setItem("allCommits", JSON.stringify(timeline))
        
        // Store individual stats for each contributor
        figures.forEach(figure => {
          const role = Object.entries(roles).find(([key, value]) => {
            if (Array.isArray(value)) {
              return value.some(f => f.username === figure.username)
            }
            return value?.username === figure.username
          })
          
          localStorage.setItem(`stats_${figure.username}`, JSON.stringify({
            totalCommits: figure.totalCommits,
            additions: figure.additions,
            deletions: figure.deletions,
            activeWeeks: figure.activeWeeks,
            role: role ? role[0].charAt(0).toUpperCase() + role[0].slice(1) : "Contributor"
          }))
        })
      }
      
      return transformFiguresToCarouselItems(roles, figures)
    }
    return carouselItems // Default placeholder data
  }, [figures, roles, timeline])

  // Show input form if no data has been fetched yet
  if (!hasSearched) {
    return (
      <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-background">
        <div className="flex flex-col items-center gap-8 px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              CollabLens
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Analyze your GitHub repository and discover contributor roles
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-lg">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Github className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  className="h-14 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-[#56A13E] focus:outline-none focus:ring-2 focus:ring-[#56A13E]/20"
                />
              </div>
              
              {/* Token toggle button */}
              <button
                type="button"
                onClick={() => setShowTokenInput(!showTokenInput)}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <svg
                  className={`h-4 w-4 transition-transform ${showTokenInput ? "rotate-90" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {showTokenInput ? "Hide" : "Add"} GitHub Token (for private repos)
              </button>

              {/* Token input field */}
              {showTokenInput && (
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (optional)"
                    className="h-14 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-[#56A13E] focus:outline-none focus:ring-2 focus:ring-[#56A13E]/20"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !repoUrl.trim()}
                className="h-14 rounded-xl bg-[#56A13E] px-8 font-semibold text-white transition-colors hover:bg-[#4a8f35] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing Repository...
                  </span>
                ) : (
                  "Analyze Repository"
                )}
              </button>
            </div>
          </form>

          <p className="text-sm text-muted-foreground">
            Enter a GitHub repository URL to analyze contributor patterns
          </p>
          {showTokenInput && (
            <p className="mt-1 text-xs text-muted-foreground">
              Your token is only used for this request and is not stored
            </p>
          )}
        </div>
      </main>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <main className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-[#56A13E]" />
        <p className="mt-4 text-lg text-muted-foreground">Analyzing repository...</p>
        <p className="mt-2 text-sm text-muted-foreground">This may take a moment for large repositories</p>
      </main>
    )
  }

  // Show error state
  if (error) {
    return (
      <main className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="mt-4 text-lg font-semibold text-foreground">Something went wrong</p>
        <p className="mt-2 text-center text-sm text-muted-foreground">{error}</p>
        <button
          onClick={() => setHasSearched(false)}
          className="mt-6 rounded-xl bg-[#56A13E] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#4a8f35]"
        >
          Try Again
        </button>
      </main>
    )
  }

  // Show carousel with data
  return (
    <div className="relative h-screen w-screen overflow-hidden"
         style={{
           backgroundImage: 'url("/images/BackGround.png")',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}>
      {/* Header with repository info */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-background/80 px-6 py-4 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-bold text-foreground">{repository || "Repository Analysis"}</h1>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {figures.length} contributors
            </span>
            <span className="flex items-center gap-1">
              <GitCommit className="h-4 w-4" />
              {timeline.length} commits
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            setHasSearched(false)
            setRepoUrl("")
          }}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Analyze Another
        </button>
      </div>

      {/* Carousel */}
      <RotatingCarousel
        items={carouselData}
        width={190}
        height={254}
        sensitivity={0.3}
      />

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-center">
        <p className="text-sm text-muted-foreground">
          Scroll to rotate the carousel and hover on cards to see contributor details
        </p>
      </div>
    </div>
  )
}
