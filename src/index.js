const core = require('@actions/core');
const AWS = require('aws-sdk');

function run() {
    try {
        const AWS_REGION = core.getInput("AWS_REGION") || process.env.AWS_REGION;
        const AWS_ACCESS_KEY_ID = core.getInput("AWS_ACCESS_KEY_ID") || process.env.AWS_ACCESS_KEY_ID;
        const AWS_SECRET_ACCESS_KEY = core.getInput("AWS_SECRET_ACCESS_KEY") || process.env.AWS_SECRET_ACCESS_KEY;

        const message = core.getInput("MESSAGE");
        const subject = core.getInput("SUBJECT");
        const topic = core.getInput("TOPIC_ARN");

        AWS.config.update({
            region: AWS_REGION,
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY
        })

        core.debug(message);

        let slackMessage =
        `Ref: ${process.env.GITHUB_REF} \n` +
        `Event: ${process.env.GITHUB_EVENT_NAME} \n` +
        `Action URL : <https://github.com/${process.env.GITHUB_REPOSITORY}/commit/${process.env.GITHUB_SHA}/checks|${process.env.GITHUB_WORKFLOW}> \n` +
        `Commit: <https://github.com/${process.env.GITHUB_REPOSITORY}/commit/${process.env.GITHUB_SHA}|commit_sha> \n` +
        `Message: ${message} \n`;

        const params = {
            Subject: subject,
            Message: slackMessage,
            TopicArn: topic
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
