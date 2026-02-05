import { NextResponse } from "next/server";

/* ============================
   TOKEN (OPTIONAL)
============================ */

const ENV_GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/*
Helper to build headers.
Prioritizes user-provided token over environment token.
If token exists → authenticated requests (5000/hr)
If not → unauthenticated fallback (60/hr)
*/
function getHeaders(userToken?: string): HeadersInit {
  const token = userToken || ENV_GITHUB_TOKEN;
  const headers: HeadersInit = {
    "Accept": "application/vnd.github.v3+json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/* ============================
   FETCH COMMITS WITH PAGINATION
============================ */

async function fetchAllCommits(owner: string, repo: string, userToken?: string) {
  let allCommits: any[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100&page=${page}`,
      {
        headers: getHeaders(userToken),
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Fetch detailed stats for each commit (including additions/deletions)
    const detailedCommits = await Promise.all(
      data.map(async (commit: any) => {
        try {
          const detailResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/commits/${commit.sha}`,
            { headers: getHeaders(userToken) }
          );
          
          if (detailResponse.ok) {
            const detail = await detailResponse.json();
            return { ...commit, stats: detail.stats };
          }
        } catch (e) {
          // If detail fetch fails, return commit without stats
          console.warn(`Failed to fetch stats for commit ${commit.sha}`);
        }
        return commit;
      })
    );
    
    allCommits.push(...detailedCommits);

    // Continue if we got a full page of results
    if (data.length < 100) {
      hasMore = false;
    } else {
      page++;
    }
  }

  return allCommits;
}

/* ============================
   DERIVE CONTRIBUTOR DATA FROM COMMITS
============================ */

function deriveContributorStats(commits: any[]) {
  const contributorMap = new Map<string, {
    username: string;
    totalCommits: number;
    additions: number;
    deletions: number;
    firstCommit: Date;
    lastCommit: Date;
    commitDates: Set<string>;
  }>();

  commits.forEach(commit => {
    const username = commit.author?.login ?? "Unknown";
    const date = new Date(commit.commit.author.date);
    const additions = commit.stats?.additions ?? 0;
    const deletions = commit.stats?.deletions ?? 0;

    if (!contributorMap.has(username)) {
      contributorMap.set(username, {
        username,
        totalCommits: 0,
        additions: 0,
        deletions: 0,
        firstCommit: date,
        lastCommit: date,
        commitDates: new Set()
      });
    }

    const contributor = contributorMap.get(username)!;
    contributor.totalCommits++;
    contributor.additions += additions;
    contributor.deletions += deletions;
    
    if (date < contributor.firstCommit) contributor.firstCommit = date;
    if (date > contributor.lastCommit) contributor.lastCommit = date;
    
    // Track unique weeks for active weeks calculation
    const weekKey = `${date.getFullYear()}-W${Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000))}`;
    contributor.commitDates.add(weekKey);
  });

  return Array.from(contributorMap.values()).map(contributor => ({
    username: contributor.username,
    totalCommits: contributor.totalCommits,
    activeWeeks: contributor.commitDates.size,
    additions: contributor.additions,
    deletions: contributor.deletions
  }));
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
    const { repoUrl, githubToken } = await req.json();

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

    // Use user-provided token or fall back to environment token
    const token = githubToken || ENV_GITHUB_TOKEN;

    /* ---------- FETCH DATA ---------- */

    const rawCommits = await fetchAllCommits(owner, repo, token);

    /* ---------- CLEAN TIMELINE ---------- */

    const timeline = rawCommits.map(commit => ({
      username: commit.author?.login ?? "Unknown",
      authorName: commit.commit.author.name,
      message: commit.commit.message,
      date: commit.commit.author.date,
      commitUrl: commit.html_url
    }));

    /* ---------- DERIVE FIGURES FROM COMMITS ---------- */

    const figures = deriveContributorStats(rawCommits);

    return NextResponse.json({
      repository: `${owner}/${repo}`,
      timeline,
      figures,
      usingAuthToken: Boolean(token) // helpful debug flag
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
