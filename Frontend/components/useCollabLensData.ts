import { useState } from "react";

/* ---------- TYPES ---------- */

export interface Figure {
  username: string;
  totalCommits: number;
  activeWeeks: number;
  additions: number;
  deletions: number;
}

export interface TimelineCommit {
  username: string;
  message: string;
  date: string;
  commitUrl: string;
}

interface Roles {
  forge?: Figure;
  compass?: Figure;
  sentinel?: Figure;
  catalyst?: Figure;
  anchor?: Figure;
  parasite?: Figure;
  common?: Figure[];
}

/* ---------- HOOK ---------- */

export const useCollabLensData = () => {
  const [figures, setFigures] = useState<Figure[]>([]);
  const [timeline, setTimeline] = useState<TimelineCommit[]>([]);
  const [roles, setRoles] = useState<Roles>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repository, setRepository] = useState<string | null>(null);

  const fetchRepoData = async (repoUrl: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/repo-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch repository data");
      }

      setFigures(data.figures || []);
      setTimeline(data.timeline || []);
      setRepository(data.repository);

      if (data.figures && data.figures.length > 0) {
        assignRoles(data.figures, data.timeline || []);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- ROLE LOGIC ---------- */

  const assignRoles = (figures: Figure[], timeline: TimelineCommit[]) => {
    if (!figures || figures.length === 0) {
      setRoles({});
      return;
    }

    const used = new Set<string>();
    const newRoles: Roles = {};

    // Helper to get next available figure for a role
    const getAvailable = () => figures.filter(u => !used.has(u.username));

    // Forge: highest additions + commits
    const forgeCandidate = [...figures].sort(
      (a, b) => (b.additions + b.totalCommits) - (a.additions + a.totalCommits)
    )[0];
    if (forgeCandidate) {
      newRoles.forge = forgeCandidate;
      used.add(forgeCandidate.username);
    }

    // Compass: most active weeks
    const compassCandidate = getAvailable().sort((a, b) => b.activeWeeks - a.activeWeeks)[0];
    if (compassCandidate) {
      newRoles.compass = compassCandidate;
      used.add(compassCandidate.username);
    }

    // Sentinel: highest deletion ratio
    const sentinelCandidate = getAvailable().sort(
      (a, b) =>
        b.deletions / (b.additions || 1) -
        a.deletions / (a.additions || 1)
    )[0];
    if (sentinelCandidate) {
      newRoles.sentinel = sentinelCandidate;
      used.add(sentinelCandidate.username);
    }

    // Catalyst: burst score (most commits in timeline)
    const burstScore = (username: string) =>
      timeline.filter(c => c.username === username).length;

    const catalystCandidate = getAvailable().sort(
      (a, b) => burstScore(b.username) - burstScore(a.username)
    )[0];
    if (catalystCandidate) {
      newRoles.catalyst = catalystCandidate;
      used.add(catalystCandidate.username);
    }

    // Anchor: longest contribution span
    const anchorScore = (username: string) => {
      const commits = timeline
        .filter(c => c.username === username)
        .map(c => new Date(c.date).getTime())
        .sort((a, b) => a - b);

      if (!commits.length) return 0;
      return commits[commits.length - 1] - commits[0];
    };

    const anchorCandidate = getAvailable().sort(
      (a, b) => anchorScore(b.username) - anchorScore(a.username)
    )[0];
    if (anchorCandidate) {
      newRoles.anchor = anchorCandidate;
      used.add(anchorCandidate.username);
    }

    // Parasite: lowest overall contribution
    const parasiteCandidate = getAvailable().sort(
      (a, b) =>
        (a.totalCommits + a.activeWeeks + a.additions) -
        (b.totalCommits + b.activeWeeks + b.additions)
    )[0];
    if (parasiteCandidate) {
      newRoles.parasite = parasiteCandidate;
      used.add(parasiteCandidate.username);
    }

    // Common: remaining contributors
    newRoles.common = figures.filter(u => !used.has(u.username));

    setRoles(newRoles);
  };

  return { fetchRepoData, figures, timeline, roles, loading, error, repository };
};
