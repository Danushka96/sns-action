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

        let fields = [
            {
                "title": "Ref",
                "value": "" + process.env.GITHUB_REF,
                "short": "true"
            },
            {
                "title": "Event",
                "value": "" + process.env.GITHUB_EVENT_NAME,
                "short": "true"
            },
            {
                "title": "Action URL",
                "value": "<https://github.com/" + process.env.GITHUB_REPOSITORY + "/commit/" + process.env.GITHUB_SHA + "/checks",
                "short": "false"
            },
            {
                "title": "Message",
                "value": "" + message,
                "short": "false"
            }
        ];

        let slackMessage = {
            color: "good",
            author_name: process.env.GITHUB_ACTOR,
            author_link: "http://github.com/" + process.env.GITHUB_ACTOR,
            author_icon: "http://github.com/" + process.env.GITHUB_ACTOR + ".png?size=32",
            footer: "Ustocktrade",
            footer_icon: "https://avatars.githubusercontent.com/u/25242511?s=200&v=4",
            fields
        }

        const params = {
            Subject: subject,
            Message: JSON.stringify(slackMessage),
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
