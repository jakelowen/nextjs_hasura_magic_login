const jwt = require('jsonwebtoken');

const confirmLogin = async (parent, args, ctx) => {
  /*  Response target
        type ConfirmLoginResponse {
            code: String!
            success: Boolean!
            message: String!
            user: User
        }
    */

  const user = await ctx
    .db('users')
    .where('loginToken', '=', args.token)
    .andWhere('loginTokenExpiry', '>', 'now()')
    .first();

  console.log(user, args);

  if (!user) {
    console.log('!!!!! NO USER');
    return {
      code: 'noUser',
      success: false,
      message: 'This token is either invalid or expired!',
      user: null,
    };
  }

  const [updatedUser] = await ctx
    .db('users')
    .update({
      loginToken: null,
      loginTokenExpiry: null,
    })
    .where({ email: user.email })
    .returning('*');

  // 4. Generate JWT
  const token = jwt.sign(
    {
      userId: updatedUser.id,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['user'],
        'x-hasura-default-role': 'user',
        'x-hasura-user-id': updatedUser.id,
        // 'x-hasura-org-id': '123',
        // 'x-hasura-custom': 'custom-value',
      },
    },
    process.env.APP_SECRET
  );

  // 5. Set the JWT cookie
  ctx.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  // 6. return the new user
  return {
    code: 'ok',
    success: true,
    message:
      'You have successfully logged in. You may close this window and return to your previous tab to continue!',
    user: updatedUser,
  };
};

module.exports = confirmLogin;
