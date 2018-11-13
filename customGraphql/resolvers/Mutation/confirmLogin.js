const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
    .db('lt_user')
    .where('login_token', '=', args.token)
    .andWhere('login_token_expiry', '>', 'now()')
    .first();

  // console.log(user, args);
  // console.log('USER', user);
  if (!user) {
    // console.log('!!!!! NO USER');
    return {
      code: 'noUser',
      success: false,
      message: 'This token is either invalid or expired!',
      user: null,
    };
  }

  const [updatedUser] = await ctx
    .db('lt_user')
    .update({
      login_token: null,
      login_token_expiry: null,
    })
    .where({ email: user.email })
    .returning('*');

  // get permissions
  const permissions = await ctx
    .db('permission')
    .where({ user_id: updatedUser.id })
    .select('role');

  const allowedRoles = permissions.map(permission => permission.role);
  allowedRoles.push('anonymous');

  // figure out default role
  const defaultRole = _.includes(allowedRoles, 'user') ? 'user' : 'anonymous';

  // 4. Generate JWT
  const token = jwt.sign(
    {
      userId: updatedUser.id,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': allowedRoles,
        'x-hasura-default-role': defaultRole,
        'x-hasura-user-id': updatedUser.id,
      },
    },
    process.env.APP_SECRET
  );

  // console.log('JWT', token);

  // 5. Set the JWT cookie
  ctx.res.cookie('token', token, {
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
