# multi-repo / multi-org github commits exporter

Fetches the number of commits from specified GitHub repositories and exposes metrics for monitoring using Prometheus and Grafana.

## Prerequisites

- [Node.js](https://nodejs.org/) installed
- [Yarn](https://yarnpkg.com/) installed
- A GitHub Personal Access Token (PAT) for accessing private repositories if needed

### Setup

#### Clone the repository** and navigate into the project directory:

```sh
git clone <your-repo-url>
cd <your-repo-directory>
```

#### Add required packages

`yarn add axios node-cron prom-client express dotenv`

#### Create `.env` file in root dir and add your PAT 

echo "GITHUB_TOKEN=your_personal_github_token" > .env

#### Install dependencies

[I use `yarn` here, you can use another package manager no problem]

`yarn install`

 
#### Create a sources.json file in the root directory with the following structure:


```json
[
    {
        "repo": "grpc/grpc-web"
    },
    {
        "repo": "codecrafters-io"
    },
    {
        "repo": "github_org/repo",
        "pat": "YOUR_PAT_FOR_JEWEL_DISTRIBUTOR"
    },
    {
        "repo": "github_org/repo"
    },
    {
        "repo": "github_org"
    }
]

```

### Running the Exporter

#### Start the script

`yarn start`



The script will:

 - Fetch the number of commits from the specified repositories.
 - Log the commit counts to a file.
 - Expose metrics on port 3000 for Prometheus to scrape.

#### Monitoring with Prometheus and Grafana

1. Set up Prometheus to scrape the metrics from http://localhost:3000/metrics.
2. Configure Grafana to visualize the data from Prometheus.

## License 

This project is licensed under the MIT License.

## Summary
