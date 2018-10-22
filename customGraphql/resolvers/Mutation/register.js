const { randomBytes } = require('crypto');
const { promisify } = require('util');

const transport = require('../../../email/connectors/transport');
const { subject, html, text } = require('../../../email/templates/magicLogin');
const generateSecurityCode = require('../../../utils/securityCode');

const register = async (parent, args, ctx) => {
  /*  Response target
        type ReguestLoginResponse {
            code: String!
            success: Boolean!
            message: String!
            securityCode: String!
          }
        */

  console.log('!!! calling registration');
  // 1. Create user with provided arguments
  const [user] = await ctx
    .db('users')
    .insert({ name: args.name, email: args.email })
    .returning('*');

  console.log('DB USER create', user);

  // 2. Set a reset token and expiry on that user
  const randomBytesPromiseified = promisify(randomBytes);
  const loginToken = (await randomBytesPromiseified(20)).toString('hex');

  await ctx
    .db('users')
    .update({ loginToken })
    .where({ email: args.email });

  const securityCode = generateSecurityCode();

  // construct url
  const url = `${process.env.FRONTEND_HOST}/confirm-login?token=${loginToken}`;

  // 3. Email them that reset token
  const messageData = {
    from: process.env.EMAIL_SENDER,
    to: user.email,
    subject: subject(),
    html: html(url, securityCode),
    txt: text(url, securityCode),
  };
  await transport.sendMail(messageData);

  // 4. Return the message
  return {
    code: 'ok',
    success: true,
    message:
      'A message has been sent to your email with a magic link you need to click to log in.',
    securityCode,
  };
};

module.exports = register;
