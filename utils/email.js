/* eslint-disable no-undef */
import aws from 'aws-sdk';
import template_json from '../metadata/templates/templates.json';

var s3 = {
  accessKeyId: process.env.AWS_SES_SECRET_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SES_SECRET_SECRET_KEY,
  region: process.env.AWS_SES_REGION,
};

aws.config.update(s3);
const ses = new aws.SES();

const sendEMail = async ({ type: type }) => {
  return new Promise((resolve) => {
    try {
      var replaced_template;
      var replaced_subject;

      if (type === 'EMAIL') {
        let template = template_json.find((el) => el.templateType === 'EMAIL');
        replaced_template = template.content
          .replace('userName', days)
          .replace('accountVerificationLink', days)
          .replace('projectName', days);

        replaced_subject = template.subject.replace('projectName', days);
      }

      const params = {
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Subject: {
            Data: replaced_subject,
          },
          Body: {
            Html: {
              Data: replaced_template,
            },
          },
        },
        Source: process.env.AWS_SES_ADMIN_EMAIL,
      };

      ses
        .sendEmail(params)
        .promise()
        .then(() => resolve(true))
        .catch(() => resolve(false));
    } catch (error) {
      console.log(error);
      resolve(false);
    }
  });
};

export default {
  sendEMail,
};
