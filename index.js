const { createServer } = require('http');
const cookieParser = require('cookie-parser');

const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env' });
const next = require('next');
const express = require('express');
const createGQLServer = require('./createServer');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 4000;

app.prepare().then(async () => {
  const expressServer = express();
  const gqlserver = await createGQLServer();

  expressServer.use(cookieParser());

  // decode the JWT so we can get the user Id on each request
  expressServer.use((req, res, next) => {
    const { token } = req.cookies;
    // console.log('TOKEN', token);
    if (token) {
      let userId;
      try {
        const decoded = jwt.verify(token, process.env.APP_SECRET);
        userId = decoded.userId || null;
      } catch (e) {
        userId = null;
      }
      // put the userId onto the req for future requests to access
      req.userId = userId;
    }
    next();
  });

  gqlserver.applyMiddleware({
    app: expressServer,
    path: '/graphql',
  });

  const httpServer = createServer(expressServer);
  gqlserver.installSubscriptionHandlers(httpServer);

  // Not sure if I need this, but leaving in the stub.
  // 2. Create a middleware that populates the user on each request
  // server.express.use(async (req, res, next) => {
  //   // if they aren't logged in, skip this
  //   if (!req.userId) return next();
  //   const user = await db.query.user(
  //     { where: { id: req.userId } },
  //     '{ id, email, name }'
  //   );
  //   req.user = user;
  //   next();
  // });

  expressServer.get('*', (req, res, next) => {
    if (req.url === '/graphql') {
      return next();
    }
    return handle(req, res);
  });

  httpServer.listen(port, err => {
    if (err) throw err;
    console.log(`Listening on http://localhost:${port}`);
    console.log(
      `🚀 Server ready at http://localhost:${port}${gqlserver.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${port}${
        gqlserver.subscriptionsPath
      }`
    );
  });
});
