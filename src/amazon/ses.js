const {SESv2Client, SendEmailCommand} = require("@aws-sdk/client-sesv2");
require('dotenv').config();

const accessKey = process.env.SES_API_KEY_ID
const secretKey = process.env.SES_API_ACCESS_KEY
const sendEmail = async (toAddresses, title, template) => {
    const clientSes = new SESv2Client({
        region: "us-east-1",
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey
        }
    });

    const input = { // SendEmailRequest
        FromEmailAddress: "dodosobreira@gmail.com",
        Destination: { // Destination
            ToAddresses: toAddresses,
        },
        Content: { // EmailContent
            Simple: { // Message
                Subject: { // Content
                    Data: title, // required
                },
                Body: { // Body
                    Html: {
                        Data: template
                    },
                },
            },
        },
    };

    const command = new SendEmailCommand(input);

    try {
        await clientSes.send(command);
    } catch (error) {
        return error;
    }
};
module.exports = {
    sendEmail,
};
