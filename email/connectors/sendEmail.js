import * as Mailgun from 'mailgun-js';

export default messageData => {
  const mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

  return mailgun.messages().send(messageData);
};
