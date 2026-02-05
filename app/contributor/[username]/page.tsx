"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Github, GitCommit, Calendar, Plus, Minus } from "lucide-react"
import type { TimelineCommit } from "@/components/useCollabLensData"

export default function ContributorPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params)
  const username = decodeURIComponent(resolvedParams.username)
  const router = useRouter()
  const [commits, setCommits] = useState<TimelineCommit[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCommits: 0,
    additions: 0,
    deletions: 0,
    activeWeeks: 0,
    role: ""
  })

  useEffect(() => {
    // Get data from localStorage (stored by dashboard)
    const allCommitsStr = localStorage.getItem("allCommits")
    const statsStr = localStorage.getItem(`stats_${username}`)
    
    if (allCommitsStr) {
      try {
        const allCommits = JSON.parse(allCommitsStr) as TimelineCommit[]
        const userCommits = allCommits.filter(commit => commit.username === username)
        setCommits(userCommits)
      } catch (e) {
        console.error("Failed to parse commits", e)
      }
    }

    if (statsStr) {
      try {
        const parsedStats = JSON.parse(statsStr)
        setStats(parsedStats)
      } catch (e) {
        console.error("Failed to parse stats", e)
      }
    }

    setLoading(false)
  }, [username])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <div className="flex items-start gap-4">
            <img
              src={`https://github.com/${username}.png`}
              alt={username}
              className="h-16 w-16 rounded-full border-2 border-[#56A13E]"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{username}</h1>
                {stats.role && (
                  <span className="rounded-full bg-[#56A13E]/20 px-3 py-1 text-xs font-semibold text-[#56A13E]">
                    {stats.role}
                  </span>
                )}
              </div>
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-[#56A13E]"
              >
                <Github className="h-4 w-4" />
                View GitHub Profile
              </a>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GitCommit className="h-4 w-4" />
                <span className="text-sm">Commits</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{stats.totalCommits}</p>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Active Weeks</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{stats.activeWeeks}</p>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-green-500">
                <Plus className="h-4 w-4" />
                <span className="text-sm">Additions</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {stats.additions.toLocaleString()}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-red-500">
                <Minus className="h-4 w-4" />
                <span className="text-sm">Deletions</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {stats.deletions.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Commits List */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-xl font-bold text-foreground">
          All Commits ({commits.length})
        </h2>

        {commits.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No commits found for this contributor</p>
          </div>
        ) : (
          <div className="space-y-3">
            {commits.map((commit, index) => (
              <div
                key={index}
                className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-[#56A13E] hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{commit.message}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(commit.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                      {commit.authorName && (
                        <span className="text-xs">by {commit.authorName}</span>
                      )}
                    </div>
                  </div>
                  <a
                    href={commit.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-md bg-[#56A13E]/10 px-3 py-1.5 text-xs font-medium text-[#56A13E] transition-colors hover:bg-[#56A13E]/20"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
