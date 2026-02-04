require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

/*
========================================
🔐 TOKEN FROM .env
========================================
*/
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/*
========================================
MIDDLEWARE
========================================
*/
app.use(cors());
app.use(express.json());

/*
========================================
TEST ROUTE
========================================
*/
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

/*
========================================
UTILITY FUNCTION
Fetch commits with pagination
========================================
*/
async function fetchAllCommits(owner, repo) {
  let allCommits = [];

  for (let page = 1; page <= 3; page++) {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`
        }
      }
    );

    allCommits.push(...response.data);

    // Stop if less than 100 commits returned
    if (response.data.length < 100) break;
  }

  return allCommits;
}

/*
========================================
UTILITY FUNCTION
Fetch contributor stats
========================================
*/
async function fetchContributorStats(owner, repo) {
  const response = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/stats/contributors`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`
      }
    }
  );

  // GitHub sometimes returns 202 while computing
  if (response.status === 202) {
    return [];
  }

  return response.data;
}

/*
========================================
MAIN ROUTE
========================================
*/
app.post("/repo-data", async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: "Repo URL required" });
    }

    /* Extract owner and repo */
    const parts = repoUrl.split("/");
    const owner = parts[3];
    const repo = parts[4];

    if (!owner || !repo) {
      return res.status(400).json({ error: "Invalid GitHub URL" });
    }

    /*
    ========================================
    FETCH DATA
    ========================================
    */
    const rawCommits = await fetchAllCommits(owner, repo);
    const rawContributors = await fetchContributorStats(owner, repo);

    /*
    ========================================
    CLEAN TIMELINE DATA
    ========================================
    */
    const timeline = rawCommits.map(commit => ({
      username: commit.author ? commit.author.login : "Unknown",
      authorName: commit.commit.author.name,
      message: commit.commit.message,
      date: commit.commit.author.date,
      commitUrl: commit.html_url
    }));

    /*
    ========================================
    CLEAN CONTRIBUTOR FIGURES
    ========================================
    */
    const figures = rawContributors.map(user => ({
      username: user.author.login,
      totalCommits: user.total,
      activeWeeks: user.weeks.filter(w => w.c > 0).length,
      additions: user.weeks.reduce((sum, w) => sum + w.a, 0),
      deletions: user.weeks.reduce((sum, w) => sum + w.d, 0)
    }));

    /*
    ========================================
    RESPONSE
    ========================================
    */
    res.json({
      repository: `${owner}/${repo}`,

      timeline: timeline,        // commit-level events
      figures: figures,          // contributor-level metrics

      totalCommitsFetched: timeline.length,
      contributorCount: figures.length
    });

  } catch (error) {
    console.error("ERROR:", error.message);

    res.status(500).json({
      error: "Failed to fetch repository data"
    });
  }
});

/*
========================================
START SERVER
========================================
*/
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
