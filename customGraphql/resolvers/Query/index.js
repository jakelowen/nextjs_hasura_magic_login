const Query = {
  async me(parent, args, ctx) {
    // check if there is a current user ID
    // console.log('ctx userid', ctx);
    if (!ctx.userId) {
      return null;
    }

    const [userFromDbQuery] = await ctx.db('lt_user').where({ id: ctx.userId });

    // console.log('USER FROM DB QUERY', userFromDbQuery);
    return userFromDbQuery;
  },
};

module.exports = Query;
