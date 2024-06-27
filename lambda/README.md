# setup through AWS with Cloudwatch

## Create an AWS Lambda Function:

- Go to the AWS Lambda console and create a new Lambda function.
- Choose the runtime as Node.js.
- In the Lambda function, add your Node.js script. You can either upload a zip file with your script and dependencies or use the inline editor.


## Set Up IAM Role:

- Ensure your Lambda function has an IAM role with the necessary permissions to access CloudWatch Logs and any other AWS services you might need.


## Create a CloudWatch Event Rule:

 - Go to the CloudWatch console and create a new rule to trigger your Lambda function.
 - Set the schedule to run daily (e.g., at midnight).
 - Add the Lambda function as the target for the rule.


##  Create an S3 Bucket:

 - Go to the S3 console and create a new bucket.
 *Note the bucket name for use in the Lambda function.*


## Update Lambda Environment Variables:

 - Add `GITHUB_PAT` and `SOURCES_JSON` as environment variables in the Lambda function configuration.
 - `GITHUB_PAT` should be your GitHub personal access token.
 - `SOURCES_JSON` should be your list of repositories and organizations in JSON format.


## Create a CloudWatch Event Rule:
 - Go to the CloudWatch console.
 - Create a new rule with a schedule expression (e.g., `cron(0 0 * * ? *`) for midnight UTC).
 - Add the Lambda function as the target.


## Set Up Grafana:

 - Ensure Grafana is installed and running.
 - Install the S3 data source plugin if not already available.


## Configure S3 Data Source:

 - Go to Grafana and configure a new data source using the S3 plugin.
 - Provide the necessary credentials and S3 bucket details.


## Create a Dashboard:

 - Create a new dashboard in Grafana.
 - Add panels and use the S3 data source to query the activity.csv file.
 *example dashboard in `gh_tracker/lambda/s3dash.json*

 - **Data Source**: Each panel's datasource is set to "S3". You need to replace "your-s3-bucket-name" with the actual name of your S3 bucket.
 - **CSV Query**: The csvQuery field is used to specify the S3 bucket, path, and the SQL-like query to retrieve the data.
 - **Queries**: The queries are adjusted to fetch data from the `activity.csv` stored in S3.
