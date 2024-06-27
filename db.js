const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./activity.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS activity (
      repo TEXT,
      commit_date TEXT,
      commits INTEGER,
      PRIMARY KEY (repo, commit_date)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS repos (
      repo TEXT PRIMARY KEY,
      org TEXT,
      last_checked TEXT
    )
  `);
});

module.exports = db;
