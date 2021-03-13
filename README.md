# sns-action
Github action to publish message to AWS SNS topic

``` yml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      
      - name: SNS action step
        uses: Danushka96/sns-action@v1.3
        with:
          AWS_REGION: ${{ secrets.AWS_REGION }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          TOPIC_ARN: ${{ secrets.AWS_TOPIC_ARN }}
          SUBJECT: "My Repository"
          MESSAGE: "Build Success 1.0.011"
```
