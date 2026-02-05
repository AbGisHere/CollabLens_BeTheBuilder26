import { NextResponse } from "next/server";

/* ============================
   TOKEN (OPTIONAL)
============================ */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/*
Helper to build headers.
If token exists → authenticated requests
If not → unauthenticated fallback (60/hr)
*/
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Accept": "application/vnd.github.v3+json",
  };
  if (GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
  }
  return headers;
}

/* ============================
   FETCH COMMITS WITH PAGINATION
============================ */

async function fetchAllCommits(owner: string, repo: string) {
  let allCommits: any[] = [];

  for (let page = 1; page <= 3; page++) {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100&page=${page}`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    allCommits.push(...data);

    if (data.length < 100) break;
  }

  return allCommits;
}

/* ============================
   FETCH CONTRIBUTOR STATS
============================ */

async function fetchContributorStats(owner: string, repo: string, retries = 3): Promise<any[]> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/stats/contributors`,
      {
        headers: getHeaders(),
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      if (data) return data;
    }

    if (response.status === 202) {
      // GitHub still computing stats, wait and retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      continue;
    }

    // Other errors
    return [];
  }

  return [];
}

/* ============================
   VALIDATE GITHUB URL
============================ */

function extractRepo(repoUrl: string) {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);

  if (!match) return null;

  return {
    owner: match[1],
    repo: match[2]
  };
}

/* ============================
   POST ROUTE
============================ */

export async function POST(req: Request) {
  try {
    const { repoUrl } = await req.json();

    if (!repoUrl) {
      return NextResponse.json(
        { error: "Repo URL required" },
        { status: 400 }
      );
    }

    const extracted = extractRepo(repoUrl);

    if (!extracted) {
      return NextResponse.json(
        { error: "Invalid GitHub repository URL" },
        { status: 400 }
      );
    }

    const { owner, repo } = extracted;

    /* ---------- FETCH DATA ---------- */

    const rawCommits = await fetchAllCommits(owner, repo);
    const rawContributors = await fetchContributorStats(owner, repo);

    /* ---------- CLEAN TIMELINE ---------- */

    const timeline = rawCommits.map(commit => ({
      username: commit.author?.login ?? "Unknown",
      authorName: commit.commit.author.name,
      message: commit.commit.message,
      date: commit.commit.author.date,
      commitUrl: commit.html_url
    }));

    /* ---------- CLEAN FIGURES ---------- */

    const figures = rawContributors.map((user: any) => ({
      username: user.author.login,
      totalCommits: user.total,
      activeWeeks: user.weeks.filter((w: any) => w.c > 0).length,
      additions: user.weeks.reduce((sum: number, w: any) => sum + w.a, 0),
      deletions: user.weeks.reduce((sum: number, w: any) => sum + w.d, 0)
    }));

    return NextResponse.json({
      repository: `${owner}/${repo}`,
      timeline,
      figures,
      usingAuthToken: Boolean(GITHUB_TOKEN) // helpful debug flag
    });

  } catch (error: any) {

    /* ---------- RATE LIMIT HANDLING ---------- */

    if (error.message?.includes("403")) {
      return NextResponse.json(
        {
          error: "GitHub API rate limit exceeded. Try later or add a token."
        },
        { status: 403 }
      );
    }

    console.error(error);

    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
