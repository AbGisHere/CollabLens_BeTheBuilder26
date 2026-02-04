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

  const fetchRepoData = async (repoUrl: string) => {
    const res = await fetch("BACKEND_URL_PLACEHOLDER", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl })
    });

    const data = await res.json();

    setFigures(data.figures);
    setTimeline(data.timeline);

    assignRoles(data.figures, data.timeline);
  };

  /* ---------- ROLE LOGIC ---------- */

  const assignRoles = (figures: Figure[], timeline: TimelineCommit[]) => {
    const used = new Set<string>();

    const forge = [...figures].sort(
      (a, b) => (b.additions + b.totalCommits) - (a.additions + a.totalCommits)
    )[0];
    used.add(forge.username);

    const compass = [...figures]
      .filter(u => !used.has(u.username))
      .sort((a, b) => b.activeWeeks - a.activeWeeks)[0];
    used.add(compass.username);

    const sentinel = [...figures]
      .filter(u => !used.has(u.username))
      .sort(
        (a, b) =>
          b.deletions / (b.additions || 1) -
          a.deletions / (a.additions || 1)
      )[0];
    used.add(sentinel.username);

    const burstScore = (username: string) =>
      timeline.filter(c => c.username === username).length;

    const catalyst = [...figures]
      .filter(u => !used.has(u.username))
      .sort((a, b) => burstScore(b.username) - burstScore(a.username))[0];
    used.add(catalyst.username);

    const anchorScore = (username: string) => {
      const commits = timeline
        .filter(c => c.username === username)
        .map(c => new Date(c.date).getTime())
        .sort((a, b) => a - b);

      if (!commits.length) return 0;
      return commits[commits.length - 1] - commits[0];
    };

    const anchor = [...figures]
      .filter(u => !used.has(u.username))
      .sort((a, b) => anchorScore(b.username) - anchorScore(a.username))[0];
    used.add(anchor.username);

    const parasite = [...figures]
      .filter(u => !used.has(u.username))
      .sort(
        (a, b) =>
          (a.totalCommits + a.activeWeeks + a.additions) -
          (b.totalCommits + b.activeWeeks + b.additions)
      )[0];

    const common = figures.filter(u => !used.has(u.username));

    setRoles({ forge, compass, sentinel, catalyst, anchor, parasite, common });
  };

  return { fetchRepoData, figures, timeline, roles };
};
