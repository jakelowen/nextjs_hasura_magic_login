// const { GraphQLServer } = require('graphql-yoga');
// const { ApolloServer } = require('apollo-server');
const { ApolloServer } = require('apollo-server-express');
const { mergeSchemas, makeExecutableSchema } = require('graphql-tools');
const { SubscriptionClient } = require('subscriptions-transport-ws');
const ws = require('ws');
const typeDefs = require('./customGraphql/typeDefs');
const Mutation = require('./customGraphql/resolvers/Mutation');
const Query = require('./customGraphql/resolvers/Query');
const { getRemoteSchema, makeHttpAndWsLink } = require('./utils/stitching');
const knex = require('./knex');
// const { WebSocketLink } = require('apollo-link-ws');

async function createServer() {
  const { HASURA_GRAPHQL_ENGINE_URL, HASURA_ACCESS_KEY } = process.env;
  const HASURA_GRAPHQL_API_URL = `${HASURA_GRAPHQL_ENGINE_URL}/v1alpha1/graphql`;

  // this is a special link that has admin access to hasura for use in introspecting schema
  const linkOverRide = makeHttpAndWsLink(
    HASURA_GRAPHQL_API_URL,
    HASURA_ACCESS_KEY && {
      'x-hasura-access-key': HASURA_ACCESS_KEY,
    }
  );

  // this is the hasura schema without admin access that is actually ingeseted
  const executableHasuraSchema = await getRemoteSchema(
    HASURA_GRAPHQL_API_URL,
    null,
    linkOverRide // the admin override above used for introspection,
  );

  // the local custom schema out of custom resolvers and typedefs
  // mainly auth stuff
  const executableCustomSchema = makeExecutableSchema({
    typeDefs,
    resolvers: {
      Mutation,
      Query,
    },
  });

  // merge custom resolvers with Hasura schema
  const finalSchema = mergeSchemas({
    schemas: [executableHasuraSchema, executableCustomSchema],
  });

  // intialize db
  const db = knex();

  return new ApolloServer({
    schema: finalSchema,
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    context: async ({ req, res, connection }) => {
      if (connection) {
        return connection.context;
      }
      return { db, res, userId: req.userId || null };
    },
    subscriptions: {
      // https://stackoverflow.com/questions/51023178/stitching-secure-subscriptions-using-makeremoteexecutableschema
      // https://gist.github.com/josephktcheung/cd1b65b321736a520ae9d822ae5a951b
      onConnect: (connectionParams, webSocket) => {
        const token =
          webSocket &&
          webSocket.upgradeReq &&
          webSocket.upgradeReq.headers &&
          webSocket.upgradeReq.headers.cookie &&
          webSocket.upgradeReq.headers.cookie.replace('token=', '');

        if (token) {
          // console.log(`TOKEN IST ${token}`);
          const secureWebsocketConnection = new SubscriptionClient(
            HASURA_GRAPHQL_API_URL,
            {
              connectionParams: {
                headers: {
                  authorization: `Bearer ${token}`,
                },
              },
              reconnect: true,
            },
            ws
          );
          return {
            secureWebsocketConnection,
          };
        }
        throw new Error('No authorization to connect via web socket connetion');
      },
      onDisconnect: async (websocket, context) => {
        const params = await context.initPromise;
        const { secureWebsocketConnection } = params;
        secureWebsocketConnection.close();
      },
    },
  });
}

module.exports = createServer;
