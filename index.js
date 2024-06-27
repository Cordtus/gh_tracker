const axios = require('axios');
const moment = require('moment');
require('dotenv').config();
const sources = require('./sources.json');
const db = require('./db');

const genericGithubToken = process.env.GITHUB_PAT;

async function fetchOrgRepos(org, token = genericGithubToken) {
  console.log(`Fetching repos for organization: ${org}`);
  try {
    const response = await axios.get(`https://api.github.com/orgs/${org}/repos`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const repos = response.data.filter(repo => !repo.fork);
    console.log(`Fetched ${repos.length} repos for organization: ${org} (excluding forks)`);
    return repos;
  } catch (error) {
    console.error(`Error fetching repos for org ${org}:`, error.message);
    return [];
  }
}

async function fetchRepoCommits(repo, token = genericGithubToken, since) {
  const commits = [];
  let page = 1;
  const perPage = 100;
  console.log(`Fetching commits for repository: ${repo} since ${since}`);

  try {
    while (true) {
      console.log(`Fetching page ${page} for repository: ${repo}`);
      const response = await axios.get(`https://api.github.com/repos/${repo}/commits`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          per_page: perPage,
          page: page,
          since: since
        }
      });

      if (response.data.length === 0) break;
      commits.push(...response.data);
      console.log(`Fetched ${response.data.length} commits from page ${page} for repository: ${repo}`);
      page++;
    }

    console.log(`Total commits fetched for repository ${repo}: ${commits.length}`);
    return commits.map(commit => ({
      date: commit.commit.author.date,
      sha: commit.sha
    }));
  } catch (error) {
    console.error(`Error fetching commits for repo ${repo}:`, error.message);
    return [];
  }
}

async function updateActivity(sources) {
  const now = moment().toISOString();
  let activity = {
    orgs: {},
    repos: {},
    overall: 0
  };

  for (const source of sources) {
    const repoPath = source.repo;
    const token = source.pat || genericGithubToken;
    const pathParts = repoPath.split('/');

    if (pathParts.length === 1) {
      // This is an org
      const org = repoPath;
      console.log(`Processing organization: ${org}`);
      const repos = await fetchOrgRepos(org, token);

      for (const repo of repos) {
        const repoName = `${org}/${repo.name}`;
        await processRepo(repoName, org, token, activity, now);
      }
    } else if (pathParts.length === 2) {
      // This is a specific repo
      console.log(`Processing repository: ${repoPath}`);
      await processRepo(repoPath, null, token, activity, now);
    }
  }

  return activity;
}

async function processRepo(repoName, org, token, activity, now) {
  db.get(`SELECT last_checked FROM repos WHERE repo = ?`, [repoName], async (err, row) => {
    if (err) {
      console.error(`Database error: ${err.message}`);
      return;
    }

    const lastChecked = row ? row.last_checked : null;
    const since = lastChecked ? moment(lastChecked).toISOString() : null;
    const commits = await fetchRepoCommits(repoName, token, since);

    if (commits.length > 0) {
      if (row) {
        db.run(`UPDATE repos SET last_checked = ? WHERE repo = ?`, [now, repoName]);
      } else {
        db.run(`INSERT INTO repos (repo, org, last_checked) VALUES (?, ?, ?)`, [repoName, org, now]);
      }

      commits.forEach(commit => {
        db.run(`INSERT OR REPLACE INTO activity (repo, commit_date, commits) VALUES (?, ?, ?)`,
          [repoName, commit.date, 1]);
      });

      activity.repos[repoName] = (activity.repos[repoName] || 0) + commits.length;
      activity.overall += commits.length;
      if (org) {
        activity.orgs[org] = (activity.orgs[org] || 0) + commits.length;
      }
      console.log(`Total activity for repository ${repoName}: ${activity.repos[repoName]} commits`);
    }
  });
}

async function exportToCSV(activity) {
  const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: 'activity.csv',
    header: [
      { id: 'type', title: 'Type' },
      { id: 'name', title: 'Name' },
      { id: 'commits', title: 'Commits' }
    ]
  });

  const records = [];

  for (const org in activity.orgs) {
    records.push({ type: 'Org', name: org, commits: activity.orgs[org] });
  }

  for (const repo in activity.repos) {
    records.push({ type: 'Repo', name: repo, commits: activity.repos[repo] });
  }

  await csvWriter.writeRecords(records);
  console.log('Activity data has been written to activity.csv');
}

async function main() {
  console.log('Starting activity update process...');
  const activity = await updateActivity(sources);
  console.log(JSON.stringify(activity, null, 2));
  await exportToCSV(activity);
  console.log('Activity update process completed.');
}

main();
