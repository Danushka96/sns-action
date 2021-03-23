const core = require('@actions/core');
const AWS = require('aws-sdk');

function run() {
    try {
        const AWS_REGION = core.getInput("AWS_REGION") || process.env.AWS_REGION;
        const AWS_ACCESS_KEY_ID = core.getInput("AWS_ACCESS_KEY_ID") || process.env.AWS_ACCESS_KEY_ID;
        const AWS_SECRET_ACCESS_KEY = core.getInput("AWS_SECRET_ACCESS_KEY") || process.env.AWS_SECRET_ACCESS_KEY;
        const TOPIC = core.getInput("TOPIC_ARN");
        const MESSAGE = core.getInput("MESSAGE");
        const SUCCESS = core.getInput("SUCCESS");

        AWS.config.update({
            region: AWS_REGION,
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY
        })

        core.debug(MESSAGE);

        let message = {
            githubRef: process.env.GITHUB_REF,
            githubEvent: process.env.GITHUB_EVENT_NAME,
            githubRepo: process.env.GITHUB_REPOSITORY,
            githubSHA: process.env.GITHUB_SHA,
            githubActor: process.env.GITHUB_ACTOR,
            success: SUCCESS,
            message: MESSAGE,
        }

        const params = {
            Message: JSON.stringify(message),
            TopicArn: TOPIC
        }

        const awsClient = new AWS.SNS({apiVersion: '2010-03-31'});

        awsClient.publish(params, function (err, data) {
            if (err) {
                core.debug(err.message);
                core.setFailed(err.message);
            } else {
                core.debug('Message sent to the topic');
                return data.MessageId
            }
        });

    } catch (err) {
        core.debug(err.Message);
        core.setFailed(err.Message)
    }
}

run();
