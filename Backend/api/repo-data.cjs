import axios from "axios";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: "Repo URL required" });
    }

    const parts = repoUrl.split("/");
    const owner = parts[3];
    const repo = parts[4];

    const token = process.env.GITHUB_TOKEN;

    /* Fetch commits */
    let allCommits = [];

    for (let page = 1; page <= 3; page++) {
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100&page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      allCommits.push(...response.data);

      if (response.data.length < 100) break;
    }

    const timeline = allCommits.map(commit => ({
      username: commit.author ? commit.author.login : "Unknown",
      authorName: commit.commit.author.name,
      message: commit.commit.message,
      date: commit.commit.author.date,
      commitUrl: commit.html_url
    }));

    /* Contributor stats */
    const contributorRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/stats/contributors`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const rawContributors = contributorRes.status === 202 ? [] : contributorRes.data;

    const figures = rawContributors.map(user => ({
      username: user.author.login,
      totalCommits: user.total,
      activeWeeks: user.weeks.filter(w => w.c > 0).length,
      additions: user.weeks.reduce((sum, w) => sum + w.a, 0),
      deletions: user.weeks.reduce((sum, w) => sum + w.d, 0)
    }));

    return res.status(200).json({
      repository: `${owner}/${repo}`,
      timeline,
      figures
    });

  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
