"use client";

import { useState } from "react";

/* =====================
   TYPES
===================== */

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

/* =====================
   HOOK
===================== */

export function useCollabLens() {

  const [roles, setRoles] = useState<Roles>({});
  const [timeline, setTimeline] = useState<TimelineCommit[]>([]);
  const [loading, setLoading] = useState(false);

  /* =====================
     FETCH BACKEND DATA
  ===================== */

  async function loadRepo(repoUrl: string) {

    try {
      setLoading(true);

      const res = await fetch("/api/repo-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ repoUrl })
      });

      const data = await res.json();

      const figures: Figure[] = data.figures;
      const timelineData: TimelineCommit[] = data.timeline;

      setTimeline(timelineData);

      assignRoles(figures, timelineData);

    } catch (err) {
      console.error("Repo load failed", err);
    } finally {
      setLoading(false);
    }
  }

  /* =====================
     ROLE ASSIGNMENT LOGIC
  ===================== */

  function assignRoles(figures: Figure[], timeline: TimelineCommit[]) {

    if (!figures.length) return;

    const used = new Set<string>();

    /* ---------- Forge ---------- */
    const forge = [...figures]
      .sort((a, b) =>
        (b.additions + b.totalCommits) -
        (a.additions + a.totalCommits)
      )[0];

    used.add(forge.username);

    /* ---------- Compass ---------- */
    const compass = [...figures]
      .filter(f => !used.has(f.username))
      .sort((a, b) => b.activeWeeks - a.activeWeeks)[0];

    used.add(compass.username);

    /* ---------- Sentinel ---------- */
    const sentinel = [...figures]
      .filter(f => !used.has(f.username))
      .sort((a, b) =>
        (b.deletions / (b.additions || 1)) -
        (a.deletions / (a.additions || 1))
      )[0];

    used.add(sentinel.username);

    /* ---------- Catalyst ---------- */
    const burstScore = (username: string) =>
      timeline.filter(c => c.username === username).length;

    const catalyst = [...figures]
      .filter(f => !used.has(f.username))
      .sort((a, b) =>
        burstScore(b.username) - burstScore(a.username)
      )[0];

    used.add(catalyst.username);

    /* ---------- Anchor ---------- */
    const anchorScore = (username: string) => {

      const commits = timeline
        .filter(c => c.username === username)
        .map(c => new Date(c.date).getTime())
        .sort((a, b) => a - b);

      if (!commits.length) return 0;

      return commits[commits.length - 1] - commits[0];
    };

    const anchor = [...figures]
      .filter(f => !used.has(f.username))
      .sort((a, b) =>
        anchorScore(b.username) - anchorScore(a.username)
      )[0];

    used.add(anchor.username);

    /* ---------- Parasite ---------- */
    const parasite = [...figures]
      .filter(f => !used.has(f.username))
      .sort((a, b) =>
        (a.totalCommits + a.activeWeeks + a.additions) -
        (b.totalCommits + b.activeWeeks + b.additions)
      )[0];

    used.add(parasite.username);

    /* ---------- Common ---------- */
    const common = figures.filter(f => !used.has(f.username));

    setRoles({
      forge,
      compass,
      sentinel,
      catalyst,
      anchor,
      parasite,
      common
    });
  }

  return {
    loadRepo,
    roles,
    timeline,
    loading
  };
}
