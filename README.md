
# GitHub Activity Tracker

Tracks activity across multiple GitHub repositories and organizations and stores the data for visualization in Grafana.

## Table of Contents

- [Project Structure](#project-structure)
- [Usage](#usage)
- [Configuration](#configuration)
- [Dashboard Setup](#dashboard-setup)

## Project Structure

```
.
├── README.md
├── activity.csv
├── dash.json
├── db.js
├── index.js
├── sources.json
└── lambda/
    ├── README.md
    ├── lambda_function
    └── s3dash.json
```

### Files and Directories

- `README.md`: What you are currently reading.
- `activity.csv`: Generated CSV file containing activity data.
- `dash.json`: Grafana dashboard configuration JSON.
- `db.js`: SQLite db init and schema script.
- `index.js`: Main script to fetch activity and update db.
- `sources.json`: List of tracked repos and orgs.
- `lambda/`: AWS Lambda setup.

## Usage

Run the GitHub activity tracker:

```bash
node index.js
```

This will fetch the latest commits from the specified repositories and organizations, update the SQLite database, and generate the `activity.csv` file.

## Configuration

### GitHub Personal Access Token (PAT)

Ensure you have a `.env` file in the project root directory containing your GitHub Personal Access Token (PAT):

```env
GITHUB_PAT=your_generic_github_pat
```
*This is optional, but helps to avoid rate-limiting*

### Sources JSON

The `sources.json` file should contain a list of repositories and organizations to track. Example `sources.json`:

```json
[
    {
        "repo": "github_org/repo",
        "pat": "CUSTOM_PAT_FOR_THIS_REPO"
    },    
    {
        "repo": "grpc/grpc-web"
    },
    {
        "repo": "codecrafters-io"
    },
    {
        "repo": "github_org/repo"
    },
    {
        "repo": "github_org"
    }
]
```

- `repo`: The repository or organization to track.
- `pat`: (Optional) Specific PAT for accessing private repositories.

## Dashboard Setup

To visualize the data in Grafana, use the provided `dash.json` configuration. Follow these steps to set up the Grafana dashboard:

1. **Open Grafana and create a new dashboard:**
   - Open Grafana in browser.
   - Go to `"Create"` -> `"Import"`.

2. **Import the Dashboard:**
   - Copy contents of `dash.json`.
   - Paste into the Import field and "Load".

3. **Configure the Data Source:**
   - Ensure you have an SQLite or S3 data source configured in Grafana.
   - Update the data source settings in the imported dashboard panels to match your setup.
