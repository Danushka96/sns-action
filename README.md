# SNS github action
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)

Github action to publish message to AWS SNS topic

## Usage

1. Create a .github/workflows/sns-notify.yml file in your GitHub repo.
1. Add the following code to the sns-notify.yml file.

``` yml
name: SNS-notify

on:
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      
      - name: SNS action step
        uses: Danushka96/sns-action@v2
        with:
          AWS_REGION: ${{ secrets.AWS_REGION }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          TOPIC_ARN: ${{ secrets.AWS_TOPIC_ARN }}
          MESSAGE: "Build success 1.0.011"
          SUCCESS: true
```
3. Create a SNS topic from [AWS console](https://console.aws.amazon.com/sns/v3/home) save the topic ARN in the [Github Secrets](https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets#creating-encrypted-secrets-for-a-repository)

## Environment Variables



| Variable | Default | Purpose |
| -------- | -------- | -------- |
| AWS_REGION            |      | Region of SNS Topic     |
| AWS_ACCESS_KEY_ID     |      | AWS access key to send message to sns topic     |
| AWS_SECRET_ACCESS_KEY            |      | AWS secret access key to send message to sns topic     |
| AWS_REGION            |      | Region of SNS Topic     |
| TOPIC_ARN            |      | ARN of SNS Topic     |
| MESSAGE            |      | Custom message that can be sent to sns topic     |
| SUCCESS            |true   | Extra parameter to notify success or fail     |

## Output Message

|Property|Value|
|--------|------|
|githubRef|GITHUB_REF|
|githubEvent|GITHUB_EVENT_NAME|
|githubRepo|GITHUB_REPOSITORY|
|githubSHA|GITHUB_SHA|
|githubActor|GITHUB_ACTOR|
|success|SUCCESS|
|message|MESSAGE|
