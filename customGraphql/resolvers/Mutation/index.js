const requestLogin = require('./requestLogin');
const confirmLogin = require('./confirmLogin');
const register = require('./register');

const Mutations = {
  requestLogin,
  confirmLogin,
  register,
  signout(parent, args, ctx) {
    ctx.response.clearCookie('token');
    return {
      code: 'ok',
      success: true,
      message: 'Goodbye!',
    };
  },
};

module.exports = Mutations;
